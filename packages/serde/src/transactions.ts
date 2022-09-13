import {
  Transaction,
  TxIntent,
  UnconfirmedActivateArtifact,
  UnconfirmedBuyHat,
  UnconfirmedCapturePlanet,
  UnconfirmedDeactivateArtifact,
  UnconfirmedDepositArtifact,
  UnconfirmedFindArtifact,
  UnconfirmedGetShips,
  UnconfirmedInit,
  UnconfirmedInvadePlanet,
  UnconfirmedMove,
  UnconfirmedPlanetTransfer,
  UnconfirmedProspectPlanet,
  UnconfirmedReveal,
  UnconfirmedUpgrade,
  UnconfirmedWithdrawArtifact,
  UnconfirmedWithdrawSilver,
} from '@darkforest_eth/types';

// @todo:
// - these `isUnconfirmedX` should be named something that matches the naming convention of the
//   `TxIntent` subtypes - `isXIntent`
// - these `isUnconfirmedX` should check something more than the method name

export function isUnconfirmedReveal(txIntent: TxIntent): txIntent is UnconfirmedReveal {
  return txIntent.methodName === 'revealLocation';
}

export function isUnconfirmedInit(txIntent: TxIntent): txIntent is UnconfirmedInit {
  return txIntent.methodName === 'initializePlayer';
}

export function isUnconfirmedMove(txIntent: TxIntent): txIntent is UnconfirmedMove {
  return txIntent.methodName === 'move';
}

export function isUnconfirmedRelease(txIntent: TxIntent): txIntent is UnconfirmedMove {
  return isUnconfirmedMove(txIntent) && txIntent.abandoning;
}

export function isUnconfirmedUpgrade(txIntent: TxIntent): txIntent is UnconfirmedUpgrade {
  return txIntent.methodName === 'upgradePlanet';
}

export function isUnconfirmedBuyHat(txIntent: TxIntent): txIntent is UnconfirmedBuyHat {
  return txIntent.methodName === 'buyHat';
}

export function isUnconfirmedTransfer(txIntent: TxIntent): txIntent is UnconfirmedPlanetTransfer {
  return txIntent.methodName === 'transferPlanet';
}

export function isUnconfirmedFindArtifact(txIntent: TxIntent): txIntent is UnconfirmedFindArtifact {
  return txIntent.methodName === 'findArtifact';
}

export function isUnconfirmedDepositArtifact(
  txIntent: TxIntent
): txIntent is UnconfirmedDepositArtifact {
  return txIntent.methodName === 'depositArtifact';
}

export function isUnconfirmedWithdrawArtifact(
  txIntent: TxIntent
): txIntent is UnconfirmedWithdrawArtifact {
  return txIntent.methodName === 'withdrawArtifact';
}

export function isUnconfirmedProspectPlanet(
  txIntent: TxIntent
): txIntent is UnconfirmedProspectPlanet {
  return txIntent.methodName === 'prospectPlanet';
}

export function isUnconfirmedActivateArtifact(
  txIntent: TxIntent
): txIntent is UnconfirmedActivateArtifact {
  return txIntent.methodName === 'activateArtifact';
}

export function isUnconfirmedDeactivateArtifact(
  txIntent: TxIntent
): txIntent is UnconfirmedDeactivateArtifact {
  return txIntent.methodName === 'deactivateArtifact';
}

export function isUnconfirmedWithdrawSilver(
  txIntent: TxIntent
): txIntent is UnconfirmedWithdrawSilver {
  return txIntent.methodName === 'withdrawSilver';
}

export function isUnconfirmedGetShips(txIntent: TxIntent): txIntent is UnconfirmedGetShips {
  return txIntent.methodName === 'giveSpaceShips';
}

export function isUnconfirmedCapturePlanet(
  txIntent: TxIntent
): txIntent is UnconfirmedCapturePlanet {
  return txIntent.methodName === 'capturePlanet';
}

export function isUnconfirmedInvadePlanet(txIntent: TxIntent): txIntent is UnconfirmedInvadePlanet {
  return txIntent.methodName === 'invadePlanet';
}

export function isUnconfirmedRevealTx(tx: Transaction): tx is Transaction<UnconfirmedReveal> {
  return isUnconfirmedReveal(tx.intent);
}

export function isUnconfirmedInitTx(tx: Transaction): tx is Transaction<UnconfirmedInit> {
  return isUnconfirmedInit(tx.intent);
}

export function isUnconfirmedMoveTx(tx: Transaction): tx is Transaction<UnconfirmedMove> {
  return isUnconfirmedMove(tx.intent);
}

export function isUnconfirmedReleaseTx(tx: Transaction): tx is Transaction<UnconfirmedMove> {
  return isUnconfirmedRelease(tx.intent);
}

export function isUnconfirmedUpgradeTx(tx: Transaction): tx is Transaction<UnconfirmedUpgrade> {
  return isUnconfirmedUpgrade(tx.intent);
}

export function isUnconfirmedBuyHatTx(tx: Transaction): tx is Transaction<UnconfirmedBuyHat> {
  return isUnconfirmedBuyHat(tx.intent);
}

export function isUnconfirmedTransferTx(
  tx: Transaction
): tx is Transaction<UnconfirmedPlanetTransfer> {
  return isUnconfirmedTransfer(tx.intent);
}

export function isUnconfirmedFindArtifactTx(
  tx: Transaction
): tx is Transaction<UnconfirmedFindArtifact> {
  return isUnconfirmedFindArtifact(tx.intent);
}

export function isUnconfirmedDepositArtifactTx(
  tx: Transaction
): tx is Transaction<UnconfirmedDepositArtifact> {
  return isUnconfirmedDepositArtifact(tx.intent);
}

export function isUnconfirmedWithdrawArtifactTx(
  tx: Transaction
): tx is Transaction<UnconfirmedWithdrawArtifact> {
  return isUnconfirmedWithdrawArtifact(tx.intent);
}

export function isUnconfirmedProspectPlanetTx(
  tx: Transaction
): tx is Transaction<UnconfirmedProspectPlanet> {
  return isUnconfirmedProspectPlanet(tx.intent);
}

export function isUnconfirmedActivateArtifactTx(
  tx: Transaction
): tx is Transaction<UnconfirmedActivateArtifact> {
  return isUnconfirmedActivateArtifact(tx.intent);
}

export function isUnconfirmedDeactivateArtifactTx(
  tx: Transaction
): tx is Transaction<UnconfirmedDeactivateArtifact> {
  return isUnconfirmedDeactivateArtifact(tx.intent);
}

export function isUnconfirmedWithdrawSilverTx(
  tx: Transaction
): tx is Transaction<UnconfirmedWithdrawSilver> {
  return isUnconfirmedWithdrawSilver(tx.intent);
}

export function isUnconfirmedGetShipsTx(tx: Transaction): tx is Transaction<UnconfirmedGetShips> {
  return isUnconfirmedGetShips(tx.intent);
}

export function isUnconfirmedInvadePlanetTx(
  tx: Transaction
): tx is Transaction<UnconfirmedInvadePlanet> {
  return isUnconfirmedInvadePlanet(tx.intent);
}

export function isUnconfirmedCapturePlanetTx(
  tx: Transaction
): tx is Transaction<UnconfirmedCapturePlanet> {
  return isUnconfirmedCapturePlanet(tx.intent);
}
