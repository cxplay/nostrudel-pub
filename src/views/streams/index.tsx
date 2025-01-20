import { useCallback, useMemo } from "react";
import { Flex, Heading, SimpleGrid, Switch } from "@chakra-ui/react";
import { getEventUID, isStreamURL } from "applesauce-core/helpers";
import { Filter, kinds } from "nostr-tools";

import useTimelineLoader from "../../hooks/use-timeline-loader";
import IntersectionObserverProvider from "../../providers/local/intersection-observer";
import { useTimelineCurserIntersectionCallback } from "../../hooks/use-timeline-cursor-intersection-callback";
import StreamCard from "./components/stream-card";
import useRelaysChanged from "../../hooks/use-relays-changed";
import PeopleListSelection from "../../components/people-list-selection/people-list-selection";
import PeopleListProvider, { usePeopleListContext } from "../../providers/local/people-list-provider";
import TimelineActionAndStatus from "../../components/timeline/timeline-action-and-status";
import { useAppTitle } from "../../hooks/use-app-title";
import { NostrEvent } from "../../types/nostr-event";
import VerticalPageLayout from "../../components/vertical-page-layout";
import useClientSideMuteFilter from "../../hooks/use-client-side-mute-filter";
import { useRouteStateBoolean } from "../../hooks/use-route-state-value";
import { useReadRelays } from "../../hooks/use-client-relays";
import { AdditionalRelayProvider, useAdditionalRelayContext } from "../../providers/local/additional-relay-context";
import useFavoriteStreams from "../../hooks/use-favorite-streams";
import { getStreamStatus, getStreamStreamingURLs } from "../../helpers/nostr/stream";

function StreamsPage() {
  useAppTitle("Streams");
  const relays = useReadRelays(useAdditionalRelayContext()).urls;
  const userMuteFilter = useClientSideMuteFilter();
  const showEnded = useRouteStateBoolean("ended", false);

  const eventFilter = useCallback(
    (event: NostrEvent) => {
      if (userMuteFilter(event)) return false;

      // only show streams that have video streams
      const urls = getStreamStreamingURLs(event);
      if (!urls.some(isStreamURL)) return false;

      return true;
    },
    [userMuteFilter],
  );

  const { filter, listId } = usePeopleListContext();
  const query = useMemo<Filter | Filter[] | undefined>(() => {
    if (!filter) return undefined;
    return [
      { authors: filter.authors, kinds: [kinds.LiveEvent] },
      { "#p": filter.authors, kinds: [kinds.LiveEvent] },
    ];
  }, [filter]);

  const { loader, timeline: streams } = useTimelineLoader(`${listId ?? "global"}-streams`, relays, query, {
    eventFilter,
  });
  const callback = useTimelineCurserIntersectionCallback(loader);

  useRelaysChanged(relays, () => loader.reset());

  const { streams: favorites } = useFavoriteStreams();

  const liveStreams = streams.filter((stream) => getStreamStatus(stream) === "live");
  const endedStreams = streams.filter((stream) => getStreamStatus(stream) === "ended");

  const columns = { base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 };

  return (
    <VerticalPageLayout>
      <Flex gap="2" wrap="wrap" alignItems="center">
        <PeopleListSelection />
        <Switch isChecked={showEnded.isOpen} onChange={showEnded.onToggle}>
          Show Ended
        </Switch>
      </Flex>
      <IntersectionObserverProvider callback={callback}>
        {favorites.length > 0 && (
          <>
            <Heading size="lg" mt="2">
              Favorites
            </Heading>
            <SimpleGrid columns={columns} spacing="2">
              {favorites.map((stream) => (
                <StreamCard key={getEventUID(stream)} stream={stream} />
              ))}
            </SimpleGrid>
          </>
        )}
        <Heading size="lg" mt="2">
          Live
        </Heading>
        <SimpleGrid columns={columns} spacing="2">
          {liveStreams.map((stream) => (
            <StreamCard key={getEventUID(stream)} stream={stream} />
          ))}
        </SimpleGrid>
        {showEnded.isOpen && (
          <>
            <Heading size="lg" mt="4">
              Ended
            </Heading>
            <SimpleGrid columns={columns} spacing="2">
              {endedStreams.map((stream) => (
                <StreamCard key={getEventUID(stream)} stream={stream} />
              ))}
            </SimpleGrid>
          </>
        )}
        <TimelineActionAndStatus timeline={loader} />
      </IntersectionObserverProvider>
    </VerticalPageLayout>
  );
}
export default function StreamHomeView() {
  return (
    <AdditionalRelayProvider
      relays={["wss://nos.lol", "wss://relay.damus.io", "wss://relay.snort.social", "wss://nostr.wine"]}
    >
      <PeopleListProvider>
        <StreamsPage />
      </PeopleListProvider>
    </AdditionalRelayProvider>
  );
}
