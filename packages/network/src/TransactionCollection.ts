import { Transaction, TransactionCollection, TxIntent } from '@darkforest_eth/types';

/**
 * Default implementation of a transaction collection - provides a simple api for adding, removing,
 * and querying by type of transaction.
 */
export class TxCollection implements TransactionCollection {
  private transactions: Transaction[] = [];

  /**
   * Internally records the given transaction.
   */
  public addTransaction(tx: Transaction) {
    this.transactions.push(tx);
  }

  /**
   * Removes the internal record of the given transaction.
   */
  public removeTransaction(tx: Transaction) {
    this.transactions.splice(
      this.transactions.findIndex((tx2) => tx === tx2),
      1
    );
  }

  /**
   * Gets all transactions which are filtered to a particular type given a predicate.
   */
  public getTransactions<T extends TxIntent>(
    transactionPredicate: (u: Transaction) => u is Transaction<T>
  ): Transaction<T>[] {
    return this.transactions.filter(transactionPredicate);
  }

  /**
   * Returns whether or not there is at least one transaction which is filtered to by the given
   * predicate.
   */
  public hasTransaction<T extends TxIntent>(
    transactionPredicate: (u: Transaction) => u is Transaction<T>
  ): boolean {
    return this.transactions.filter(transactionPredicate).length !== 0;
  }
}
