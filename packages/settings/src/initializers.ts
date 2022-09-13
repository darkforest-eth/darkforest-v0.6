import * as decoders from 'decoders';
import {
  array6,
  between,
  exactArray10,
  exactArray4,
  exactArray5,
  exactArray64,
} from './decoder-helpers';

// Handle Date or ISO8601 strings because the TOML parser converts to Date already
const dateInSeconds = decoders.map(decoders.either(decoders.date, decoders.iso8601), (val) =>
  Math.floor(val.getTime() / 1000)
);

export type Initializers = ReturnType<typeof decodeInitializers>;

export const decodeInitializers = decoders.guard(
  decoders.exact({
    START_PAUSED: decoders.boolean,
    ADMIN_CAN_ADD_PLANETS: decoders.boolean,
    TOKEN_MINT_END_TIMESTAMP: dateInSeconds,
    WORLD_RADIUS_LOCKED: decoders.boolean,
    WORLD_RADIUS_MIN: decoders.number,
    /**
     * SNARK keys & Perlin parameters
     */
    DISABLE_ZK_CHECKS: decoders.boolean,
    PLANETHASH_KEY: decoders.number,
    SPACETYPE_KEY: decoders.number,
    BIOMEBASE_KEY: decoders.number,
    PERLIN_MIRROR_X: decoders.boolean,
    PERLIN_MIRROR_Y: decoders.boolean,
    PERLIN_LENGTH_SCALE: decoders.number, // must be power of two at most 8192
    /**
     * Game configuration
     */
    MAX_NATURAL_PLANET_LEVEL: decoders.number,
    TIME_FACTOR_HUNDREDTHS: decoders.number,
    PERLIN_THRESHOLD_1: decoders.number,
    PERLIN_THRESHOLD_2: decoders.number,
    PERLIN_THRESHOLD_3: decoders.number,
    INIT_PERLIN_MIN: decoders.number,
    INIT_PERLIN_MAX: decoders.number,
    BIOME_THRESHOLD_1: decoders.number,
    BIOME_THRESHOLD_2: decoders.number,
    PLANET_LEVEL_THRESHOLDS: exactArray10(decoders.number),
    PLANET_RARITY: decoders.number,
    PLANET_TRANSFER_ENABLED: decoders.boolean,
    PHOTOID_ACTIVATION_DELAY: decoders.number,
    SPAWN_RIM_AREA: decoders.number,
    LOCATION_REVEAL_COOLDOWN: decoders.number,
    PLANET_TYPE_WEIGHTS: exactArray4(exactArray10(exactArray5(between(decoders.number, 0, 255)))),
    SILVER_SCORE_VALUE: decoders.number,
    ARTIFACT_POINT_VALUES: array6(decoders.number),
    /**
     * Space Junk
     */
    SPACE_JUNK_ENABLED: decoders.boolean,
    SPACE_JUNK_LIMIT: decoders.number,
    PLANET_LEVEL_JUNK: exactArray10(decoders.number),
    ABANDON_SPEED_CHANGE_PERCENT: decoders.number,
    ABANDON_RANGE_CHANGE_PERCENT: decoders.number,
    /**
     * Capture Zones
     */
    CAPTURE_ZONES_ENABLED: decoders.boolean,
    CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: decoders.number,
    CAPTURE_ZONE_RADIUS: decoders.number,
    CAPTURE_ZONE_PLANET_LEVEL_SCORE: exactArray10(decoders.number),
    CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: decoders.number,
    CAPTURE_ZONES_PER_5000_WORLD_RADIUS: decoders.number,
    SPACESHIPS: decoders.object({
      GEAR: decoders.boolean,
      MOTHERSHIP: decoders.boolean,
      TITAN: decoders.boolean,
      CRESCENT: decoders.boolean,
      WHALE: decoders.boolean,
    }),
    ROUND_END_REWARDS_BY_RANK: exactArray64(decoders.number),
  }),
  { style: 'simple' }
);
