import type { ProviderContext } from '../../../server/domain/run-contract.ts';

export interface AnalyzeIntent {
  readonly requestedUrl: string;
  readonly providerContext: ProviderContext;
}

export interface AnalysisConfiguration {
  readonly localModelInstalled?: boolean;
  readonly groqApiUrlConfigured?: boolean;
}

export interface AnalysisError {
  readonly text: string;
  readonly unsaved: boolean;
  readonly cleanup: boolean;
}
