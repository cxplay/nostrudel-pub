import { Button, Flex, Heading, Link, Spinner, Text } from "@chakra-ui/react";
import { useActiveAccount } from "applesauce-react/hooks";
import { Link as RouterLink } from "react-router-dom";
import { EventTemplate } from "nostr-tools";
import dayjs from "dayjs";

import RelayFavicon from "../../../components/relay-favicon";
import useUserContactRelays from "../../../hooks/use-user-contact-relays";
import { CheckIcon } from "../../../components/icons";
import { useCallback, useState } from "react";
import useUserContactList from "../../../hooks/use-user-contact-list";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import SimpleView from "../../../components/layout/presets/simple-view";

export default function ContactListRelaysView() {
  const account = useActiveAccount();
  const contacts = useUserContactList(account?.pubkey);
  const relays = useUserContactRelays(account?.pubkey);
  const publish = usePublishEvent();

  const [loading, setLoading] = useState(false);
  const clearRelays = useCallback(async () => {
    if (!contacts) return;
    if (confirm("你确定要移除这些中继吗? 其他的 Nostr 应用可能会因此受到影响") !== true) return;

    const draft: EventTemplate = {
      kind: contacts.kind,
      content: "",
      tags: contacts.tags,
      created_at: dayjs().unix(),
    };

    setLoading(true);
    await publish("清除中继", draft);
    setLoading(false);
  }, [setLoading, contacts, publish]);

  if (relays === undefined) return <Spinner />;

  return (
    <SimpleView
      title="通讯录中继"
      actions={
        relays && (
          <Button colorScheme="red" onClick={clearRelays} isLoading={loading} ml="auto" size="sm">
            清除中继
          </Button>
        )
      }
    >
      <Text fontStyle="italic" mt="-2">
        某些应用会在通讯录列表中存储中继配置 (kind:3)
        <br />
        noStrudel 不使用该配置, 而是使用{" "}
        <Link as={RouterLink} to="/relays/mailboxes" color="blue.500">
          信箱中继
        </Link>
      </Text>

      {relays === null ? (
        <Text color="green.500" fontSize="lg" mt="4">
          <CheckIcon /> 你的通讯录列表中没有存储任何中继
        </Text>
      ) : (
        <>
          <Heading size="md" mt="2">
            仅读中继
          </Heading>
          {relays.inbox.map((relay) => (
            <Flex key={relay} gap="2" alignItems="center" overflow="hidden">
              <RelayFavicon relay={relay} size="xs" />
              <Link as={RouterLink} to={`/relays/${encodeURIComponent(relay)}`} isTruncated>
                {relay}
              </Link>
            </Flex>
          ))}

          <Heading size="md" mt="2">
            仅写中继
          </Heading>
          {relays.outbox.map((relay) => (
            <Flex key={relay} gap="2" alignItems="center" overflow="hidden">
              <RelayFavicon relay={relay} size="xs" />
              <Link as={RouterLink} to={`/relays/${encodeURIComponent(relay)}`} isTruncated>
                {relay}
              </Link>
            </Flex>
          ))}
        </>
      )}
    </SimpleView>
  );
}
