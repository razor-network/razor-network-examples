//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IDelegator.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    address public immutable owner;
    IDelegator delegator;

    address public token1;
    address public token2;

    uint16 public token1ID;
    uint16 public token2ID;

    uint256 fundAmount = 0.01 ether;

    event Swap(
        uint16 fromID,
        uint16 toID,
        uint256 fromAmount,
        uint256 toAmount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    modifier checkID(uint16 _id) {
        require(_id == 1 || _id == 2, "only id 1 and 2 can be updated");
        _;
    }

    constructor(
        address _delegator,
        address _token1,
        address _token2,
        uint16 _token1ID,
        uint16 _token2ID
    ) {
        owner = msg.sender;
        delegator = IDelegator(_delegator);

        token1 = _token1;
        token2 = _token2;

        token1ID = _token1ID;
        token2ID = _token2ID;
    }

    /// @notice Swap ERC20 tokens
    /// @dev Swap ERC20 tokens based on oracle result
    /// @param _from From tokenID
    /// @param _to To tokenID
    /// @param _amount Amount of from tokens
    function swap(
        uint16 _from,
        uint16 _to,
        uint256 _amount
    ) public {
        require(
            (_from == token1ID && _to == token2ID) ||
                (_from == token2ID || _to == token1ID),
            "invalid token pair"
        );

        address from = token1ID == _from ? token1 : token2;
        address to = token2ID == _to ? token2 : token1;

        uint256 toAmount = getSwapAmount(_from, _to, _amount);
        emit Swap(_from, _to, _amount, toAmount);

        IERC20(from).transferFrom(msg.sender, address(this), _amount);
        IERC20(to).approve(address(this), toAmount);
        IERC20(to).transferFrom(address(this), msg.sender, toAmount);
    }

    /// @notice Returns swap amount
    /// @dev Calculate swap amount by fetching price from oracle
    /// @return toAmount to be transferred inexchange of fromAmount
    function getSwapAmount(
        uint16 from,
        uint16 to,
        uint256 fromAmount
    ) private view returns (uint256) {
        uint32 fromTokenResult;
        uint32 toTokenResult;
        int8 fromTokenPower;
        int8 toTokenPower;

        (fromTokenResult, fromTokenPower) = delegator.getResultFromID(from);
        (toTokenResult, toTokenPower) = delegator.getResultFromID(to);

        uint256 fromTokenPrice = fromTokenResult / uint256(pow(fromTokenPower));
        uint256 toTokenPrice = toTokenResult / uint256(pow(toTokenPower));

        uint256 toAmount = (fromAmount * fromTokenPrice) / toTokenPrice;
        return toAmount;
    }

    /// @notice Only admin can update tokenID
    /// @dev In case of ID's gets updated in delegator, tokenID needs to be updated
    function updateTokenID(uint16 _id, uint16 _tokenID)
        public
        onlyOwner
        checkID(_id)
    {
        _id == 1 ? token1ID = _tokenID : token2ID = _tokenID;
    }

    /// @notice Only admin can update tokenAddress
    /// @dev In case of token gets out of balance, new token contract can be deployed and set
    function updateTokenAddress(uint16 _id, address _tokenAddress)
        public
        onlyOwner
        checkID(_id)
    {
        _id == 1 ? token1 = _tokenAddress : token2 = _tokenAddress;
    }

    /// @notice Fund user with required token
    /// @dev Transfer `fundAmount` to msg.sender with
    function addFunds(uint16 _id) public checkID(_id) {
        address tokenAddress = _id == 1 ? token1 : token2;
        IERC20(tokenAddress).approve(address(this), fundAmount);
        IERC20(tokenAddress).transferFrom(
            address(this),
            msg.sender,
            fundAmount
        );
    }

    function pow(int8 val) public pure returns (int256) {
        if (val == 0) {
            return 0;
        }

        int256 result = 1;

        if (val < 0) {
            result = -1;
            val = val * -1;
        }

        for (int256 i = 0; i < val; i++) {
            result = result * 10;
        }
        return result;
    }
}
