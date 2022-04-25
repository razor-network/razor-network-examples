import { Center, Container, Heading, VStack } from "@chakra-ui/react";
import AccordionCard from "./components/AccordionCard";
import Card from "./components/Card";
import Connect from "./components/Connect";

function App() {
  return (
    <Container w="lg" m="auto" p={0}>
      <Center m={4}>
        <Heading>💰 Lottery dApp</Heading>
      </Center>
      <Connect />
      <Card />
      <AccordionCard />
    </Container>
  );
}

export default App;
