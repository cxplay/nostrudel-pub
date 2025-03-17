import { useAsync } from "react-use";
import { Button, Card, CardBody, CardHeader, Heading, Link, Text } from "@chakra-ui/react";

import { NOSTR_RELAY_TRAY_URL, checkNostrRelayTray, localRelay } from "../../../../services/local-relay";

export default function CitrineRelayCard() {
  const { value: available, loading: checking } = useAsync(checkNostrRelayTray);

  const enabled = localRelay?.url.startsWith(NOSTR_RELAY_TRAY_URL);
  const enable = () => {
    localStorage.setItem("localRelay", NOSTR_RELAY_TRAY_URL);
    location.reload();
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">Citrine</Heading>
        <Link color="blue.500" href="https://github.com/greenart7c3/Citrine" isExternal>
          GitHub
        </Link>
        {available ? (
          <Button size="sm" colorScheme="primary" ml="auto" isLoading={checking} onClick={enable} isDisabled={enabled}>
            {enabled ? "已启用" : "启用"}
          </Button>
        ) : (
          <Button
            as={Link}
            isExternal
            href="https://github.com/greenart7c3/Citrine"
            colorScheme="blue"
            size="sm"
            ml="auto"
          >
            获得该应用
          </Button>
        )}
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">一款很酷的小软件, 可在手机上运行本地中继</Text>
        <Text>容量: 无限制</Text>
        <Text>性能: 和你的手机一样快</Text>
      </CardBody>
    </Card>
  );
}
