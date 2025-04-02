import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { kinds } from "nostr-tools";
import { useActiveAccount } from "applesauce-react/hooks";

import { NostrEvent } from "../../../../types/nostr-event";
import { RepostIcon } from "../../../icons";
import useEventCount from "../../../../hooks/use-event-count";
import ShareModal from "./share-modal";

export default function EventShareButton({ event, title = "分享事件" }: { event: NostrEvent; title?: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const account = useActiveAccount();
  const hasShared = useEventCount(
    account ? { "#e": [event.id], kinds: [kinds.Repost, kinds.GenericRepost], authors: [account.pubkey] } : undefined,
  );
  const shareCount = useEventCount({ "#e": [event.id], kinds: [kinds.Repost, kinds.GenericRepost] });

  return (
    <>
      {shareCount !== undefined && shareCount > 0 ? (
        <Button
          leftIcon={<RepostIcon />}
          onClick={onOpen}
          title={title}
          colorScheme={hasShared ? "primary" : undefined}
        >
          {shareCount}
        </Button>
      ) : (
        <IconButton
          icon={<RepostIcon />}
          onClick={onOpen}
          aria-label={title}
          title={title}
          colorScheme={hasShared ? "primary" : undefined}
        />
      )}
      {isOpen && <ShareModal isOpen={isOpen} onClose={onClose} event={event} />}
    </>
  );
}
