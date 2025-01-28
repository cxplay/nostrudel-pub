import { useMemo } from "react";
import { ButtonProps } from "@chakra-ui/react";
import { useActiveAccount } from "applesauce-react/hooks";

import { NostrEvent } from "../../types/nostr-event";
import useEventReactions from "../../hooks/use-event-reactions";
import { groupReactions } from "../../helpers/nostr/reactions";
import ReactionGroupButton from "./reaction-group-button";
import { useAddReaction } from "./common-hooks";

export default function SimpleLikeButton({ event, ...props }: Omit<ButtonProps, "children"> & { event: NostrEvent }) {
  const account = useActiveAccount();
  const reactions = useEventReactions(event) ?? [];
  const grouped = useMemo(() => groupReactions(reactions), [reactions]);

  const addReaction = useAddReaction(event, grouped);
  const group = grouped.find((g) => g.emoji === "+");

  return (
    <ReactionGroupButton
      emoji="+"
      count={group?.pubkeys.length ?? 0}
      onClick={() => addReaction("+")}
      colorScheme={account && group?.pubkeys.includes(account?.pubkey) ? "primary" : undefined}
      {...props}
    />
  );
}
