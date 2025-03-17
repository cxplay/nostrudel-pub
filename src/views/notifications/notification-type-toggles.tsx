import { ButtonGroup, ButtonGroupProps, IconButton, IconButtonProps } from "@chakra-ui/react";
import { AtIcon, LightningIcon, ReplyIcon, RepostIcon } from "../../components/icons";
import Heart from "../../components/icons/heart";
import HelpCircle from "../../components/icons/help-circle";

type Disclosure = { isOpen: boolean; onToggle: () => void };

function ToggleIconButton({ toggle, colorScheme, color, ...props }: IconButtonProps & { toggle: Disclosure }) {
  return (
    <IconButton
      // colorScheme={toggle.isOpen ? colorScheme || "primary" : undefined}
      color={toggle.isOpen ? color : undefined}
      variant={toggle.isOpen ? "outline" : "ghost"}
      onClick={toggle.onToggle}
      {...props}
    />
  );
}

type NotificationTypeTogglesPropTypes = Omit<ButtonGroupProps, "children"> & {
  showReplies: Disclosure;
  showMentions: Disclosure;
  showZaps: Disclosure;
  showReposts: Disclosure;
  showReactions: Disclosure;
  showUnknown: Disclosure;
};

export default function NotificationTypeToggles({
  showReplies,
  showMentions,
  showZaps,
  showReposts,
  showReactions,
  showUnknown,
  ...props
}: NotificationTypeTogglesPropTypes) {
  return (
    <ButtonGroup variant="outline" {...props}>
      <ToggleIconButton
        icon={<ReplyIcon boxSize={5} />}
        aria-label="切换显示回复消息"
        title="切换显示回复消息"
        toggle={showReplies}
        color="green.400"
      />
      <ToggleIconButton
        icon={<AtIcon boxSize={5} />}
        aria-label="切换显示转发消息"
        title="切换显示转发消息"
        toggle={showMentions}
        color="purple.400"
      />
      <ToggleIconButton
        icon={<LightningIcon boxSize={5} />}
        aria-label="切换显示打闪消息"
        title="切换显示打闪消息"
        toggle={showZaps}
        color="yellow.400"
      />
      <ToggleIconButton
        icon={<RepostIcon boxSize={5} />}
        aria-label="切换显示转发消息"
        title="切换显示转发消息"
        toggle={showReposts}
        color="blue.400"
      />
      <ToggleIconButton
        icon={<Heart boxSize={5} />}
        aria-label="切换显示回应消息"
        title="切换显示回应消息"
        toggle={showReactions}
        color="red.400"
      />
      <ToggleIconButton
        icon={<HelpCircle boxSize={5} />}
        aria-label="切换显示未知关联事件"
        title="切换显示未知关联事件"
        toggle={showUnknown}
        color="gray.500"
      />
    </ButtonGroup>
  );
}
