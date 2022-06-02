export const skaleTestnetV2 = {
  id: 132333505628089,
  name: "Skale Testnet v2",
  network: "skale testnet v2",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Skale",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://staging-v2.skalenodes.com/v1/whispering-turais",
  },
  blockExplorers: {
    default: {
      name: "Skalenodes",
      url: "https://whispering-turais.explorer.staging-v2.skalenodes.com/",
    },
  },
  testnet: true,
};
