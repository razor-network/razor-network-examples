//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/ITransparentForwarder.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    address public immutable owner;
    ITransparentForwarder public transparentForwarder;
    address public usdToken;
    address public wethToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    constructor(
        address _transparentForwarder,
        address _usdToken,
        address _wethToken
    ) {
        owner = msg.sender;
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
        usdToken = _usdToken;
        wethToken = _wethToken;
    }

    /// @notice Swap native token with equivalent USD token
    function swap(bytes calldata data, uint256 _amount) public payable {
        uint256 usdAmount;
        (uint256 result, int8 power,) = transparentForwarder.updateAndGetResult(data);
        // * if power is +ve, price = result / 10^power
        // * if power is -ve, price = result * 10^power
        if (power < 0) {
            usdAmount =
                (_amount * result) *
                uint256(pow(power));
        } else {
            usdAmount =
                (_amount * result) /
                uint256(pow(power));
        }

        require(IERC20(wethToken).transferFrom(msg.sender, address(this), _amount), "WETH token transfer failed");
        IERC20(usdToken).approve(address(this), usdAmount);
        require(IERC20(usdToken).transfer(msg.sender, usdAmount), "USD token transfer failed");
    }

    function disperseFunds() public payable {
        uint256 balance = IERC20(wethToken).balanceOf(msg.sender);
        if(balance > 0.2 ether){
            revert("balance is sufficient");
        }
         IERC20(wethToken).approve(address(this), 0.1 ether);
        IERC20(wethToken).transfer(msg.sender, 0.1 ether);
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
