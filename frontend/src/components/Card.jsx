import { Button, Heading, VStack } from "@chakra-ui/react";

const Card = () => {
  return (
    <VStack spacing={4}>
      <Button w="full">Contribute</Button>
      <Button w="full">Declare winner</Button>
    </VStack>
  );
};

export default Card;
