import { MenuItem } from "@chakra-ui/react";
import { useActiveAccount } from "applesauce-react/hooks";

import { NostrEvent } from "../../types/nostr-event";
import { MuteIcon, UnmuteIcon } from "../icons";
import { useMuteModalContext } from "../../providers/route/mute-modal-provider";
import useUserMuteActions from "../../hooks/use-user-mute-actions";

export default function MuteUserMenuItem({ event }: { event: NostrEvent }) {
  const account = useActiveAccount();
  const { isMuted, mute, unmute } = useUserMuteActions(event.pubkey);
  const { openModal } = useMuteModalContext();

  if (account?.pubkey === event.pubkey) return null;

  return (
    <MenuItem
      onClick={isMuted ? unmute : () => openModal(event.pubkey)}
      icon={isMuted ? <UnmuteIcon /> : <MuteIcon />}
      color="red.500"
    >
      {isMuted ? "解除静音" : "静音"}
    </MenuItem>
  );
}
