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
  const [rawBalance, setRawBalance] = useState(null);
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
        console.log(wethBalanceResult)
        setRawBalance(wethBalanceResult);
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
    const response = await axios.get('https://api-staging.razorscan.io/collection/0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160');
    const { calldata } = response.data;
    console.log(calldata)
      const ethAmountInBN = ethers.utils.parseEther(ethAmount);
      console.log(ethAmountInBN);
      const tx = await dexContract.swap(calldata, ethAmountInBN, {
        value: 0,
      });
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
        <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="1rem">
            <Button onClick={() => setETHAmount(ethers.utils.formatEther(rawBalance.mul(25).div(100)))}>25%</Button>
            <Button onClick={() => setETHAmount(ethers.utils.formatEther(rawBalance.mul(50).div(100)))}>50%</Button>    
            <Button onClick={() => setETHAmount(ethers.utils.formatEther(rawBalance.mul(75).div(100)))}>75%</Button>    
            <Button onClick={() => setETHAmount(ethers.utils.formatEther(rawBalance))}>100%</Button>
        </Flex>
          <Input
            type="number"
            placeholder="Enter amount"
            flex={7}
            value={ethAmount}
            onChange={(e) => setETHAmount(e.target.value)}
            minHeight="50px"
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
            (!data && ethAmount !== 0 && ethAmount !== "" || ethAmount > wethBalance) || isSwapLoading
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
