// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "../lib/forge-std/src/Script.sol";
import {console2} from "../lib/forge-std/src/console2.sol";
import { stdJson } from "../lib/forge-std/src/StdJson.sol";
import "../contracts/Token.sol";
import "../contracts/Dex.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract UpdateResult is Script {
     using stdJson for string;
     address public deployer;
    // The list supported networks TRANSPARENT_FORWARDER Addresses can be found here - https://docs.razor.network/docs/consume-data-feeds/deployment-details

    function run() external {
        deployer = vm.envAddress("DEPLOYER_ADDRESS");
        string memory network = vm.envString("NETWORK");

         vm.startBroadcast(deployer);
         // interact with Dex contract
        Dex dex = Dex(vm.envAddress("VITE_DEX_ADDRESS"));
        bytes memory data = abi.encode("0x466b6944c1e2c32bb803cb4a6a812ba89250f62d367297c38833cba8cc1adf7500000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e8734281716000000000000000000000000000000000000000000000000000000000000539710000000000000000000000000000000000000000000000000000000065e19d3200000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001e9ccdbf3b62db4ad82c6b1497da7b874dd5478d2fecf8915713b3cea6fb4c6cd000000000000000000000000000000000000000000000000000000000000004199a02b8ee38004625099b266577533ecede49cc080353c2b0f33805dd6607d3b1552b28b76a8910ea7d8bff27393de5a8851c0b4575de649f9f3a334b96c80891b00000000000000000000000000000000000000000000000000000000000000");
        dex.swap(data, 0.1 ether);
        vm.stopBroadcast();
    }
}
