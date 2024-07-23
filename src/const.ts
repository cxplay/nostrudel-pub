import { safeRelayUrl, safeRelayUrls } from "./helpers/relay";

export const SEARCH_RELAYS = safeRelayUrls([
  "wss://relay.nostr.band",
  "wss://search.nos.today",
  "wss://relay.noswhere.com",
  // TODO: requires NIP-42 auth
  // "wss://filter.nostr.wine",
]);
export const WIKI_RELAYS = safeRelayUrls(["wss://relay.wikifreedia.xyz/"]);
export const COMMON_CONTACT_RELAY = safeRelayUrl("wss://purplepag.es") as string;
export const COMMON_CONTACT_RELAYS = [COMMON_CONTACT_RELAY];

export const DEFAULT_SIGNAL_RELAYS = safeRelayUrls(["wss://nostrue.com/", "wss://relay.damus.io"]);

export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  {
    urls: ["stun:freeturn.net:3479"],
  },
  {
    urls: ["turn:freeturn.net:3479"],
    username: "free",
    credential: "free",
  },
  {
    urls: ["stun:stun.l.google.com:19302"],
  },
];
