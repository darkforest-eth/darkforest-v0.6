import type { Biome, SpaceType } from './game_types';
import type { ArtifactId, EthAddress, LocationId } from './identifier';
import type { PlanetMessage } from './planetmessage';
import type { TransactionCollection } from './transaction';
import type { Upgrade, UpgradeState } from './upgrade';
import type { Abstract } from './utility';
import type { WorldLocation } from './world';

/**
 * Abstract type representing a planet level.
 */
export type PlanetLevel = Abstract<number, 'PlanetLevel'>;

/**
 * Enumeration of the possible planet levels.
 */
export const PlanetLevel = {
  ZERO: 0 as PlanetLevel,
  ONE: 1 as PlanetLevel,
  TWO: 2 as PlanetLevel,
  THREE: 3 as PlanetLevel,
  FOUR: 4 as PlanetLevel,
  FIVE: 5 as PlanetLevel,
  SIX: 6 as PlanetLevel,
  SEVEN: 7 as PlanetLevel,
  EIGHT: 8 as PlanetLevel,
  NINE: 9 as PlanetLevel,
  // Don't forget to update MIN_PLANET_LEVEL and/or MAX_PLANET_LEVEL in the `constants` package
} as const;

/**
 * Mapping from PlanetLevel to pretty-printed names.
 */
export const PlanetLevelNames = {
  [PlanetLevel.ZERO]: 'Level 0',
  [PlanetLevel.ONE]: 'Level 1',
  [PlanetLevel.TWO]: 'Level 2',
  [PlanetLevel.THREE]: 'Level 3',
  [PlanetLevel.FOUR]: 'Level 4',
  [PlanetLevel.FIVE]: 'Level 5',
  [PlanetLevel.SIX]: 'Level 6',
  [PlanetLevel.SEVEN]: 'Level 7',
  [PlanetLevel.EIGHT]: 'Level 8',
  [PlanetLevel.NINE]: 'Level 9',
} as const;

/**
 * Abstract type representing a planet type.
 */
export type PlanetType = Abstract<number, 'PlanetType'>;

/**
 * Enumeration of the planet types. (PLANET = 0, SILVER_BANK = 4)
 */
export const PlanetType = {
  PLANET: 0 as PlanetType,
  SILVER_MINE: 1 as PlanetType,
  RUINS: 2 as PlanetType,
  TRADING_POST: 3 as PlanetType,
  SILVER_BANK: 4 as PlanetType,
} as const;

/**
 * Mapping from PlanetType to pretty-printed names.
 */
export const PlanetTypeNames = {
  [PlanetType.PLANET]: 'Planet',
  [PlanetType.SILVER_MINE]: 'Asteroid Field',
  [PlanetType.RUINS]: 'Foundry',
  [PlanetType.TRADING_POST]: 'Spacetime Rip',
  [PlanetType.SILVER_BANK]: 'Quasar',
} as const;

/**
 * A list of five flags, indicating whether the planet has an attached comet
 * doubling each of five stats: (in order) [energyCap, energyGrowth, range,
 * speed, defense]
 */
export type PlanetBonus = [boolean, boolean, boolean, boolean, boolean, boolean];

/**
 * Represents a Dark Forest planet object (planets, asteroid fields, quasars,
 * spacetime rips, and foundries). Note that some `Planet` fields (1) store
 * client-specific data that the blockchain is not aware of, such as
 * `unconfirmedDepartures` (tracks pending moves originating at this planet that
 * have been submitted to the blockchain from a client), or (2) store derived
 * data that is calculated separately client-side, such as `silverSpent` and
 * `bonus`. So this object does not cleanly map to any single object in the
 * DarkForest contract (or even any collection of objects).
 */
export type Planet = {
  locationId: LocationId;
  perlin: number;
  spaceType: SpaceType;
  owner: EthAddress; // should never be null; all unowned planets should have 0 address
  hatLevel: number;

  planetLevel: PlanetLevel;
  planetType: PlanetType;
  isHomePlanet: boolean;

  energyCap: number;
  energyGrowth: number;

  silverCap: number;
  silverGrowth: number;

  range: number;
  defense: number;
  speed: number;

  energy: number;
  silver: number;

  spaceJunk: number;

  lastUpdated: number;
  upgradeState: UpgradeState;
  hasTriedFindingArtifact: boolean;
  heldArtifactIds: ArtifactId[];
  destroyed: boolean;
  prospectedBlockNumber?: number;
  localPhotoidUpgrade?: Upgrade;

  transactions?: TransactionCollection;
  unconfirmedAddEmoji: boolean;
  unconfirmedClearEmoji: boolean;
  loadingServerState: boolean;
  needsServerRefresh: boolean;
  lastLoadedServerState?: number;

  emojiBobAnimation?: DFAnimation;
  emojiZoopAnimation?: DFAnimation;
  emojiZoopOutAnimation?: DFStatefulAnimation<string>;

  silverSpent: number;

  isInContract: boolean;
  syncedWithContract: boolean;
  coordsRevealed: boolean;
  revealer?: EthAddress;
  claimer?: EthAddress;
  messages?: PlanetMessage<unknown>[];

  bonus: PlanetBonus;

  pausers: number;
  energyGroDoublers: number;
  silverGroDoublers: number;
  invader?: EthAddress;
  capturer?: EthAddress;
  invadeStartBlock?: number;
};

/**
 * A planet whose coordinates are known to the client.
 */
export type LocatablePlanet = Planet & {
  location: WorldLocation;
  biome: Biome;
};

/**
 * A structure with default stats of planets in nebula at corresponding levels. For
 * example, silverCap[4] refers to the default silver capacity of a level 4
 * planet in nebula with no modifiers.
 */
export interface PlanetDefaults {
  populationCap: number[];
  populationGrowth: number[];
  range: number[];
  speed: number[];
  defense: number[];
  silverGrowth: number[];
  silverCap: number[];
  barbarianPercentage: number[];
}

export class DFAnimation {
  private readonly _update: () => number;
  private _value: number;

  public constructor(update: () => number) {
    this._update = update;
    this._value = 0;
  }

  public update() {
    this._value = this._update();
  }

  public value() {
    return this._value;
  }
}

export class DFStatefulAnimation<T> extends DFAnimation {
  private readonly _state: T;

  public constructor(state: T, update: () => number) {
    super(update);
    this._state = state;
  }

  public state(): T {
    return this._state;
  }
}
