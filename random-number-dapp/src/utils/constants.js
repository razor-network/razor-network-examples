export const sepolia = {
    id: 11155111,
    network: "sepolia",
    name: "Sepolia",
    nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "SEP",
        decimals: 18,
   },
    rpcUrls: {
        alchemy: {
            http:  ["https://eth-sepolia.g.alchemy.com/v2"],
            webSocket:  ["wss://eth-sepolia.g.alchemy.com/v2"],
       },
        infura: {
            http:  ["https://sepolia.infura.io/v3"],
            webSocket:  ["wss://sepolia.infura.io/ws/v3"],
       },
        default: {
            http:  ["https://rpc.sepolia.org"],
       },
        public: {
            http:  ["https://rpc.sepolia.org"],
       },
   },
    blockExplorers: {
        etherscan: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io",
       },
        default: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io",
       },
   },
    testnet: true,
};