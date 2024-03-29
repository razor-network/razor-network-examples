import {
  Button,
  Center,
  Container,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useSigner, useContract } from "wagmi";

import DexABI from "../abis/Dex.json";

const DEX_ADDRESS =
  import.meta.env.VITE_DEX_ADDRESS ||
  "";

const Faucet = ({ fetchBalance }) => {
  const { data } = useAccount();

  const { data: signer } = useSigner();

  const toast = useToast();

  const triggerToast = (title, status = "success") => {
    toast({
      title,
      status,
      isClosable: true,
      duration: 2000,
    });
  };

  const dexContract = useContract({
    addressOrName: DEX_ADDRESS,
    contractInterface: DexABI,
    signerOrProvider: signer,
  });

  const addFunds = async () => {
    console.log("Adding funds", data);
    try {
      const tx = await dexContract.disperseFunds();
      await tx.wait();

      fetchBalance();
      triggerToast(
        `Successfully transferred 0.1 WETH`
      );
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container mt={6}>
      <Center>
        <Text fontSize="lg">Don't have tokens? Request funds</Text>
      </Center>
      <Flex alignItems="center" justifyContent="space-evenly" mt={2}>
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={!data}
          onClick={() => addFunds(1)}
        >
          Request WETH
        </Button>
      </Flex>
    </Container>
  );
};

export default Faucet;
