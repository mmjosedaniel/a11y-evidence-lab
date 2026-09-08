export const CORPUS_IDENTITY = Object.freeze({
  version: 'wcag22-mvp-v1',
  manifestSha256: '475F66CF68F6245707CAACC3E1FE423E4B0153B1A91FD967A0F1DB82ADB89E4F',
  passagesSha256: '8C396C2C5472DA9A199363410F8E89A13BB4AC04B30192DFD985371890C9B4AB',
} as const);

export type CorpusIdentity = typeof CORPUS_IDENTITY;
export type RetrievalRuleId = 'image-alt' | 'label' | 'color-contrast';
export type SuccessCriterion = '1.1.1' | '4.1.2' | '1.4.3';

export type PassageReference = {
  readonly passageId: string;
  readonly sourceTitle: string;
  readonly heading: string;
  readonly url: string;
  readonly ruleId: RetrievalRuleId;
  readonly successCriterion: SuccessCriterion;
};

export const PASSAGE_REFERENCES: readonly PassageReference[] = Object.freeze([
  ['wcag22-sc111', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'Success Criterion 1.1.1 Non-text Content', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#non-text-content', 'image-alt', '1.1.1'],
  ['wcag22-sc412', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'Success Criterion 4.1.2 Name, Role, Value', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#name-role-value', 'label', '4.1.2'],
  ['wcag22-sc143', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'Success Criterion 1.4.3 Contrast (Minimum)', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#contrast-minimum', 'color-contrast', '1.4.3'],
  ['wcag22-name-definition', 'Web Content Accessibility Guidelines (WCAG) 2.2', '6. Glossary', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#dfn-name', 'label', '4.1.2'],
  ['wcag22-large-scale-definition', 'Web Content Accessibility Guidelines (WCAG) 2.2', '6. Glossary', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#dfn-large-scale', 'color-contrast', '1.4.3'],
  ['wcag22-contrast-ratio-definition', 'Web Content Accessibility Guidelines (WCAG) 2.2', '6. Glossary', 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#dfn-contrast-ratio', 'color-contrast', '1.4.3'],
  ['understanding111-intent', 'Understanding Success Criterion 1.1.1: Non-text Content', 'Intent', 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html#intent', 'image-alt', '1.1.1'],
  ['understanding111-decoration', 'Understanding Success Criterion 1.1.1: Non-text Content', 'Additional information', 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html#additional-information', 'image-alt', '1.1.1'],
  ['h37-text-alternative', 'H37: Using alt attributes on img elements', 'Description', 'https://www.w3.org/WAI/WCAG22/Techniques/html/H37#description', 'image-alt', '1.1.1'],
  ['h67-ignored-image', 'H67: Using null alt text and no title attribute on img elements for images that assistive technology should ignore', 'Description', 'https://www.w3.org/WAI/WCAG22/Techniques/html/H67#description', 'image-alt', '1.1.1'],
  ['understanding412-intent', 'Understanding Success Criterion 4.1.2: Name, Role, Value', 'Intent', 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html#intent', 'label', '4.1.2'],
  ['h44-explicit-label', 'H44: Using label elements to associate text labels with form controls', 'Description', 'https://www.w3.org/WAI/WCAG22/Techniques/html/H44#description', 'label', '4.1.2'],
  ['h44-label-applicability', 'H44: Using label elements to associate text labels with form controls', 'Description', 'https://www.w3.org/WAI/WCAG22/Techniques/html/H44#description', 'label', '4.1.2'],
  ['understanding143-intent', 'Understanding Success Criterion 1.4.3: Contrast (Minimum)', 'Intent', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html#intent', 'color-contrast', '1.4.3'],
  ['understanding143-threshold-measurement', 'Understanding Success Criterion 1.4.3: Contrast (Minimum)', 'Intent', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html#intent', 'color-contrast', '1.4.3'],
  ['g18-contrast-remediation', 'G18: Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text', 'Description', 'https://www.w3.org/WAI/WCAG22/Techniques/general/G18#description', 'color-contrast', '1.4.3'],
].map(([passageId, sourceTitle, heading, url, ruleId, successCriterion]) => Object.freeze({
  passageId, sourceTitle, heading, url, ruleId, successCriterion,
})) as readonly PassageReference[]);

export function findPassageReference(passageId: string): PassageReference | undefined {
  return PASSAGE_REFERENCES.find(reference => reference.passageId === passageId);
}
