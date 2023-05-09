//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/ITransparentForwarder.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    address public immutable owner;
    ITransparentForwarder public transparentForwarder;
    address public usdToken;
    bytes32 public collectionNameHash;

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    constructor(
        address _transparentForwarder,
        address _usdToken,
        bytes32 _collectionNameHash
    ) {
        owner = msg.sender;

        transparentForwarder = ITransparentForwarder(_transparentForwarder);
        usdToken = _usdToken;
        collectionNameHash = _collectionNameHash;
    }

    /// @notice Swap native token with equivalent USD token
    function swap() public payable {
        uint256 collectionResult;
        int8 collectionPower;
        uint256 collectionPriceInUSD;

        (collectionResult, collectionPower) = transparentForwarder.getResult{
            value: 0
        }(collectionNameHash);

        // * if power is +ve, price = result / 1o^power
        // * if power is -ve, price = result * 10^power
        if (collectionPower < 0) {
            collectionPriceInUSD =
                collectionResult *
                uint256(pow(collectionPower));
        } else {
            collectionPriceInUSD =
                collectionResult /
                uint256(pow(collectionPower));
        }

        uint256 usdAmount = msg.value * collectionPriceInUSD;
        IERC20(usdToken).approve(address(this), usdAmount);
        IERC20(usdToken).transferFrom(address(this), msg.sender, usdAmount);
    }

    function updateTransparentForwarder(
        address _transparentForwarder
    ) public onlyOwner {
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
    }

    function updateUSDToken(address _usdToken) public onlyOwner {
        usdToken = _usdToken;
    }

    function updateCollectionNameHash(
        bytes32 _collectionNameHash
    ) public onlyOwner {
        collectionNameHash = _collectionNameHash;
    }

    function pow(int8 val) public pure returns (int256) {
        if (val == 0) {
            return 1;
        }
        int256 result = 1;

        if (val < -1) {
            val = val * -1;
        }

        for (int256 i = 0; i < val; i++) {
            result = result * 10;
        }
        return result;
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
