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
              Participant deposit <b>0.1 ETH</b> in pool to contribute.
            </ListItem>
            <ListItem>
              Only <b>5</b> unique participant in single pool.
            </ListItem>
            <ListItem>
              Once pool participant has been reached to max(5). Anyone can call
              declare winner function.
            </ListItem>
            <ListItem>
              Winner will be choosen randomly using{" "}
              <Link
                href="https://github.com/razor-network/contracts/blob/master/contracts/randomNumber/RandomNoManager.sol"
                isExternal
                color="teal"
              >
                Razor Network RandomNoManager
                <ExternalLinkIcon mx="2px" />
              </Link>{" "}
              contract.
            </ListItem>
            <ListItem>
              Winner will be rewared with <b>0.5 ETH</b>.
            </ListItem>
          </OrderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionCard;
