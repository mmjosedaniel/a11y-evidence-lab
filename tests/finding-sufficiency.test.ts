import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';
import { assessFindingEvidence } from '../src/server/domain/finding-sufficiency.ts';
import { buildFindingAnalysis } from '../src/server/domain/finding-analysis.ts';
import { classifyGuidanceSupport } from '../src/server/retrieval/support-policy.ts';
import { resolveCitations } from '../src/server/retrieval/citation-resolution.ts';
import { resolveFindingCitations } from '../src/server/retrieval/corpus-catalog.ts';
import {
  PASSAGE_REFERENCES,
  PROFILE_REQUIRED_ROLES,
} from '../src/server/retrieval/corpus-identity.ts';
import { SOURCE_NOTICES } from '../src/server/retrieval/source-notices.ts';
import { contrastFinding, fact, imageFinding, labelFinding, unavailable } from './helpers/m202-retrieval-fixture.ts';
import {
  clone,
  completeFindings,
  documentNotice,
  evidencePaths,
  explanations,
  expectDeepFrozen,
  imagePassages,
  investigations,
  labelPassages,
  reasons,
  retrievalFor,
  roles,
  setPath,
  softwareDocumentNotice,
} from './helpers/m203-finding-fixture.ts';

const root = resolve(import.meta.dirname, '..');
const manifestPath = resolve(root, 'corpus/wcag22-mvp-v1/manifest.json');
const passagePath = resolve(root, 'corpus/wcag22-mvp-v1/passages.json');
const [manifestBytes, passageBytes] = await Promise.all([readFile(manifestPath), readFile(passagePath)]);
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const manifest = JSON.parse(decoder.decode(manifestBytes));
const catalog = JSON.parse(decoder.decode(passageBytes));
const manifestLf = decoder.decode(manifestBytes).replaceAll('\r\n', '\n');
const passageLf = decoder.decode(passageBytes).replaceAll('\r\n', '\n');
const corpusFailure = Object.freeze({ ok: false, error: 'corpus-integrity' });
const resultFailure = Object.freeze({ ok: false, error: 'result-validation' });
const startedAt = '2026-09-08T20:00:00.000Z';
const finishedAt = '2026-09-08T20:00:01.000Z';

const successful = <T>(result: { readonly ok: boolean; readonly value?: T }): T => {
  assert.equal(result.ok, true);
  if (!result.ok || !('value' in result)) throw new Error('Expected success');
  return result.value as T;
};

const expectDetachedFrozen = (result: unknown, input: unknown, before: unknown): void => {
  assert.deepEqual(input, before);
  assert.notEqual(result, input);
  expectDeepFrozen(result);
};

const supportFor = (passages: readonly { readonly passageId: string; readonly score: number }[], conflicts: unknown = []) =>
  classifyGuidanceSupport(completeFindings.image, retrievalFor(completeFindings.image, passages), conflicts);

test('assesses complete image, label, textarea and contrast evidence in exact deterministic order', () => {
  const cases = [
    [completeFindings.image, evidencePaths.image],
    [completeFindings.label, evidencePaths.labelInput],
    [completeFindings.textarea, evidencePaths.labelTextarea],
    [completeFindings.contrast, evidencePaths.contrast],
  ] as const;
  for (const [finding, availableReferences] of cases) {
    const before = clone(finding);
    const result = assessFindingEvidence(finding as never);
    assert.deepEqual(result, { state: 'complete', availableReferences, blockers: [] });
    expectDetachedFrozen(result, finding, before);
    assert.equal(result.availableReferences.includes('locator' as never), false);
  }
});

test('treats truthful negative native facts as available rather than contextual incompleteness', () => {
  const findings = [
    imageFinding(fact('img'), fact('empty')),
    imageFinding(fact('img'), fact('absent')),
    labelFinding(fact('input'), 'negative'),
    contrastFinding('below'),
    contrastFinding('equal'),
    contrastFinding('above'),
  ];
  for (const finding of findings) assert.equal(assessFindingEvidence(finding as never).state, 'complete');
  for (const relation of ['unresolved', 'partially-resolved'] as const) {
    const label: any = labelFinding(fact('input'), 'negative');
    label.evidence.nameSources.ariaLabelledby = fact(relation);
    const result = assessFindingEvidence(label);
    assert.equal(result.state, 'complete');
    assert.equal(result.availableReferences.includes('evidence.nameSources.ariaLabelledby'), true);
  }
});

test('retains every unavailable reason for every required fact without inventing optional blockers', () => {
  const requiredCases = [
    ...evidencePaths.image.map(path => [completeFindings.image, path] as const),
    ...evidencePaths.labelInput.filter(path => path !== 'evidence.elementKind').map(path => [completeFindings.label, path] as const),
    ...evidencePaths.contrast.filter(path => path !== 'evidence.measurementSource').map(path => [completeFindings.contrast, path] as const),
  ];
  for (const [base, path] of requiredCases) {
    for (const reason of reasons) {
      const finding = setPath(base, path, unavailable(reason));
      const before = clone(finding);
      const result = assessFindingEvidence(finding as never);
      assert.equal(result.state, 'incomplete', `${path}:${reason}`);
      assert.deepEqual(result.blockers, [{ reference: path, reason }], `${path}:${reason}`);
      const expectedReferences = (base === completeFindings.image
        ? evidencePaths.image
        : base === completeFindings.label
          ? evidencePaths.labelInput
          : evidencePaths.contrast).filter(reference => reference !== path);
      assert.deepEqual(result.availableReferences, expectedReferences, `${path}:${reason}`);
      expectDetachedFrozen(result, finding, before);
    }
  }

  for (const reason of reasons) {
    const finding = labelFinding(unavailable(reason));
    const result = assessFindingEvidence(finding as never);
    assert.deepEqual(result.blockers, [{ reference: 'evidence.elementKind', reason }]);
    assert.deepEqual(result.availableReferences, evidencePaths.labelTextarea.filter(
      reference => reference !== 'evidence.elementKind',
    ));
  }

  const textarea = assessFindingEvidence(labelFinding(fact('textarea')) as never);
  assert.equal(textarea.state, 'complete');
  assert.equal(textarea.availableReferences.includes('evidence.inputType' as never), false);

  const optional = contrastFinding();
  optional.locator = unavailable('withheld') as never;
  optional.evidence.messageKey = unavailable('invalid') as never;
  optional.evidence.shadowColor = unavailable('withheld') as never;
  assert.deepEqual(assessFindingEvidence(optional as never), {
    state: 'complete', availableReferences: evidencePaths.contrast, blockers: [],
  });
});

test('orders optional contrast diagnostics and makes shadow evidence required only for shadow measurements', () => {
  const diagnostic: any = contrastFinding();
  diagnostic.evidence.messageKey = fact('bgImage');
  diagnostic.evidence.shadowColor = fact('#777777');
  assert.deepEqual(assessFindingEvidence(diagnostic), {
    state: 'complete',
    availableReferences: [...evidencePaths.contrast, 'evidence.messageKey', 'evidence.shadowColor'],
    blockers: [],
  });

  for (const messageKey of ['shadowOnBgColor', 'fgOnShadowColor'] as const) {
    const available: any = contrastFinding();
    available.evidence.messageKey = fact(messageKey);
    available.evidence.shadowColor = fact('#777777');
    assert.deepEqual(assessFindingEvidence(available), {
      state: 'complete',
      availableReferences: [...evidencePaths.contrast, 'evidence.shadowColor', 'evidence.messageKey'],
      blockers: [],
    });
    for (const reason of reasons) {
      const blocked: any = contrastFinding();
      blocked.evidence.messageKey = fact(messageKey);
      blocked.evidence.shadowColor = unavailable(reason);
      assert.deepEqual(assessFindingEvidence(blocked), {
        state: 'incomplete',
        availableReferences: [...evidencePaths.contrast, 'evidence.messageKey'],
        blockers: [{ reference: 'evidence.shadowColor', reason }],
      });
    }
  }
});

test('rejects malformed native evidence instead of converting validation errors to incompleteness', () => {
  const malformed: any = clone(completeFindings.image);
  malformed.evidence.extra = 'forbidden';
  assert.throws(() => assessFindingEvidence(malformed));
  const accessor = clone(completeFindings.image) as any;
  Object.defineProperty(accessor.evidence, 'altState', { enumerable: true, get() { throw new Error('SECRET'); } });
  assert.throws(() => assessFindingEvidence(accessor), error => !String(error).includes('SECRET'));
});

test('publishes exact fixed role metadata for all three profiles and every passage', () => {
  assert.deepEqual(PROFILE_REQUIRED_ROLES, {
    'image-alt': roles,
    label: roles,
    'color-contrast': roles,
  });
  assert.equal(PASSAGE_REFERENCES.length, catalog.passages.length);
  assert.deepEqual(PASSAGE_REFERENCES.map(reference => ({
    passageId: reference.passageId,
    sourceType: reference.sourceType,
    guidanceRole: reference.guidanceRole,
  })), catalog.passages.map((passage: any) => ({
    passageId: passage.passageId,
    sourceType: passage.sourceType,
    guidanceRole: passage.guidanceRole,
  })));
  expectDeepFrozen(PROFILE_REQUIRED_ROLES);
  expectDeepFrozen(PASSAGE_REFERENCES);
});

test('classifies missing, incomplete and supported guidance from roles rather than scores', () => {
  const zero = supportFor([]);
  assert.deepEqual(zero, { ok: true, value: { state: 'missing', missingRoles: roles, conflicts: [] } });
  const partial = supportFor([imagePassages.criterion]);
  assert.deepEqual(partial, {
    ok: true, value: { state: 'incomplete', missingRoles: ['interpretation', 'remediation'], conflicts: [] },
  });
  const full = supportFor(Object.values(imagePassages));
  assert.deepEqual(full, { ok: true, value: { state: 'supported', missingRoles: [], conflicts: [] } });

  const changedScores = Object.values(imagePassages).map((passage, index) => ({
    passageId: passage.passageId, score: 0.3 - index * 0.1,
  }));
  assert.deepEqual(supportFor(changedScores), {
    ok: true, value: { state: 'supported', missingRoles: [], conflicts: [] },
  });
  for (const result of [zero, partial, full]) expectDeepFrozen(result);
});

test('applies conflict precedence and normative precedence only to canonical present pairs', () => {
  const passages = Object.values(imagePassages);
  const informative = {
    passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'unresolved',
  };
  assert.deepEqual(supportFor(passages, [informative]), {
    ok: true,
    value: {
      state: 'conflicting', missingRoles: [],
      conflicts: [['h37-text-alternative', 'understanding111-intent']],
    },
  });
  assert.deepEqual(supportFor([imagePassages.criterion], [informative]), {
    ok: true,
    value: { state: 'incomplete', missingRoles: ['interpretation', 'remediation'], conflicts: [] },
  });
  const normative = {
    passageIds: ['understanding111-intent', 'wcag22-sc111'], resolution: 'unresolved',
  };
  assert.deepEqual(supportFor(passages, [normative]), {
    ok: true, value: { state: 'supported', missingRoles: [], conflicts: [] },
  });
});

test('rejects malformed, noncanonical, duplicate and invalid-precedence conflict declarations', () => {
  const retrieval = retrievalFor(completeFindings.image, Object.values(imagePassages));
  const invalid = [
    [{ passageIds: ['unknown', 'wcag22-sc111'], resolution: 'unresolved' }],
    [{ passageIds: ['wcag22-sc111', 'wcag22-sc111'], resolution: 'unresolved' }],
    [{ passageIds: ['wcag22-sc111', 'wcag22-sc412'], resolution: 'unresolved' }],
    [{ passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'unresolved', extra: true }],
    [
      { passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'unresolved' },
      { passageIds: ['understanding111-intent', 'h37-text-alternative'], resolution: 'unresolved' },
    ],
    [{ passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'normative-precedence' }],
    [{ passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'other' }],
  ];
  for (const conflicts of invalid) {
    assert.deepEqual(classifyGuidanceSupport(completeFindings.image, retrieval, conflicts), resultFailure);
  }
  const labelRetrieval = retrievalFor(completeFindings.label, [
    labelPassages.criterion, labelPassages.secondCriterion, labelPassages.interpretation,
  ]);
  assert.deepEqual(classifyGuidanceSupport(completeFindings.label, labelRetrieval, [{
    passageIds: ['wcag22-name-definition', 'wcag22-sc412'], resolution: 'normative-precedence',
  }]), resultFailure);
  const malformed: any = clone(retrieval);
  malformed.extra = true;
  assert.deepEqual(classifyGuidanceSupport(completeFindings.image, malformed), resultFailure);
});

test('canonicalizes and lexically sorts unresolved conflict output without mutating inputs', () => {
  const passages = [
    { passageId: 'understanding111-decoration', score: 0.9 },
    { passageId: 'understanding111-intent', score: 0.8 },
    { passageId: 'h37-text-alternative', score: 0.7 },
  ];
  const retrieval = retrievalFor(completeFindings.image, passages);
  const conflicts = [
    { passageIds: ['understanding111-intent', 'h37-text-alternative'], resolution: 'unresolved' },
    { passageIds: ['understanding111-decoration', 'h37-text-alternative'], resolution: 'unresolved' },
  ];
  const beforeRetrieval = clone(retrieval);
  const beforeConflicts = clone(conflicts);
  const result = classifyGuidanceSupport(completeFindings.image, retrieval, conflicts);
  assert.deepEqual(result, {
    ok: true,
    value: {
      state: 'conflicting', missingRoles: ['criterion'],
      conflicts: [
        ['h37-text-alternative', 'understanding111-decoration'],
        ['h37-text-alternative', 'understanding111-intent'],
      ],
    },
  });
  assert.deepEqual(retrieval, beforeRetrieval);
  assert.deepEqual(conflicts, beforeConflicts);
  expectDeepFrozen(result);
});

test('contains both full recorded notices exactly with LF joins and no trailing newline', () => {
  const notices = Object.values(SOURCE_NOTICES as Readonly<Record<string, string>>);
  assert.equal(notices.length, 2);
  assert.deepEqual(new Set(notices), new Set([documentNotice, softwareDocumentNotice]));
  for (const notice of notices) {
    assert.equal(notice.includes('\r'), false);
    assert.equal(notice.endsWith('\n'), false);
  }
  expectDeepFrozen(SOURCE_NOTICES);
});

function expectedCitation(passageId: string, score: number) {
  const passage = catalog.passages.find((item: any) => item.passageId === passageId);
  const source = manifest.sources.find((item: any) => item.title === passage.sourceTitle);
  const noticeKind = passage.sourceType === 'recommendation' ? 'document' : 'software-document';
  return {
    passageId: passage.passageId,
    corpusVersion: passage.corpusVersion,
    sourceTitle: passage.sourceTitle,
    sourceType: passage.sourceType,
    heading: passage.heading,
    url: passage.url,
    ruleId: passage.ruleIds[0],
    successCriterion: passage.successCriteria[0],
    guidanceRole: passage.guidanceRole,
    text: passage.text,
    score,
    sourceStatus: source.status,
    copyright: source.copyright,
    attribution: source.attribution,
    noticeKind,
  };
}

test('resolves all authenticated citations and notices from original LF or CRLF bytes', () => {
  const retrieval = retrievalFor(completeFindings.image, Object.values(imagePassages));
  const beforeFinding = clone(completeFindings.image);
  const beforeRetrieval = clone(retrieval);
  const expectedPassages = Object.values(imagePassages).map(item => expectedCitation(item.passageId, item.score));
  const expectedNotices = [
    { kind: 'document', text: documentNotice },
    { kind: 'software-document', text: softwareDocumentNotice },
  ];
  for (const [manifestInput, passageInput] of [
    [manifestBytes, passageBytes],
    [encoder.encode(manifestLf), encoder.encode(passageLf)],
    [
      encoder.encode(manifestLf.replaceAll('\n', '\r\n')),
      encoder.encode(passageLf.replaceAll('\n', '\r\n')),
    ],
  ]) {
    const result = resolveCitations(completeFindings.image, retrieval, manifestInput, passageInput);
    assert.deepEqual(result, {
      ok: true,
      value: { corpus: retrieval.corpus, passages: expectedPassages, notices: expectedNotices },
      support: { state: 'supported', missingRoles: [], conflicts: [] },
    });
    expectDeepFrozen(result);
  }
  assert.deepEqual(completeFindings.image, beforeFinding);
  assert.deepEqual(retrieval, beforeRetrieval);
});

test('deduplicates citation notices by first passage use and preserves ranked order and signed scores', () => {
  const passages = [imagePassages.interpretation, imagePassages.remediation];
  const retrieval = retrievalFor(completeFindings.image, passages);
  const result: any = resolveCitations(completeFindings.image, retrieval, manifestBytes, passageBytes);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value.passages, passages.map(item => expectedCitation(item.passageId, item.score)));
  assert.deepEqual(result.value.notices, [{ kind: 'software-document', text: softwareDocumentNotice }]);
  assert.deepEqual(result.support, {
    state: 'incomplete', missingRoles: ['criterion'], conflicts: [],
  });
});

test('fails citation resolution atomically for unauthenticated corpus bytes before result errors', () => {
  const retrieval = retrievalFor(completeFindings.image, Object.values(imagePassages));
  const malformed: any = clone(retrieval);
  malformed.extra = true;
  const manifestText = decoder.decode(manifestBytes);
  const passageText = decoder.decode(passageBytes);
  const altered = encoder.encode(passageText.replace('WCAG', 'WCAg'));
  const bom = Uint8Array.from([0xef, 0xbb, 0xbf, ...manifestBytes]);
  const reserialized = encoder.encode(JSON.stringify(JSON.parse(passageText)));
  const sourceMetadataChanged = encoder.encode(manifestText.replace(
    'Informative Understanding document', 'Informative understanding document',
  ));
  for (const [manifestInput, passageInput] of [
    [manifestBytes, altered], [bom, passageBytes], [manifestBytes, reserialized],
    [sourceMetadataChanged, passageBytes],
  ]) {
    assert.deepEqual(resolveCitations(completeFindings.image, retrieval, manifestInput, passageInput), corpusFailure);
    assert.deepEqual(resolveCitations(completeFindings.image, malformed, manifestInput, passageInput), corpusFailure);
  }
});

test('rejects unknown, wrong-profile, duplicate and malformed retrieval references without partial citations', () => {
  const valid: any = retrievalFor(completeFindings.image, Object.values(imagePassages));
  const inputs = [
    (() => { const value = clone(valid); value.passages[0].passageId = 'unknown'; return value; })(),
    (() => { const value = clone(valid); value.passages[0].passageId = 'wcag22-sc412'; return value; })(),
    (() => { const value = clone(valid); value.passages[1] = clone(value.passages[0]); return value; })(),
    (() => { const value = clone(valid); value.passages[0].extra = true; return value; })(),
    (() => { const value = clone(valid); value.corpus.version = 'wcag22-mvp-v2'; return value; })(),
  ];
  for (const retrieval of inputs) {
    assert.deepEqual(resolveCitations(completeFindings.image, retrieval, manifestBytes, passageBytes), resultFailure);
  }
});

test('fixed-path citation wrapper matches synchronous authenticated resolution', async () => {
  const retrieval = retrievalFor(completeFindings.image, Object.values(imagePassages));
  assert.deepEqual(
    await resolveFindingCitations(completeFindings.image, retrieval),
    resolveCitations(completeFindings.image, retrieval, manifestBytes, passageBytes),
  );
});

test('fixed-path citation wrapper fails closed on an in-memory read fault and restores file I/O', async () => {
  const retrieval = retrievalFor(completeFindings.image, Object.values(imagePassages));
  const originalReadFile = fs.promises.readFile;
  try {
    fs.promises.readFile = async () => { throw new Error('in-memory denied read'); };
    syncBuiltinESMExports();
    assert.deepEqual(await resolveFindingCitations(completeFindings.image, retrieval), corpusFailure);
  } finally {
    fs.promises.readFile = originalReadFile;
    syncBuiltinESMExports();
  }
  assert.deepEqual(
    await resolveFindingCitations(completeFindings.image, retrieval),
    resolveCitations(completeFindings.image, retrieval, manifestBytes, passageBytes),
  );
});

test('builds the exact supported decision with no result and exact completed analysis', () => {
  const support = successful<any>(supportFor(Object.values(imagePassages)));
  const beforeFinding = clone(completeFindings.image);
  const beforeSupport = clone(support);
  const result = buildFindingAnalysis(completeFindings.image as never, startedAt, finishedAt, support);
  assert.deepEqual(result, {
    state: 'active',
    analysis: {
      status: 'completed', startedAt, finishedAt,
      evidence: { state: 'complete', availableReferences: evidencePaths.image, blockers: [] },
    },
  });
  assert.deepEqual(completeFindings.image, beforeFinding);
  assert.deepEqual(support, beforeSupport);
  expectDeepFrozen(result);
});

test('builds exact guidance abstentions with references, explanations and no provider or review artifacts', () => {
  const cases = [
    [successful<any>(supportFor([])), 'missing-guidance'],
    [successful<any>(supportFor([imagePassages.criterion])), 'incomplete-guidance'],
    [successful<any>(supportFor(Object.values(imagePassages), [{
      passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'unresolved',
    }])), 'conflicting-guidance'],
  ] as const;
  for (const [support, reason] of cases) {
    const result: any = buildFindingAnalysis(completeFindings.image as never, startedAt, finishedAt, support);
    assert.deepEqual(result, {
      state: 'abstained',
      analysis: {
        status: 'completed', startedAt, finishedAt,
        evidence: { state: 'complete', availableReferences: evidencePaths.image, blockers: [] },
      },
      result: {
        type: 'abstention', findingId: 'finding-0', evidenceReferences: evidencePaths.image,
        retrievalReference: 'retrieval', reason, explanation: explanations[reason],
        providerCalled: false, manualInvestigation: investigations.guidance,
      },
    });
    for (const forbidden of ['evidence', 'passages', 'remediation', 'proposal', 'invocation', 'review', 'resultId']) {
      assert.equal(forbidden in result.result, false);
    }
    expectDeepFrozen(result);
  }
});

test('builds exact evidence-only abstentions for each profile and shadow blocker', () => {
  const cases: readonly [any, string, string][] = [
    [imageFinding(fact('img'), unavailable('missing')), 'evidence.altState', investigations['image-alt']],
    [setPath(labelFinding(), 'evidence.nameSources.ariaLabel', unavailable('withheld')), 'evidence.nameSources.ariaLabel', investigations.label],
    [setPath(contrastFinding(), 'evidence.fontWeight', unavailable('invalid')), 'evidence.fontWeight', investigations['color-contrast']],
  ];
  for (const [finding, blockedPath, manualInvestigation] of cases) {
    const evidence = assessFindingEvidence(finding);
    const result: any = buildFindingAnalysis(finding, startedAt, finishedAt, null);
    assert.deepEqual(result, {
      state: 'abstained',
      analysis: { status: 'completed', startedAt, finishedAt, evidence },
      result: {
        type: 'abstention', findingId: 'finding-0', evidenceReferences: evidence.availableReferences,
        retrievalReference: null, reason: 'incomplete-evidence',
        explanation: explanations['incomplete-evidence'], providerCalled: false, manualInvestigation,
      },
    }, blockedPath);
  }

  const shadow: any = contrastFinding();
  shadow.evidence.messageKey = fact('shadowOnBgColor');
  shadow.evidence.shadowColor = unavailable('missing');
  const shadowEvidence = assessFindingEvidence(shadow);
  const shadowResult: any = buildFindingAnalysis(shadow, startedAt, finishedAt, null);
  assert.equal(shadowResult.analysis.evidence.blockers[0].reference, 'evidence.shadowColor');
  assert.equal(shadowResult.result.manualInvestigation,
    `${investigations['color-contrast']} ${investigations.shadow}`);
  assert.deepEqual(shadowResult.result.evidenceReferences, shadowEvidence.availableReferences);
});

test('rejects malformed support, impossible evidence/support pairings and noncanonical chronology', () => {
  const supported = successful<any>(supportFor(Object.values(imagePassages)));
  const incomplete = imageFinding(fact('img'), unavailable('missing'));
  assert.throws(() => buildFindingAnalysis(incomplete as never, startedAt, finishedAt, supported));
  assert.throws(() => buildFindingAnalysis(completeFindings.image as never, startedAt, finishedAt, null));
  assert.throws(() => buildFindingAnalysis(completeFindings.image as never, finishedAt, startedAt, supported));
  assert.throws(() => buildFindingAnalysis(completeFindings.image as never, 'not-a-time', finishedAt, supported));
  assert.throws(() => buildFindingAnalysis(completeFindings.image as never, startedAt, finishedAt, {
    ...supported, extra: true,
  } as never));
  const malformed: any = clone(completeFindings.image);
  malformed.extra = true;
  assert.throws(() => buildFindingAnalysis(malformed, startedAt, finishedAt, supported));
});
