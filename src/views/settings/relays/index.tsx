import { MouseEventHandler, useCallback, useMemo } from "react";
import { Button, Card, CardBody, CardHeader, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { IdentityStatus } from "applesauce-loaders/helpers/dns-identity";
import { mergeRelaySets } from "applesauce-core/helpers";

import { JAPANESE_RELAYS, RECOMMENDED_READ_RELAYS, RECOMMENDED_WRITE_RELAYS } from "../../../const";
import AddRelayForm from "./add-relay-form";
import { useReadRelays, useWriteRelays } from "../../../hooks/use-client-relays";
import { useActiveAccount } from "applesauce-react/hooks";
import RelayControl from "./relay-control";
import { getRelaysFromExt } from "../../../helpers/nip07";
import { useUserDNSIdentity } from "../../../hooks/use-user-dns-identity";
import useUserContactRelays from "../../../hooks/use-user-contact-relays";
import HoverLinkOverlay from "../../../components/hover-link-overlay";
import SimpleView from "../../../components/layout/presets/simple-view";
import localSettings from "../../../services/local-settings";
import { addAppRelay, RelayMode } from "../../../services/app-relays";
import useUserMailboxes from "../../../hooks/use-user-mailboxes";

function RelaySetCard({ label, read, write }: { label: string; read: Iterable<string>; write: Iterable<string> }) {
  const handleClick = useCallback<MouseEventHandler>((e) => {
    e.preventDefault();
    localSettings.readRelays.next(Array.from(read));
    localSettings.writeRelays.next(Array.from(write));
  }, []);

  return (
    <Card w="full" variant="outline">
      <CardHeader px="4" pt="4" pb="2">
        <Heading size="sm">
          <HoverLinkOverlay href="#" onClick={handleClick}>
            {label}:
          </HoverLinkOverlay>
        </Heading>
      </CardHeader>
      <CardBody px="4" pt="0" pb="4">
        {mergeRelaySets(read, write).map((url) => (
          <Text key={url} whiteSpace="pre" isTruncated>
            {url}
          </Text>
        ))}
      </CardBody>
    </Card>
  );
}

export default function AppRelaysView() {
  const account = useActiveAccount();
  const readRelays = useReadRelays();
  const writeRelays = useWriteRelays();
  const mailboxes = useUserMailboxes(account?.pubkey);
  const nip05 = useUserDNSIdentity(account?.pubkey);
  const contactRelays = useUserContactRelays(account?.pubkey);

  const sorted = useMemo(() => mergeRelaySets(readRelays, writeRelays).sort(), [readRelays, writeRelays]);

  return (
    <SimpleView title="应用中继" maxW="6xl">
      <Text fontStyle="italic" px="2" mt="-2">
        这部分中继保存在本地, 应用中的所有功能都会使用这组中继设置.
      </Text>

      {sorted.map((url) => (
        <RelayControl key={url} url={url} />
      ))}
      <AddRelayForm
        onSubmit={(url) => {
          addAppRelay(url, RelayMode.BOTH);
        }}
      />

      {writeRelays.length === 0 && (
        <Text color="yellow.500">
          <WarningIcon /> 没有设置写入中继, 创建的笔记可能无法保存.
        </Text>
      )}

      <Heading size="md" mt="2">
        读取预设
      </Heading>
      <Flex wrap="wrap" gap="2">
        {window.nostr && (
          <Button
            onClick={async () => {
              const { read, write } = await getRelaysFromExt();
              localSettings.readRelays.next(Array.from(read));
              localSettings.writeRelays.next(Array.from(write));
            }}
          >
            浏览器扩展
          </Button>
        )}
        {mailboxes && (
          <Button
            onClick={() => {
              localSettings.readRelays.next(mailboxes.inboxes);
              localSettings.writeRelays.next(mailboxes.outboxes);
            }}
          >
            NIP-65 (信箱模型)
          </Button>
        )}
        {nip05?.status === IdentityStatus.Found && (
          <Button
            onClick={() => {
              if (!nip05.relays) return;
              localSettings.readRelays.next(Array.from(nip05.relays));
              localSettings.writeRelays.next(Array.from(nip05.relays));
            }}
          >
            NIP-05
          </Button>
        )}
        {contactRelays && (
          <Button
            onClick={() => {
              localSettings.readRelays.next(contactRelays.inbox);
              localSettings.writeRelays.next(contactRelays.outbox);
            }}
          >
            通讯录中继 (Legacy)
          </Button>
        )}
      </Flex>

      <Heading size="md" mt="2">
        预设
      </Heading>
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing="2">
        <RelaySetCard label="推荐中继" read={RECOMMENDED_READ_RELAYS} write={RECOMMENDED_WRITE_RELAYS} />
        <RelaySetCard label="日语中继" read={JAPANESE_RELAYS} write={JAPANESE_RELAYS} />
      </SimpleGrid>
    </SimpleView>
  );
}
