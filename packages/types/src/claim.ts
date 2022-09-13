import type { EthAddress, LocationId } from './identifier';
import type { WorldCoords, WorldLocation } from './world';

/**
 * Represents a planet location that has been broadcast on-chain
 */
export type ClaimedCoords = WorldCoords & {
  hash: LocationId;
  revealer: EthAddress;
  score: number;
};

export type ClaimedLocation = WorldLocation & {
  revealer: EthAddress;
};
