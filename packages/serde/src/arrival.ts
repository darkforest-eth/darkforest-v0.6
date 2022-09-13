import { CONTRACT_PRECISION } from '@darkforest_eth/constants';
import type { DarkForest } from '@darkforest_eth/contracts/typechain';
import type { ArrivalType, QueuedArrival, VoyageId } from '@darkforest_eth/types';
import { address } from './address';
import { artifactIdFromEthersBN } from './artifact';
import { locationIdFromDecStr } from './location';

export type RawArrival = Awaited<ReturnType<DarkForest['getPlanetArrival']>>;

/**
 * Converts the raw typechain result of `ArrivalTypes.ArrivalData` struct to
 * to a `QueuedArrival` typescript typed object (see @darkforest_eth/types)
 *
 * @param rawArrival Raw data of a `ArrivalTypes.ArrivalData` struct,
 * returned from a blockchain call (assumed to be typed with typechain).
 */
export function decodeArrival(rawArrival: RawArrival): QueuedArrival {
  const arrival: QueuedArrival = {
    eventId: rawArrival.id.toString() as VoyageId,
    player: address(rawArrival.player),
    fromPlanet: locationIdFromDecStr(rawArrival.fromPlanet.toString()),
    toPlanet: locationIdFromDecStr(rawArrival.toPlanet.toString()),
    energyArriving: rawArrival.popArriving.toNumber() / CONTRACT_PRECISION,
    silverMoved: rawArrival.silverMoved.toNumber() / CONTRACT_PRECISION,
    departureTime: rawArrival.departureTime.toNumber(),
    arrivalTime: rawArrival.arrivalTime.toNumber(),
    distance: rawArrival.distance.toNumber(),
    artifactId: rawArrival.carriedArtifactId.eq(0)
      ? undefined
      : artifactIdFromEthersBN(rawArrival.carriedArtifactId),
    arrivalType: rawArrival.arrivalType as ArrivalType,
  };

  return arrival;
}
