import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

import useCacheRelay from "../../../../hooks/use-cache-relay";
import { setCacheRelayURL } from "../../../../services/cache-relay";

export default function NoRelayCard() {
  const cacheRelay = useCacheRelay();
  const enabled = cacheRelay === null;

  const [enabling, setEnabling] = useState(false);
  const enable = async () => {
    try {
      setEnabling(true);
      await setCacheRelayURL(":none:");
    } catch (error) {}
    setEnabling(false);
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">无缓存</Heading>
        <Button size="sm" colorScheme="primary" ml="auto" onClick={enable} isDisabled={enabled} isLoading={enabling}>
          {enabled ? "已启用" : "启用"}
        </Button>
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">没有本地中继, 什么都没有缓存</Text>
        <Text>容量: 0</Text>
        <Text>性能: 和你连接到中继的速度一样快</Text>
        <Text color="blue.500">注意: 用户资料和时间线还是会缓存到内存中</Text>
      </CardBody>
    </Card>
  );
}
