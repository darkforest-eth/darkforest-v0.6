// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import {LibDiamond} from "../vendor/libraries/LibDiamond.sol";

import {DFWhitelistFacet} from "./DFWhitelistFacet.sol";

import {WithStorage} from "../libraries/LibStorage.sol";

import {Player} from "../DFTypes.sol";

contract DFRewardFacet is WithStorage {
    modifier onlyWhitelisted() {
        require(
            DFWhitelistFacet(address(this)).isWhitelisted(msg.sender) ||
                msg.sender == LibDiamond.contractOwner(),
            "Player is not whitelisted"
        );
        _;
    }

    function claimReward(address[] calldata sortedPlayerAddresses, uint256[] calldata sortedScores)
        public
        onlyWhitelisted
    {
        require(
            sortedPlayerAddresses.length == gs().playerIds.length,
            "supplied player array is incorrect length"
        );
        require(
            sortedPlayerAddresses.length == sortedScores.length,
            "score and player array lengths do not match"
        );
        require(block.timestamp > gs().TOKEN_MINT_END_TIMESTAMP, "game is not over");

        Player storage claimingPlayer = gs().players[msg.sender];

        require(!claimingPlayer.claimedReward, "reward has already been claimed");
        require(claimingPlayer.isInitialized, "player not initialized");

        uint256 lastScore = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

        for (uint256 i = 0; i < gs().playerIds.length; i++) {
            Player memory player = gs().players[sortedPlayerAddresses[i]];
            require(player.isInitialized, "invalid player array");

            uint256 score = sortedScores[i];
            require(player.score == score, "invalid score array");
            require(score < lastScore, "score array is not sorted correctly");

            if (player.player == claimingPlayer.player) {
                claimingPlayer.finalRank = i;
                claimingPlayer.claimedReward = true;
            }

            lastScore = score;
        }

        payable(msg.sender).transfer(
            gameConstants().ROUND_END_REWARDS_BY_RANK[claimingPlayer.finalRank] * 1 ether
        );
    }
}
