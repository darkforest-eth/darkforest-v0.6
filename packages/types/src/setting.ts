/**
 * @hidden
 */

import type { Abstract } from './utility';

/**
 * The user can choose to have the client automatically choose a gas price for their transactions,
 * depending on how much they are willing to pay and how fast they want their transactions to confirm.
 */
export type AutoGasSetting = Abstract<string, 'AutoGasSetting'>;

export const AutoGasSetting = {
  Slow: 'Slow' as AutoGasSetting,
  Average: 'Average' as AutoGasSetting,
  Fast: 'Fast' as AutoGasSetting,
};

export type Setting = Abstract<string, 'Setting'>;

/**
 * Each setting has a unique identifier. Each account gets to store its own local storage setting,
 * per instance of the dark forest contract that it's connected to.
 */
export const Setting = {
  OptOutMetrics: 'OptOutMetrics' as Setting,
  AutoApproveNonPurchaseTransactions: 'AutoApproveNonPurchaseTransactions' as Setting,
  DrawChunkBorders: 'DrawChunkBorders' as Setting,
  HighPerformanceRendering: 'HighPerformanceRendering' as Setting,
  MoveNotifications: 'MoveNotifications' as Setting,
  GasFeeGwei: 'GasFeeGwei' as Setting,
  TerminalVisible: 'TerminalVisible' as Setting,
  HasAcceptedPluginRisk: 'HasAcceptedPluginRisk' as Setting,

  FoundPirates: 'FoundPirates' as Setting,
  TutorialCompleted: 'TutorialCompleted' as Setting,
  FoundSilver: 'FoundSilver' as Setting,
  FoundSilverBank: 'FoundSilverBank' as Setting,
  FoundTradingPost: 'FoundTradingPost' as Setting,
  FoundComet: 'FoundComet' as Setting,
  FoundArtifact: 'FoundArtifact' as Setting,
  FoundDeepSpace: 'FoundDeepSpace' as Setting,
  FoundSpace: 'FoundSpace' as Setting,
  NewPlayer: 'NewPlayer' as Setting,
  MiningCores: 'MiningCores' as Setting,
  TutorialOpen: 'TutorialOpen' as Setting,
  IsMining: 'IsMining' as Setting,
  DisableDefaultShortcuts: 'DisableDefaultShortcuts' as Setting,
  ExperimentalFeatures: 'ExperimentalFeatures' as Setting,
  DisableEmojiRendering: 'DisableEmojiRendering' as Setting,
  DisableHatRendering: 'DisableHatRendering' as Setting,
  AutoClearConfirmedTransactionsAfterSeconds:
    'AutoClearConfirmedTransactionsAfterSeconds' as Setting,
  AutoClearRejectedTransactionsAfterSeconds: 'AutoClearRejectedTransactionsAfterSeconds' as Setting,
  RendererColorInnerNebula: 'RendererColorInnerNebula' as Setting,
  RendererColorNebula: 'RendererColorNebula' as Setting,
  RendererColorSpace: 'RendererColorSpace' as Setting,
  RendererColorDeepSpace: 'RendererColorDeepSpace' as Setting,
  RendererColorDeadSpace: 'RendererColorDeadSpace' as Setting,
  DisableFancySpaceEffect: 'DisableFancySpaceEffect' as Setting,
  ForceReloadEmbeddedPlugins: 'ForceReloadEmbeddedPlugins' as Setting,
};
