//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IRandomNoManager.sol";

contract Lottery {
    uint256 public contributionAmount = 0.1 ether;
    uint256 poolCounter = 1;
    mapping(uint256 => address[]) poolParticipants;
    mapping(uint256 => mapping(address => bool)) poolRecords;
    uint8 public immutable maxParticipants = 5;
    IRandomNoManager public randomNoManager;
    uint8 public poolParticipantCounter = 0;

    constructor(address _randomNoManager) {
        randomNoManager = IRandomNoManager(_randomNoManager);
    }

    function contribute() public payable {
        require(
            !poolRecords[poolCounter][msg.sender],
            "Already contributed to pool"
        );
        require(
            poolParticipantCounter == maxParticipants,
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

    function declareWinner() public returns (address) {}

    receive() external payable {}
}
