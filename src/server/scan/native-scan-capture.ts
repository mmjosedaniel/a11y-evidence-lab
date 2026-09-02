import axe from 'axe-core';
import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from 'playwright';
import { nativeBuckets, nativeScanOptions, reporterId } from './scan-profile.ts';

// This function is serialized into the analyzed document, with no Node closure.
function registerReporter(engine: typeof axe, reporterName: string, buckets: readonly string[]): void {
  type Fact = { value: string | boolean } | { unavailable: string };
  type NativeNode = { element?: unknown; capturedDom?: unknown;
    any?: { relatedNodes?: NativeNode[] }[]; all?: { relatedNodes?: NativeNode[] }[];
    none?: { relatedNodes?: NativeNode[] }[] };
  type Report = Record<string, { id: string; nodes: NativeNode[] }[]>;
  const unavailable = (reason: string): Fact => ({ unavailable: reason });
  const read = (operation: () => string | boolean): Fact => {
    try { return { value: operation() }; } catch { return unavailable('invalid'); }
  };
  const attribute = (element: Element, name: string): Fact => read(() => {
    const value = element.getAttribute(name);
    return value === null ? 'absent' : value === '' ? 'empty' : value.trim() === '' ? 'whitespace-only' : 'non-empty';
  });
  function locator(element: Element): Fact {
    try {
      const indices: number[] = [];
      let current = element;
      const visited = new Set<Element>();
      while (current !== document.documentElement) {
        if (visited.has(current)) return unavailable('invalid');
        visited.add(current);
        const parent = current.parentElement;
        if (!parent) return unavailable(current.getRootNode() instanceof ShadowRoot ? 'unsupported' : 'invalid');
        const index = Array.from(parent.children).indexOf(current);
        if (index < 0) return unavailable('invalid');
        indices.unshift(index + 1);
        current = parent;
      }
      const selector = ':root' + indices.map(index => ` > :nth-child(${index})`).join('');
      if (selector.length > 2048) return unavailable('too-long');
      const matches = document.querySelectorAll(selector);
      return matches.length === 1 && matches[0] === element ? { value: selector } : unavailable('invalid');
    } catch { return unavailable('invalid'); }
  }
  function capture(node: NativeNode, rule: string): unknown {
    let element: Element | undefined;
    let reason = 'invalid';
    try {
      const reference = node.element;
      if (reference === undefined || reference === null) reason = 'missing';
      else if (reference instanceof Element && reference.isConnected && reference.ownerDocument === document) element = reference;
    } catch { /* A bad reference never falls back to a native selector. */ }
    const location = element ? locator(element) : unavailable(reason);
    if (rule === 'color-contrast') return { locator: location };
    if (rule === 'image-alt') {
      return { locator: location, evidence: {
        elementKind: element ? (element instanceof HTMLImageElement ? { value: 'img' } : unavailable('invalid')) : unavailable(reason),
        altState: element ? attribute(element, 'alt') : unavailable(reason),
      } };
    }
    let kind: Fact = unavailable(reason);
    let inputType: Fact = unavailable(reason);
    if (element) {
      if (element instanceof HTMLInputElement) {
        kind = { value: 'input' };
        inputType = read(() => {
          const type = (element as HTMLInputElement).type;
          if (!['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
            'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit',
            'tel', 'text', 'time', 'url', 'week'].includes(type)) throw new Error();
          return type;
        });
      } else if (element instanceof HTMLTextAreaElement) {
        kind = { value: 'textarea' }; inputType = unavailable('not-applicable');
      } else { kind = unavailable('invalid'); inputType = unavailable('invalid'); }
    }
    const associatedLabel = (explicit: boolean): Fact => element ? read(() => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) throw new Error();
      return Array.from(element.labels ?? []).some(label => label.control === element &&
        (explicit ? label.hasAttribute('for') : !label.hasAttribute('for') && label.contains(element)));
    }) : unavailable(reason);
    return { locator: location, evidence: { elementKind: kind, inputType, nameSources: {
      explicitLabel: associatedLabel(true), implicitLabel: associatedLabel(false),
      ariaLabel: element ? attribute(element, 'aria-label') : unavailable(reason),
      ariaLabelledby: element ? read(() => {
        const value = element.getAttribute('aria-labelledby');
        if (value === null) return 'absent';
        const ids = value.split(/[\t\n\f\r ]+/).filter(Boolean);
        if (!ids.length) return 'empty';
        const root = element.getRootNode();
        if (!(root instanceof Document || root instanceof ShadowRoot)) throw new Error();
        const count = ids.filter(id => root.getElementById(id) !== null).length;
        return count === 0 ? 'unresolved' : count === ids.length ? 'resolved' : 'partially-resolved';
      }) : unavailable(reason),
      title: element ? attribute(element, 'title') : unavailable(reason),
      placeholder: element ? attribute(element, 'placeholder') : unavailable(reason),
      presentationalRole: element ? read(() => (element.getAttribute('role') ?? '').split(/[\t\n\f\r ]+/)
        .some(token => token === 'presentation' || token === 'none')) : unavailable(reason),
    } } };
  }
  engine.addReporter<unknown>(reporterName, (raw, options, resolve, reject) => {
    engine.getReporter<Report>('v1')(raw, options, report => {
      try {
        for (const bucket of buckets) {
          for (const rule of report[bucket]) for (const node of rule.nodes) {
            if (bucket === 'violations' || bucket === 'incomplete') node.capturedDom = capture(node, rule.id);
            delete node.element;
            for (const group of ['any', 'all', 'none'] as const) {
              for (const check of node[group] ?? []) for (const related of check.relatedNodes ?? []) delete related.element;
            }
          }
        }
        resolve(report);
      } catch { resolve({ captureFailure: 'evidence-capture' }); }
    }, reject);
  });
}

export async function captureNativeScan(page: Page): Promise<unknown> {
  const reporterRegistration = `;(${registerReporter.toString()})(axe, ${JSON.stringify(reporterId)}, ${JSON.stringify(nativeBuckets)});`;
  return new AxeBuilder({ page, axeSource: axe.source + reporterRegistration })
    .setLegacyMode(true).exclude('iframe').exclude('frame').options(nativeScanOptions()).analyze();
}
