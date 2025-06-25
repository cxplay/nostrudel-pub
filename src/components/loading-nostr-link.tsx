import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DecodeResult, encodeDecodeResult } from "applesauce-core/helpers";
import { useObservableState } from "applesauce-react/hooks";
import { useContext, useState } from "react";
import { useSet } from "react-use";

import { ExternalLinkIcon, SearchIcon } from "./icons";
import UserLink from "./user/user-link";

import { AppHandlerContext } from "../providers/route/app-handler-provider";
import { addressLoader, eventLoader } from "../services/loaders";
import { connections$ } from "../services/pool";
import RelayFavicon from "./relay-favicon";

function SearchOnRelaysModal({ isOpen, onClose, decode }: Omit<ModalProps, "children"> & { decode: DecodeResult }) {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const discoveredRelays = Object.entries(useObservableState(connections$) ?? {}).reduce<string[]>(
    (arr, [relay, status]) => (status !== "error" ? [...arr, relay] : arr),
    [],
  );
  const [relays, actions] = useSet<string>(new Set(discoveredRelays.slice(0, 4)));

  const searchForEvent = async () => {
    if (relays.size === 0) return;
    setLoading(true);
    switch (decode.type) {
      case "naddr":
        addressLoader({
          ...decode.data,
          relays: [...relays, ...(decode.data.relays ?? [])],
          cache: false,
        }).subscribe();
        break;
      case "note":
        eventLoader({ id: decode.data, relays: Array.from(relays) }).subscribe();
        break;
      case "nevent":
        eventLoader({ id: decode.data.id, relays: Array.from(relays) }).subscribe();
        break;
    }
  };

  const filtered = filter ? discoveredRelays.filter((r) => r.includes(filter)) : discoveredRelays;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p="4">搜索事件</ModalHeader>
        <ModalCloseButton />
        <ModalBody px="2" pb="2" pt="0" gap="2" display="flex" flexDirection="column">
          {loading ? (
            <Heading size="md" mx="auto">
              正在检索 {relays.size} 中继...
            </Heading>
          ) : (
            <>
              <Input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoFocus
                placeholder="过滤中继"
                aria-label="过滤中继"
              />
              <Flex direction="column" role="list" aria-label="可用的中继">
                {filtered.map((relay) => (
                  <Button
                    key={relay}
                    variant="outline"
                    w="full"
                    p="2"
                    leftIcon={<RelayFavicon relay={relay} size="xs" />}
                    justifyContent="flex-start"
                    colorScheme={relays.has(relay) ? "primary" : undefined}
                    onClick={() => (relays.has(relay) ? actions.remove(relay) : actions.add(relay))}
                    role="listitem"
                    aria-pressed={relays.has(relay)}
                  >
                    {relay}
                  </Button>
                ))}
              </Flex>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button colorScheme="primary" onClick={searchForEvent} isLoading={loading}>
              搜索
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function LoadingNostrLink({ link }: { link: DecodeResult }) {
  const { openAddress } = useContext(AppHandlerContext);
  const address = encodeDecodeResult(link);
  const details = useDisclosure();
  const search = useDisclosure();

  const renderDetails = () => {
    switch (link.type) {
      case "note":
        return <Text>ID: {link.data}</Text>;
      case "nevent":
        return (
          <>
            <Text>ID: {link.data.id}</Text>
            {link.data.kind && <Text>Kind: {link.data.kind}</Text>}
            {link.data.author && (
              <Text>
                公钥: <UserLink pubkey={link.data.author} />
              </Text>
            )}
            {link.data.relays && link.data.relays.length > 0 && <Text>中继: {link.data.relays.join(", ")}</Text>}
          </>
        );
      case "npub":
        return <Text>公钥: {link.data}</Text>;
      case "nprofile":
        return (
          <>
            <Text>公钥: {link.data.pubkey}</Text>
            {link.data.relays && link.data.relays.length > 0 && <Text>中继: {link.data.relays.join(", ")}</Text>}
          </>
        );
      case "naddr":
        return (
          <>
            <Text>类型: {link.data.kind}</Text>
            <Text>
              公钥: <UserLink pubkey={link.data.pubkey} />
            </Text>
            <Text>标识符: {link.data.identifier}</Text>
            {link.data.relays && link.data.relays.length > 0 && <Text>中继: {link.data.relays.join(", ")}</Text>}
          </>
        );
    }
    return null;
  };

  return (
    <>
      <Button
        variant="link"
        color="GrayText"
        maxW="lg"
        textAlign="left"
        fontFamily="monospace"
        whiteSpace="pre"
        onClick={details.onToggle}
        aria-expanded={details.isOpen}
        aria-controls="nostr-link-details"
      >
        [{details.isOpen ? "-" : "+"}]
        <Text as="span" isTruncated>
          {address}
        </Text>
      </Button>
      {details.isOpen && (
        <Box
          id="nostr-link-details"
          px="2"
          fontFamily="monospace"
          color="GrayText"
          fontWeight="bold"
          fontSize="sm"
          role="region"
          aria-label="链接详情"
        >
          <Text>Type: {link.type}</Text>
          {renderDetails()}
          <ButtonGroup variant="link" size="sm" my="1">
            <Button leftIcon={<SearchIcon />} colorScheme="primary" onClick={search.onOpen} aria-label="查找事件">
              Find
            </Button>
            <Button
              leftIcon={<ExternalLinkIcon />}
              onClick={() => openAddress(address)}
              aria-label="在新窗口打开"
            >
              Open
            </Button>
          </ButtonGroup>
        </Box>
      )}
      {search.isOpen && <SearchOnRelaysModal isOpen onClose={search.onClose} decode={link} />}
    </>
  );
}
