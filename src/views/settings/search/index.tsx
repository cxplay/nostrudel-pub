import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { EventTemplate, kinds } from "nostr-tools";
import dayjs from "dayjs";
import { CloseIcon } from "@chakra-ui/icons";

import BackButton from "../../../components/router/back-button";
import useUserSearchRelayList from "../../../hooks/use-user-search-relay-list";
import { useActiveAccount } from "applesauce-react/hooks";
import { cloneList, getRelaysFromList, listAddRelay, listRemoveRelay } from "../../../helpers/nostr/lists";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import RelayFavicon from "../../../components/relay-favicon";
import AddRelayForm from "../relays/add-relay-form";
import { useRelayInfo } from "../../../hooks/use-relay-info";
import SimpleView from "../../../components/layout/presets/simple-view";

function RelayEntry({
  url,
  onRemove,
  onMakeDefault,
  isDefault,
}: {
  url: string;
  onRemove: () => void;
  onMakeDefault: () => void;
  isDefault: boolean;
}) {
  const { info } = useRelayInfo(url);

  return (
    <Flex
      key={url}
      gap="2"
      alignItems="center"
      p="2"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={isDefault ? "primary.500" : undefined}
    >
      <RelayFavicon relay={url} size="sm" outline="2px solid" />
      <Box overflow="hidden">
        <Link as={RouterLink} to={`/relays/${encodeURIComponent(url)}`} isTruncated>
          {url}
        </Link>
        {info?.supported_nips && !info?.supported_nips.includes(50) && <Text color="red">Search not supported</Text>}
      </Box>
      <ButtonGroup size="sm" ml="auto">
        <Button
          onClick={() => onMakeDefault()}
          variant={isDefault ? "solid" : "ghost"}
          colorScheme={isDefault ? "primary" : undefined}
          isDisabled={isDefault}
        >
          默认
        </Button>
        <IconButton
          aria-label="删除中继"
          icon={<CloseIcon />}
          colorScheme="red"
          onClick={() => onRemove()}
          variant="ghost"
        />
      </ButtonGroup>
    </Flex>
  );
}

function emptySearchRelayList(): EventTemplate {
  return {
    kind: kinds.SearchRelaysList,
    tags: [],
    content: "",
    created_at: dayjs().unix(),
  };
}

export default function SearchRelaysView() {
  const toast = useToast();
  const publish = usePublishEvent();
  const account = useActiveAccount();
  const searchRelayList = useUserSearchRelayList(account?.pubkey);

  const searchRelays = searchRelayList ? getRelaysFromList(searchRelayList) : [];

  const addRelay = async (url: string) => {
    try {
      const draft = listAddRelay(searchRelayList || emptySearchRelayList(), url);
      await publish("添加搜索中继", draft);
    } catch (error) {
      if (error instanceof Error) toast({ status: "error", description: error.message });
    }
  };

  const makeDefault = async (url: string) => {
    try {
      const draft = searchRelayList ? cloneList(searchRelayList) : emptySearchRelayList();
      draft.tags = Array.from(draft.tags).sort((a, b) => (a[1] === url ? -1 : 1));
      await publish("设置默认搜索中继", draft);
    } catch (error) {
      if (error instanceof Error) toast({ status: "error", description: error.message });
    }
  };

  const removeRelay = async (url: string) => {
    try {
      const draft = listRemoveRelay(searchRelayList || emptySearchRelayList(), url);
      await publish("删除搜索中继", draft);
    } catch (error) {
      if (error instanceof Error) toast({ status: "error", description: error.message });
    }
  };

  return (
    <SimpleView title="搜索设置" maxW="4xl">
      <Text fontStyle="italic" px="2" mt="-2">
        这些中继用于检索用户和内容
      </Text>

      {searchRelays.length === 0 && (
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            没有设置搜索中继
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            你需要设置至少一个搜索中继才能使用搜索功能
          </AlertDescription>
          <Button mt="2" onClick={() => addRelay("wss://relay.nostr.band/")}>
            使用 nostr.band 作为搜索中继
          </Button>
        </Alert>
      )}

      {searchRelays.map((url) => (
        <RelayEntry
          key={url}
          url={url}
          onMakeDefault={() => makeDefault(url)}
          onRemove={() => removeRelay(url)}
          isDefault={searchRelays[0] === url}
        />
      ))}

      <AddRelayForm onSubmit={(relay) => addRelay(relay)} supportedNips={[50]} />
    </SimpleView>
  );
}
