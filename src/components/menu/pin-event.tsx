import { MenuItem } from "@chakra-ui/react";
import { CreatePinList, PinNote, UnpinNote } from "applesauce-actions/actions/pins";
import { useActionHub, useActiveAccount, useEventFactory, useEventStore } from "applesauce-react/hooks";
import { kinds, NostrEvent } from "nostr-tools";

import { isEventInList } from "../../helpers/nostr/lists";
import useAsyncAction from "../../hooks/use-async-action";
import useUserPinList from "../../hooks/use-user-pin-list";
import { usePublishEvent } from "../../providers/global/publish-provider";
import { PinIcon } from "../icons";

export default function PinEventMenuItem({ event }: { event: NostrEvent }) {
  const publish = usePublishEvent();
  const account = useActiveAccount();
  const factory = useEventFactory();
  const actions = useActionHub();
  const eventStore = useEventStore();
  const { list } = useUserPinList(account?.pubkey);

  const isPinned = !!list && isEventInList(list, event);

  let type = "笔记";
  switch (event.kind) {
    case kinds.LongFormArticle:
      type = "文章";
      break;
  }
  const label = isPinned ? `取消置顶${type}` : `置顶${type}`;

  const toggle = useAsyncAction(async () => {
    if (!account) return;
    if (isPinned) await actions.exec(UnpinNote, event).forEach((e) => publish(label, e));
    else if (eventStore.hasReplaceable(kinds.Pinlist, account.pubkey))
      await actions.exec(PinNote, event).forEach((e) => publish(label, e));
    else await actions.exec(CreatePinList, [event]).forEach((e) => publish(label, e));
  }, [isPinned, factory]);

  if (event.pubkey !== account?.pubkey) return null;

  return (
    <MenuItem onClick={toggle.run} icon={<PinIcon />} isDisabled={toggle.loading}>
      {label}
    </MenuItem>
  );
}
