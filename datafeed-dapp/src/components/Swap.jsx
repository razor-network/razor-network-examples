import {
  Button,
  Container,
  Input,
  Select,
  Text,
  Flex,
  useToast,
  Badge,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import axios from "axios";
import DexABI from "../abis/Dex.json";
import ERC20ABI from "../abis/ERC20.json";
import Faucet from "./Faucet";

const DEX_ADDRESS =
  import.meta.env.VITE_DEX_ADDRESS ||
  "0x45AE733978c605918f1667F91BB8D2c3a506553e";
const USD_TOKEN_ADDRESS =
  import.meta.env.VITE_USD_TOKEN_ADDRESS ||
  "0xdD5d5a945d2e87aC73BEA8F31788bbd4b63C74d8";
  const WETH_TOKEN_ADDRESS =
  import.meta.env.VITE_WETH_TOKEN_ADDRESS ||
  "0xdD5d5a945d2e87aC73BEA8F31788bbd4b63C74d8";

const Swap = () => {
  const [ethAmount, setETHAmount] = useState(0);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [usdTokenBalance, setUSDTokenBalance] = useState(null);
  const [wethBalance, setWethBalance] = useState(null);
  const toast = useToast();

  const { data } = useAccount();
  const { data: signer } = useSigner();

  const dexContract = useContract({
    addressOrName: DEX_ADDRESS,
    contractInterface: DexABI,
    signerOrProvider: signer,
  });

  const usdTokenContract = useContract({
    addressOrName: USD_TOKEN_ADDRESS,
    contractInterface: ERC20ABI,
    signerOrProvider: signer,
  });

  const wethTokenContract = useContract({
    addressOrName: WETH_TOKEN_ADDRESS,
    contractInterface: ERC20ABI,
    signerOrProvider: signer,
  });


  useEffect(() => {
    fetchBalance();
  }, [data, usdTokenContract]);

  const triggerToast = (title, status = "success") => {
    toast({
      title,
      status,
      isClosable: true,
      duration: 2000,
    });
  };

  const fetchBalance = async () => {
    try {
      if (data.address && wethTokenContract.provider) {
        let wethBalanceResult = await wethTokenContract.balanceOf(data.address);
        const wethRemainder = wethBalanceResult.mod(1e14);
        let usdTokenBalanceResult = await usdTokenContract.balanceOf(data.address);
        const usdTokenRemainder = usdTokenBalanceResult.mod(1e14);
        setWethBalance(ethers.utils.formatEther(wethBalanceResult.sub(wethRemainder)));
        setUSDTokenBalance(
          ethers.utils.formatEther(usdTokenBalanceResult.sub(usdTokenRemainder))
        );
      } else {
        setUSDTokenBalance(null);
      }
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  };

  const addToken = async () => {
    const tokenOptions = {
      name: `WrappedEther`,
      address: WETH_TOKEN_ADDRESS,
      symbol: `WETH`,
      decimals: 18,
    };
    if (data.address) {
      try {
        const ethereum = window.ethereum;
        await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: tokenOptions,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log(usdTokenBalance);
    console.log(wethBalance);
  }, [usdTokenBalance, wethBalance]);

  const swap = async () => {
    setIsSwapLoading(true);
    try {
    const calldata = '0x7b90f0c55c82d1da34acbf1cecc43366108d4f27063fa29084aeef332055644b00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e8734281716000000000000000000000000000000000000000000000000000000000000538b70000000000000000000000000000000000000000000000000000000065e1988000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001dace82ee20e1ace54796dd5fa2172790a9cd85414a2d25826fea61682dae2122000000000000000000000000000000000000000000000000000000000000004199c7b4d62fe4e156c970a98338abeb4bbd62a22111e0a3ee1e158cb7120ee1db6418df2a1320defd24300c8e5d4ae1a46393f86fbeaf4ed0c7968cb3d6d389f91c00000000000000000000000000000000000000000000000000000000000000'
    const data = ethers.utils.defaultAbiCoder.encode([bytes], calldata)
      const ethAmountInBN = ethers.utils.parseEther(ethAmount);
      console.log(ethAmountInBN);
      const tx = await dexContract.swap(data, ethAmountInBN);
      console.log(tx);
      await tx.wait();

      triggerToast("Swap transaction successful");
      setETHAmount("0");
      fetchBalance();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSwapLoading(false);
    }
  };

  return (
    <>
      <Container mt={4}>
        <Flex justifyContent="flex-end" mt={4} mb={2}>
          <Flex justifyContent="center" alignItems="center">
            <Badge colorScheme="teal" fontSize="lg" mr="1rem">
              {usdTokenBalance || 0} USD
            </Badge>
            <Badge colorScheme="teal" fontSize="lg">
              {wethBalance || 0} WETH
            </Badge>
          </Flex>

          <Tooltip label="Add WETH token to metamask">
            <IconButton
              aria-label="Search database"
              icon={<AddIcon />}
              size={5}
              ml={4}
              padding={1}
              onClick={addToken}
            />
          </Tooltip>
        </Flex>
        <Text mb={2}>Amount of <Badge>WETH</Badge> to swap</Text>
        <Flex>
          <Input
            type="number"
            placeholder="Enter amount"
            flex={7}
            value={ethAmount}
            onChange={(e) => setETHAmount(e.target.value)}
          />
          {/* <Input
            type="number"
            placeholder="Enter amount"
            flex={7}
            value={ethAmount}
            onChange={(e) => setETHAmount(e.target.value)}
          /> */}
        </Flex>

        <Button
          mt={4}
          w="full"
          colorScheme="blue"
          disabled={
            (!data && ethAmount !== 0 && ethAmount !== "") || isSwapLoading
          }
          onClick={swap}
          isLoading={isSwapLoading}
        >
          Swap
        </Button>
        <Faucet fetchBalance={fetchBalance}/>
      </Container>
    </>
  );
};

export default Swap;
