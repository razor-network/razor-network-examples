const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function main() {
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  let lottery = Lottery.attach(CONTRACT_ADDRESS);

  const poolCounter = await lottery.poolCounter();
  console.log("poolCounter");
  console.log(poolCounter);

  const signers = await hre.ethers.getSigners();

  // Contribute with 5 different signer
  for (let i = 1; i <= 5; i++) {
    lottery = lottery.connect(signers[i]);
    tx = await lottery.contribute({
      value: hre.ethers.utils.parseEther("0.1"),
    });
  }

  // declare winner
  tx = await lottery.declareWinner();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
