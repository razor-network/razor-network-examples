import { Button, Container, Input, Select, Text, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import DexABI from "../abis/Dex.json";
import ERC20ABI from "../abis/ERC20.json";
const DEX_ADDRESS =
  import.meta.env.VITE_DEX_ADDRESS ||
  "0x9e2fCeB92da40c9254d4aEae6d76099690B59C81";
const WETH_ADDRESS =
  import.meta.env.VITE_WETH_ADDRESS ||
  "0x1f2Bc4c0DA2D1BcF235AF5030c85438D1e32DE00";
const WBTC_ADDRESS =
  import.meta.env.VITE_WBTC_ADDRESS ||
  "0xF854Ff5EC716ad0D31A6F0B9808F619d7127BdeD";

const Swap = () => {
  const [fromToken, setFromToken] = useState("WETH");
  const [toToken, setToToken] = useState("WBTC");
  const [fromTokenAmount, setFromTokenAmount] = useState(0);
  const [toTokenAmount, setToTokenAmount] = useState(0);

  const { data } = useAccount();
  const { data: signer } = useSigner();

  const dexContract = useContract({
    addressOrName: DEX_ADDRESS,
    contractInterface: DexABI,
    signerOrProvider: signer,
  });

  const wethContract = useContract({
    addressOrName: WETH_ADDRESS,
    contractInterface: ERC20ABI,
    signerOrProvider: signer,
  });

  const wbtcContract = useContract({
    addressOrName: WBTC_ADDRESS,
    contractInterface: ERC20ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    fromToken === "WETH" ? setToToken("WBTC") : setToToken("WETH");
  }, [fromToken]);

  useEffect(() => {
    toToken === "WBTC" ? setFromToken("WETH") : setFromToken("WBTC");
  }, [toToken]);

  useEffect(() => {
    if (fromTokenAmount !== 0 && fromTokenAmount !== "") {
      getSwapAmount();
    }
  }, [fromTokenAmount, fromToken, toToken]);

  const getSwapAmount = async () => {
    try {
      let fromID = fromToken === "WETH" ? 1 : 2;
      let toID = toToken === "WBTC" ? 2 : 1;

      const value = await dexContract.getSwapAmount(
        fromID,
        toID,
        ethers.utils.parseEther(fromTokenAmount.toString())
      );
      setToTokenAmount(ethers.utils.formatEther(value));
    } catch (error) {
      console.log(error);
      console.log("Error occured while fetching swap amount");
    }
  };

  const swap = async () => {
    try {
      let fromID = fromToken === "WETH" ? 1 : 2;
      let toID = toToken === "WBTC" ? 2 : 1;

      if (fromID === 1) {
        const approveTx = await wethContract.approve(
          DEX_ADDRESS,
          ethers.utils.parseEther(fromTokenAmount)
        );
        await approveTx.wait();
      } else {
        const approveTx = await wbtcContract.approve(
          DEX_ADDRESS,
          ethers.utils.parseEther(fromTokenAmount)
        );
        await approveTx.wait();
      }

      // approve before swap
      const swapTx = await dexContract.swap(
        fromID,
        toID,
        ethers.utils.parseEther(fromTokenAmount)
      );
      await swapTx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container mt={8}>
      <Text mb={2}>Select from token and amount</Text>
      <Flex>
        <Input
          type="number"
          placeholder="Enter amount"
          flex={7}
          value={fromTokenAmount}
          onChange={(e) => setFromTokenAmount(e.target.value)}
        />
        <Select
          flex={3}
          value={fromToken}
          placeholder="Select from Token"
          onChange={(e) => setFromToken(e.target.value)}
        >
          <option value="WETH">WETH</option>
          <option value="WBTC">WBTC</option>
        </Select>
      </Flex>

      <Text mt={4} mb={2}>
        Select to token and amount
      </Text>
      <Flex>
        <Input
          type="number"
          placeholder="Enter amount"
          disabled={true}
          flex={7}
          value={toTokenAmount}
        />
        <Select
          flex={3}
          onChange={(e) => setToToken(e.target.value)}
          value={toToken}
          placeholder="Select to token"
        >
          <option value="WETH">WETH</option>
          <option value="WBTC">WBTC</option>
        </Select>
      </Flex>
      <Text mt={2}>
        {fromTokenAmount} {fromToken} = {toTokenAmount} {toToken}
      </Text>
      <Button
        mt={4}
        w="full"
        colorScheme="blue"
        disabled={!data && fromTokenAmount !== 0 && fromTokenAmount !== ""}
        onClick={swap}
      >
        Swap
      </Button>
    </Container>
  );
};

export default Swap;
