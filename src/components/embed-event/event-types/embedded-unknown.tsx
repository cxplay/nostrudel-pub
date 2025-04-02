import { useContext, useMemo } from "react";
import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, CardProps, IconButton, Text } from "@chakra-ui/react";

import { NostrEvent } from "../../../types/nostr-event";
import UserAvatarLink from "../../user/user-avatar-link";
import UserLink from "../../user/user-link";
import UserDnsIdentity from "../../user/user-dns-identity";
import Timestamp from "../../timestamp";
import { ExternalLinkIcon } from "../../icons";
import DebugEventButton from "../../debug-modal/debug-event-button";
import DebugEventTags from "../../debug-modal/event-tags";
import { AppHandlerContext } from "../../../providers/route/app-handler-provider";
import { getSharableEventAddress } from "../../../services/relay-hints";
import { QuestionIcon } from "@chakra-ui/icons";
import RouterLink from "../../router-link";

export default function EmbeddedUnknown({ event, ...props }: Omit<CardProps, "children"> & { event: NostrEvent }) {
  const address = useMemo(() => getSharableEventAddress(event), [event]);
  const { openAddress } = useContext(AppHandlerContext);

  const alt = event.tags.find((t) => t[0] === "alt")?.[1];

  return (
    <>
      <Card {...props}>
        <CardHeader display="flex" gap="2" alignItems="center" p="2" pb="0" flexWrap="wrap">
          <UserAvatarLink pubkey={event.pubkey} size="xs" />
          <UserLink pubkey={event.pubkey} isTruncated fontWeight="bold" fontSize="md" />
          <UserDnsIdentity pubkey={event.pubkey} onlyIcon />
          <Text>kind: {event.kind}</Text>
          <Timestamp timestamp={event.created_at} />
          <ButtonGroup ml="auto" size="sm">
            {address && (
              <Button leftIcon={<ExternalLinkIcon />} onClick={() => openAddress(address)}>
                打开
              </Button>
            )}
            <IconButton icon={<QuestionIcon />} aria-label="Details" as={RouterLink} to={`/l/${address}`} />
            <DebugEventButton event={event} variant="outline" />
          </ButtonGroup>
        </CardHeader>
        <CardBody p="2">
          {alt && (
            <Text isTruncated fontStyle="italic">
              {alt}
            </Text>
          )}
          <Box whiteSpace="pre-wrap" noOfLines={3}>
            {event.content}
          </Box>
          {event.tags.length > 0 && <DebugEventTags event={event} />}
        </CardBody>
      </Card>
    </>
  );
}
