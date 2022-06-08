require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    skale: {
      url: process.env.PROVIDER_URL || "",
      accounts: [process.env.PRIVATE_KEY],
    },
    skaleTestnetV2: {
      url: process.env.SKALE_TESTNET_V2_URL || "",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
