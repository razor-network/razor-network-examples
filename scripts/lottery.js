const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xb1Bc0fA8325b57B8bB4F0F77465A2a170A02B6c0";

async function main() {
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  let lottery = Lottery.attach(CONTRACT_ADDRESS);
  let tx;

  const poolCounter = await lottery.poolCounter();
  console.log("poolCounter");
  console.log(poolCounter);

  const signers = await hre.ethers.getSigners();

  // Contribute with 5 different signer
  for (let i = 0; i <= 4; i++) {
    console.log(`Sending tx from signer ${i + 1} - ${signers[i].address}`);
    lottery = lottery.connect(signers[i]);
    tx = await lottery.contribute({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await tx.wait();
  }

  // declare winner
  console.log("Declaring winner");
  tx = await lottery.declareWinner();
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
