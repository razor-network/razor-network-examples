//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IRandomNoManager.sol";

contract Lottery {
    uint256 public contributionAmount = 0.1 ether;
    uint8 public constant MAX_PARTICIPANTS = 5;
    uint16 public constant EPOCH_LENGTH = 1800;
    uint256 public poolCounter = 1;
    uint8 public poolParticipantCounter = 0;

    mapping(uint256 => address[]) poolParticipants;
    mapping(uint256 => mapping(address => bool)) poolRecords;
    mapping(uint256 => bool) epoches;
    mapping(uint256 => address) winners;

    IRandomNoManager public randomNoManager;

    event WinnerDeclared(address indexed winner, uint256 pool);

    constructor(address _randomNoManager) {
        randomNoManager = IRandomNoManager(_randomNoManager);
    }

    function contribute() public payable {
        require(
            !poolRecords[poolCounter][msg.sender],
            "Already contributed to pool"
        );
        require(
            poolParticipantCounter != MAX_PARTICIPANTS,
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

    function declareWinner() public {
        require(
            poolParticipantCounter == MAX_PARTICIPANTS,
            "Max participants limit not reached"
        );
        uint32 epoch = (uint32(block.timestamp) / (EPOCH_LENGTH));
        require(!epoches[epoch], "Pool closed for current epoch");

        uint256 index = randomNoManager.getGenericRandomNumberOfLastEpoch() %
            MAX_PARTICIPANTS;
        address winner = poolParticipants[poolCounter][index];
        bool sent = payable(winner).send(contributionAmount * MAX_PARTICIPANTS);
        require(sent, "Failed to send reward");

        emit WinnerDeclared(winner, poolCounter);

        winners[poolCounter] = winner;
        poolCounter++;
        poolParticipantCounter = 0;
        epoches[epoch] = true;
    }

    receive() external payable {}
}
