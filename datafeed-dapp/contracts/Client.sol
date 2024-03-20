
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// Example Client Contract
interface ITransparentForwarder {
    /**
     * @notice Updates the result based on the provided data and returns the latest result
     * @dev The data will be updated only if the result is valid and is newer than the previous result.
     * Updation will be done by the clients, though once the result is updated, it wont be updated till the latest results
     * are sent again. Regardless of the updation, the result will be returned.
     * @param _data bytes data required to update the result
     * @return result of the collection, its power and timestamp
     */
    function updateAndGetResult(bytes calldata _data) external payable returns (uint256, int8, uint256);

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 _name) external returns (uint256, int8, uint256);

    /**
     * @dev validates the result based on the provided data and returns the validity
     * @param _data bytes data required to validate the result
     * @return validity of the result
     */
    function validateResult(bytes calldata _data) external returns (bool, uint256, int8, uint256);
}


contract Client {
    ITransparentForwarder public transparentForwarder;
    uint256 public lastResult;
    int8 public lastPower;
    uint256 public lastTimestamp;
    bool public isResultValid;

    constructor() {
        transparentForwarder = ITransparentForwarder(0x8cE69db7CA670A22073199C2934FAbC72084a3BC);
    }

    function setTransparentForwarder(address _transparentForwarder) public {
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
    }

    function updateAndGetResult(bytes calldata data) public payable returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder.updateAndGetResult{value: msg.value}(data);

        lastResult = result;
        lastPower = power;
        lastTimestamp = timestamp;
        return (result, power, timestamp);
    }

    function getResult(bytes32 name) public returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder.getResult(name);

        lastResult = result;
        lastPower = power;
        lastTimestamp = timestamp;
        return (result, power, timestamp);
    }

    function validateResult(bytes calldata data) public returns (bool) {
        (isResultValid, , , ) = transparentForwarder.validateResult(data);

        return isResultValid;
    }
}
