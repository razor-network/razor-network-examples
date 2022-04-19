const hre = require("hardhat");

const RANDOM_NO_MANAGER_ADDRESS = process.env.RANDOM_NO_MANAGER_ADDRESS;

async function main() {
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(RANDOM_NO_MANAGER_ADDRESS);

  await lottery.deployed();

  console.log("Lottery contract deployed to:", lottery.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
