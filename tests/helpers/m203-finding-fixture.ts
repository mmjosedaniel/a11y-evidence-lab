import { createFindingQuery } from '../../src/server/retrieval/finding-query.ts';
import {
  contrastFinding,
  imageFinding,
  labelFinding,
  retrievalResult,
} from './m202-retrieval-fixture.ts';

export const reasons = ['missing', 'invalid', 'withheld'] as const;
export const roles = ['criterion', 'interpretation', 'remediation'] as const;

export const evidencePaths = Object.freeze({
  image: Object.freeze(['checks', 'evidence.elementKind', 'evidence.altState']),
  labelInput: Object.freeze([
    'checks', 'evidence.elementKind', 'evidence.inputType',
    'evidence.nameSources.explicitLabel', 'evidence.nameSources.implicitLabel',
    'evidence.nameSources.ariaLabel', 'evidence.nameSources.ariaLabelledby',
    'evidence.nameSources.title', 'evidence.nameSources.placeholder',
    'evidence.nameSources.presentationalRole',
  ]),
  labelTextarea: Object.freeze([
    'checks', 'evidence.elementKind',
    'evidence.nameSources.explicitLabel', 'evidence.nameSources.implicitLabel',
    'evidence.nameSources.ariaLabel', 'evidence.nameSources.ariaLabelledby',
    'evidence.nameSources.title', 'evidence.nameSources.placeholder',
    'evidence.nameSources.presentationalRole',
  ]),
  contrast: Object.freeze([
    'checks', 'evidence.foregroundColor', 'evidence.backgroundColor',
    'evidence.contrastRatio', 'evidence.expectedContrastRatio',
    'evidence.fontSize', 'evidence.fontWeight', 'evidence.measurementSource',
  ]),
} as const);

export const completeFindings = Object.freeze({
  image: imageFinding(),
  label: labelFinding(),
  textarea: labelFinding({ value: 'textarea' }),
  contrast: contrastFinding(),
});

export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function setPath(input: unknown, path: string, value: unknown): unknown {
  const copy: any = clone(input);
  const parts = path.split('.');
  let owner = copy;
  for (const part of parts.slice(0, -1)) owner = owner[part];
  owner[parts.at(-1)!] = value;
  return copy;
}

export function retrievalFor(
  finding: unknown,
  passages: readonly { readonly passageId: string; readonly score: number }[],
) {
  const query = createFindingQuery(finding);
  if (!query.ok) throw new Error('Fixture Finding must produce a valid retrieval query');
  return retrievalResult(query.value, passages);
}

export const imagePassages = Object.freeze({
  criterion: Object.freeze({ passageId: 'wcag22-sc111', score: 0.9 }),
  interpretation: Object.freeze({ passageId: 'understanding111-intent', score: 0.8 }),
  remediation: Object.freeze({ passageId: 'h37-text-alternative', score: 0.7 }),
});

export const labelPassages = Object.freeze({
  criterion: Object.freeze({ passageId: 'wcag22-sc412', score: 0.9 }),
  secondCriterion: Object.freeze({ passageId: 'wcag22-name-definition', score: 0.8 }),
  interpretation: Object.freeze({ passageId: 'understanding412-intent', score: 0.7 }),
});

export const explanations = Object.freeze({
  'incomplete-evidence': 'Required captured evidence is incomplete.',
  'conflicting-guidance': 'The retrieved guidance contains an unresolved material conflict.',
  'missing-guidance': 'No applicable guidance was retrieved.',
  'incomplete-guidance': 'The retrieved guidance does not cover every required role.',
} as const);

export const investigations = Object.freeze({
  'image-alt': 'Inspect the affected image and verify its purpose and alternative-text state. Capture the unavailable required facts before requesting guidance in a new analysis.',
  label: 'Inspect the affected control and verify its element type and naming relationships. Capture the unavailable required facts before requesting guidance in a new analysis.',
  'color-contrast': 'Inspect the affected text and verify its foreground, background, font properties and contrast measurements. Capture the unavailable required facts before requesting guidance in a new analysis.',
  guidance: 'Inspect the affected element and the cited sources. Investigate the missing or conflicting guidance before proceeding in a new analysis.',
  shadow: 'The recorded measurement identifies a shadow contribution; inspect and capture that shadow color.',
} as const);

export const documentNotice = `By using and/or copying this document, or the W3C document from which this statement is linked, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions:

Permission to copy, and distribute the contents of this document, or the W3C document from which this statement is linked, in any medium for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the document, or portions thereof, that you use:

- A link or URL to the original W3C document.
- The pre-existing copyright notice of the original author, or if it doesn't exist, a notice (hypertext is preferred, but a textual representation is permitted) of the form: "Copyright © [$date-of-document] World Wide Web Consortium. https://www.w3.org/copyright/document-license-2023/"
- If it exists, the STATUS of the W3C document.

When space permits, inclusion of the full text of this NOTICE should be provided. We request that authorship attribution be provided in any software, documents, or other items or products that you create pursuant to the implementation of the contents of this document, or any portion thereof.

No right to create modifications or derivatives of W3C documents is granted pursuant to this license, except as follows: To facilitate implementation of the technical specifications set forth in this document, anyone may prepare and distribute derivative works and portions of this document in software, in supporting materials accompanying software, and in documentation of software, PROVIDED that all such works include the notice below.

HOWEVER, the publication of derivative works of this document for use as a technical specification is expressly prohibited.

In addition, "Code Components" —Web IDL in sections clearly marked as Web IDL; and W3C-defined markup (HTML, CSS, etc.) and computer programming language code clearly marked as code examples— are licensed under the W3C Software License.

The notice is:

"Copyright © 2023 W3C®. This software or document includes material copied from or derived from [title and URI of the W3C document]."

THIS DOCUMENT IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR TITLE; THAT THE CONTENTS OF THE DOCUMENT ARE SUITABLE FOR ANY PURPOSE; NOR THAT THE IMPLEMENTATION OF SUCH CONTENTS WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.

COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE DOCUMENT OR THE PERFORMANCE OR IMPLEMENTATION OF THE CONTENTS THEREOF.

The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to this document or its contents without specific, written prior permission. Title to copyright in this document will at all times remain with copyright holders.`;

export const softwareDocumentNotice = `By obtaining and/or copying this work, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions.

Permission to copy, modify, and distribute this work, with or without modification, for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the work or portions thereof, including modifications:

- The full text of this NOTICE in a location viewable to users of the redistributed or derivative work.
- Any pre-existing intellectual property disclaimers, notices, or terms and conditions. If none exist, the W3C software and document short notice should be included.
- Notice of any changes or modifications, through a copyright statement on the new code or document such as "This software or document includes material copied from or derived from [title and URI of the W3C document]. Copyright © [$year-of-document] World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/"

THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.

COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.

The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to the work without specific, written prior permission. Title to copyright in this work will at all times remain with copyright holders.`;

export function expectDeepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  if (!Object.isFrozen(value)) throw new Error('Expected a deeply frozen result');
  for (const child of Object.values(value)) expectDeepFrozen(child);
}
