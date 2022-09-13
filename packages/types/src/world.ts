import type { LocationId } from './identifier';

// TODO we should do the &never TS thing for world / canvas coords; as this is a
// common source of bugs
/**
 * Represents the coordinates of a location in the world.
 */
export type WorldCoords = {
  x: number;
  y: number;
};

/**
 * A location in the world with relevant properties: the location's ID
 * (deterministically generated from its coords), the spacetype perlin value at
 * these coordinates, and the biomebase perlin value at these coordinates
 * (combined with spacetype to derive the biome here)
 */
export type WorldLocation = {
  coords: WorldCoords;
  hash: LocationId;
  perlin: number;
  biomebase: number; // biome perlin value. combined with spaceType to get the actual biome
};

/**
 * Ok, this is gonna sound weird, but all rectangles are squares. Also, we only permit side lengths
 * that are powers of two, and ALSO!! The side lengths must be between {@link MIN_CHUNK_SIZE} and
 * {@link MAX_CHUNK_SIZE}.
 */
export interface Rectangle {
  bottomLeft: WorldCoords;
  sideLength: number;
}

/**
 * Represents a fully mined aligned square.
 */
export interface Chunk {
  chunkFootprint: Rectangle;
  planetLocations: WorldLocation[];
  perlin: number; // approximate avg perlin value. used for rendering
}

/**
 * Various configuration used for calculating perlin.
 * Always make sure these values match the contracts you are working with
 * or else your transactions **will** be reverted.
 */
export interface PerlinConfig {
  /**
   * The key being used for the perlin calculation. Will be `SPACETYPE_KEY` or `BIOMEBASE_KEY`.
   */
  key: number;
  /**
   * The `PERLIN_LENGTH_SCALE` being used to calculate perlin.
   */
  scale: number;
  /**
   * Whether the X coordinate is being mirrored in the perlin calculation.
   *
   * @default false
   */
  mirrorX: boolean;
  /**
   * Whether the Y coordinate is being mirrored in the perlin calculation.
   *
   * @default false
   */
  mirrorY: boolean;
  /**
   * If the resulting perlin should be "floored".
   *
   * @default false
   */
  floor: boolean;
}
