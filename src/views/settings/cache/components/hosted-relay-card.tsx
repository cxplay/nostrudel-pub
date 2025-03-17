import { Button, Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

import useCacheRelay from "../../../../hooks/use-cache-relay";
import localSettings from "../../../../services/local-settings";

export default function HostedRelayCard() {
  const cacheRelay = useCacheRelay();
  const enabled = cacheRelay?.url.includes(location.host + "/local-relay");
  const enable = () => {
    localSettings.cacheRelayURL.clear();
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">托管中继</Heading>
        <Button size="sm" colorScheme="primary" ml="auto" onClick={enable} isDisabled={enabled}>
          {enabled ? "已启用" : "启用"}
        </Button>
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">noStrudel 已经设置了一个本地中继用于缓存</Text>
        <Text>容量: 未知</Text>
        <Text>性能: 未知, 但应该会很快...</Text>
      </CardBody>
    </Card>
  );
}
