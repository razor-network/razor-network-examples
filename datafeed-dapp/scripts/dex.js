const hre = require("hardhat");

const TRANSPARENT_FORWARDER_ADDRESS =
  "0x76a6AB56E27823B2175F11b0041c489bFdb13c88";
const COLLECTION_NAME_HASH =
  "0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // keccak256("ETHUSD")

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const USD = await hre.ethers.getContractFactory("Token");
  const usd = await USD.deploy("usd", "USD");
  await usd.deployed();
  console.log("USD token contract deployed at: ", usd.address);

  console.log("Deploying DEX contract");
  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy(
    TRANSPARENT_FORWARDER_ADDRESS,
    usd.address,
    COLLECTION_NAME_HASH
  );
  await dex.deployed();
  console.log("DEX contracts deployed at: ", dex.address);

  console.log("Transferring USD tokens to dex contract address");
  const tx = await usd.transfer(
    dex.address,
    hre.ethers.utils.parseEther("10000")
  );
  await tx.wait();
  console.log("Transferred USD token to dex contract. Tx: ", tx.hash);

  const balanceBefore = await usd.balanceOf(admin.address);
  console.log(
    "Balance before swap:",
    hre.ethers.utils.formatEther(balanceBefore)
  );

  console.log("Swapping tokens for 0.05 ETH");
  const tx1 = await dex.swap({ value: hre.ethers.utils.parseEther("0.05") });
  await tx1.wait();
  console.log("txHash:", tx1.hash);

  const balanceAfter = await usd.balanceOf(admin.address);
  console.log(
    "Balance before swap:",
    hre.ethers.utils.formatEther(balanceAfter)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
