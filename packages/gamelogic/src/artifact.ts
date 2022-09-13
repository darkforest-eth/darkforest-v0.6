import { EMPTY_ADDRESS, MAX_SPACESHIP_TYPE, MIN_SPACESHIP_TYPE } from '@darkforest_eth/constants';
import { hashToInt } from '@darkforest_eth/serde';
import {
  Abstract,
  Artifact,
  ArtifactId,
  ArtifactRarity,
  ArtifactRarityNames,
  ArtifactType,
  ArtifactTypeNames,
  Biome,
  BiomeNames,
  EthAddress,
  Planet,
  PlanetLevel,
  PlanetType,
  RenderedArtifact,
} from '@darkforest_eth/types';

export const RelicsList: ArtifactType[] = [
  ArtifactType.Wormhole,
  ArtifactType.PlanetaryShield,
  ArtifactType.PhotoidCannon,
  ArtifactType.BloomFilter,
  ArtifactType.BlackDomain,
];

// relics are the forgotten technologies / the artifacts that you can talk to
export function isRelic(type: ArtifactType): boolean {
  return ArtifactType.Wormhole <= type && type <= ArtifactType.BlackDomain;
}

export function isBasic(type: ArtifactType): boolean {
  return ArtifactType.Monolith <= type && type <= ArtifactType.Pyramid;
}

export function isSpaceShip(type: ArtifactType | undefined): boolean {
  return type !== undefined && type >= MIN_SPACESHIP_TYPE && type <= MAX_SPACESHIP_TYPE;
}

export function hasStatBoost(type: ArtifactType | undefined): boolean {
  return (
    !isSpaceShip(type) &&
    type !== ArtifactType.BlackDomain &&
    type !== ArtifactType.BloomFilter &&
    type !== ArtifactType.Wormhole
  );
}

const artifactCooldownHoursMap = {
  [ArtifactType.Unknown]: 24,
  [ArtifactType.Monolith]: 0,
  [ArtifactType.Colossus]: 0,
  [ArtifactType.Spaceship]: 0,
  [ArtifactType.Pyramid]: 0,
  [ArtifactType.Wormhole]: 4,
  [ArtifactType.PlanetaryShield]: 4,
  [ArtifactType.PhotoidCannon]: 24,
  [ArtifactType.BloomFilter]: 24,
  [ArtifactType.BlackDomain]: 24,
} as const;

const artifactIsAncientMap: Map<ArtifactId, boolean> = new Map();

export function durationUntilArtifactAvailable(artifact: Artifact) {
  return artifactAvailableTimestamp(artifact) - Date.now();
}

export function artifactAvailableTimestamp(artifact: Artifact) {
  if (artifact.lastDeactivated === 0) {
    return Date.now();
  }

  const availableAtTimestampMs =
    artifact.lastDeactivated * 1000 +
    artifactCooldownHoursMap[artifact.artifactType] * 60 * 60 * 1000;

  return availableAtTimestampMs;
}

export function isActivated(artifact: Artifact | undefined) {
  if (artifact === undefined) {
    return false;
  }

  return artifact.lastActivated > artifact.lastDeactivated;
}

export function getActivatedArtifact(artifacts: Artifact[]): Artifact | undefined {
  return artifacts.find(isActivated);
}

export function getArtifactDebugName(a?: Artifact): string {
  if (!a) {
    return 'unknown artifact';
  }

  return a.id.substring(0, 8);
}

export const biomeName = (biome: Biome): string => BiomeNames[biome];

export const rarityName = (rarity: ArtifactRarity): string => ArtifactRarityNames[rarity];

export const rarityNameFromArtifact = (a: Artifact): string => rarityName(a.rarity);

export function artifactBiomeName(artifact: Artifact): string {
  if (isAncient(artifact)) return 'Ancient';
  return biomeName(artifact.planetBiome);
}

export const levelFromRarity = (rarity: ArtifactRarity): PlanetLevel => {
  if (rarity === ArtifactRarity.Mythic) return PlanetLevel.NINE;
  else if (rarity === ArtifactRarity.Legendary) return PlanetLevel.SEVEN;
  else if (rarity === ArtifactRarity.Epic) return PlanetLevel.FIVE;
  else if (rarity === ArtifactRarity.Rare) return PlanetLevel.THREE;
  else return PlanetLevel.ONE;
};

const artifactFileNamesById: Map<ArtifactId, string> = new Map();

export type ArtifactFileColor = Abstract<number, 'ArtifactFileColor'>;
export const ArtifactFileColor = {
  BLUE: 0 as ArtifactFileColor,
  APP_BACKGROUND: 1 as ArtifactFileColor,
};

let forceAncient: boolean | undefined = undefined;

export function artifactRoll(id: ArtifactId): number {
  return hashToInt(id) % 256;
}

export function isAncient(artifact: RenderedArtifact): boolean {
  if (forceAncient !== undefined) return forceAncient;

  if (isSpaceShip(artifact.artifactType)) return false;

  const { id, planetBiome: biome } = artifact;

  if (artifactIsAncientMap.has(id)) {
    return artifactIsAncientMap.get(id) || false;
  }

  let ancient = false;
  const roll = artifactRoll(id);

  if (biome === Biome.CORRUPTED) ancient = roll % 2 === 0;
  else ancient = roll % 16 === 0;

  artifactIsAncientMap.set(id, ancient);

  return ancient;
}

export function setForceAncient(force: boolean): void {
  forceAncient = force;
}

export function artifactFileName(
  videoMode: boolean,
  thumb: boolean,
  artifact: RenderedArtifact,
  color: ArtifactFileColor,
  // used in GifRenderer.ts to generate filenames from mock artifacts
  debugProps: { forceAncient: boolean; skipCaching: boolean } | undefined = undefined
): string {
  const { artifactType: type, rarity, planetBiome: biome, id } = artifact;

  if (isSpaceShip(type)) {
    switch (type) {
      case ArtifactType.ShipWhale:
        return '64-whale.png';
      case ArtifactType.ShipMothership:
        return '64-mothership.png';
      case ArtifactType.ShipCrescent:
        return '64-crescent.png';
      case ArtifactType.ShipGear:
        return '64-gear.png';
      case ArtifactType.ShipTitan:
        return '64-titan.png';
    }
  }

  const size = thumb ? '16' : '64';
  const ext = videoMode ? 'webm' : 'png';

  let fileName = '';

  if (!debugProps?.skipCaching && artifactFileNamesById.has(id)) {
    fileName = artifactFileNamesById.get(id) || '';
  } else {
    const typeStr = ArtifactTypeNames[type];
    const rarityStr = ArtifactRarityNames[rarity];
    let nameStr = '';
    if (debugProps) {
      if (debugProps.forceAncient) {
        nameStr = 'ancient';
      } else {
        nameStr = biome + BiomeNames[biome];
      }
    } else {
      if (isAncient(artifact)) {
        nameStr = 'ancient';
      } else {
        nameStr = biome + BiomeNames[biome];
      }
    }
    fileName = `${typeStr}-${rarityStr}-${nameStr}`;
  }

  if (!debugProps?.skipCaching) artifactFileNamesById.set(id, fileName);

  let colorStr = '';
  if (color === ArtifactFileColor.APP_BACKGROUND) colorStr = '-bg';

  return `${size}-${fileName}${colorStr}.${ext}`;
}

export function getActiveBlackDomain(artifacts: Artifact[]): Artifact | undefined {
  for (const artifact of artifacts) {
    if (artifact.artifactType === ArtifactType.BlackDomain && isActivated(artifact))
      return artifact;
  }
  return undefined;
}

export const dateMintedAt = (artifact: Artifact | undefined): string => {
  if (!artifact) return '00/00/0000';
  return new Date(artifact.mintedAtTimestamp * 1000).toDateString();
};

export function canActivateArtifact(
  artifact: Artifact,
  planet: Planet | undefined,
  artifactsOnPlanet: Artifact[]
) {
  if (isSpaceShip(artifact.artifactType)) {
    return (
      planet &&
      planet.owner === EMPTY_ADDRESS &&
      artifact.artifactType === ArtifactType.ShipCrescent &&
      artifact.activations === 0
    );
  }

  const available = artifactAvailableTimestamp(artifact);
  if (available !== undefined) {
    const now = Date.now();
    const anyArtifactActive = artifactsOnPlanet.some((a) => isActivated(a));
    const waitUntilAvailable = available - now;
    const availableToActivate =
      waitUntilAvailable <= -0 &&
      !anyArtifactActive &&
      planet?.locationId === artifact.onPlanetId &&
      !!artifact.onPlanetId;
    return availableToActivate;
  }

  return false;
}

export function canWithdrawArtifact(account: EthAddress, artifact: Artifact, planet?: Planet) {
  return (
    planet &&
    !planet.destroyed &&
    planet.owner === account &&
    planet.planetType === PlanetType.TRADING_POST &&
    !isActivated(artifact) &&
    !isSpaceShip(artifact.artifactType)
  );
}

export function canDepositArtifact(account: EthAddress, artifact: Artifact, planet?: Planet) {
  return (
    planet &&
    !planet.destroyed &&
    planet.owner === account &&
    !artifact.onPlanetId &&
    planet.planetType === PlanetType.TRADING_POST
  );
}

export function getPlayerControlledSpaceships(
  artifacts: (Artifact | undefined)[] | undefined,
  owner: EthAddress | undefined
) {
  if (!owner) return [];
  return (artifacts || []).filter((a) => a?.controller === owner);
}
