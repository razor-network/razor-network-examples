import { Button, Center, Container, Flex, Text } from "@chakra-ui/react";
import { useAccount, useSigner, useContract } from "wagmi";

import DexABI from "../abis/Dex.json";

const DEX_ADDRESS =
  import.meta.env.VITE_DEX_ADDRESS ||
  "0x9e2fCeB92da40c9254d4aEae6d76099690B59C81";

const Faucet = () => {
  const { data } = useAccount();

  const { data: signer } = useSigner();

  const dexContract = useContract({
    addressOrName: DEX_ADDRESS,
    contractInterface: DexABI,
    signerOrProvider: signer,
  });

  const addFunds = async (tokenID) => {
    try {
      const tx = await dexContract.addFunds(tokenID);
      await tx.wait();
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
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={!data}
          onClick={() => addFunds(2)}
        >
          Request WBTC
        </Button>
      </Flex>
    </Container>
  );
};

export default Faucet;
