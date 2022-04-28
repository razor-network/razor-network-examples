const { expect } = require("chai");
const { BigNumber } = require("ethers");
const hre = require("hardhat");

describe("Lottery", () => {
  let signers;
  let lottery;
  let contributionAmount;

  before(async () => {
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(
      "0x4e4CF6039637B208D1f68872eA947d917086AaE1"
    );
    signers = await hre.ethers.getSigners();
    contributionAmount = await lottery.contributionAmount();
  });

  it("Pool counter to be 1 on start", async () => {
    const poolCounter = await lottery.poolCounter();
    expect(poolCounter.toNumber()).to.be.equal(1);
  });

  it("Participant cannot contribute in same pool twice", async () => {
    lottery = lottery.connect(signers[0]);
    await lottery.contribute({ value: contributionAmount });
    await expect(
      lottery.contribute({ value: contributionAmount })
    ).to.be.revertedWith("Already contributed to pool");
  });

  it("Participant can only contribute to pool with contribution amount", async () => {
    lottery = lottery.connect(signers[1]);
    let notContributionAmount = contributionAmount.sub(100000000000000);
    await expect(
      lottery.contribute({ value: notContributionAmount })
    ).to.be.revertedWith("Requires 0.1 ether to contribute");
  });

  it("declareWinner cannot be called if maxParticipants is not reached", async () => {
    let tx = lottery.declareWinner();
    await expect(tx).to.be.revertedWith("Max participants limit not reached");
  });

  it("Only 5 participant can participate in pool", async () => {
    for (let i = 1; i <= 4; i++) {
      lottery = lottery.connect(signers[i]);
      await lottery.contribute({ value: contributionAmount });
    }

    lottery = lottery.connect(signers[5]);
    await expect(
      lottery.contribute({ value: contributionAmount })
    ).to.be.revertedWith("Pool reached max participants");
  });
});
