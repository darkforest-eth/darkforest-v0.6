import type { Biome } from './game_types';
import type { ArtifactId, EthAddress, LocationId, VoyageId } from './identifier';
import type { TransactionCollection } from './transaction';
import type { Upgrade } from './upgrade';
import type { Abstract } from './utility';

/**
 * Abstract type representing an artifact type.
 */
export type ArtifactType = Abstract<number, 'ArtifactType'>;

/**
 * Enumeration of artifact types.
 */
export const ArtifactType = {
  Unknown: 0 as ArtifactType,
  Monolith: 1 as ArtifactType,
  Colossus: 2 as ArtifactType,
  Spaceship: 3 as ArtifactType,
  Pyramid: 4 as ArtifactType,
  Wormhole: 5 as ArtifactType,
  PlanetaryShield: 6 as ArtifactType,
  PhotoidCannon: 7 as ArtifactType,
  BloomFilter: 8 as ArtifactType,
  BlackDomain: 9 as ArtifactType,
  ShipMothership: 10 as ArtifactType,
  ShipCrescent: 11 as ArtifactType,
  ShipWhale: 12 as ArtifactType,
  ShipGear: 13 as ArtifactType,
  ShipTitan: 14 as ArtifactType,

  // Don't forget to update MIN_ARTIFACT_TYPE and/or MAX_ARTIFACT_TYPE in the `constants` package
} as const;

/**
 * Mapping from ArtifactType to pretty-printed names.
 */
export const ArtifactTypeNames = {
  [ArtifactType.Unknown]: 'Unknown',
  [ArtifactType.Monolith]: 'Monolith',
  [ArtifactType.Colossus]: 'Colossus',
  [ArtifactType.Spaceship]: 'Spaceship',
  [ArtifactType.Pyramid]: 'Pyramid',
  [ArtifactType.Wormhole]: 'Wormhole',
  [ArtifactType.PlanetaryShield]: 'Planetary Shield',
  [ArtifactType.BlackDomain]: 'Black Domain',
  [ArtifactType.PhotoidCannon]: 'Photoid Cannon',
  [ArtifactType.BloomFilter]: 'Bloom Filter',
  [ArtifactType.ShipMothership]: 'Mothership',
  [ArtifactType.ShipCrescent]: 'Crescent',
  [ArtifactType.ShipWhale]: 'Whale',
  [ArtifactType.ShipGear]: 'Gear',
  [ArtifactType.ShipTitan]: 'Titan',
} as const;

/**
 * Abstract type representing an artifact rarity level.
 */
export type ArtifactRarity = Abstract<number, 'ArtifactRarity'>;

/**
 * Enumeration of artifact rarity levels. Common = 1, Mythic = 5
 */
export const ArtifactRarity = {
  Unknown: 0 as ArtifactRarity,
  Common: 1 as ArtifactRarity,
  Rare: 2 as ArtifactRarity,
  Epic: 3 as ArtifactRarity,
  Legendary: 4 as ArtifactRarity,
  Mythic: 5 as ArtifactRarity,
  // Don't forget to update MIN_ARTIFACT_RARITY and/or MAX_ARTIFACT_RARITY in the `constants` package
} as const;

/**
 * Mapping from ArtifactRarity to pretty-printed names.
 */
export const ArtifactRarityNames = {
  [ArtifactRarity.Unknown]: 'Unknown',
  [ArtifactRarity.Common]: 'Common',
  [ArtifactRarity.Rare]: 'Rare',
  [ArtifactRarity.Epic]: 'Epic',
  [ArtifactRarity.Legendary]: 'Legendary',
  [ArtifactRarity.Mythic]: 'Mythic',
} as const;

/**
 * mapping from ArtifactRarity to points earned for finding this artifact.
 */
export type ArtifactPointValues = { [ArtifactRarity: number]: number };

/**
 * Represents data associated with a Dark Forest artifact NFT. Note
 * that some `Artifact` fields store client-specific data that the blockchain is
 * not aware of, such as `unconfirmedDepositArtifact` (tracks pending
 * depositArtifact transaction that involves this artifact). If you're using a
 * client that can't send transactions, these fields should be ignored.
 */
export type Artifact = {
  isInititalized: boolean;
  id: ArtifactId;
  planetDiscoveredOn: LocationId;
  rarity: ArtifactRarity;
  planetBiome: Biome;
  mintedAtTimestamp: number;
  discoverer: EthAddress;
  artifactType: ArtifactType;
  activations: number;
  lastActivated: number;
  lastDeactivated: number;
  controller: EthAddress;

  upgrade: Upgrade;
  timeDelayedUpgrade: Upgrade;
  currentOwner: EthAddress; // owner of the NFT - can be the contract
  wormholeTo?: LocationId;
  onPlanetId?: LocationId;
  onVoyageId?: VoyageId;

  transactions?: TransactionCollection;
};

// TODO: get this out of here

const godGrammar = {
  god1: [
    "c'",
    'za',
    "ry'",
    "ab'",
    "bak'",
    "dt'",
    "ek'",
    "fah'",
    "q'",
    'qo',
    'van',
    'bow',
    'gui',
    'si',
  ],
  god2: [
    'thun',
    'tchalla',
    'thovo',
    'saron',
    'zoth',
    'sharrj',
    'thulu',
    'ra',
    'wer',
    'doin',
    'renstad',
    'nevere',
    'goth',
    'anton',
    'layton',
  ],
};

/**
 * Deterministically generates the name of the artifact from its ID.
 *
 * @param artifact The artifact to generate a name for
 */
export function artifactNameFromArtifact(artifact: Artifact) {
  const idNum = parseInt(artifact.id, 16);

  const roll1 = (idNum % 7919) % godGrammar.god1.length; // 7919 is a big prime
  const roll2 = (idNum % 7883) % godGrammar.god2.length; // 7883 is a big prime

  const name = godGrammar.god1[roll1] + godGrammar.god2[roll2];
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return nameCapitalized;
}

/**
 * type interface for ERC721 metadata.
 */

type NFTAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};
export type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
};

export interface RenderedArtifact extends Partial<Artifact> {
  artifactType: ArtifactType;
  planetBiome: Biome;
  rarity: ArtifactRarity;
  id: ArtifactId; // for rolls
}

export type Wormhole = {
  from: LocationId;
  to: LocationId;
};
