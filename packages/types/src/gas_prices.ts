import type { AutoGasSetting } from './setting';

/**
 * These are measured in gwei.
 */
export interface GasPrices {
  average: number;
  fast: number;
  slow: number;
}

/**
 * On the server we keep track of how fast each auto gas setting confirms in practice.
 */
export declare type NetworkHealthSummary = [AutoGasSetting, number][];
