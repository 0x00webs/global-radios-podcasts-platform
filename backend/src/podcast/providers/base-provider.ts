import { ProviderName, ProviderPodcastResult, ProviderSearchParams } from '../types/podcast-search.types';

export interface BasePodcastProvider {
  readonly name: ProviderName;
  search(query: ProviderSearchParams): Promise<ProviderPodcastResult[]>;
  isAvailable(): Promise<boolean>;
  requiresAuthentication(): boolean;
}
