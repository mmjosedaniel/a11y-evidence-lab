export type RetrievalErrorCode =
  | 'corpus-integrity'
  | 'missing-prerequisite'
  | 'model-identity'
  | 'input-fit'
  | 'embedding-failed'
  | 'embedding-response'
  | 'timeout'
  | 'shutdown'
  | 'result-validation';

export class RetrievalError extends Error {
  readonly code: RetrievalErrorCode;
  readonly cleanupFailed: boolean;

  constructor(code: RetrievalErrorCode, cleanupFailed = false) {
    super(code);
    this.name = 'RetrievalError';
    this.code = code;
    this.cleanupFailed = cleanupFailed;
  }
}
