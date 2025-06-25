import { Button, ButtonGroup, Flex, Heading, SimpleGrid, Text, useInterval } from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";
import { useState } from "react";

import { useActiveAccount, useObservableEagerState } from "applesauce-react/hooks";
import NostrWebRTCPeer from "../../../../classes/webrtc/nostr-webrtc-peer";
import WebRtcRelayClient from "../../../../classes/webrtc/webrtc-relay-client";
import WebRtcRelayServer from "../../../../classes/webrtc/webrtc-relay-server";
import UserAvatar from "../../../../components/user/user-avatar";
import UserName from "../../../../components/user/user-name";
import { getPubkeysFromList } from "../../../../helpers/nostr/lists";
import useForceUpdate from "../../../../hooks/use-force-update";
import useUserContactList from "../../../../hooks/use-user-contact-list";
import { cacheRelay$ } from "../../../../services/cache-relay";

export default function Connection({
  call,
  peer,
  client,
  server,
}: {
  call: NostrEvent;
  peer: NostrWebRTCPeer;
  client: WebRtcRelayClient;
  server: WebRtcRelayServer;
}) {
  const cacheRelay = useObservableEagerState(cacheRelay$);
  const update = useForceUpdate();
  useInterval(update, 1000);
  // const toggleRead = () => {
  // if(clientRelaysService.readRelays.value.has(client))
  // };

  const account = useActiveAccount();
  const contacts = useUserContactList(account?.pubkey);

  const [sending, setSending] = useState(false);
  const sendEvents = async () => {
    if (!account?.pubkey || !cacheRelay) return;

    setSending(true);
    const sub = cacheRelay.subscribe([{ authors: [account.pubkey] }], {
      onevent: (event) => {
        client.publish(event);
        update();
      },
      oneose: () => {
        sub.close();
        setSending(false);
      },
    });
  };

  const [requesting, setRequesting] = useState(false);
  const requestEvents = async () => {
    if (!contacts || !cacheRelay) return;

    setRequesting(true);
    const sub = client.subscribe([{ authors: getPubkeysFromList(contacts).map((p) => p.pubkey) }], {
      onevent: (event) => {
        if (cacheRelay) cacheRelay.publish(event);
        update();
      },
      oneose: () => {
        sub.close();
        setRequesting(false);
      },
    });
  };

  return (
    <Flex key={call.id} borderWidth="1px" rounded="md" p="2" gap="2" direction="column">
      <Flex gap="2" alignItems="center">
        <UserAvatar pubkey={call.pubkey} size="sm" />
        <UserName pubkey={call.pubkey} />
        <Text>{peer.connection?.connectionState ?? "Unknown"}</Text>
        <Button size="sm" ml="auto" colorScheme="red" isDisabled>
          关闭
        </Button>
      </Flex>
      <Heading size="sm">服务器:</Heading>
      <SimpleGrid spacing="2" columns={{ base: 2, md: 3, lg: 4, xl: 5 }}>
        <Text>已发送: {server.stats.events.sent}</Text>
        <Text>已接收: {server.stats.events.received}</Text>
      </SimpleGrid>
      <Heading size="sm">客户端:</Heading>
      <SimpleGrid spacing="2" columns={{ base: 2, md: 3, lg: 4, xl: 5 }}>
        <Text>已发布: {client.stats.events.published}</Text>
        <Text>已接收: {client.stats.events.received}</Text>
      </SimpleGrid>
      {account && (
        <ButtonGroup ml="auto" size="sm">
          <Button onClick={sendEvents} isLoading={sending}>
            发送事件
          </Button>
          <Button onClick={requestEvents} isLoading={requesting}>
            请求联系
          </Button>
        </ButtonGroup>
      )}
    </Flex>
  );
}
