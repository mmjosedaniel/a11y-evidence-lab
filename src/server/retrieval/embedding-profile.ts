export const EMBEDDING_IDENTITY = Object.freeze({
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
} as const);

export const DOCUMENT_INPUT_PREFIX = 'title: none | text: ';
export const QUERY_INPUT_PREFIX = 'task: search result | query: ';
export const EMBEDDING_QUANTIZATION = 'BF16';
export const EMBEDDING_ARCHITECTURE = 'gemma3';
export const EMBEDDING_KEEP_ALIVE = '5m';
export const EMBEDDING_SOURCE_IDENTITY = Object.freeze({
  ollamaCommit: 'b79067b0db7417f20108363bc22adb97f35c966a',
  llamaCppCommit: '0f3a71be15af836d277c9f918adfafb45732677e',
  manualSegmentation: true,
  queryPrefix: QUERY_INPUT_PREFIX,
} as const);
