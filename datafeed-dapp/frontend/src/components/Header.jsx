import {
  Center,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Flex mt={3} justifyContent="flex-end">
        <ConnectButton />
        <IconButton
          ml={4}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
        />
      </Flex>
      <Flex
        mt={4}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading>Razor Network Dex</Heading>
        <Text>Swap assets using Razor Network oracle</Text>
      </Flex>
    </>
  );
};

export default Header;
