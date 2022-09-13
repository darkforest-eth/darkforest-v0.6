import type { GasPrices } from './gas_prices';

export interface Diagnostics {
  visiblePlanets: number;
  visibleChunks: number;
  fps: number;
  totalPlanets: number;
  chunkUpdates: number;
  totalCalls: number;
  callsInQueue: number;
  totalTransactions: number;
  transactionsInQueue: number;
  totalChunks: number;
  gasPrices?: GasPrices;
  rpcUrl: string;
  width?: number;
  height?: number;
}

/**
 * Various parts of our codebase need to be able to self-report diagnostics. To enable them to do
 * so, you must provide them with an object that conforms to this interface. Currently, the only
 * implementation of this function is `GameManager`. However, in the future, we might want to stream
 * a sample of these diagnostic updates to our backend, so that we can analyze performance, catch
 * bugs, etc.
 */
export interface DiagnosticUpdater {
  /**
   * Updates the diagnostics using the provided updater function.
   */
  updateDiagnostics: (updateFn: (d: Diagnostics) => void) => void;
}
