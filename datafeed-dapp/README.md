# Dex

Dex contract which utilizes Razor Network data feeds through a Transparent Forwarder contract.

## How does the Datafeed dApp work?

- Datafeed dApp allows to perform one-way swap for collection in return for USD(ERC-20) token.
- Consider the price of collection ETHUSD (reported by Razor Network Data feed) is 2000$.
- Assuming the price of native currency = the price of collection (ETHUSD), when a user tries to swap 1 ETH (native currency) in exchange for USD token, the user will receive 2000 USD tokens.

## Deployment

- Add network in `hardhat.config.js` by adding URL and accounts private key.
- Update `TRANSPARENT_FORWARDER_ADDRESS` and `COLLECTION_NAME_HASH` in `scripts/dex.js`. Transparent Forwarder address deployed across different chains can be found [here](https://docs.razor.network/docs/consume-data-feeds/deployment-details).
- Run `npx hardhat run scripts/dex.js --network [NETWORK]`.
  This will deploy USD(ERC-20) token contract, Dex contract and fund 10k USD tokens to the Dex contract address.
