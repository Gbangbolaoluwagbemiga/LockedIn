const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LockedIn", function () {
  let lockedIn;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const LockedIn = await ethers.getContractFactory("LockedIn");
    lockedIn = await LockedIn.deploy();
    await lockedIn.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await lockedIn.getAddress()).to.be.properAddress;
    });

    it("Should have zero initial commitments", async function () {
      expect(await lockedIn.getTotalCommitments()).to.equal(0);
    });

    it("Should have zero initial reward pool", async function () {
      expect(await lockedIn.totalRewardPool()).to.equal(0);
    });
  });

  describe("Creating Commitments", function () {
    it("Should create a commitment with valid parameters", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      const goal = "I will not buy coffee for 30 days";
      const durationInDays = 30;

      const tx = await lockedIn.connect(user1).createCommitment(goal, durationInDays, {
        value: stakeAmount,
      });
      
      await expect(tx)
        .to.emit(lockedIn, "CommitmentCreated")
        .withArgs(0, user1.address, stakeAmount, goal, (deadline) => {
          return deadline > 0;
        });

      const commitment = await lockedIn.getCommitment(0);
      expect(commitment.user).to.equal(user1.address);
      expect(commitment.stakeAmount).to.equal(stakeAmount);
      expect(commitment.goal).to.equal(goal);
      expect(commitment.completed).to.be.false;
      expect(commitment.claimed).to.be.false;
    });

    it("Should reject commitment with zero stake", async function () {
      await expect(
        lockedIn.connect(user1).createCommitment("Test goal", 30, {
          value: 0,
        })
      ).to.be.revertedWith("LockedIn: Stake amount must be greater than 0");
    });

    it("Should reject commitment with zero duration", async function () {
      await expect(
        lockedIn.connect(user1).createCommitment("Test goal", 0, {
          value: ethers.parseEther("1.0"),
        })
      ).to.be.revertedWith("LockedIn: Duration must be greater than 0");
    });

    it("Should reject commitment with empty goal", async function () {
      await expect(
        lockedIn.connect(user1).createCommitment("", 30, {
          value: ethers.parseEther("1.0"),
        })
      ).to.be.revertedWith("LockedIn: Goal description cannot be empty");
    });

    it("Should track user commitments", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      
      await lockedIn.connect(user1).createCommitment("Goal 1", 30, {
        value: stakeAmount,
      });
      await lockedIn.connect(user1).createCommitment("Goal 2", 60, {
        value: stakeAmount,
      });

      const userCommitments = await lockedIn.getUserCommitments(user1.address);
      expect(userCommitments.length).to.equal(2);
      expect(userCommitments[0]).to.equal(0);
      expect(userCommitments[1]).to.equal(1);
    });
  });

  describe("Marking Commitments as Completed", function () {
    beforeEach(async function () {
      await lockedIn.connect(user1).createCommitment("Test goal", 30, {
        value: ethers.parseEther("1.0"),
      });
    });

    it("Should allow creator to mark commitment as completed", async function () {
      await expect(lockedIn.connect(user1).markCompleted(0))
        .to.emit(lockedIn, "CommitmentCompleted")
        .withArgs(0, user1.address);

      const commitment = await lockedIn.getCommitment(0);
      expect(commitment.completed).to.be.true;
    });

    it("Should reject marking completed by non-creator", async function () {
      await expect(
        lockedIn.connect(user2).markCompleted(0)
      ).to.be.revertedWith("LockedIn: Only creator can mark as completed");
    });

    it("Should reject marking already completed commitment", async function () {
      await lockedIn.connect(user1).markCompleted(0);
      await expect(
        lockedIn.connect(user1).markCompleted(0)
      ).to.be.revertedWith("LockedIn: Commitment already completed");
    });

    it("Should reject marking completed after deadline", async function () {
      // Create commitment with 1 day duration
      await lockedIn.connect(user2).createCommitment("Test", 1, {
        value: ethers.parseEther("1.0"),
      });

      // Fast forward time by 2 days
      await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        lockedIn.connect(user2).markCompleted(1)
      ).to.be.revertedWith("LockedIn: Deadline has passed");
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      // Create commitments
      await lockedIn.connect(user1).createCommitment("Goal 1", 30, {
        value: ethers.parseEther("1.0"),
      });
      await lockedIn.connect(user2).createCommitment("Goal 2", 30, {
        value: ethers.parseEther("2.0"),
      });
    });

    it("Should reject unstaking before deadline", async function () {
      await expect(
        lockedIn.connect(user1).unstake(0)
      ).to.be.revertedWith("LockedIn: Commitment period not ended yet");
    });

    it("Should allow unstaking after deadline for completed commitment", async function () {
      // Mark as completed
      await lockedIn.connect(user1).markCompleted(0);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      await expect(lockedIn.connect(user1).unstake(0))
        .to.emit(lockedIn, "StakeUnstaked")
        .withArgs(0, user1.address, (amount) => amount > 0, true);

      const finalBalance = await ethers.provider.getBalance(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should send stake to reward pool for failed commitment", async function () {
      // Fast forward time (user2 didn't complete)
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      await lockedIn.connect(user2).unstake(1);

      const rewardPool = await lockedIn.totalRewardPool();
      expect(rewardPool).to.equal(ethers.parseEther("2.0"));
    });

    it("Should distribute rewards to completed commitments", async function () {
      // User1 completes, User2 fails
      await lockedIn.connect(user1).markCompleted(0);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      // User2 unstakes first (adds to reward pool)
      await lockedIn.connect(user2).unstake(1);

      // User1 unstakes (should get stake + reward)
      const initialBalance = await ethers.provider.getBalance(user1.address);
      await lockedIn.connect(user1).unstake(0);
      const finalBalance = await ethers.provider.getBalance(user1.address);

      // User1 should get back stake (1 ETH) + reward (2 ETH from user2)
      const received = finalBalance - initialBalance;
      expect(received).to.be.closeTo(ethers.parseEther("3.0"), ethers.parseEther("0.01"));
    });

    it("Should reject unstaking by non-creator", async function () {
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        lockedIn.connect(user2).unstake(0)
      ).to.be.revertedWith("LockedIn: Only creator can unstake");
    });

    it("Should reject unstaking already claimed commitment", async function () {
      await lockedIn.connect(user1).markCompleted(0);
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      await lockedIn.connect(user1).unstake(0);
      await expect(
        lockedIn.connect(user1).unstake(0)
      ).to.be.revertedWith("LockedIn: Already claimed");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await lockedIn.connect(user1).createCommitment("Test goal", 30, {
        value: ethers.parseEther("1.0"),
      });
    });

    it("Should return correct commitment details", async function () {
      const commitment = await lockedIn.getCommitment(0);
      expect(commitment.user).to.equal(user1.address);
      expect(commitment.stakeAmount).to.equal(ethers.parseEther("1.0"));
      expect(commitment.goal).to.equal("Test goal");
    });

    it("Should return correct canUnstake status", async function () {
      expect(await lockedIn.canUnstake(0)).to.be.false; // Before deadline

      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      expect(await lockedIn.canUnstake(0)).to.be.true; // After deadline
    });

    it("Should return estimated reward", async function () {
      const estimatedReward = await lockedIn.getEstimatedReward(0);
      expect(estimatedReward).to.equal(0); // No reward pool yet
    });
  });
});


