import type { DarkForest } from '@darkforest_eth/contracts/typechain';
import type { Artifact, ArtifactId, ArtifactPointValues, VoyageId } from '@darkforest_eth/types';
import { ArtifactRarity, ArtifactType, Biome } from '@darkforest_eth/types';
import bigInt from 'big-integer';
import type { BigNumber as EthersBN } from 'ethers';
import { address } from './address';
import { locationIdFromDecStr, locationIdFromEthersBN } from './location';
import { decodeUpgrade } from './upgrade';

/**
 * Converts a possibly 0x-prefixed string of hex digits to an `ArtifactId`: a
 * non-0x-prefixed all lowercase hex string of exactly 64 hex characters
 * (0-padded if necessary). ArtifactIDs should only be instantiated through
 * `artifactIdFromHexStr`, `artifactIdFromDecStr`, and `artifactIdFromEthersBN`.
 *
 * @param artifactId Possibly 0x-prefixed, possibly unpadded hex `string`
 * representation of an artifact's ID.
 */
export function artifactIdFromHexStr(artifactId: string): ArtifactId {
  const artifactIdBI = bigInt(artifactId, 16);
  let ret = artifactIdBI.toString(16);
  if (ret.length > 64) throw new Error('not a valid artifact id');
  while (ret.length < 64) ret = '0' + ret;
  return ret as ArtifactId;
}

/**
 * Converts a string representing a decimal number into an ArtifactID: a
 * non-0x-prefixed all lowercase hex string of exactly 64 hex characters
 * (0-padded if necessary). ArtifactIDs should only be instantiated through
 * `artifactIdFromHexStr`, `artifactIdFromDecStr`, and `artifactIdFromEthersBN`.
 *
 * @param artifactId `string` of decimal digits, the base 10 representation of an
 * artifact ID.
 */
export function artifactIdFromDecStr(artifactId: string): ArtifactId {
  const locationBI = bigInt(artifactId);
  let ret = locationBI.toString(16);
  while (ret.length < 64) ret = '0' + ret;
  return ret as ArtifactId;
}

/**
 * Converts a ethers.js BigNumber (type aliased here as EthersBN) representing a
 * decimal number into an ArtifactID: a non-0x-prefixed all lowercase hex string
 * of exactly 64 hex characters (0-padded if necessary). ArtifactIDs should only
 * be instantiated through `artifactIdFromHexStr`, `artifactIdFromDecStr`, and
 * `artifactIdFromEthersBN`.
 *
 * @param artifactId ether.js `BigNumber` representing artifact's ID
 */
export function artifactIdFromEthersBN(artifactId: EthersBN): ArtifactId {
  return artifactIdFromDecStr(artifactId.toString());
}

/**
 * Converts an ArtifactID to a decimal string with equivalent numerical value;
 * can be used if you need to pass an artifact ID into a web3 call.
 *
 * @param artifactId non-0x-prefixed lowercase hex `string` of 64 hex characters
 * representing an artifact's ID
 */
export function artifactIdToDecStr(artifactId: ArtifactId): string {
  return bigInt(artifactId, 16).toString(10);
}

export type RawArtifactPointValues = Awaited<ReturnType<DarkForest['getArtifactPointValues']>>;

/**
 * Converts the raw typechain result of a call to
 * `DarkForest.getArtifactPointValues` to an `ArtifactPointValues`
 * typescript typed object (see @darkforest_eth/types).
 */
export function decodeArtifactPointValues(
  rawPointValues: RawArtifactPointValues
): ArtifactPointValues {
  return {
    [ArtifactRarity.Unknown]: rawPointValues[ArtifactRarity.Unknown].toNumber(),
    [ArtifactRarity.Common]: rawPointValues[ArtifactRarity.Common].toNumber(),
    [ArtifactRarity.Rare]: rawPointValues[ArtifactRarity.Rare].toNumber(),
    [ArtifactRarity.Epic]: rawPointValues[ArtifactRarity.Epic].toNumber(),
    [ArtifactRarity.Legendary]: rawPointValues[ArtifactRarity.Legendary].toNumber(),
    [ArtifactRarity.Mythic]: rawPointValues[ArtifactRarity.Mythic].toNumber(),
  };
}

export type RawArtifactWithMetadata = Awaited<ReturnType<DarkForest['getArtifactById']>>;

/**
 * Converts the raw typechain result of `ArtifactTypes.ArtifactWithMetadata`
 * struct to an `Artifact` typescript typed object (see @darkforest_eth/types).
 *
 * @param rawArtifactWithMetadata Raw data of an `ArtifactWithMetadata` struct,
 * returned from a blockchain call (assumed to be typed with typechain).
 */
export function decodeArtifact(rawArtifactWithMetadata: RawArtifactWithMetadata): Artifact {
  const { artifact, owner, upgrade, timeDelayedUpgrade, locationId, voyageId } =
    rawArtifactWithMetadata;

  return {
    isInititalized: artifact.isInitialized,
    id: artifactIdFromEthersBN(artifact.id),
    planetDiscoveredOn: locationIdFromDecStr(artifact.planetDiscoveredOn.toString()),
    rarity: artifact.rarity as ArtifactRarity,
    planetBiome: artifact.planetBiome as Biome,
    mintedAtTimestamp: artifact.mintedAtTimestamp.toNumber(),
    discoverer: address(artifact.discoverer),
    artifactType: artifact.artifactType as ArtifactType,
    activations: artifact.activations.toNumber(),
    lastActivated: artifact.lastActivated.toNumber(),
    lastDeactivated: artifact.lastDeactivated.toNumber(),
    controller: address(artifact.controller),
    wormholeTo: artifact.wormholeTo.eq(0) ? undefined : locationIdFromEthersBN(artifact.wormholeTo),
    currentOwner: address(owner),
    upgrade: decodeUpgrade(upgrade),
    timeDelayedUpgrade: decodeUpgrade(timeDelayedUpgrade),
    onPlanetId: locationId.eq(0) ? undefined : locationIdFromEthersBN(locationId),
    onVoyageId: voyageId.eq(0) ? undefined : (voyageId.toString() as VoyageId),
  };
}
