// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface RandomNoManager {
    function getGenericRandomNumberOfLastEpoch()
        external
        view
        returns (uint256);

    function getGenericRandomNumber(uint32 epoch)
        external
        view
        returns (uint256);
}
