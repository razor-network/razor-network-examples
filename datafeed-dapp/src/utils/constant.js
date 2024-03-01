export const polygonMumbai = {
  id: 80001,
  name: "Polygon Mumbai",
  network: "Polygon Mumbai",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: "https://rpc-mumbai.maticvigil.com",
  },
  blockExplorers: {
    default: {
      name: "Polygon Mumbai",
      url: "https://mumbai.polygonscan.com/",
    },
  },
  testnet: true,
};

const sepolia = {
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
