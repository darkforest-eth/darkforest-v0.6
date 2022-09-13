import type { PluginId } from './plugin';
import type { Abstract } from './utility';

/**
 * Modals can either be built into the game, or spawned by a plugin.
 */
export type ModalId = ModalName | PluginId;

/**
 * Modals built into the game have a human-readable name.
 */
export type ModalName = Abstract<string, 'ModalName'>;

export const ModalName = {
  Help: 'Help' as ModalName,
  PlanetDetails: 'PlanetDetails' as ModalName,
  Leaderboard: 'Leaderboard' as ModalName,
  PlanetDex: 'PlanetDex' as ModalName,
  UpgradeDetails: 'UpgradeDetails' as ModalName,
  TwitterVerify: 'TwitterVerify' as ModalName,
  Broadcast: 'Broadcast' as ModalName,
  Hats: 'Hats' as ModalName,
  Settings: 'Settings' as ModalName,
  YourArtifacts: 'YourArtifacts' as ModalName,
  ManageArtifacts: 'ManageArtifacts' as ModalName,
  Plugins: 'Plugins' as ModalName,
  PluginWarning: 'PluginWarning' as ModalName,
  PluginEditor: 'PluginEditor' as ModalName,
  PlanetContextPane: 'PlanetContextPane' as ModalName,
  TransactionLog: 'TransactionLog' as ModalName,

  WithdrawSilver: 'WithdrawSilver' as ModalName,
  Diagnostics: 'Diagnostics' as ModalName,

  ArtifactConversation: 'ArtifactConversation' as ModalName,
  ArtifactDetails: 'ArtifactDetails' as ModalName,
  MapShare: 'MapShare' as ModalName,
  ManageAccount: 'ManageAccount' as ModalName,
  Onboarding: 'Onboarding' as ModalName,
  Private: 'Private' as ModalName,
};

export type CursorState = Abstract<string, 'CursorState'>;

export const CursorState = {
  Normal: 'Normal' as CursorState,
  TargetingExplorer: 'TargetingExplorer' as CursorState,
  TargetingForces: 'TargetingForces' as CursorState,
};

export type ModalManagerEvent = Abstract<string, 'ModalManagerEvent'>;

export const ModalManagerEvent = {
  StateChanged: 'StateChanged',
  MiningCoordsUpdate: 'MiningCoordsUpdate',
};

export type TooltipName = Abstract<string, 'TooltipName'>;

export const TooltipName = {
  SilverGrowth: 'SilverGrowth' as TooltipName,
  SilverCap: 'SilverCap' as TooltipName,
  Silver: 'Silver' as TooltipName,
  TwitterHandle: 'TwitterHandle' as TooltipName,
  Bonus: 'Bonus' as TooltipName,
  MinEnergy: 'MinEnergy' as TooltipName,
  Time50: 'Time50' as TooltipName,
  Time90: 'Time90' as TooltipName,
  Pirates: 'Pirates' as TooltipName,
  Upgrades: 'Upgrades' as TooltipName,
  PlanetRank: 'PlanetRank' as TooltipName,
  MaxLevel: 'MaxLevel' as TooltipName,
  FindArtifact: 'FindArtifact' as TooltipName,
  ArtifactStored: 'ArtifactStored' as TooltipName,
  SelectedSilver: 'SelectedSilver' as TooltipName,
  Rank: 'Rank' as TooltipName,
  Score: 'Score' as TooltipName,
  MiningPause: 'MiningPause' as TooltipName,
  MiningTarget: 'MiningTarget' as TooltipName,
  HashesPerSec: 'HashesPerSec' as TooltipName,
  CurrentMining: 'CurrentMining' as TooltipName,
  HoverPlanet: 'HoverPlanet' as TooltipName,
  SilverProd: 'SilverProd' as TooltipName,
  TimeUntilActivationPossible: 'TimeUntilActivationPossible' as TooltipName,
  DepositArtifact: 'DepositArtifact' as TooltipName,
  DeactivateArtifact: 'DeactivateArtifact' as TooltipName,
  WithdrawArtifact: 'WithdrawArtifact' as TooltipName,
  ActivateArtifact: 'ActivateArtifact' as TooltipName,
  RetryTransaction: 'RetryTransaction' as TooltipName,
  CancelTransaction: 'CancelTransaction' as TooltipName,
  PrioritizeTransaction: 'PrioritizeTransaction' as TooltipName,

  DefenseMultiplier: 'DefenseMultiplier' as TooltipName,
  EnergyCapMultiplier: 'EnergyCapMultiplier' as TooltipName,
  EnergyGrowthMultiplier: 'EnergyGrowthMultiplier' as TooltipName,
  RangeMultiplier: 'RangeMultiplier' as TooltipName,
  SpeedMultiplier: 'SpeedMultiplier' as TooltipName,

  BonusEnergyCap: 'BonusEnergyCap' as TooltipName,
  BonusEnergyGro: 'BonusEnergyGro' as TooltipName,
  BonusRange: 'BonusRange' as TooltipName,
  BonusSpeed: 'BonusSpeed' as TooltipName,
  BonusDefense: 'BonusDefense' as TooltipName,
  BonusSpaceJunk: 'BonusSpaceJunk' as TooltipName,

  Energy: 'Energy' as TooltipName,
  EnergyGrowth: 'EnergyGrowth' as TooltipName,
  Range: 'Range' as TooltipName,
  Speed: 'Speed' as TooltipName,
  Defense: 'Defense' as TooltipName,
  SpaceJunk: 'SpaceJunk' as TooltipName,
  Abandon: 'Abandon' as TooltipName,

  Clowntown: 'Clowntown' as TooltipName,

  ArtifactBuff: 'ArtifactBuff' as TooltipName,

  ModalHelp: 'ModalHelp' as TooltipName,
  ModalPlanetDetails: 'ModalPlanetDetails' as TooltipName,
  ModalLeaderboard: 'ModalLeaderboard' as TooltipName,
  ModalPlanetDex: 'ModalPlanetDex' as TooltipName,
  ModalUpgradeDetails: 'ModalUpgradeDetails' as TooltipName,
  ModalTwitterVerification: 'ModalTwitterVerification' as TooltipName,
  ModalTwitterBroadcast: 'ModalTwitterBroadcast' as TooltipName,
  ModalHats: 'ModalHats' as TooltipName,
  ModalSettings: 'ModalSettings' as TooltipName,
  ModalYourArtifacts: 'ModalYourArtifacts' as TooltipName,
  ModalFindArtifact: 'ModalFindArtifact' as TooltipName,
  ModalPlugins: 'ModalPlugins' as TooltipName,
  ModalWithdrawSilver: 'ModalWithdrawSilver' as TooltipName,
  NetworkHealth: 'NetworkHealth' as TooltipName,
  WithdrawSilverButton: 'WithdrawSilverButton' as TooltipName,
  Invadable: 'Invadable' as TooltipName,
  Capturable: 'Capturable' as TooltipName,
  /**
   * So that you can render a tooltip without anything, and control its contents entirely via the
   * {@link TooltipTriggerProps#extraContent} prop field.
   */
  Empty: 'Empty' as TooltipName,
};

/**
 * Contains metadata on modals in the game. Meant to store coordinates and state. Is
 * uniquely identified by a ModalId, which typically either the modalId of a given modal pane, or
 * plugin id.
 */
export interface ModalPosition {
  x?: number;
  y?: number;
  state: 'open' | 'closed' | 'minimized';
  modalId: ModalId;
}

export type ModalPositions = Map<ModalId, ModalPosition>;
