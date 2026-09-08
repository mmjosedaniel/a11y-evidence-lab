export const fact = <T>(value: T) => ({ value });
export const unavailable = (reason: 'missing' | 'invalid' | 'withheld' = 'missing') => ({ unavailable: reason });

const commonFinding = {
  findingId: 'finding-0',
  nativeResult: 'violation',
  state: 'unprocessed',
  locator: fact(':root > :nth-child(1)'),
} as const;

export function imageFinding(
  elementKind: unknown = fact('img'),
  altState: unknown = fact('absent'),
) {
  return {
    ...commonFinding,
    ruleId: 'image-alt',
    checks: fact({ any: ['has-alt'], all: [], none: [] }),
    evidence: { elementKind, altState },
  };
}

export type LabelCondition = 'positive' | 'negative' | 'unavailable';

export function labelSources(condition: LabelCondition) {
  const sources: Record<string, unknown> = {
    explicitLabel: fact(false),
    implicitLabel: fact(false),
    ariaLabel: fact('absent'),
    ariaLabelledby: fact('absent'),
    title: fact('absent'),
    placeholder: fact('absent'),
    presentationalRole: fact(false),
  };
  if (condition === 'positive') sources.explicitLabel = fact(true);
  if (condition === 'unavailable') sources.explicitLabel = unavailable();
  return sources;
}

export function labelFinding(
  elementKind: unknown = fact('input'),
  condition: LabelCondition = 'negative',
) {
  const inputType = typeof elementKind === 'object' && elementKind !== null
    && 'value' in elementKind && elementKind.value === 'textarea'
    ? { unavailable: 'not-applicable' }
    : typeof elementKind === 'object' && elementKind !== null && 'unavailable' in elementKind
      ? { unavailable: elementKind.unavailable }
      : fact('text');
  return {
    ...commonFinding,
    ruleId: 'label',
    checks: fact({ any: ['explicit-label'], all: [], none: [] }),
    evidence: { elementKind, inputType, nameSources: labelSources(condition) },
  };
}

export type ContrastCondition = 'below' | 'equal' | 'above' | 'unavailable';

export function contrastFinding(condition: ContrastCondition = 'below') {
  const ratios = condition === 'unavailable'
    ? { contrastRatio: unavailable(), expectedContrastRatio: fact(4.5) }
    : condition === 'below'
      ? { contrastRatio: fact(3), expectedContrastRatio: fact(4.5) }
      : condition === 'equal'
        ? { contrastRatio: fact(4.5), expectedContrastRatio: fact(4.5) }
        : { contrastRatio: fact(7), expectedContrastRatio: fact(4.5) };
  return {
    ...commonFinding,
    ruleId: 'color-contrast',
    checks: fact({ any: ['color-contrast'], all: [], none: [] }),
    evidence: {
      foregroundColor: fact('#000000'), backgroundColor: fact('#ffffff'),
      shadowColor: unavailable(), ...ratios, fontSize: fact('12.0pt (16px)'),
      fontWeight: fact('normal'), measurementSource: 'axe-core', messageKey: unavailable(),
    },
  };
}

const queryText = (ruleId: string, successCriterion: string, element: string, condition: string) =>
  `Find accessibility guidance for an axe-core ${ruleId} violation mapped to WCAG 2.2 SC ${successCriterion}.\n`
  + `Affected element type: ${element}.\n`
  + `Observed condition: ${condition}.\n`
  + 'Return guidance that explains the issue, a bounded remediation approach, and what a person must verify.';

export type QueryCase = {
  readonly name: string;
  readonly finding: unknown;
  readonly expected: {
    readonly version: 'm2-retrieval-query-v1';
    readonly ruleId: 'image-alt' | 'label' | 'color-contrast';
    readonly successCriterion: '1.1.1' | '4.1.2' | '1.4.3';
    readonly element: string;
    readonly condition: string;
    readonly text: string;
  };
};

const imageElements = [
  [fact('img'), 'img'],
  [unavailable('missing'), 'element kind unavailable: missing'],
  [unavailable('invalid'), 'element kind unavailable: invalid'],
  [unavailable('withheld'), 'element kind unavailable: withheld'],
] as const;
const altStates = [
  [fact('absent'), 'alt attribute absent'],
  [fact('empty'), 'alt attribute empty'],
  [fact('whitespace-only'), 'alt attribute contains only whitespace'],
  [fact('non-empty'), 'non-empty alt attribute was recorded, and axe-core reported an image-alt violation'],
  [unavailable('missing'), 'alt attribute state unavailable: missing'],
  [unavailable('invalid'), 'alt attribute state unavailable: invalid'],
  [unavailable('withheld'), 'alt attribute state unavailable: withheld'],
] as const;
const labelElements = [
  [fact('input'), 'input'],
  [fact('textarea'), 'textarea'],
  [unavailable('missing'), 'element kind unavailable: missing'],
  [unavailable('invalid'), 'element kind unavailable: invalid'],
  [unavailable('withheld'), 'element kind unavailable: withheld'],
] as const;
const labelConditions = [
  ['positive', 'axe-core reported a label violation; one or more label or name-source indicators were recorded'],
  ['negative', 'axe-core reported a label violation; no positive label or name-source indicator was recorded'],
  ['unavailable', 'axe-core reported a label violation; label and name-source indicator completeness is unavailable'],
] as const;
const contrastConditions = [
  ['below', 'recorded contrast ratio is below the recorded required ratio'],
  ['equal', 'recorded contrast ratio equals the recorded required ratio'],
  ['above', 'recorded contrast ratio is above the recorded required ratio, and axe-core reported a color-contrast violation'],
  ['unavailable', 'contrast-ratio relation is unavailable'],
] as const;

export const queryCases: readonly QueryCase[] = Object.freeze([
  ...imageElements.flatMap(([elementKind, element]) => altStates.map(([altState, condition]) => ({
    name: `image ${element} / ${condition}`,
    finding: imageFinding(elementKind, altState),
    expected: {
      version: 'm2-retrieval-query-v1' as const, ruleId: 'image-alt' as const,
      successCriterion: '1.1.1' as const, element, condition,
      text: queryText('image-alt', '1.1.1', element, condition),
    },
  }))),
  ...labelElements.flatMap(([elementKind, element]) => labelConditions.map(([kind, condition]) => ({
    name: `label ${element} / ${kind}`,
    finding: labelFinding(elementKind, kind),
    expected: {
      version: 'm2-retrieval-query-v1' as const, ruleId: 'label' as const,
      successCriterion: '4.1.2' as const, element, condition,
      text: queryText('label', '4.1.2', element, condition),
    },
  }))),
  ...contrastConditions.map(([kind, condition]) => ({
    name: `contrast ${kind}`,
    finding: contrastFinding(kind),
    expected: {
      version: 'm2-retrieval-query-v1' as const, ruleId: 'color-contrast' as const,
      successCriterion: '1.4.3' as const, element: 'color-contrast target', condition,
      text: queryText('color-contrast', '1.4.3', 'color-contrast target', condition),
    },
  })),
]);

export const expectedCorpusIdentity = Object.freeze({
  version: 'wcag22-mvp-v1',
  manifestSha256: '475F66CF68F6245707CAACC3E1FE423E4B0153B1A91FD967A0F1DB82ADB89E4F',
  passagesSha256: '8C396C2C5472DA9A199363410F8E89A13BB4AC04B30192DFD985371890C9B4AB',
});

export const expectedEmbeddingIdentity = Object.freeze({
  tag: 'embeddinggemma',
  resolvedModel: 'embeddinggemma:latest',
  manifestDigest: '85462619ee721b466c5927d109d4cb765861907d5417b9109caebc4e614679f1',
  modelDigest: '0800cbac9c2064dde519420e75e512a83cb360de3ad5df176185dc69652fc515',
  dimensions: 768,
  runtimeVersion: '0.33.3',
  adapterVersion: 'm2-ollama-embed-v1',
  context: 2048,
  numBatch: 2048,
  inputFitVersion: 'm202-finite-v1',
  documentFormat: 'm2-document-none-v1',
  textNormalization: 'none',
  vectorNormalization: 'ollama-l2',
});

export function retrievalResult(query: QueryCase['expected'], passages: readonly { passageId: string; score: number }[] = []) {
  return {
    corpus: { ...expectedCorpusIdentity }, query: structuredClone(query),
    embedding: { ...expectedEmbeddingIdentity },
    filter: { ruleId: query.ruleId, successCriterion: query.successCriterion },
    metric: 'cosine', topK: 3, tieBreak: 'passageId-ascending',
    passages: passages.map(passage => ({ ...passage })),
  };
}

// Frozen expected SHA-256 values for the accepted 16 document and 47 query inputs.
export const finiteInputSha256: readonly string[] = Object.freeze([
  'B60519DDD699D3812C248E2D72615B57DACFF7BCB3256847920D807A7B61F3AE', '5D65265EFAAAE2639B0432D243CCF22AFC07D00873690431B668C5A7946853C1',
  '8CA8B412290DD9CF248B712A9C0AAF82506D7C2A6AFAEF7660EA08784BAB853E', 'A3F7310A3B7F712716A4D245775289FD5BA9A2BCD19E7691E2A639D4DAF395D7',
  'F224D517A65B9145CC30C2165E83E196F1A9642619AF968D7FEBC8B27C3C6523', 'C32E5198D8AA77E6C6593F63F039E056E4165BCA35866582B978F35DF1A77043',
  'CFDBE4487CA12275765D858EB360B9976D04247FA7BCF24805A913E8F7E2DE3F', '3C9465C55386F6002A72652BF580D74AE490B4775AD1AB309C71E6A110354926',
  '0F66A58E40B716161FC4D9A825086818439931CE4F4A6F7CA499CB09DD388C6B', 'F63A641FA843BD99CBDCD05B6B84819BECDF511425E9DB36545613F96C7DB380',
  '1123E866F932AF9202567A8EC5C4920A3FD7694FC0AC788AA83A7FEC8F9FCE43', '2C5D546CB3E49E7ED9FFD95C87B29B08135044F470DA69BD7C1D7D2AB971DE6F',
  '53239F60DF9BB29A3BDF4FAED73B268B588A586D402FA7C039FEEF9F359335CE', '0B87FA3922B1B0472C1F349E098A45ACDB375997AA97C6F36518A0A48FE91000',
  '3CE1C9DF5A7D7B07156629285431F86694F0CA9C83ADAFE3E04E91D4190FEBC0', '006B7B26BCF4736D87056199AB20257462307008335CA378377076E7ACDA57AA',
  '9A6DC6ED8B8457E01ACA8E8E44A9F7D0ADE0658F3FDBD5F4539413842547C62F', 'A20D0F1B2293C831D4329DE68BB270891E1A6CCEF68062522D74B963E7EDC50D',
  '6E72B30F96D688584C01901E45E5A7A5B808223116FCB4F2600D2BAEEA2A5B6D', '4BF8A55A8B93DF24084C6415D5354BF2BA99FA66454EECB0420010F142D53DA1',
  'A944E9AF3952AD4D5312270DC8BB9571A83E6FB684A280805909BDF83196168A', 'D5F66C202AA574FE826D9ABB1E028D91B3E1E0A558F627DEED7E1957D8D71CFB',
  'D08602DFDD0A581F1A92FFBAA1034D1DF2CAA7998526CCD3D7EA030551710015', 'D686A4ED9ED11CBEE071228DA98CB5DE5C3F1417E4CA28FF041BB8B960E67A71',
  '8531273846C4A09F81F7003199C38EA8E0653E4638C2F05DE3CB326CEA977DF8', '067B8D617D9FBEA32853923B56C47C31146B02291C2080284E30E8E55676486C',
  '15BD669DEC7A0380B1F8657A9FADC0E6E03A5A92976612475573FB41C78483AE', '6177E536D80348118E9954F3DB67F320A7AC114BC456E17730904264ECA6CC96',
  '2D928FA28C3422D52B5C57242C5E3CD8461004B97024BCFFD7A45F9F3F42815A', '6C9828628F348A4AA2C8A09486FCF4E2EFEF06A4619399C3526AC4CC5BBBBD53',
  '4F9D726A3F786EC8C835C60C00C5C585EF6011437011EE3717F553CB34698005', 'A0CDCF8CAEB7CC07257EA416890DD9E7BBF19E2513436DE4566AC6BB9E44EE05',
  '117ABC40B958ABA21B0F0D4C2DB3E69F7F60DE6BFDD00B6030B627805C366C41', '27E5F7C708E27738745DE81F62D3CA039B794E2555197F7AFA6174655A533039',
  'BD7BEE4CCAD6980F419CC581AF7F7B21506A85A535A10D7A0F5E1CE0D5037849', 'C4791ED5218365D0894655F4486F83EE817C1E8E25D05A40F6BA2594EF17D0EA',
  '95FEF7E642F3FE40012820BC55D04C8499D2CBC3375B44E120573FA6411D47B3', '7D1926BB5739DC573EB6CF8EA364BB6A548F474BC6025316C80C289F480AAFB2',
  '61243E05FE47CC410CDD9560637E414AFAF925BAAE78D50B7EDD386CA8C8AC6D', 'E30BA937095B0B8C59D0CE31AA0E11C6BB4260A53ADFA572A8708E98E25E3E44',
  '3C8603C47A2F5087122669C40117C630892EC0C0F4713AFC3962AF1B6EFFACC7', 'F88C049C1FA8B14EC36F5ACE1854E3E5B07265BBD5EEA764E8D72BB60DCFD884',
  '96FA0D54FBC01FD26CF1189591BEC60331AAFECEC5E617E0EB36B4C087DA7EF3', '8BCE7D6F9B7A16E3ADE1DDE285FB18EB7B3D5BD795D232844138C1DDA5F10F53',
  '7F73FAF256E0C93C75491A3DE89C44A268D9CF9C410771EEAEA927C6CFCFDA44', 'CA6265B600F7C3C793E43E6864B2A0926345E7FE8992A67CD7350B8414DC2A27',
  'DC01970D7EA43C26D4D29251996ABDD9851F4B692FAB70E70BA0D79833BBEA6B', '1BE163759796E41E45253B4F3372FAF7791C8316DCA96BDB4B1FC1FE1F4B59C6',
  '743CDFD1DA66250CEE5D075441468CC1507C8199E829DA7058BBA61DF57B0E3E', '623ACF578F813539A170EEA6D0DE7C089F46DEC93B9E9A8D66DF888A97919CFC',
  '11E61A1DDA60EE8B5894079C593FEA0767BA42C9C31B471425A388394E10CED8', '30B5652159876E5053FE7270B05A9E543C8FB9ECD650DCD5AB965A8C1EA13F2B',
  '8D72479389D11772972A8186CA281A3D6556D215CC021E412C1E77DDF62FCB25', '14D64838D967EA6EDEC35086ABD2F6D88A49D74AF2AFA658AA9584AEA5694881',
  'D76F64C26601EBA2A9DDA0B98229452842E1E95247E3823DF3BFD825A70BAC22', '8E4929A6E3A02743807CCA9A9465E1D603D732EA2E5CE4F89CF9009396DEE91D',
  '4CC98222A55B7A779E0A35B012F8809F74272E5534752BC8B657857669C34475', 'B0D60A0CBD30982D663759F721D3EE55CAF519976831086DE211F936866DFEF3',
  'FA95501C8DD1E095557E90FE624ED3CDEFED30E544EDF6D51B7B473B86559A44', 'B6554BBD5EBF85FB98E7A56F6D864FD05CAA8192B8051A8997CEA1421CF093C1',
  '69022BCA0324670D3821718BB886D89A133D016BD14D6A02781724205308D725', 'B5E800FADAF495BA9A1D5F9D0EB81A92A4F63769BB9A1E4E7556D28A981BEDE5',
  '262BEA433254C8CAEB33187470E7AA2D36C0C5632A691783F23EDD822A289E41',
]);
