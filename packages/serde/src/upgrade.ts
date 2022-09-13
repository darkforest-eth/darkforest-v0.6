import type { DarkForest } from '@darkforest_eth/contracts/typechain';
import type { Upgrade, UpgradeBranches } from '@darkforest_eth/types';

// Sort of duplicate of RawArtifactWithMetadata to avoid circular dependency
export type RawUpgrade = Awaited<ReturnType<DarkForest['getArtifactById']>>['upgrade'];
export type RawUpgradesBranches = Awaited<ReturnType<DarkForest['getUpgrades']>>;

/**
 * Converts raw data received from a typechain-typed ethers.js contract call
 * returning a `UpgradeTypes.Upgrade` into an `Upgrade` object (see
 * @darkforest_eth/types)
 *
 * @param rawUpgrade raw data received from a typechain-typed ethers.js contract
 * call returning a `UpgradeTypes.Upgrade`
 */
export function decodeUpgrade(rawUpgrade: RawUpgrade): Upgrade {
  return {
    energyCapMultiplier: rawUpgrade.popCapMultiplier.toNumber(),
    energyGroMultiplier: rawUpgrade.popGroMultiplier.toNumber(),
    rangeMultiplier: rawUpgrade.rangeMultiplier.toNumber(),
    speedMultiplier: rawUpgrade.speedMultiplier.toNumber(),
    defMultiplier: rawUpgrade.defMultiplier.toNumber(),
  };
}

/**
 * Converts the raw return value of an ether.js contract call to
 * `DarkForest.getUpgrades` to a 2D array of `Upgrade`s.
 *
 * @param rawUpgradeBranches raw return value of ether.js contract call to
 * `DarkForest.getUpgrades`
 */
export function decodeUpgradeBranches(rawUpgradeBranches: RawUpgradesBranches): UpgradeBranches {
  return rawUpgradeBranches.map((a) => a.map(decodeUpgrade)) as UpgradeBranches;
}
