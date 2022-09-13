import type { EthAddress } from './identifier';

/**
 * Map from game version -> leaderboard.
 *
 * @hidden
 */
export interface AllAddressScoreMaps {
  [version: string]: AddressScoreMap;
}

/**
 * @hidden
 */
export interface AddressScoreMap {
  [key: string]: number | undefined;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  score: number | undefined;
  ethAddress: EthAddress;
  twitter?: string;
}
