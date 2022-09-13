import type { Abstract } from './utility';

/**
 * The effects of an upgrade on the stats of a planet. Both upgrades purchased
 * for silver as well as artifacts of certain types can modify stats of a
 * planet.
 */
export type Upgrade = {
  energyCapMultiplier: number;
  energyGroMultiplier: number;
  rangeMultiplier: number;
  speedMultiplier: number;
  defMultiplier: number;
};

/**
 * On a single upgrade branch, the stat effects of the four upgrades.
 */
export type UpgradeLevels = [Upgrade, Upgrade, Upgrade, Upgrade];

/**
 * Stores the stat effects of upgrades of all three branches: defense, range,
 * speed.
 */
export type UpgradeBranches = [UpgradeLevels, UpgradeLevels, UpgradeLevels];

/**
 * How many times a planet has been upgraded along each of the three branches:
 * defense, range, and speed
 */
export type UpgradeState = [number, number, number];

/**
 * Abstract type representing an upgrade branch.
 */
export type UpgradeBranchName = Abstract<number, 'UpgradeBranchName'>;

/**
 * Enumeration of the three upgrade branches.
 */
export const UpgradeBranchName = {
  Defense: 0 as UpgradeBranchName,
  Range: 1 as UpgradeBranchName,
  Speed: 2 as UpgradeBranchName,
} as const;
