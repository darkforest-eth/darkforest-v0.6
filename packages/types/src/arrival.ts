import type { ArtifactId, EthAddress, LocationId, VoyageId } from './identifier';
import type { Abstract } from './utility';

/**
 * Represents a voyage.
 */
export interface QueuedArrival {
  eventId: VoyageId;
  player: EthAddress;
  fromPlanet: LocationId;
  toPlanet: LocationId;
  energyArriving: number;
  silverMoved: number;
  artifactId?: ArtifactId;
  departureTime: number;
  distance: number;
  arrivalTime: number;
  arrivalType: ArrivalType;
}

/**
 * Abstract type representing an arrival type.
 */
export type ArrivalType = Abstract<number, 'ArrivalType'>;

/**
 * Enumeration of arrival types.
 */
export const ArrivalType = {
  Unknown: 0 as ArrivalType,
  Normal: 1 as ArrivalType,
  Photoid: 2 as ArrivalType,
  Wormhole: 3 as ArrivalType,
} as const;

/**
 * Convenience type for storing a voyage and a reference to a timeout that is triggered on voyage
 * arrival (in case the timeout needs to be cancelled).
 */
export interface ArrivalWithTimer {
  /**
   * TODO: rename to `arrival` or 'voyage'.
   */
  arrivalData: QueuedArrival;
  timer: ReturnType<typeof setTimeout>;
}
