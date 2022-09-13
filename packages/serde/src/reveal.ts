import { LOCATION_ID_UB } from '@darkforest_eth/constants';
import type { DarkForest } from '@darkforest_eth/contracts/typechain';
import type { RevealedCoords } from '@darkforest_eth/types';
import bigInt from 'big-integer';
import { address } from './address';
import { locationIdFromDecStr } from './location';

export type RawRevealedCoords = Awaited<ReturnType<DarkForest['revealedCoords']>>;

/**
 * Converts the result of a typechain-typed ethers.js contract call returning a
 * `RevealTypes.RevealedCoords` struct into a `RevealedCoords` object (see
 * @darkforest_eth/types)
 *
 * @param rawRevealedCoords the result of a typechain-typed ethers.js contract
 * call returning a RevealTypes.RevealedCoords` struct
 */
export function decodeRevealedCoords(rawRevealedCoords: RawRevealedCoords): RevealedCoords {
  const locationId = locationIdFromDecStr(rawRevealedCoords.locationId.toString());
  let xBI = bigInt(rawRevealedCoords.x.toString()); // nonnegative residue mod p
  let yBI = bigInt(rawRevealedCoords.y.toString()); // nonnegative residue mod p
  let x = 0;
  let y = 0;
  if (xBI.gt(LOCATION_ID_UB.divide(2))) {
    xBI = xBI.minus(LOCATION_ID_UB);
  }
  x = xBI.toJSNumber();
  if (yBI.gt(LOCATION_ID_UB.divide(2))) {
    yBI = yBI.minus(LOCATION_ID_UB);
  }
  y = yBI.toJSNumber();
  return {
    hash: locationId,
    x,
    y,
    revealer: address(rawRevealedCoords.revealer),
  };
}
