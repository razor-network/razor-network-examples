// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "../lib/forge-std/src/Script.sol";
import {console2} from "../lib/forge-std/src/console2.sol";
import { stdJson } from "../lib/forge-std/src/StdJson.sol";
import "../contracts/Token.sol";
import "../contracts/Dex.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../contracts/interface/ITransparentForwarder.sol";


contract UpdateResult is Script {
     using stdJson for string;
     address public deployer;
      ITransparentForwarder public transparentForwarder;
    // The list supported networks TRANSPARENT_FORWARDER Addresses can be found here - https://docs.razor.network/docs/consume-data-feeds/deployment-details

    function run() external {
        deployer = vm.envAddress("DEPLOYER_ADDRESS");
        string memory network = vm.envString("NETWORK");
          transparentForwarder = ITransparentForwarder(address(0x8cE69db7CA670A22073199C2934FAbC72084a3BC));
         vm.startBroadcast(deployer);
         // interact with Dex contract
        Dex dex = Dex(vm.envAddress("VITE_DEX_ADDRESS"));
        bytes memory data = abi.encode("0xd9d7a909d36dbe147719ee41f87cd99f710283b267cdb35b8ad6b98c06e5990600000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160000000000000000000000000000000000000000000000000000000000005340a0000000000000000000000000000000000000000000000000000000065e1b9510000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000116ed877f4160d0e3b639770e0e3645b8db311e1468e66736c30fa8b19de8834d0000000000000000000000000000000000000000000000000000000000000041fa776fdef89e0764c76d06f81198ff7cf2cc76161b1c0257e699cd9deb864f4247f20ae6ea6bd2f3e685eaf673dea5eab4a5b42fdec4698a5a0a8ab4c84b11f01c00000000000000000000000000000000000000000000000000000000000000");
        dex.swap(data, 0.1 ether);
        vm.stopBroadcast();
    }
}
