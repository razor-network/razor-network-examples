import { Button, Flex, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected, SKALE_CHAIN_ID, switchNetwork } from "../utils/connector";
import AccountText from "./AccountText";

const Connect = () => {
  const { activate, account, active, chainId } = useWeb3React();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    try {
      activate(injected);
      injected.isAuthorized().then((data) => setIsAuthorized(data));
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  }, [account, active]);

  return (
    <Flex justifyContent="flex-end" mt={12} mb={6}>
      {isAuthorized && account && <AccountText account={account} />}
      {isAuthorized && chainId !== SKALE_CHAIN_ID && (
        <Button variant="outline" colorScheme="red" onClick={switchNetwork}>
          Switch Network
        </Button>
      )}
      {!isAuthorized && (
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => activate(injected)}
        >
          Connect wallet 🦊
        </Button>
      )}
    </Flex>
  );
};

export default Connect;
