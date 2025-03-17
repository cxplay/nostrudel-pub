import { useCallback } from "react";
import { Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { kinds } from "nostr-tools";

import RequireCurrentAccount from "../../../providers/route/require-current-account";
import useUserMailboxes from "../../../hooks/use-user-mailboxes";
import useCurrentAccount from "../../../hooks/use-current-account";
import { InboxIcon, OutboxIcon } from "../../../components/icons";
import MediaServerFavicon from "../../../components/media-server/media-server-favicon";
import { RelayMode } from "../../../classes/relay";
import { NostrEvent } from "../../../types/nostr-event";
import useAsyncErrorHandler from "../../../hooks/use-async-error-handler";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import BackButton from "../../../components/router/back-button";
import { addRelayModeToMailbox, removeRelayModeFromMailbox } from "../../../helpers/nostr/mailbox";
import AddRelayForm from "../app/add-relay-form";
import DebugEventButton from "../../../components/debug-modal/debug-event-button";
import useReplaceableEvent from "../../../hooks/use-replaceable-event";
import { COMMON_CONTACT_RELAYS } from "../../../const";

function RelayLine({ relay, mode, list }: { relay: string; mode: RelayMode; list?: NostrEvent }) {
  const publish = usePublishEvent();
  const remove = useAsyncErrorHandler(async () => {
    const draft = removeRelayModeFromMailbox(list, relay, mode);
    await publish("删除中继", draft, COMMON_CONTACT_RELAYS);
  }, [relay, mode, list, publish]);

  return (
    <Flex key={relay} gap="2" alignItems="center" overflow="hidden">
      <MediaServerFavicon server={relay} size="xs" />
      <Link as={RouterLink} to={`/r/${encodeURIComponent(relay)}`} isTruncated>
        {relay}
      </Link>
      <IconButton
        aria-label="删除中继"
        icon={<CloseIcon />}
        size="xs"
        ml="auto"
        colorScheme="red"
        variant="ghost"
        onClick={remove}
      />
    </Flex>
  );
}

function MailboxesPage() {
  const account = useCurrentAccount()!;
  const publish = usePublishEvent();
  const mailboxes = useUserMailboxes(account.pubkey, undefined, { alwaysRequest: true, ignoreCache: true });
  const event = useReplaceableEvent({ kind: kinds.RelayList, pubkey: account.pubkey });

  const addRelay = useCallback(
    async (relay: string, mode: RelayMode) => {
      const draft = addRelayModeToMailbox(event ?? undefined, relay, mode);
      await publish("添加中继", draft, COMMON_CONTACT_RELAYS);
    },
    [event],
  );

  return (
    <Flex gap="2" direction="column" overflow="auto hidden" flex={1} px="2">
      <Flex gap="2" alignItems="center">
        <BackButton hideFrom="lg" size="sm" />
        <Heading size="lg">信箱</Heading>
        {event && <DebugEventButton event={event} size="sm" ml="auto" />}
      </Flex>
      <Text fontStyle="italic" mt="-2">
        信箱中继是其他用户查找和发送事件给你的账户的一种方式, 它定义于 {" "}
        <Link
          color="blue.500"
          isExternal
          href={`https://github.com/nostr-protocol/nips/blob/master/65.md`}
          textDecoration="underline"
        >
          NIP-65
        </Link>
      </Text>

      <Flex gap="2" mt="2">
        <InboxIcon boxSize={5} />
        <Heading size="md">收件箱</Heading>
      </Flex>
      <Text fontStyle="italic" mt="-2">
        这些中继用于声明其他用户(代理)应该将私信和笔记通过哪些中继发送给你
      </Text>
      {Array.from(mailboxes?.inboxes ?? [])
        .sort()
        .map((url) => (
          <RelayLine key={url} relay={url} mode={RelayMode.READ} list={event ?? undefined} />
        ))}
      <AddRelayForm onSubmit={(r) => addRelay(r, RelayMode.READ)} />

      <Flex gap="2" mt="4">
        <OutboxIcon boxSize={5} />
        <Heading size="md">发件箱</Heading>
      </Flex>
      <Text fontStyle="italic" mt="-2">
        这些中继定义客户端(noStrudel)应该将你的内容发布至哪些中继, 以便于其他用户通过这些中继找到你的笔记
      </Text>
      {Array.from(mailboxes?.outboxes ?? [])
        .sort()
        .map((url) => (
          <RelayLine key={url} relay={url} mode={RelayMode.WRITE} list={event ?? undefined} />
        ))}
      <AddRelayForm onSubmit={(r) => addRelay(r, RelayMode.WRITE)} />
    </Flex>
  );
}

export default function MailboxesView() {
  return (
    <RequireCurrentAccount>
      <MailboxesPage />
    </RequireCurrentAccount>
  );
}
