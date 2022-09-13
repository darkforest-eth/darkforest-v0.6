import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { fixtureLoader, makeInitArgs } from './utils/TestUtils';
import { defaultWorldFixture, World } from './utils/TestWorld';
import { SPAWN_PLANET_1, SPAWN_PLANET_2 } from './utils/WorldConstants';
const { utils } = ethers;

describe('DarkForestRewards', function () {
  let world: World;

  async function worldFixture() {
    const world = await fixtureLoader(defaultWorldFixture);
    await world.user1Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_1));
    await world.user2Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_2));
    await world.contract.setTokenMintEndTime(0);

    return world;
  }

  beforeEach('load fixture', async function () {
    world = await fixtureLoader(worldFixture);
  });

  it('when a player submits a correctly sorted score array, it transfers XDAI to them based on their rank', async function () {
    const rewardAmount = (
      await world.contract.getGameConstants()
    ).ROUND_END_REWARDS_BY_RANK[1].toNumber();

    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);
    await world.user1.sendTransaction({
      to: world.contract.address,
      value: utils.parseEther(rewardAmount.toString()),
    });

    expect(
      await world.user1Core.claimReward([world.user2.address, world.user1.address], [20, 10])
    ).to.changeEtherBalance(world.user1, utils.parseEther(rewardAmount.toString()));

    const player = await world.contract.players(world.user1.address);
    expect(player.claimedReward).to.eq(true);
    expect(player.finalRank).to.eq(1);
  });

  it('when a player tries to claim the reward more than once, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(
      world.user1Core.claimReward([world.user2.address, world.user1.address], [20, 10])
    ).to.be.revertedWith('');
  });

  it('when a player tries to claim reward before the game is over, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    await world.contract.setTokenMintEndTime(
      '21888242871839275222246405745257275088548364400416034343698204186575808495617'
    );

    expect(
      world.user1Core.claimReward([world.user2.address, world.user1.address], [20, 10])
    ).to.be.revertedWith('game is not over');
  });

  it('when a player submits an incorrectly sorted score array, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(
      world.user1Core.claimReward([world.user1.address, world.user2.address], [10, 20])
    ).to.be.revertedWith('score array is not sorted correctly');
  });

  it('when a player submit a score and player array of different lengths, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(
      world.user1Core.claimReward([world.user1.address, world.user2.address], [10])
    ).to.be.revertedWith('score and player array lengths do not match');
  });

  it('when a player submits sorted arrays that are too short, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(world.user1Core.claimReward([world.user1.address], [10])).to.be.revertedWith(
      'supplied player array is incorrect length'
    );
  });

  it('when a player submits sorted arrays that are too long, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(
      world.user1Core.claimReward(
        [world.user2.address, world.user1.address, world.user2.address],
        [20, 10, 5]
      )
    ).to.be.revertedWith('supplied player array is incorrect length');
  });

  it('when a player submits an incorrect score for a player, it fails', async function () {
    await world.contract.adminSetScore(world.user1.address, 10);
    await world.contract.adminSetScore(world.user2.address, 20);

    expect(
      world.user1Core.claimReward([world.user2.address, world.user1.address], [2000000, 1010000])
    ).to.be.revertedWith('invalid score array');
  });
});
