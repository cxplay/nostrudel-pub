import { CardProps } from "@chakra-ui/react";
import { nip18, NostrEvent } from "nostr-tools";

import EmbeddedUnknown from "./embedded-unknown";
import { EmbedEventPointer } from "..";

export default function EmbeddedRepost({ repost, ...props }: Omit<CardProps, "children"> & { repost: NostrEvent }) {
  const pointer = nip18.getRepostedEventPointer(repost);

  if (!pointer) return <EmbeddedUnknown event={repost} {...props} />;
  return <EmbedEventPointer pointer={{ type: "nevent", data: pointer }} {...props} />;
}
