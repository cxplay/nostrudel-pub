import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from "@chakra-ui/react";
import { CacheRelay, clearDB } from "nostr-idb";
import { Link as RouterLink } from "react-router-dom";

import { localDatabase, localRelay } from "../../../../services/local-relay";
import EnableWithDelete from "../components/enable-with-delete";

export default function InternalRelayCard() {
  const enabled = localRelay instanceof CacheRelay;
  const enable = () => {
    localStorage.setItem("localRelay", "nostr-idb://internal");
    location.reload();
  };

  const wipe = async () => {
    await clearDB(localDatabase);
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">浏览器缓存</Heading>
        <EnableWithDelete size="sm" ml="auto" enable={enable} enabled={enabled} wipe={wipe} />
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">使用浏览器内置的数据库去缓存事件.</Text>
        <Text>容量: 10k 事件</Text>
        <Text>性能: 可用, 但受制于你的浏览器</Text>
      </CardBody>
      {enabled && (
        <CardFooter p="4" pt="0">
          <Button size="sm" colorScheme="primary" ml="auto" as={RouterLink} to="/relays/cache/database">
            数据库工具
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
