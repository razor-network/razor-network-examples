const hre = require("hardhat");

// ID of token1 and token2 in Delegator
const token1ID = 1;
const token2ID = 2;
const DELEGATOR_ADDRESS =
  process.env.DELEGATOR_ADDRESS || "0x713f5C70cD2C8590e88bF917DF7F4Cc1eB6e821F";

const balanceOf = async (contract, address) => {
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatEther(balance);
};

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const WETH = await hre.ethers.getContractFactory("Token");
  const weth = await WETH.deploy("Wrapped ETH", "WETH");
  await weth.deployed();
  console.log("Wrapped ETH contract deployed at: ", weth.address);

  const WBTC = await hre.ethers.getContractFactory("Token");
  const wbtc = await WBTC.deploy("Wrapped ETH", "WBTC");
  await wbtc.deployed();
  console.log("Wrapped BTC contract deployed at: ", wbtc.address);

  console.log("Deploying DEX contract");
  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy(
    DELEGATOR_ADDRESS,
    weth.address,
    wbtc.address,
    token1ID,
    token2ID
  );

  await dex.deployed();
  console.log("DEX contracts deployed at: ", dex.address);

  let dexBalanceOfWETH = await balanceOf(weth, dex.address);
  console.log(`Balance of WETH of dex before transfer: `, dexBalanceOfWETH);
  let dexBalanceOfWBTC = await balanceOf(weth, dex.address);
  console.log(`Balance of WBTC of dex before transfer: `, dexBalanceOfWBTC);

  // Transfer WETH and WBTC to dex contract
  let tx = await weth.transfer(
    dex.address,
    hre.ethers.utils.parseEther("10000")
  );
  await tx.wait();
  console.log("Transferred WETH to dex contract");

  tx = await wbtc.transfer(dex.address, hre.ethers.utils.parseEther("10000"));
  await tx.wait();
  console.log("Transferred WBTC to dex contract");

  dexBalanceOfWETH = await balanceOf(weth, dex.address);
  console.log(`Balance of WETH of dex after transfer: `, dexBalanceOfWETH);
  dexBalanceOfWBTC = await balanceOf(weth, dex.address);
  console.log(`Balance of WBTC of dex after transfer: `, dexBalanceOfWBTC);

  // * Test swap function
  let approveTx = await weth.approve(dex.address, ethers.utils.parseEther("1"));
  await approveTx.wait();
  console.log(`Approve tx successful`);

  let adminBalanceOfWETH = await balanceOf(weth, admin.address);
  console.log(`Balance of WETH of admin before swap: `, adminBalanceOfWETH);
  let adminBalanceOfWBTC = await balanceOf(wbtc, admin.address);
  console.log(`Balance of WBTC of admin before swap: `, adminBalanceOfWBTC);

  console.log(`Swap 1 WETH with equivalent WBTC`);
  const swap = await dex.swap(1, 2, ethers.utils.parseEther("1"));
  await swap.wait();

  console.log("swap");
  console.log(swap);

  adminBalanceOfWETH = await balanceOf(weth, admin.address);
  console.log(`Balance of WETH of admin after swap: `, adminBalanceOfWETH);
  adminBalanceOfWBTC = await balanceOf(wbtc, admin.address);
  console.log(`Balance of WBTC of admin after swap: `, adminBalanceOfWBTC);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
