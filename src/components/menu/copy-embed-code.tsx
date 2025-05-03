import { MenuItem } from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";

import { getSharableEventAddress } from "../../services/relay-hints";
import { CopyToClipboardIcon } from "../icons";

export default function CopyEmbedCodeMenuItem({ event }: { event: NostrEvent }) {
  const address = getSharableEventAddress(event);

  return (
    address && (
      <MenuItem onClick={() => window.navigator.clipboard.writeText("nostr:" + address)} icon={<CopyToClipboardIcon />}>
        复制嵌入代码
      </MenuItem>
    )
  );
}
