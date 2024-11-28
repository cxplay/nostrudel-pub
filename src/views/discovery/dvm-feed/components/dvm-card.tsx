import { ButtonGroup, Card, CardProps, Flex, Heading, LinkBox, LinkOverlayProps, Text } from "@chakra-ui/react";
import { Link as RouterLink, To } from "react-router-dom";
import { useMemo } from "react";
import { AddressPointer } from "nostr-tools/nip19";

import { NostrEvent } from "../../../../types/nostr-event";
import HoverLinkOverlay from "../../../../components/hover-link-overlay";
import { DVMAvatar } from "./dvm-avatar";
import { getEventAddressPointer } from "../../../../helpers/nostr/event";
import { DVMName } from "./dvm-name";
import DebugEventButton from "../../../../components/debug-modal/debug-event-button";
import useEventIntersectionRef from "../../../../hooks/use-event-intersection-ref";
import DVMFeedFavoriteButton from "../../../../components/dvm/dvm-feed-favorite-button";

export default function DVMCard({
  appData,
  to,
  onClick,
  ...props
}: Omit<CardProps, "children"> & { appData: NostrEvent; to: To; onClick?: LinkOverlayProps["onClick"] }) {
  const metadata = JSON.parse(appData.content);
  const pointer: AddressPointer = useMemo(() => getEventAddressPointer(appData), [appData]);

  const ref = useEventIntersectionRef(appData);

  return (
    <>
      <Card as={LinkBox} display="block" p="4" ref={ref} {...props}>
        <Flex gap="2" float="right" zIndex={1}>
          <DVMFeedFavoriteButton zIndex={1} size="sm" pointer={pointer} />
          <DebugEventButton zIndex={1} size="sm" event={appData} />
        </Flex>
        <DVMAvatar pointer={pointer} w="24" float="left" mr="4" mb="2" />
        <Heading size="md">
          <HoverLinkOverlay as={RouterLink} to={to} onClick={onClick}>
            <DVMName pointer={pointer} />
          </HoverLinkOverlay>
        </Heading>
        <Text>{metadata.about}</Text>
      </Card>
    </>
  );
}
