import { ButtonGroup, ButtonGroupProps, IconButton } from "@chakra-ui/react";
import { ReplyIcon, RepostIcon } from "./icons";

type Disclosure = { isOpen: boolean; onToggle: () => void };

export default function NoteFilterTypeButtons({
  showReplies,
  showReposts,
  ...props
}: Omit<ButtonGroupProps, "children"> & { showReplies: Disclosure; showReposts: Disclosure }) {
  return (
    <ButtonGroup variant="outline" {...props}>
      <IconButton
        icon={<ReplyIcon boxSize={5} />}
        colorScheme={showReplies.isOpen ? "primary" : undefined}
        aria-label="切换显示回复消息"
        title="切换显示回复消息"
        onClick={showReplies.onToggle}
      />
      <IconButton
        icon={<RepostIcon boxSize={5} />}
        colorScheme={showReposts.isOpen ? "primary" : undefined}
        aria-label="切换显示转发消息"
        title="切换显示转发消息"
        onClick={showReposts.onToggle}
      />
    </ButtonGroup>
  );
}
