import { AddIcon, BellIcon } from "@chakra-ui/icons";
import { Button, VStack, Text, Tooltip, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import LotteryABI from "../abi/Lottery.json";
import ContractDetails from "./ContractDetails";
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0x365C268E878Dda3281ed87e6Ddd8aAcA1Ae1b472";

const Card = () => {
  const { account } = useAccount();
  const [poolCounter, setPoolCounter] = useState(null);
  const [participantCounter, setParticipantCounter] = useState(null);
  const [isContributeLoading, setIsCoontributeLoading] = useState(false);
  const [isDeclareLoading, setIsDeclareLoading] = useState(false);

  const toast = useToast();

  const getContractInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Lottery = useContract({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: LotteryABI,
        signerOrProvider: signer,
      });
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

  const handleUserDeniedTx = (err) => {
    toast({
      title: "User denied transaction request",
      description: err.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleCallException = async (err) => {
    const { transactionHash } = err;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getTransaction(transactionHash).then((tx) => {
      provider.call(tx).catch((err) => {
        const { error } = err;
        // Skale testnet v1 has error message in error.data
        // Skale testnet v2 has error message in error.data.message
        toast({
          title: error.data.message,
          description: "Transaction Reverted",
          status: "error",
          isClosable: true,
        });
      });
    });
  };

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
      if (err.code === 4001) {
        handleUserDeniedTx(err);
      } else if (err.code === "CALL_EXCEPTION") {
        handleCallException(err);
      } else {
        console.log(err);
      }
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
      if (err.code === 4001) {
        handleUserDeniedTx(err);
      } else if (err.code === "CALL_EXCEPTION") {
        handleCallException(err);
      } else {
        console.log(err);
      }
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
