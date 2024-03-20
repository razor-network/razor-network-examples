// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "../lib/forge-std/src/Script.sol";
import {console2} from "../lib/forge-std/src/console2.sol";
import {stdJson} from "../lib/forge-std/src/StdJson.sol";
import "../contracts/Token.sol";
import "../contracts/Dex.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Deployer is Script {
    using stdJson for string;
    address public deployer;
    string internal _deployments;
    string internal _deploymentsPath;
    address constant TRANSPARENT_FORWARDER_ADDRESS =
        address(0x8cE69db7CA670A22073199C2934FAbC72084a3BC);
    // The list supported networks TRANSPARENT_FORWARDER Addresses can be found here - https://docs.razor.network/docs/consume-data-feeds/deployment-details

    function run() external {
        deployer = vm.envAddress("DEPLOYER_ADDRESS");
        string memory network = vm.envString("NETWORK");
        _deploymentsPath = string.concat(
            string.concat("./deployments/", network),
            ".json"
        );

        vm.startBroadcast(deployer);

        // Deploy USD Token
        Token usd = new Token("usd", "USD");
        _deployments.serialize("USD", address(usd));
        // Deploy WETH Token
        Token weth = new Token("weth", "WETH");
        _deployments.serialize("WETH", address(weth));
        // Deploy Dex
        Dex dex = new Dex(
            TRANSPARENT_FORWARDER_ADDRESS,
            address(usd),
            address(weth)
        );
        _deployments = _deployments.serialize("DEX", address(dex));
        // Transfer USD tokens to Dex contract
        usd.transfer(address(dex), 100000000 ether);
        // Transfer WETH tokens to Dex contract
        weth.transfer(address(dex), 100000000 ether);
        uint256 balance = IERC20(address(usd)).balanceOf(address(dex));
        console2.logUint(balance);
        _deployments.write(_deploymentsPath);
        vm.stopBroadcast();
    }
}
