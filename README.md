## Razor Network Examples

This repository serves as a central hub for dApps developed utilizing Razor Network contracts, showcasing practical implementations and potential use cases.

## DApps

1. **Dex dApp (Swap ETH for USD 💰)**: A decentralized exchange application enabling users to swap ETH for USD.

### Getting Started

To interact with the examples in this repository, follow these setup instructions:

#### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed.
- Verify that [Foundry](https://book.getfoundry.sh/getting-started/installation) is installed for smart contract interactions.

#### Installation

1. Clone the repository and install dependencies:

   ```sh
   git clone <repository-url>
   cd <repository-name>
   npm install
   ```

2. Set up your environment variables. Copy the .env.tpl to .env and update the variables accordingly:

    ```sh
    Copy code
    cp .env.tpl .env
    ```
3. Deploy Contracts 

    To deploy the necessary contracts, including the DEX contract, USD, and WETH tokens, use the following forge command:

    ``` sh
    forge script script/Deployer.s.sol:Deployer --rpc-url $SEPOLIA_RPC --optimize --private-key $PRIV_KEY -vvv
    ```

    Replace $SEPOLIA_RPC with your Sepolia RPC URL and $PRIV_KEY with your private key.

    After deployment, update the .env file with the contract addresses found in the deployments folder. Contracts are already deployed on Sepolia:
    ```sh
    DEPLOYER_ADDRESS=
    NETWORK=sepolia
    VITE_DEX_ADDRESS=0xAf4D4B2E057440c033b76a8b3c53E38fDDE2657D
    VITE_WETH_TOKEN_ADDRESS=0x7601106078c7f6333A26796F3f1E9B507a4D93d7
    VITE_USD_TOKEN_ADDRESS=0x5577575DF3cC00854f4456326E8A423d39406197
    ```

4. Running the Frontend
    To start the frontend application and interact with the deployed contracts:
    ```sh
    npm run dev
    ```
    Obtain WETH from the faucet and swap it for USD tokens. Currently, the dApp supports one-way swaps, but this functionality can be extended or updated. Feel free to make the necessary changes in testnet. 
