import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import AccordionCard from "./components/AccordionCard";
import Card from "./components/Card";
import Connect from "./components/Connect";

function App() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Container w="lg" m="auto" p={0}>
      <Flex w="full" justifyContent="center" alignItems="center">
        <Center m={4}>
          <Heading>💰 Lottery dApp</Heading>
        </Center>
        <IconButton
          justifySelf="flex-end"
          onClick={toggleColorMode}
          size="lg"
          variant="unstyled"
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        />
      </Flex>
      <Connect />
      <Card />
      <AccordionCard />
    </Container>
  );
}

export default App;
