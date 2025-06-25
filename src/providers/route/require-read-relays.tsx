import { PropsWithChildren } from "react";
import { Alert, AlertIcon, Button, Link, Spacer, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useReadRelays } from "../../hooks/use-client-relays";

export default function RequireReadRelays({ children }: PropsWithChildren) {
  const readRelays = useReadRelays();
  const location = useLocation();

  if (readRelays.length === 0 && !location.pathname.startsWith("/relays"))
    return (
      <>
        <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
          <AlertIcon />
          <Text>
            未找到{" "}
            <Link as={RouterLink} to="/relays/app">
              应用中继
            </Link>
            配置! 阅读和笔记发布功能将无法使用!
          </Text>
          <Spacer />
          <Button as={RouterLink} to="/relays/app" size="sm" colorScheme="primary">
            设置中继
          </Button>
        </Alert>
        {children}
      </>
    );

  return children;
}
