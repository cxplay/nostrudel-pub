import { Text } from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";

export default function NotePublishedUsing({ event }: { event: NostrEvent }) {
  const clientTag = event.tags.find((t) => t[0] === "client");
  if (!clientTag) return;

  return (
    <Text as="span" fontStyle="italic" fontSize="sm">
      使用 {clientTag[1]} 发布
    </Text>
  );
}
