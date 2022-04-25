import { VStack, Text, Box, Progress, Tag, Flex } from "@chakra-ui/react";

const ContractDetails = ({ poolCounter, participantCounter }) => {
  return (
    <VStack w="full">
      <Flex justifyContent="flex-end" w="full">
        <Tag size="lg" variant="outline" colorScheme="blue">
          Pool - {poolCounter}
        </Tag>
      </Flex>
      <Box w="full">
        <Text fontSize="md" align="right">
          Participants - {participantCounter} / 5
        </Text>
        <Progress isAnimated size="lg" value={20 * participantCounter} />
      </Box>
    </VStack>
  );
};

export default ContractDetails;
