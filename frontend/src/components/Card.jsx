import { AddIcon, BellIcon } from "@chakra-ui/icons";
import { Button, VStack, Text, Tooltip } from "@chakra-ui/react";
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
      fetchContractData();
    } catch (err) {
      console.log("err");
      console.log(err);
    } finally {
      setIsCoontributeLoading(false);
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
        variant="outline"
        leftIcon={<BellIcon />}
        colorScheme="blue"
        w="full"
        size="lg"
      >
        Declare winner
      </Button>
    </VStack>
  );
};

export default Card;
