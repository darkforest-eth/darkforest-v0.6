import type { Contract } from 'ethers';
import type { LiteralUnion } from 'type-fest';
import type { ArtifactId, EthAddress, LocationId } from './identifier';
import type { WorldLocation } from './world';

export type ContractMethodName =
  | 'revealLocation'
  | 'initializePlayer'
  | 'move'
  | 'upgradePlanet'
  | 'buyHat'
  | 'transferPlanet'
  | 'findArtifact'
  | 'prospectPlanet'
  | 'depositArtifact'
  | 'withdrawArtifact'
  | 'activateArtifact'
  | 'deactivateArtifact'
  | 'withdrawSilver'
  | 'useKey'
  | 'adminUseKey'
  | 'addKeys'
  | 'giveSpaceShips'
  | 'createLobby'
  | 'invadePlanet'
  | 'capturePlanet'
  | 'claimReward';

export type EthTxStatus =
  | 'Init'
  | 'Processing'
  | 'Prioritized'
  | 'Submit'
  | 'Confirm'
  | 'Fail'
  | 'Cancel';

/**
 * The intent of this type is to represent a transaction that will occur on the blockchain in a way
 * that the game understands. This should usually be accessed as a member of {@link Transaction}.
 * @hidden
 */
export type TxIntent = {
  contract: Contract;
  methodName: LiteralUnion<ContractMethodName, string>;
  args: Promise<unknown[]>;
};

/**
 * @hidden
 */
export type UnconfirmedInit = TxIntent & {
  methodName: 'initializePlayer';
  locationId: LocationId;
  location: WorldLocation;
};

/**
 * @hidden
 */
export type UnconfirmedMove = TxIntent & {
  methodName: 'move';
  from: LocationId;
  to: LocationId;
  forces: number;
  silver: number;
  abandoning: boolean;
  artifact?: ArtifactId;
};

/**
 * @hidden
 */
export type UnconfirmedFindArtifact = TxIntent & {
  methodName: 'findArtifact';
  planetId: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedProspectPlanet = TxIntent & {
  methodName: 'prospectPlanet';
  planetId: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedPlanetTransfer = TxIntent & {
  methodName: 'transferPlanet';
  planetId: LocationId;
  newOwner: EthAddress;
};

/**
 * @hidden
 */
export type UnconfirmedClaimReward = TxIntent & {
  methodName: 'claimReward';
  sortedPlayerAddresses: EthAddress[];
  sortedScores: number[];
};

/**
 * @hidden
 */
export type UnconfirmedUpgrade = TxIntent & {
  methodName: 'upgradePlanet';
  locationId: LocationId;
  upgradeBranch: number; // 0, 1, or 2
};

/**
 * @hidden
 */
export type UnconfirmedBuyHat = TxIntent & {
  methodName: 'buyHat';
  locationId: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedDepositArtifact = TxIntent & {
  methodName: 'depositArtifact';
  locationId: LocationId;
  artifactId: ArtifactId;
};

/**
 * @hidden
 */
export type UnconfirmedWithdrawArtifact = TxIntent & {
  methodName: 'withdrawArtifact';
  locationId: LocationId;
  artifactId: ArtifactId;
};

/**
 * @hidden
 */
export type UnconfirmedActivateArtifact = TxIntent & {
  methodName: 'activateArtifact';
  locationId: LocationId;
  artifactId: ArtifactId;
  wormholeTo?: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedDeactivateArtifact = TxIntent & {
  methodName: 'deactivateArtifact';
  locationId: LocationId;
  artifactId: ArtifactId;
};

/**
 * @hidden
 */
export type UnconfirmedWithdrawSilver = TxIntent & {
  methodName: 'withdrawSilver';
  locationId: LocationId;
  amount: number;
};

/**
 * @hidden
 */
export type UnconfirmedReveal = TxIntent & {
  methodName: 'revealLocation';
  locationId: LocationId;
  location: WorldLocation;
};

/**
 * @hidden
 */
export type UnconfirmedAddKeys = TxIntent & {
  methodName: 'addKeys';
};

/**
 * @hidden
 */
export type UnconfirmedUseKey = TxIntent & {
  methodName: 'useKey';
};

/**
 * @hidden
 */
export type UnconfirmedAdminUseKey = TxIntent & {
  methodName: 'adminUseKey';
};

/**
 * @hidden
 */
export type UnconfirmedGetShips = TxIntent & {
  methodName: 'giveSpaceShips';
  locationId: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedCreateLobby = TxIntent & {
  methodName: 'createLobby';
};

/**
 * @hidden
 */
export type UnconfirmedInvadePlanet = TxIntent & {
  methodName: 'invadePlanet';
  locationId: LocationId;
};

/**
 * @hidden
 */
export type UnconfirmedCapturePlanet = TxIntent & {
  methodName: 'capturePlanet';
  locationId: LocationId;
};
