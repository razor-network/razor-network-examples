import { AddIcon, BellIcon } from "@chakra-ui/icons";
import { Button, VStack } from "@chakra-ui/react";

const Card = () => {
  return (
    <VStack spacing={4}>
      <Button w="full" colorScheme="blue" size="lg" leftIcon={<AddIcon />}>
        Contribute
      </Button>
      <Button
        variant="outline"
        leftIcon={<BellIcon />}
        colorScheme="blue"
        w="full"
        size="lg"
      >
        Declare winner
      </Button>
    </VStack>
  );
};

export default Card;
