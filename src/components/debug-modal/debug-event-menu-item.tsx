import { useContext } from "react";
import { MenuItem, MenuItemProps } from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";

import { CodeIcon } from "../icons";
import { DebugModalContext } from "../../providers/route/debug-modal-provider";

export default function DebugEventMenuItem({
  event,
  ...props
}: { event: NostrEvent } & Omit<MenuItemProps, "icon" | "aria-label">) {
  const { open } = useContext(DebugModalContext);

  return (
    <MenuItem onClick={() => open(event)} icon={<CodeIcon />} {...props}>
      查看原始
    </MenuItem>
  );
}
