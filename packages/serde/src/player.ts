import type { DarkForest } from '@darkforest_eth/contracts/typechain';
import type { Player } from '@darkforest_eth/types';
import { address } from './address';
import { locationIdFromEthersBN } from './location';

export type RawPlayer = Awaited<ReturnType<DarkForest['players']>>;

/**
 * Converts the raw typechain result of a call which fetches a
 * `PlayerTypes.Player` struct, and converts it into an object
 * with type `Player` (see @darkforest_eth/types) that can be used by a client.
 *
 * @param rawPlayer result of an ethers.js contract call which returns a raw
 * `PlayerTypes.Player` struct, typed with typechain.
 */
export function decodePlayer(rawPlayer: RawPlayer): Player {
  return {
    address: address(rawPlayer.player),
    initTimestamp: rawPlayer.initTimestamp.toNumber(),
    homePlanetId: locationIdFromEthersBN(rawPlayer.homePlanetId),
    lastRevealTimestamp: rawPlayer.lastRevealTimestamp.toNumber(),
    lastClaimTimestamp: rawPlayer.lastRevealTimestamp.toNumber(),
    score: rawPlayer.score.toNumber(),
    spaceJunk: rawPlayer.spaceJunk.toNumber(),
    spaceJunkLimit: rawPlayer.spaceJunkLimit.toNumber(),
    claimedShips: rawPlayer.claimedShips,
    finalRank: rawPlayer.finalRank.toNumber(),
    claimedReward: rawPlayer.claimedReward,
  };
}
