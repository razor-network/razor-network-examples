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
        bytes memory data = abi.encode("0x8ebe77bf050e8233ba4910b5ebf40316d717874374dddae5223531999da0df1800000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e873428171600000000000000000000000000000000000000000000000000000000000053ae90000000000000000000000000000000000000000000000000000000065e1a69300000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001a3770e2216f4508c84946942487f07dfb0026ea534b77daf4544f6ecd037ed590000000000000000000000000000000000000000000000000000000000000041be1bb1c80830a517d4eb0586e3bf02b2e6e7c38eac3675de45e6ff5217dfb895567a67695a442d1b7875af46aa0c21c44f9b2b15333a4cade91ffdbd1e5773cd1b00000000000000000000000000000000000000000000000000000000000000");
        dex.swap(data, 0.1 ether);
        vm.stopBroadcast();
    }
}
