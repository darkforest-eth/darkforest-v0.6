import type { AutoGasSetting } from './setting';

/**
 * Each time a transaction either reverts or confirms we send an event to the webserver with this
 * diagnostic info about the transaction, so that we can analyze the performance of the network in
 * aggregate across our player-base.
 */
export interface NetworkEvent {
  /**
   * Contract address to which the transaction was sent.
   */
  tx_to: string;

  /**
   * Function name that the transaction is calling on the contract.
   */
  tx_type: string;

  /**
   * Timestamp of when the transaction was first uploaded to the network.
   */
  time_exec_called: number;

  /**
   * If the user has specified that they want to use an auto gas setting (which is the case by
   * default in our client), then this value contains the string representation of that setting. In
   * certain cases this can also be a string number.
   */
  auto_gas_price_setting?: string | AutoGasSetting;

  /**
   * The url of the node fleet this transaction was sent to.
   */
  rpc_endpoint?: string;

  /**
   * If the transaction was confirmed, this is the transaction hash.
   */
  tx_hash?: string;

  /**
   * The address on behalf of which this transaction was sent.
   */
  user_address?: string;

  /**
   * The amount of time the client had to wait until the transaction was submitted to the pool.
   */
  wait_submit?: number;

  /**
   * If the transaction confirmed, the amount of time the client had to wait before it became aware
   * of the confirmation.
   */
  wait_confirm?: number;

  /**
   * If the transaction confirmed, the amount of time the client had to wait before it became aware
   * of the confirmation.
   */
  wait_error?: number;

  /**
   * If there was an error executing this transaction, contains a stringified version of that error.
   */
  error?: string;

  /**
   * If the error was returned as a byte string, contains a parsed version of that error.
   */
  parsed_error?: string;
}
