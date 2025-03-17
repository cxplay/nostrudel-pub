import { useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import MemoryRelay from "../../../../classes/memory-relay";
import useCacheRelay from "../../../../hooks/use-cache-relay";
import { setCacheRelayURL } from "../../../../services/cache-relay";

export default function MemoryRelayCard() {
  const cacheRelay = useCacheRelay();
  const enabled = cacheRelay instanceof MemoryRelay;

  const [enabling, setEnabling] = useState(false);
  const enable = async () => {
    try {
      setEnabling(true);
      await setCacheRelayURL(":memory:");
    } catch (error) {}
    setEnabling(false);
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">内存缓存</Heading>
        <Button size="sm" colorScheme="primary" ml="auto" onClick={enable} isDisabled={enabled} isLoading={enabling}>
          {enabled ? "已启用" : "启用"}
        </Button>
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">在内存里面缓存所有事件</Text>
        <Text>容量: 无限, 直到你的系统卡住</Text>
        <Text>性能: 非常快</Text>
        <Text color="yellow.500">注意: 所有的事件都会在你关闭本应用后消失</Text>
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
