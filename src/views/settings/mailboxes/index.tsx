import { useCallback } from "react";
import { Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { kinds } from "nostr-tools";

import RequireActiveAccount from "../../../components/router/require-active-account";
import useUserMailboxes from "../../../hooks/use-user-mailboxes";
import { useActiveAccount } from "applesauce-react/hooks";
import { InboxIcon, OutboxIcon } from "../../../components/icons";
import MediaServerFavicon from "../../../components/favicon/media-server-favicon";
import { NostrEvent } from "../../../types/nostr-event";
import useAsyncAction from "../../../hooks/use-async-error-handler";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import { addRelayModeToMailbox, removeRelayModeFromMailbox } from "../../../helpers/nostr/mailbox";
import AddRelayForm from "../relays/add-relay-form";
import DebugEventButton from "../../../components/debug-modal/debug-event-button";
import useReplaceableEvent from "../../../hooks/use-replaceable-event";
import { COMMON_CONTACT_RELAYS } from "../../../const";
import SimpleView from "../../../components/layout/presets/simple-view";
import { RelayMode } from "../../../services/app-relays";

function RelayLine({ relay, mode, list }: { relay: string; mode: RelayMode; list?: NostrEvent }) {
  const publish = usePublishEvent();
  const remove = useAsyncAction(async () => {
    const draft = removeRelayModeFromMailbox(list, relay, mode);
    await publish("删除回复", draft, COMMON_CONTACT_RELAYS);
  }, [relay, mode, list, publish]);

  return (
    <Flex key={relay} gap="2" alignItems="center" overflow="hidden">
      <MediaServerFavicon server={relay} size="xs" />
      <Link as={RouterLink} to={`/relays/${encodeURIComponent(relay)}`} isTruncated>
        {relay}
      </Link>
      <IconButton
        aria-label="删除中继"
        icon={<CloseIcon />}
        size="xs"
        ml="auto"
        colorScheme="red"
        variant="ghost"
        onClick={remove.run}
        isLoading={remove.loading}
      />
    </Flex>
  );
}

function MailboxesPage() {
  const account = useActiveAccount()!;
  const publish = usePublishEvent();
  const mailboxes = useUserMailboxes(account.pubkey, undefined, true);
  const event = useReplaceableEvent({ kind: kinds.RelayList, pubkey: account.pubkey });

  const addRelay = useCallback(
    async (relay: string, mode: RelayMode) => {
      const draft = addRelayModeToMailbox(event ?? undefined, relay, mode);
      await publish("添加中继", draft, COMMON_CONTACT_RELAYS);
    },
    [event],
  );

  return (
    <SimpleView title="信箱" actions={event && <DebugEventButton event={event} size="sm" ml="auto" />} maxW="4xl">
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
    </SimpleView>
  );
}

export default function MailboxesView() {
  return (
    <RequireActiveAccount>
      <MailboxesPage />
    </RequireActiveAccount>
  );
}
