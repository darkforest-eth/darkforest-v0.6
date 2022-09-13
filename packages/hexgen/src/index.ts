/**
 * This package contains functions for determining various properties of Dark Forest objects based on their ID in hex. You could think of this package like procedural generation for Ethereum addresses.
 *
 * **Note:** This package _might_ go away when objects become classes that contain a lot of these helpers as instance methods.
 *
 * ## Installation
 *
 * You can install this package using [`npm`](https://www.npmjs.com) or
 * [`yarn`](https://classic.yarnpkg.com/lang/en/) by running:
 *
 * ```bash
 * npm install --save @darkforest_eth/hexgen
 * ```
 * ```bash
 * yarn add @darkforest_eth/hexgen
 * ```
 *
 * When using this in a plugin, you might want to load it with [skypack](https://www.skypack.dev)
 *
 * ```js
 * import * as hexgen from 'http://cdn.skypack.dev/@darkforest_eth/hexgen'
 * ```
 *
 * @packageDocumentation
 */
import type { LocationId, Planet, PlanetBonus } from '@darkforest_eth/types';
import bigInt from 'big-integer';

/**
 * The core method for extracting planet details from a LocationID.
 *
 * @param hexStr LocationID of a planet.
 * @param startByte The first byte to include in the result.
 * @param endByte The byte _after_ the last byte to include in the result.
 */
export function getBytesFromHex(hexStr: string, startByte: number, endByte: number) {
  const byteString = hexStr.substring(2 * startByte, 2 * endByte);
  return bigInt(`0x${byteString}`);
}

// This is a cache of bonuses by LocationID to avoid an expensive recalc
const bonusById = new Map<LocationId, PlanetBonus>();

/**
 * Extracts the bonuses of a planet given its LocationID.
 *
 * @param hex LocationID of a planet.
 */
export function bonusFromHex(hex: LocationId): PlanetBonus {
  const bonus = bonusById.get(hex);
  if (bonus) return bonus;

  const newBonus = Array(6).fill(false) as PlanetBonus;

  for (let i = 0; i < newBonus.length; i++) {
    newBonus[i] = getBytesFromHex(hex, 9 + i, 10 + i).lesser(16);
  }

  bonusById.set(hex, newBonus);
  return newBonus;
}

/**
 * Checks if the LocationID of the planet indicates any bonuses.
 *
 * @param planet Planet to check for bonuses.
 */
export function planetHasBonus(planet?: Planet): boolean {
  if (!planet) return false;
  return bonusFromHex(planet.locationId).some((bonus) => bonus);
}
