import Blockies from "react-blockies";
import { Text, Tag } from "@chakra-ui/react";

const AccountText = ({ account }) => {
  return (
    <Tag size="lg" colorScheme="cyan">
      <Blockies seed={account} scale={3} className="react-blockies" />
      <Text ml={2}>
        {account.substring(0, 6)}...
        {account.substring(account.length - 4, account.length)}
      </Text>
    </Tag>
  );
};

export default AccountText;
