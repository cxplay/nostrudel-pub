import { MenuItem } from "@chakra-ui/react";

import { NostrEvent } from "../../../types/nostr-event";
import { DotsMenuButton, MenuIconButtonProps } from "../../../components/dots-menu-button";
import { useActiveAccount } from "applesauce-react/hooks";
import { TrashIcon } from "../../../components/icons";
import { useDeleteEventContext } from "../../../providers/route/delete-event-provider";
import OpenInAppMenuItem from "../../../components/common-menu-items/open-in-app";
import CopyEmbedCodeMenuItem from "../../../components/common-menu-items/copy-embed-code";
import DebugEventMenuItem from "../../../components/debug-modal/debug-event-menu-item";

export default function BadgeMenu({ badge, ...props }: { badge: NostrEvent } & Omit<MenuIconButtonProps, "children">) {
  const account = useActiveAccount();

  const { deleteEvent } = useDeleteEventContext();

  return (
    <>
      <DotsMenuButton {...props}>
        <OpenInAppMenuItem event={badge} />
        <CopyEmbedCodeMenuItem event={badge} />
        {account?.pubkey === badge.pubkey && (
          <MenuItem icon={<TrashIcon />} color="red.500" onClick={() => deleteEvent(badge)}>
            Delete Badge
          </MenuItem>
        )}
        <DebugEventMenuItem event={badge} />
      </DotsMenuButton>
    </>
  );
}
