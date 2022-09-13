/**
 * This package contains useful constants for use when interacting with
 * the Dark Forest smart contracts within JavaScript or TypeScript.
 *
 * ## Installation
 *
 * You can install this package using [`npm`](https://www.npmjs.com) or
 * [`yarn`](https://classic.yarnpkg.com/lang/en/) by running:
 *
 * ```bash
 * npm install --save @darkforest_eth/constants
 * ```
 * ```bash
 * yarn add @darkforest_eth/constants
 * ```
 *
 * When using this in a plugin, you might want to load it with [skypack](https://www.skypack.dev)
 *
 * ```js
 * import * as constants from 'http://cdn.skypack.dev/@darkforest_eth/constants'
 * ```
 *
 * @packageDocumentation
 */
import {
  ArtifactId,
  ArtifactRarity,
  ArtifactType,
  Biome,
  EthAddress,
  GasPrices,
  LocationId,
  PlanetLevel,
} from '@darkforest_eth/types';
import bigInt, { BigInteger } from 'big-integer';

/**
 * The precision of Energy & Silver stored in the Dark Forest smart contracts.
 *
 * Energy and Silver are not stored as floats in the smart contracts,
 * so any of those values coming from the contracts need to be divided by `CONTRACT_PRECISION`
 * and any values being sent to the contract need to be multiplied by `CONTRACT_PRECISION`.
 */
export const CONTRACT_PRECISION = 1000 as const;

/**
 * By default, the various {@link ContractCaller} will retry a blockchain read this many times.
 */
export const DEFAULT_MAX_CALL_RETRIES = 12 as const;

/**
 * The upper-bounds of a LocationID.
 *
 * Represents the maximum possible value that the MiMC hash function (used for IDing locations in the universe) can output.
 * A LocationID must be less than `LOCATION_ID_UB / PLANET_RARITY` in order to be considered a valid planet.
 */
export const LOCATION_ID_UB: BigInteger = bigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

/**
 * The 0x0 Ethereum address, which is used for unowned planets, artifacts without an owner, etc.
 */
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000' as EthAddress;

/**
 * A blank LocationID (all zeros).
 */
export const EMPTY_LOCATION_ID =
  '0000000000000000000000000000000000000000000000000000000000000000' as LocationId;

/**
 * A blank ArtifactID (all zeros).
 */
export const EMPTY_ARTIFACT_ID =
  '0000000000000000000000000000000000000000000000000000000000000000' as ArtifactId;

/**
 * The value of the minimum, valid artifact type
 */
export const MIN_ARTIFACT_TYPE = ArtifactType.Monolith;
/**
 * The value of the maximum, valid artifact type
 */
export const MAX_ARTIFACT_TYPE = ArtifactType.ShipTitan;

/**
 * The value of the minimum, valid spaceship type
 */
export const MIN_SPACESHIP_TYPE = ArtifactType.ShipMothership;
/**
 * The value of the maximum, valid spaceship type
 */
export const MAX_SPACESHIP_TYPE = ArtifactType.ShipTitan;

/**
 * The value of the minimum, valid artifact rarity
 */
export const MIN_ARTIFACT_RARITY = ArtifactRarity.Common;
/**
 * The value of the maximum, valid artifact rarity
 */
export const MAX_ARTIFACT_RARITY = ArtifactRarity.Mythic;

/**
 * The value of the minimum, valid planet level
 */
export const MIN_PLANET_LEVEL = PlanetLevel.ZERO;
/**
 * The value of the maximum, valid planet level
 */
export const MAX_PLANET_LEVEL = PlanetLevel.NINE;

/**
 * The value of the minimum, valid biome
 */
export const MIN_BIOME = Biome.OCEAN;
/**
 * The value of the maximum, valid biome
 */
export const MAX_BIOME = Biome.CORRUPTED;

/**
 * The URL for xDai's API that returns the gas prices for 35th, 60th, and 90th percentiles of gas prices in the
 * previous 200 blocks. Useful for auto gas price setting.
 *
 * https://www.xdaichain.com/for-developers/developer-resources/gas-price-oracle
 */
export const GAS_PRICE_API = 'https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle' as const;

/**
 * In case we cannot load gas prices from xDai, these are the default auto gas prices.
 */
export const DEFAULT_GAS_PRICES: GasPrices = {
  slow: 1,
  average: 3,
  fast: 10,
} as const;

/**
 * In case xDai's auto-price is something ridiculous, we don't want our players to insta run out of
 * money.
 */
export const MAX_AUTO_GAS_PRICE_GWEI = 15 as const;

/**
 * The URL to the block explorer for the chain being used. Prepended to transaction links, etc
 */
// Careful, don't add a slash to the end of this.
export const BLOCK_EXPLORER_URL = 'https://dashboard.tenderly.co/tx/xdai' as const;

/**
 * The amount of time between gas price refreshes when fetching prices from the oracle.
 */
export const GAS_PRICES_INTERVAL_MS = 60_000 as const;

/**
 * {@link PlanetContextPane} is this wide, and all the subpanes of that modal also try to stay this
 * size as well.
 */
export const RECOMMENDED_MODAL_WIDTH = '400px' as const;

/**
 * The minimum level required for claiming a planet.
 */
export const PLANET_CLAIM_MIN_LEVEL = 3 as const;

/**
 * Keys to handle in a special fashion when dealing with key presses
 */
export const SpecialKey = {
  Space: ' ',
  Tab: 'Tab',
  Escape: 'Escape',
  Control: 'Control',
  Shift: 'Shift',
} as const;

export const HAT_SIZES = [
  'None',
  'Tiny HAT',
  'Small HAT',
  'Medium HAT',
  'Large HAT',
  'Huge HAT',
  'Mega HAT',
  'Enormous HAT',
  'Titanic HAT',
  'Legendary HAT',
  'Almighty HAT',
  'Cosmic HAT',
  'Celestial HAT',
  'Empyrean HAT',
  'Ethereal HAT',
  'Transcendental HAT',
  'haaaat',
  'HAAAAT',
];

/**
 * This should be updated every round.
 */
export const THEGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/darkforest-eth/dark-forest-v06-round-5';
