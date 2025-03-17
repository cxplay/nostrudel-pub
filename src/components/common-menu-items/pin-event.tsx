import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import { kinds } from "nostr-tools";
import { useActiveAccount, useEventFactory } from "applesauce-react/hooks";
import { removeEventTag, addEventTag } from "applesauce-factory/operations/tag";

import useUserPinList from "../../hooks/use-user-pin-list";
import { NostrEvent } from "../../types/nostr-event";
import { isEventInList } from "../../helpers/nostr/lists";
import { PinIcon } from "../icons";
import { usePublishEvent } from "../../providers/global/publish-provider";

export default function PinEventMenuItem({ event }: { event: NostrEvent }) {
  const publish = usePublishEvent();
  const account = useActiveAccount();
  const factory = useEventFactory();
  const { list } = useUserPinList(account?.pubkey);

  const isPinned = isEventInList(list, event);

  let type = "笔记";
  switch (event.kind) {
    case kinds.LongFormArticle:
      type = "文章";
      break;
  }
  const label = isPinned ? `取消置顶${type}` : `置顶${type}`;

  const [loading, setLoading] = useState(false);
  const togglePin = useCallback(async () => {
    setLoading(true);

    const draft = await factory.modifyTags(
      list || { kind: kinds.Pinlist },
      isPinned ? removeEventTag(event.id) : addEventTag(event.id),
    );

    await publish(label, draft);
    setLoading(false);
  }, [list, isPinned, factory]);

  if (event.pubkey !== account?.pubkey) return null;

  return (
    <MenuItem onClick={togglePin} icon={<PinIcon />} isDisabled={loading}>
      {label}
    </MenuItem>
  );
}
