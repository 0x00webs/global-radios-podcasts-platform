import { RadioProviderName, ProviderRadioResult, RadioProviderSearchParams } from '../types/radio-search.types';

export interface BaseRadioProvider {
  readonly name: RadioProviderName;
  search(params: RadioProviderSearchParams): Promise<ProviderRadioResult[]>;
  isAvailable(): Promise<boolean>;
  requiresAuthentication(): boolean;
}
