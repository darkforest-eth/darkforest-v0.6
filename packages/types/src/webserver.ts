export type WhitelistStatusResponse = {
  whitelisted: boolean;
  /**
   * The address' position in the queue.
   */
  position?: string;
  /**
   * If successful, the hash of the whitelist
   * registration transaction.
   */
  txHash?: string;
  /**
   * Failure timestamp.
   */
  failedAt?: string;
};

export type RegisterResponse = {
  inProgress: boolean;
  success?: boolean;
  error?: string;
};
