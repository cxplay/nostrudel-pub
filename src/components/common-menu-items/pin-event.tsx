import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import { kinds } from "nostr-tools";

import useCurrentAccount from "../../hooks/use-current-account";
import useUserPinList from "../../hooks/use-user-pin-list";
import { DraftNostrEvent, NostrEvent } from "../../types/nostr-event";
import { isEventInList, listAddEvent, listRemoveEvent } from "../../helpers/nostr/lists";
import { PinIcon } from "../icons";
import { usePublishEvent } from "../../providers/global/publish-provider";

export default function PinEventMenuItem({ event }: { event: NostrEvent }) {
  const publish = usePublishEvent();
  const account = useCurrentAccount();
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
    let draft: DraftNostrEvent = {
      kind: kinds.Pinlist,
      created_at: dayjs().unix(),
      content: list?.content ?? "",
      tags: list?.tags ? Array.from(list.tags) : [],
    };

    if (isPinned) draft = listRemoveEvent(draft, event);
    else draft = listAddEvent(draft, event);

    await publish(label, draft);
    setLoading(false);
  }, [list, isPinned]);

  if (event.pubkey !== account?.pubkey) return null;

  return (
    <MenuItem onClick={togglePin} icon={<PinIcon />} isDisabled={loading || !!account?.readonly}>
      {label}
    </MenuItem>
  );
}
