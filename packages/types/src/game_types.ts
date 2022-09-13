import type { Abstract } from './utility';

/**
 * Abstract type representing a type of space.
 */
export type SpaceType = Abstract<number, 'SpaceType'>;

/**
 * Enumeration of the types of space in the game. NEBULA = 0, DEAD_SPACE = 3
 */
export const SpaceType = {
  NEBULA: 0 as SpaceType,
  SPACE: 1 as SpaceType,
  DEEP_SPACE: 2 as SpaceType,
  DEAD_SPACE: 3 as SpaceType,
} as const;

/**
 * Mapping from SpaceType to pretty-printed names.
 */
export const SpaceTypeNames = {
  [SpaceType.NEBULA]: 'Nebula',
  [SpaceType.SPACE]: 'Space',
  [SpaceType.DEEP_SPACE]: 'Deep Space',
  [SpaceType.DEAD_SPACE]: 'Dead Space',
} as const;

/**
 * Abstract type representing a biome.
 */
export type Biome = Abstract<number, 'Biome'>;

/**
 * Enumeration of the biomes in the game. OCEAN = 1, CORRUPTED = 10
 */
export const Biome = {
  UNKNOWN: 0 as Biome,
  OCEAN: 1 as Biome,
  FOREST: 2 as Biome,
  GRASSLAND: 3 as Biome,
  TUNDRA: 4 as Biome,
  SWAMP: 5 as Biome,
  DESERT: 6 as Biome,
  ICE: 7 as Biome,
  WASTELAND: 8 as Biome,
  LAVA: 9 as Biome,
  CORRUPTED: 10 as Biome,
  // Don't forget to update MIN_BIOME and/or MAX_BIOME in the `constants` package
} as const;

/**
 * Mapping from Biome to pretty-printed names.
 */
export const BiomeNames = {
  [Biome.UNKNOWN]: 'Unknown',
  [Biome.OCEAN]: 'Ocean',
  [Biome.FOREST]: 'Forest',
  [Biome.GRASSLAND]: 'Grassland',
  [Biome.TUNDRA]: 'Tundra',
  [Biome.SWAMP]: 'Swamp',
  [Biome.DESERT]: 'Desert',
  [Biome.ICE]: 'Ice',
  [Biome.WASTELAND]: 'Wasteland',
  [Biome.LAVA]: 'Lava',
  [Biome.CORRUPTED]: 'Corrupted',
} as const;
