import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  OrderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const AccordionCard = () => {
  return (
    <Accordion allowToggle={true} mt={8}>
      <AccordionItem>
        <h1>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              How Lottery dApp works?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h1>
        <AccordionPanel pb={4}>
          <OrderedList>
            <ListItem>
              To participate in the pool, each participant must deposit <b>0.1 ETH</b>.
            </ListItem>
            <ListItem>
            The pool is limited to a maximum of <b>5</b> unique participants.
            </ListItem>
            <ListItem>
            Once the participant limit is reached, any participant can initiate the process to declare a winner.
            </ListItem>
            <ListItem>
              The winner will be selected randomly using the <Link
                href="https://github.com/razor-network/oracle-contracts/blob/v1.1/contracts/randomNumber/RandomNoManager.sol"
                isExternal
                color="teal"
              >
                Razor Network RandomNoManager
                <ExternalLinkIcon mx="2px" />
              </Link>{" "} contract.
            </ListItem>
            <ListItem>
                The chosen winner will be rewarded with <b> 0.5 ETH</b>.
            </ListItem>
          </OrderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionCard;
