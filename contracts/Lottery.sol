//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IRandomNoManager.sol";
import "hardhat/console.sol";

contract Lottery {
    uint256 public contributionAmount = 0.1 ether;
    uint8 public immutable maxParticipants = 5;
    uint256 public poolCounter = 1;
    uint8 public poolParticipantCounter = 0;

    mapping(uint256 => address[]) poolParticipants;
    mapping(uint256 => mapping(address => bool)) poolRecords;

    IRandomNoManager public randomNoManager;

    constructor(address _randomNoManager) {
        randomNoManager = IRandomNoManager(_randomNoManager);
    }

    function contribute() public payable {
        require(
            !poolRecords[poolCounter][msg.sender],
            "Already contributed to pool"
        );
        require(
            poolParticipantCounter != maxParticipants,
            "Pool reached max participants"
        );
        require(
            msg.value == contributionAmount,
            "Requires 0.1 ether to contribute"
        );

        poolParticipants[poolCounter].push(msg.sender);
        poolRecords[poolCounter][msg.sender] = true;
        poolParticipantCounter++;
    }

    function declareWinner() public returns (address) {
        require(
            poolParticipantCounter == maxParticipants,
            "Max participants limit not reached"
        );
        // Needs to convert this to random number generator function
        uint256 index = block.timestamp % poolParticipants[poolCounter].length;
        address winner = poolParticipants[poolCounter][index];
        bool sent = payable(winner).send(0.5 ether);
        require(sent, "Failed to send reward");
        poolCounter++;
        poolParticipantCounter = 0;
        return winner;
    }

    receive() external payable {}
}
