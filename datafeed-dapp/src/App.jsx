import { Container } from "@chakra-ui/react";
import Header from "./components/Header";
import Swap from "./components/Swap";

function App() {
  return (
    <Container w="xl" m="auto" p={0}>
      <Header />
      <Swap />
      
    </Container>
  );
}

export default App;
