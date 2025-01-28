import { kinds } from "nostr-tools";
import { IAccount } from "applesauce-accounts";
import { combineLatest, distinct, filter } from "rxjs";
import { USER_BLOSSOM_SERVER_LIST_KIND } from "blossom-client-sdk";

import { COMMON_CONTACT_RELAYS } from "../const";
import { logger } from "../helpers/debug";
import clientRelaysService from "./client-relays";
import { offlineMode } from "./offline-mode";
import replaceableEventLoader from "./replaceable-loader";
import { eventStore, queryStore } from "./event-store";
import { MultiSubscription } from "applesauce-net/subscription";
import relayPoolService from "./relay-pool";
import { APP_SETTING_IDENTIFIER, APP_SETTINGS_KIND } from "../helpers/app-settings";
import accounts from "./accounts";

const log = logger.extend("UserEventSync");
function downloadEvents(account: IAccount) {
  const relays = clientRelaysService.readRelays.value;

  const cleanup: (() => void)[] = [];

  const requestReplaceable = (relays: Iterable<string>, kind: number, d?: string) => {
    replaceableEventLoader.next({ relays: [...relays], kind, pubkey: account.pubkey, identifier: d, force: true });
  };

  log("Loading outboxes");
  requestReplaceable([...relays, ...COMMON_CONTACT_RELAYS], kinds.RelayList);

  const mailboxesSub = queryStore.mailboxes(account.pubkey).subscribe((mailboxes) => {
    log("Loading user information");
    requestReplaceable(mailboxes?.outboxes || relays, kinds.Metadata);
    requestReplaceable(mailboxes?.outboxes || relays, USER_BLOSSOM_SERVER_LIST_KIND);
    requestReplaceable(mailboxes?.outboxes || relays, kinds.SearchRelaysList);
    requestReplaceable(mailboxes?.outboxes || relays, APP_SETTINGS_KIND, APP_SETTING_IDENTIFIER);

    log("Loading contacts list");
    replaceableEventLoader.next({
      relays: [...clientRelaysService.readRelays.value, ...COMMON_CONTACT_RELAYS],
      kind: kinds.Contacts,
      pubkey: account.pubkey,
      force: true,
    });

    if (mailboxes?.outboxes && mailboxes.outboxes.length > 0) {
      log(`Loading delete events`);
      const sub = new MultiSubscription(relayPoolService);
      sub.setRelays(mailboxes.outboxes);
      sub.setFilters([{ kinds: [kinds.EventDeletion], authors: [account.pubkey] }]);

      sub.open();
      sub.onEvent.subscribe((e) => eventStore.add(e));

      cleanup.push(() => sub.close());
    }
  });

  return () => {
    for (const fn of cleanup) fn();
    mailboxesSub.unsubscribe();
  };
}

combineLatest([
  // listen for account changes
  accounts.active$.pipe(
    filter((a) => !!a),
    distinct((a) => a.pubkey),
  ),
  // listen for offline mode changes
  offlineMode.pipe(distinct()),
])
  .pipe(filter(([_, offline]) => !offline))
  .subscribe(([account]) => downloadEvents(account));
