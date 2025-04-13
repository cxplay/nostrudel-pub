import { ReactNode } from "react";
import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { NotificationChannel } from "@satellite-earth/core/types/control-api/notifications.js";
import { useObservable } from "applesauce-react/hooks";

import { controlApi$ } from "../../../../services/bakery";

function Channel({ channel }: { channel: NotificationChannel }) {
  const controlApi = useObservable(controlApi$);
  let details: ReactNode = null;

  switch (channel.type) {
    case "ntfy":
      details = (
        <Text color="GrayText" fontSize="sm">
          {new URL(channel.topic, channel.server).toString()}
        </Text>
      );
      break;
  }

  return (
    <Flex key={channel.id} borderWidth={1} p="4" rounded="md" direction="column">
      <Flex gap="2" alignItems="center">
        <Text>
          {channel.device || channel.id} <Badge>{channel.type}</Badge>
        </Text>
        <Button
          ml="auto"
          size="xs"
          colorScheme="red"
          // onClick={() => controlApi?.send(["CONTROL", "NOTIFICATIONS", "UNREGISTER", channel.id])}
        >
          移除
        </Button>
      </Flex>
      {details}
    </Flex>
  );
}

export default function OtherSubscriptions() {
  const channels: Record<string, NotificationChannel> = {};

  if (!channels || Object.keys(channels).length === 0) return null;

  return (
    <>
      <Flex alignItems="center" gap="2">
        <Heading size="md">Other Notifications</Heading>
      </Flex>

      {channels && Object.values(channels).map((channel) => <Channel key={channel.id} channel={channel} />)}
    </>
  );
}
