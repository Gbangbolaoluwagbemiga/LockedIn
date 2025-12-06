// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LockedIn
 * @dev A decentralized commitment contract platform where users stake CELO to commit to goals
 * @notice Users can stake CELO, set commitment goals, and earn rewards from failed commitments
 * @notice Contract can be paused by owner for emergency situations
 */
contract LockedIn is Pausable, Ownable {
    // Struct to store commitment details
    struct Commitment {
        address user;           // Address of the user who created the commitment
        uint256 stakeAmount;    // Amount of ETH staked
        string goal;            // Description of the commitment goal
        uint256 deadline;       // Timestamp when commitment period ends
        bool completed;         // Whether the goal was completed
        bool claimed;           // Whether rewards have been claimed
        uint256 createdAt;      // Timestamp when commitment was created
    }

    // Mapping from commitment ID to Commitment struct
    mapping(uint256 => Commitment) public commitments;
    
    // Mapping from user address to array of commitment IDs
    mapping(address => uint256[]) public userCommitments;
    
    // Total reward pool from failed commitments
    uint256 public totalRewardPool;
    
    // Counter for commitment IDs
    uint256 private commitmentCounter;
    
    // Events
    event CommitmentCreated(
        uint256 indexed commitmentId,
        address indexed user,
        uint256 stakeAmount,
        string goal,
        uint256 deadline
    );
    
    event CommitmentCompleted(
        uint256 indexed commitmentId,
        address indexed user
    );
    
    event StakeUnstaked(
        uint256 indexed commitmentId,
        address indexed user,
        uint256 amount,
        bool success
    );
    
    event RewardClaimed(
        uint256 indexed commitmentId,
        address indexed user,
        uint256 rewardAmount
    );
    
    event RewardPoolUpdated(uint256 newTotal);

    constructor() Ownable(msg.sender) {
        // Contract is not paused on deployment
    }

    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Create a new commitment by staking ETH
     * @param _goal Description of the commitment goal
     * @param _durationInDays Number of days for the commitment period
     * @return commitmentId The ID of the newly created commitment
     */
    function createCommitment(
        string memory _goal,
        uint256 _durationInDays
    ) external payable whenNotPaused returns (uint256) {
        require(msg.value > 0, "LockedIn: Stake amount must be greater than 0");
        require(_durationInDays > 0, "LockedIn: Duration must be greater than 0");
        require(bytes(_goal).length > 0, "LockedIn: Goal description cannot be empty");
        
        uint256 commitmentId = commitmentCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        
        commitments[commitmentId] = Commitment({
            user: msg.sender,
            stakeAmount: msg.value,
            goal: _goal,
            deadline: deadline,
            completed: false,
            claimed: false,
            createdAt: block.timestamp
        });
        
        userCommitments[msg.sender].push(commitmentId);
        
        emit CommitmentCreated(
            commitmentId,
            msg.sender,
            msg.value,
            _goal,
            deadline
        );
        
        return commitmentId;
    }

    /**
     * @dev Mark a commitment as completed (only by the creator)
     * @param _commitmentId The ID of the commitment to mark as completed
     */
    function markCompleted(uint256 _commitmentId) external whenNotPaused {
        Commitment storage commitment = commitments[_commitmentId];
        
        require(commitment.user == msg.sender, "LockedIn: Only creator can mark as completed");
        require(!commitment.completed, "LockedIn: Commitment already completed");
        require(block.timestamp <= commitment.deadline, "LockedIn: Deadline has passed");
        
        commitment.completed = true;
        
        emit CommitmentCompleted(_commitmentId, msg.sender);
    }

    /**
     * @dev Unstake ETH from a commitment
     * @param _commitmentId The ID of the commitment to unstake from
     * @notice If goal is completed, user gets stake back + rewards. If failed, stake goes to reward pool.
     */
    function unstake(uint256 _commitmentId) external whenNotPaused {
        Commitment storage commitment = commitments[_commitmentId];
        
        require(commitment.user == msg.sender, "LockedIn: Only creator can unstake");
        require(block.timestamp > commitment.deadline, "LockedIn: Commitment period not ended yet");
        require(!commitment.claimed, "LockedIn: Already claimed");
        
        commitment.claimed = true;
        uint256 amountToReturn = 0;
        bool success = commitment.completed;
        
        if (success) {
            // User completed the goal - return stake + share of reward pool
            amountToReturn = commitment.stakeAmount;
            
            // Calculate reward share (proportional to stake amount)
            uint256 rewardShare = calculateRewardShare(_commitmentId);
            amountToReturn += rewardShare;
            
            // Update reward pool
            if (totalRewardPool >= rewardShare) {
                totalRewardPool -= rewardShare;
            }
            
            emit RewardClaimed(_commitmentId, msg.sender, rewardShare);
        } else {
            // User failed - stake goes to reward pool
            totalRewardPool += commitment.stakeAmount;
            emit RewardPoolUpdated(totalRewardPool);
        }
        
        // Transfer funds
        if (amountToReturn > 0) {
            (bool sent, ) = payable(msg.sender).call{value: amountToReturn}("");
            require(sent, "LockedIn: Failed to send ETH");
        }
        
        emit StakeUnstaked(_commitmentId, msg.sender, amountToReturn, success);
    }

    /**
     * @dev Calculate reward share for a completed commitment
     * @param _commitmentId The ID of the commitment
     * @return rewardShare The amount of reward the user is entitled to
     */
    function calculateRewardShare(uint256 _commitmentId) internal view returns (uint256) {
        Commitment memory commitment = commitments[_commitmentId];
        
        if (totalRewardPool == 0 || !commitment.completed) {
            return 0;
        }
        
        // Calculate total stake of all completed commitments
        uint256 totalCompletedStake = 0;
        uint256 completedCount = 0;
        
        for (uint256 i = 0; i < commitmentCounter; i++) {
            if (commitments[i].completed && block.timestamp > commitments[i].deadline) {
                totalCompletedStake += commitments[i].stakeAmount;
                completedCount++;
            }
        }
        
        if (totalCompletedStake == 0) {
            return 0;
        }
        
        // Proportional reward based on stake amount
        return (totalRewardPool * commitment.stakeAmount) / totalCompletedStake;
    }

    /**
     * @dev Get commitment details
     * @param _commitmentId The ID of the commitment
     * @return Commitment struct with all details
     */
    function getCommitment(uint256 _commitmentId) external view returns (Commitment memory) {
        return commitments[_commitmentId];
    }

    /**
     * @dev Get all commitment IDs for a user
     * @param _user The address of the user
     * @return Array of commitment IDs
     */
    function getUserCommitments(address _user) external view returns (uint256[] memory) {
        return userCommitments[_user];
    }

    /**
     * @dev Get total number of commitments
     * @return Total count of commitments
     */
    function getTotalCommitments() external view returns (uint256) {
        return commitmentCounter;
    }

    /**
     * @dev Check if a commitment can be unstaked
     * @param _commitmentId The ID of the commitment
     * @return canUnstake Whether the commitment can be unstaked
     */
    function canUnstake(uint256 _commitmentId) external view returns (bool) {
        Commitment memory commitment = commitments[_commitmentId];
        return (
            block.timestamp > commitment.deadline &&
            !commitment.claimed &&
            commitment.user != address(0)
        );
    }

    /**
     * @dev Get estimated reward for a commitment if completed
     * @param _commitmentId The ID of the commitment
     * @return Estimated reward amount
     */
    function getEstimatedReward(uint256 _commitmentId) external view returns (uint256) {
        return calculateRewardShare(_commitmentId);
    }
}

