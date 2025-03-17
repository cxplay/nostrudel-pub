import { Button, Flex, Heading } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useActiveAccount } from "applesauce-react/hooks";

export default function RequireActiveAccount({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const account = useActiveAccount();

  if (!account)
    return (
      <Flex direction="column" w="full" h="full" alignItems="center" justifyContent="center" gap="4">
        <Heading size="md">使用该应用视图必须先登录账户</Heading>
        <Button as={Link} to="/signin" state={{ from: location.pathname }} colorScheme="primary">
          登录
        </Button>
      </Flex>
    );

  return children;
}
