import { useAsync } from "react-use";
import { Button, Card, CardBody, CardHeader, Heading, Link, Text } from "@chakra-ui/react";

import { NOSTR_RELAY_TRAY_URL, checkNostrRelayTray, localRelay } from "../../../../services/local-relay";

export default function NostrRelayTrayCard() {
  const { value: available, loading: checking } = useAsync(checkNostrRelayTray);

  const enabled = localRelay?.url.startsWith(NOSTR_RELAY_TRAY_URL);
  const enable = () => {
    localStorage.setItem("localRelay", NOSTR_RELAY_TRAY_URL);
    location.reload();
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">托盘中继</Heading>
        <Link color="blue.500" href="https://github.com/CodyTseng/nostr-relay-tray" isExternal>
          GitHub
        </Link>
        {available || enabled ? (
          <Button size="sm" colorScheme="primary" ml="auto" isLoading={checking} onClick={enable} isDisabled={enabled}>
            {enabled ? "已启用" : "启用"}
          </Button>
        ) : (
          <Button
            as={Link}
            isExternal
            href="https://github.com/CodyTseng/nostr-relay-tray/releases"
            colorScheme="blue"
            size="sm"
            ml="auto"
          >
            获得该应用
          </Button>
        )}
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">一个很酷的应用, 允许你在系统托盘上运行本地中继</Text>
        <Text>容量: 无限</Text>
        <Text>性能: 和你的电脑一样快</Text>
        {!available && (
          <Text color="yellow.500">
            如果该应用已经在运行, 但此处仍然显示 "获取该应用" 那么很可能是浏览器正在阻止访问这个本地中继
          </Text>
        )}
      </CardBody>
    </Card>
  );
}
