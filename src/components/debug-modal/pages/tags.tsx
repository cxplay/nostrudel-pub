import { Flex } from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";

import { ErrorBoundary } from "../../error-boundary";
import DebugEventTags from "../event-tags";
import RawJson from "../raw-json";
import { getContentTagRefs } from "../../../helpers/nostr/event";

export default function DebugTagsPage({ event }: { event: NostrEvent }) {
  return (
    <Flex direction="column" gap="2" alignItems="flex-start" justifyContent="flex-start">
      <ErrorBoundary>
        <DebugEventTags event={event} />
      </ErrorBoundary>
      <RawJson heading="内容中引用的标签" json={getContentTagRefs(event.content, event.tags)} />
    </Flex>
  );
}
