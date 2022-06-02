import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <>
      <Flex mt={3} justifyContent="flex-end">
        <ConnectButton />
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading>Dex</Heading>
        <Text>Swap assets using Razor Network oracle</Text>
      </Flex>
    </>
  );
};

export default Header;
