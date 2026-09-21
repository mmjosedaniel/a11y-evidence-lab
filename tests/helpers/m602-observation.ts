export type M602ObserverKind = 'ui' | 'runtime' | 'gpu';
export type M602Observers = Partial<Record<M602ObserverKind, (gate: {
  signal: AbortSignal; start(effect: (signal: AbortSignal) => void | Promise<void>): boolean;
}) => void | Promise<void>>>;
export type M602ObservationSlot = Readonly<{
  status: 'unavailable' | 'missed-window' | 'failed' | 'aborted' | 'completed';
  startedAt: string | null; finishedAt: string | null; cleanup: 'complete' | 'uncertain';
}>;
type Window = Readonly<{ startedAt: string; finishedAt: string }>;
const kinds = ['ui', 'runtime', 'gpu'] as const;
const timestamp = () => new Date().toISOString();

export function createM602Observation(observers: M602Observers | undefined, signal: AbortSignal) {
  const controller = new AbortController();
  let active = true, scheduled = false;
  let nativeStart: string | undefined;
  let snapshot: Readonly<Record<M602ObserverKind, M602ObservationSlot>> | undefined;
  const states = Object.fromEntries(kinds.map(kind => [kind, {
    configured: observers?.[kind] !== undefined, used: false, refusal: false, fault: false,
    observerPending: false, effectPending: false, startedAt: null as string | null, finishedAt: null as string | null,
  }])) as Record<M602ObserverKind, { configured: boolean; used: boolean; refusal: boolean; fault: boolean;
    observerPending: boolean; effectPending: boolean; startedAt: string | null; finishedAt: string | null }>;

  function close(nativeEnd?: string): void {
    if (!active) return;
    active = false;
    const slots = {} as Record<M602ObserverKind, M602ObservationSlot>;
    for (const kind of kinds) {
      const state = states[kind];
      const pending = state.observerPending || state.effectPending;
      const interior = nativeStart !== undefined && nativeEnd !== undefined && state.startedAt !== null && state.finishedAt !== null
        && Date.parse(state.startedAt) > Date.parse(nativeStart) && Date.parse(state.finishedAt) < Date.parse(nativeEnd)
        && Date.parse(state.finishedAt) >= Date.parse(state.startedAt);
      const status = !state.configured ? 'unavailable' : pending ? 'aborted' : state.fault ? 'failed'
        : !state.used || state.refusal || !interior ? 'missed-window' : 'completed';
      slots[kind] = Object.freeze({ status, startedAt: state.startedAt, finishedAt: state.finishedAt,
        cleanup: status === 'aborted' ? 'uncertain' : 'complete' });
    }
    snapshot = Object.freeze(slots);
    signal.removeEventListener('abort', onAbort);
    // Revocation and evidence freezing precede any callback-capable notification.
    controller.abort();
  }
  const onAbort = () => close();
  signal.addEventListener('abort', onAbort, { once: true });
  if (signal.aborted) close();

  function invoke(kind: M602ObserverKind, work: () => unknown, effect: boolean): void {
    const state = states[kind];
    const pending = effect ? 'effectPending' : 'observerPending';
    state[pending] = true;
    const settle = (fault: boolean) => {
      if (!active) return;
      state[pending] = false;
      state.fault ||= fault;
      if (effect) state.finishedAt = timestamp();
    };
    try {
      const returned = work();
      if (returned === undefined) settle(false);
      else void Promise.resolve(returned).then(() => settle(false), () => settle(true));
    } catch { settle(true); }
  }
  function schedule(start: string): void {
    if (!active || scheduled || signal.aborted) return;
    scheduled = true;
    nativeStart = start;
    queueMicrotask(() => {
      for (const kind of kinds) {
        if (!active || signal.aborted) break;
        const observer = observers?.[kind];
        if (observer === undefined) continue;
        const state = states[kind];
        const gate = Object.freeze({ signal: controller.signal, start(effect: (signal: AbortSignal) => void | Promise<void>) {
          if (!active || state.used || signal.aborted || controller.signal.aborted) {
            if (active) state.refusal = true;
            return false;
          }
          state.used = true;
          if (!active || signal.aborted || controller.signal.aborted) { state.refusal = true; return false; }
          state.startedAt = timestamp();
          invoke(kind, () => effect(controller.signal), true);
          return true;
        } });
        invoke(kind, () => observer(gate), false);
      }
    });
  }
  return Object.freeze({ schedule, close, report(chatWindow: Window | null) {
    close();
    const slots = snapshot!;
    return Object.freeze({ chatWindow, ...slots,
      cleanup: kinds.some(kind => slots[kind].cleanup === 'uncertain') ? 'uncertain' as const : 'complete' as const });
  } });
}
