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

import DexABI from "../abis/Dex.json";
import ERC20ABI from "../abis/ERC20.json";
import Faucet from "./Faucet";
const DEX_ADDRESS =
  import.meta.env.VITE_DEX_ADDRESS ||
  "0xD21fE3E90Edf1db054e54DC90B1619e2A44ba002";
const USD_TOKEN_ADDRESS =
  import.meta.env.USD_TOKEN_ADDRESS ||
  "0x06b20Dd715cA1bF38085a115925d42e2df7Ef7b5";

const Swap = () => {
  const [ethAmount, setETHAmount] = useState(0);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [usdTokenBalance, setUSDTokenBalance] = useState(null);

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
      if (data.address && usdTokenContract.provider) {
        let usdBalanceResult = await usdTokenContract.balanceOf(data.address);
        const usdRemainder = usdBalanceResult.mod(1e14);

        setUSDTokenBalance(
          ethers.utils.formatEther(usdBalanceResult.sub(usdRemainder))
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
      name: `USD`,
      address: USD_TOKEN_ADDRESS,
      symbol: `USD`,
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
  }, [usdTokenBalance]);

  const swap = async () => {
    setIsSwapLoading(true);
    try {
      const ethAmountInBN = ethers.utils.parseEther(ethAmount);
      const tx = await dexContract.swap({
        value: ethAmountInBN,
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
            <Badge colorScheme="teal" fontSize="lg">
              {usdTokenBalance || 0} USD
            </Badge>
          </Flex>

          <Tooltip label="Add USD token to metamask">
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
        <Text mb={2}>Select from token and amount</Text>
        <Flex>
          <Input
            type="number"
            placeholder="Enter amount"
            flex={7}
            value={ethAmount}
            onChange={(e) => setETHAmount(e.target.value)}
          />
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
      </Container>
    </>
  );
};

export default Swap;
