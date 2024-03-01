const hre = require("hardhat");

const TRANSPARENT_FORWARDER_ADDRESS =
  "0x76a6AB56E27823B2175F11b0041c489bFdb13c88";
const COLLECTION_NAME_HASH =
  "0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // keccak256("ETHUSD")

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const TOKEN = await hre.ethers.getContractFactory("Token");
  const usd = await TOKEN.deploy("usd", "USD");
  await usd.deployed();
  const weth = await TOKEN.deploy("weth", "WETH");
  await weth.deployed();
  console.log("USD token contract deployed at: ", usd.address);
  console.log("WETH token contract deployed at: ", weth.address);

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
    hre.ethers.utils.parseEther("100000000")
  );
  await tx.wait();
  console.log("Transferred USD token to dex contract. Tx: ", tx.hash);

  console.log("Transferring WETH tokens to dex contract address");
  const tx1 = await weth.transfer(
    dex.address,
    hre.ethers.utils.parseEther("100000000")
  );
  await tx1.wait();
  console.log("Transferred WETH token to dex contract. Tx: ", tx1.hash);

  const tx2 = await weth.transfer(
    dex.address,
    hre.ethers.utils.parseEther("100000000")
  );
  await tx2.wait();
  console.log("Transferred WETH and USD token to deployer. Tx: ", tx2.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
