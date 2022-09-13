import type { providers } from 'ethers';
import type { AutoGasSetting } from './setting';
import type { EthTxStatus, TxIntent } from './transactions';

export interface TransactionCollection {
  addTransaction(tx: Transaction): void;

  removeTransaction(tx: Transaction): void;

  getTransactions<T extends TxIntent>(
    transactionPredicate: (u: Transaction) => u is Transaction<T>
  ): Transaction<T>[];

  hasTransaction<T extends TxIntent>(
    transactionPredicate: (u: Transaction) => u is Transaction<T>
  ): boolean;
}

export interface PersistedTransaction<T extends TxIntent | unknown = TxIntent> {
  intent: T;
  hash: string;
}

/**
 * A unique incrementing number that identifies a transaction.
 */
export type TransactionId = number;

/**
 * Represents a transaction that the game would like to submit to the blockchain.
 */
export interface Transaction<T extends TxIntent = TxIntent> {
  /**
   * In-game representation of this transaction.
   */
  intent: T;

  /**
   * Uniquely identifies this transaction. Invariant throughout the entire life of a transaction,
   * from the moment the game conceives of taking that action, to the moment that it finishes either
   * successfully or with an error.
   */
  id: TransactionId;

  /**
   * The timestamp of the last time this transaction's state was updated.
   */
  lastUpdatedAt: number;

  /**
   * Once this transaction has been submitted to the blockchain (but not before), then
   * {@code TxExecutor} sets this field to the hash of the transaction.
   */
  hash?: string;

  /**
   * The current state of this transaction - updated whenever the state changes by {@code TxExecutor}
   */
  state: EthTxStatus;

  /**
   * Overrides parameters which modifies the internal details of this transaction.
   */
  overrides?: providers.TransactionRequest;

  /**
   * Called if there was an error submitting this transaction.
   */
  onSubmissionError: (e: Error | undefined) => void;

  /**
   * Called if there was an error waiting for this transaction to complete.
   */
  onReceiptError: (e: Error | undefined) => void;

  /**
   * Called when the transaction was successfully submitted to the mempool.
   */
  onTransactionResponse: (e: providers.TransactionResponse) => void;

  /**
   * Called when the transaction successfully completes.
   */
  onTransactionReceipt: (e: providers.TransactionReceipt) => void;

  /**
   * If the user provided an auto gas setting, record that here for logging purposes.
   */
  autoGasPriceSetting?: AutoGasSetting | string;

  /**
   * Resolves or rejects depending on the success or failure of this transaction to get into the
   * mempool. If this rejects, {@link PendingTransaction.confirmed} neither rejects nor resolves.
   */
  submittedPromise: Promise<providers.TransactionResponse>;

  /**
   * Resolves or rejects depending on the success or failure of this transaction to execute.
   */
  confirmedPromise: Promise<providers.TransactionReceipt>;
}
