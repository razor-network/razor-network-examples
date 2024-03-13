import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";

export const SKALE_CHAIN_ID = 132333505628089;

// currently supporting only skale chain
export const injected = new InjectedConnector({
  supportedChainIds: [SKALE_CHAIN_ID],
});

export const skaleNetworkInfo = {
  chainName: "Skale Testnet V2",
  name: "SKALE",
  rpcUrls: ["https://staging-v2.skalenodes.com/v1/whispering-turais"],
  symbol: "ETH",
  decimals: 18,
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/8409.png"],
  blockExplorerUrls: [
    "https://whispering-turais.explorer.staging-v2.skalenodes.com/",
  ],
};

export const switchNetwork = async () => {
  const ethereum = window.ethereum;
  const chainIdHex = ethers.utils.hexValue(132333505628089);
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    console.log(switchError, switchError.code);
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdHex,
              rpcUrls: skaleNetworkInfo.rpcUrls,
              chainName: skaleNetworkInfo.chainName,
              blockExplorerUrls: skaleNetworkInfo.blockExplorerUrls,
              nativeCurrency: {
                name: skaleNetworkInfo.name,
                symbol: skaleNetworkInfo.symbol,
                decimals: skaleNetworkInfo.decimals,
              },
            },
          ],
        });
        // wallet.connect();
      } catch (addError) {
        // handle "add" error
        console.log("addError", addError);
      }
    }
    // handle other "switch" errors
  }
};
