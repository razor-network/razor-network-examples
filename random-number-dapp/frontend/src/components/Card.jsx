import { AddIcon, BellIcon } from "@chakra-ui/icons";
import { Button, VStack, Text, Tooltip, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import LotteryABI from "../abi/Lottery.json";
import ContractDetails from "./ContractDetails";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const Card = () => {
  const { account } = useWeb3React();
  const [poolCounter, setPoolCounter] = useState(null);
  const [participantCounter, setParticipantCounter] = useState(null);
  const [isContributeLoading, setIsCoontributeLoading] = useState(false);
  const [isDeclareLoading, setIsDeclareLoading] = useState(false);

  const toast = useToast();

  const getContractInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Lottery = new ethers.Contract(CONTRACT_ADDRESS, LotteryABI, signer);
    return Lottery;
  };

  const fetchContractData = async () => {
    try {
      const lottery = getContractInstance();
      const poolCtr = await lottery.poolCounter();
      const participantCtr = await lottery.poolParticipantCounter();
      setPoolCounter(poolCtr.toNumber());
      setParticipantCounter(participantCtr);
    } catch (error) {
      console.log("Error occured while fetching contract data");
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchContractData();
    }
  }, [account]);

  const contribute = async () => {
    setIsCoontributeLoading(true);
    try {
      const lottery = getContractInstance();
      const tx = await lottery.contribute({
        value: ethers.utils.parseEther("0.1"),
      });
      await tx.wait();
      console.log("Contribute tx");
      console.log(tx);

      toast({
        title: "Transaction successful!",
        description: "You have successfully contributed to lottery pool💰",
        status: "success",
        isClosable: true,
      });
      fetchContractData();
    } catch (err) {
      console.log("Error occured while contributing");
      console.log(err);

      toast({
        title: "Transaction unsuccessful",
        description: "Error occured while contributing to pool",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsCoontributeLoading(false);
    }
  };

  const fetchWinnerDetails = async (lottery) => {
    try {
      const currentPool = await lottery.poolCounter();
      const prevPool = currentPool.sub(1);
      const winner = await lottery.winners(prevPool);

      toast({
        title: `Winner for ${prevPool.toNumber()} is ${winner}`,
        description: "Winner will received 0.5 ETH as reward",
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    } catch (err) {
      console.log("Error occured while fetching winner");
      console.log(err);
    }
  };

  const declareWinner = async () => {
    setIsDeclareLoading(true);
    try {
      const lottery = getContractInstance();
      const tx = await lottery.declareWinner();
      await tx.wait();
      console.log("Declare winner tx");
      console.log(tx);

      toast({
        title: "Winner declared!",
        isClosable: true,
        status: "success",
        duration: 2000,
      });

      fetchWinnerDetails(lottery);
      fetchContractData();
    } catch (err) {
      console.log("err");
      console.log(err);

      toast({
        title: "Error occured while declaring winner",
        isClosable: true,
        status: "error",
      });
    } finally {
      setIsDeclareLoading(false);
    }
  };

  return (
    <VStack spacing={4} w="full">
      {poolCounter && !isNaN(participantCounter) && (
        <ContractDetails
          poolCounter={poolCounter}
          participantCounter={participantCounter}
        />
      )}

      <Button
        isDisabled={!account}
        w="full"
        colorScheme="blue"
        size="lg"
        leftIcon={<AddIcon />}
        onClick={contribute}
        isLoading={isContributeLoading}
      >
        Contribute
      </Button>
      <Button
        isDisabled={!account}
        w="full"
        variant="outline"
        colorScheme="blue"
        size="lg"
        leftIcon={<BellIcon />}
        onClick={declareWinner}
        isLoading={isDeclareLoading}
      >
        Declare winner
      </Button>
    </VStack>
  );
};

export default Card;
