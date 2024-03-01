// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "../lib/forge-std/src/Script.sol";
import {console2} from "../lib/forge-std/src/console2.sol";
import { stdJson } from "../lib/forge-std/src/StdJson.sol";
import "../contracts/Token.sol";
import "../contracts/Dex.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../contracts/interface/ITransparentForwarder.sol";


contract Result is Script {
        ITransparentForwarder public transparentForwarder;
     using stdJson for string;
     address public deployer;
    // The list supported networks TRANSPARENT_FORWARDER Addresses can be found here - https://docs.razor.network/docs/consume-data-feeds/deployment-details

    function run() external {
        deployer = vm.envAddress("DEPLOYER_ADDRESS");
        string memory network = vm.envString("NETWORK");
        transparentForwarder = ITransparentForwarder(address(0x328BAc5C2be4961252041EC589A22e55Ec132010));
         vm.startBroadcast(deployer);
         // interact with Dex contract
        bytes memory data = abi.encode("0xd2cf5dc939ce5783738ceb79fabf08a43a5da98956b9250c7a6dd6401a7b207600000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e873428171600000000000000000000000000000000000000000000000000000000000053a2e0000000000000000000000000000000000000000000000000000000065e1b0010000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000175b9d0dc024c1cfe0ef07796f5ab7b4eb7e4d79e4fcafde5424d5297640ba9b50000000000000000000000000000000000000000000000000000000000000041e50d844f14f7700a4fe988dbba4f54d2261e3eb5bacae4d9c5abf528ca6f93a409e8f4646e8fc671b30b2e7cd9f365afef2385e29e801bb3920a21fb4ce4b4a71c00000000000000000000000000000000000000000000000000000000000000");
               (uint256 getResult, , ) = transparentForwarder.getResult(0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160);
            (uint256 result, , ) = transparentForwarder.updateAndGetResult(data);

            // (bool isResultValid, , , ) = transparentForwarder.validateResult(data);
            // console2.logBool(isResultValid);
            //    console2.logUint(result);
               console2.logUint(getResult);
        vm.stopBroadcast();
    }
}
