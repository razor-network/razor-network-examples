//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/ITransparentForwarder.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    address public immutable owner;
    ITransparentForwarder public transparentForwarder;
    address public usdToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    constructor(
        address _transparentForwarder,
        address _usdToken
    ) {
        owner = msg.sender;
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
        usdToken = _usdToken;
    }

    /// @notice Swap native token with equivalent USD token
    function swap(bytes calldata data) public payable {
        uint256 usdAmount;
        uint256 minUpdateCost = 1 wei; // this should be made configurable
         (uint256 result, int8 power, uint256 timestamp) = transparentForwarder.updateAndGetResult{value: minUpdateCost}(data);
        // * if power is +ve, price = result / 10^power
        // * if power is -ve, price = result * 10^power
        if (power < 0) {
            usdAmount =
                (msg.value * result) *
                uint256(pow(power));
        } else {
            usdAmount =
                (msg.value * result) /
                uint256(pow(power));
        }

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
    function pow(int8 val) public pure returns (int256) {
        if (val == 0) {
            return 1;
        }
        int256 result = 1;

        if (val < 0) {
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
