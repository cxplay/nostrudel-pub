import { Badge, Button, ButtonProps, ComponentWithAs, Flex, IconProps, useDisclosure } from "@chakra-ui/react";
import { Filter, kinds, nip19, NostrEvent } from "nostr-tools";
import { Link as RouteLink, To } from "react-router-dom";

import {
  ArticleIcon,
  BookmarkIcon,
  ChannelsIcon,
  DirectMessagesIcon,
  EmojiPacksIcon,
  ListsIcon,
  NotesIcon,
  RelayIcon,
  RepostIcon,
} from "../../../components/icons";
import AnnotationQuestion from "../../../components/icons/annotation-question";
import { getSharableEventAddress } from "../../../services/relay-hints";
import { npubEncode } from "nostr-tools/nip19";
import useTimelineLoader from "../../../hooks/use-timeline-loader";
import { useUserOutbox } from "../../../hooks/use-user-mailboxes";
import { useReadRelays } from "../../../hooks/use-client-relays";
import AlertTriangle from "../../../components/icons/alert-triangle";
import MessageSquare02 from "../../../components/icons/message-square-02";
import Camera01 from "../../../components/icons/camera-01";
import { PICTURE_POST_KIND } from "applesauce-core/helpers";

type KnownKind = {
  kind: number;
  name?: string;
  hidden?: boolean;
  icon?: ComponentWithAs<"svg", IconProps>;
  link?: (events: NostrEvent[], pubkey: string) => LinkNav | undefined;
  single?: (event: NostrEvent, pubkey: string) => LinkNav | undefined;
  multiple?: (events: NostrEvent[], pubkey: string) => LinkNav | undefined;
};

type LinkNav = string | { to: To; state: any };

function singleLink(event: NostrEvent, _pubkey: string) {
  const address = getSharableEventAddress(event);
  return address ? `/l/${address}` : undefined;
}
function consoleLink(events: NostrEvent[], pubkey: string) {
  const kinds = new Set(events.map((e) => e.kind));
  return {
    to: "/tools/console",
    state: { filter: { kinds: Array.from(kinds), authors: [pubkey] } satisfies Filter },
  };
}

const KnownKinds: KnownKind[] = [
  {
    kind: kinds.ShortTextNote,
    name: "笔记",
    icon: NotesIcon,
    link: (_, p) => `/u/${npubEncode(p)}/notes`,
  },
  {
    kind: kinds.Repost,
    name: "转发",
    icon: RepostIcon,
    link: (_e, p) => `/u/${npubEncode(p)}/notes`,
  },
  {
    kind: kinds.GenericRepost,
    name: "通用转发",
    icon: RepostIcon,
    hidden: true,
    link: (_e, p) => `/u/${npubEncode(p)}/notes`,
  },

  {
    kind: kinds.LongFormArticle,
    name: "文章",
    icon: ArticleIcon,
    link: (_, p) => `/u/${npubEncode(p)}/articles`,
  },

  {
    kind: PICTURE_POST_KIND,
    name: "图片",
    icon: Camera01,
    link: (_, p) => `/u/${npubEncode(p)}/pictures`,
  },

  {
    kind: kinds.EncryptedDirectMessage,
    name: "一般私信",
    icon: DirectMessagesIcon,
    link: (_e, p) => `/u/${nip19.npubEncode(p)}/dms`,
  },

  {
    kind: kinds.PublicChatsList,
    icon: ChannelsIcon,
    name: "公共聊天",
    link: (_e, p) => `/u/${npubEncode(p)}/lists`,
  },

  { kind: kinds.Followsets, name: "用户列表", icon: ListsIcon, link: (_e, p) => `/u/${npubEncode(p)}/lists` },
  { kind: kinds.Genericlists, icon: ListsIcon, name: "通用列表", link: (_e, p) => `/u/${npubEncode(p)}/lists` },
  { kind: kinds.Relaysets, icon: RelayIcon, name: "中继合集" },
  { kind: kinds.Bookmarksets, icon: BookmarkIcon, name: "书签", link: (_e, p) => `/u/${npubEncode(p)}/lists` },

  { kind: kinds.Report, name: "举报", icon: AlertTriangle, link: (_e, p) => `/u/${npubEncode(p)}/reports` },

  { kind: kinds.Emojisets, name: "表情包", icon: EmojiPacksIcon, link: (_e, p) => `/u/${npubEncode(p)}/emojis` },

  { kind: kinds.Handlerinformation, name: "应用" },
  { kind: kinds.Handlerrecommendation, name: "应用推荐" },

  { kind: kinds.BadgeAward, name: "徽章奖励" },

  { kind: kinds.LiveChatMessage, icon: MessageSquare02, name: "串流聊天" },

  // common kinds
  { kind: kinds.Metadata, hidden: true },
  { kind: kinds.Contacts, hidden: true },
  { kind: kinds.EventDeletion, hidden: true },
  { kind: kinds.Reaction, hidden: true },

  // NIP-51 lists
  { kind: kinds.RelayList, hidden: true },
  { kind: kinds.BookmarkList, hidden: true },
  { kind: kinds.InterestsList, hidden: true },
  { kind: kinds.Pinlist, hidden: true },
  { kind: kinds.UserEmojiList, hidden: true },
  { kind: kinds.Mutelist, hidden: true },
  { kind: kinds.CommunitiesList, hidden: true },
  { kind: kinds.SearchRelaysList, hidden: true },
  { kind: kinds.BlockedRelaysList, hidden: true },

  { kind: 30008, hidden: true, name: "Badges" }, // profile badges

  { kind: kinds.Application, name: "App data", hidden: true },
];

function EventKindButton({
  kind,
  events,
  pubkey,
  known,
}: { kind: number; events: NostrEvent[]; pubkey: string; known?: KnownKind } & Omit<ButtonProps, "icon">) {
  const Icon = known?.icon;
  const icon = Icon ? <Icon boxSize={10} mb="4" /> : <AnnotationQuestion boxSize={10} mb="4" />;

  let nav = known?.link?.(events, pubkey);
  if (!nav) {
    if (events.length === 1) {
      nav = known?.single?.(events[0], pubkey) || singleLink(events[0], pubkey);
    } else {
      nav = known?.multiple?.(events, pubkey) || consoleLink(events, pubkey);
    }
  }

  const linkProps = typeof nav === "string" ? { to: nav } : nav;

  return (
    <Button
      as={RouteLink}
      {...linkProps}
      variant="outline"
      leftIcon={icon}
      h="36"
      w="36"
      flexDirection="column"
      position="relative"
    >
      <Badge position="absolute" top="2" right="2" fontSize="md">
        {events.length}
      </Badge>
      {known?.name || kind}
    </Button>
  );
}

export default function UserRecentEvents({ pubkey }: { pubkey: string }) {
  const outbox = useUserOutbox(pubkey);
  const readRelays = useReadRelays();
  const { timeline: recent } = useTimelineLoader(`${pubkey}-recent-events`, outbox || readRelays, {
    authors: [pubkey],
    limit: 100,
  });
  const all = useDisclosure();

  // const recent = useStoreQuery(TimelineQuery, [{ authors: [pubkey], limit: 100 }]);

  const byKind = recent?.reduce(
    (dir, event) => {
      if (dir[event.kind]) dir[event.kind].events.push(event);
      else
        dir[event.kind] = {
          known: KnownKinds.find((k) => k.kind === event.kind),
          events: [event],
        };

      return dir;
    },
    {} as Record<number, { events: NostrEvent[]; known?: KnownKind }>,
  );

  return (
    <Flex gap="2" wrap="wrap">
      {byKind &&
        Object.entries(byKind)
          .filter(([_, { known }]) => (!!known || all.isOpen) && (known ? known.hidden !== true : true))
          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
          .map(([kind, { events, known }]) => (
            <EventKindButton key={kind} kind={parseInt(kind)} events={events} pubkey={pubkey} known={known} />
          ))}
      {!all.isOpen && (
        <Button variant="link" p="4" onClick={all.onOpen}>
          显示更多 ({Object.entries(byKind).filter(([_, { known }]) => !!known).length})
        </Button>
      )}
    </Flex>
  );
}
