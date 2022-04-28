import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";

export const SKALE_CHAIN_ID = 416452918254875;

// currently supporting only skale chain
export const injected = new InjectedConnector({
  supportedChainIds: [SKALE_CHAIN_ID],
});

export const skaleNetworkInfo = {
  chainName: "Skale",
  name: "SKALE",
  rpcUrls: ["https://dappnet-api.skalenodes.com/v1/faint-acubens"],
  symbol: "SKL",
  decimals: 18,
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/8409.png"],
  blockExplorerUrls: ["https://faint-acubens.explorer.dappnet.skalenodes.com/"],
};

export const switchNetwork = async () => {
  const ethereum = window.ethereum;
  const chainIdHex = ethers.utils.hexValue(416452918254875);
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
