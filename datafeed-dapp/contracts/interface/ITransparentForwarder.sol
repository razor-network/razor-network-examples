// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITransparentForwarder {
    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 _name) external payable returns (uint256, int8);
}
