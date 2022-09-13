import type { EthAddress, LocationId } from './identifier';

/**
 * Represents a player; corresponds fairly closely with the analogous contract
 * struct
 */
export type Player = {
  address: EthAddress;
  twitter?: string;
  /**
   * seconds (not millis)
   */
  initTimestamp: number;
  homePlanetId: LocationId;
  /**
   * seconds (not millis)
   */
  lastRevealTimestamp: number;
  lastClaimTimestamp: number;
  score: number;

  spaceJunk: number;
  spaceJunkLimit: number;
  claimedShips: boolean;
  finalRank: number;
  claimedReward: boolean;
};
