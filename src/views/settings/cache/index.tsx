import { Box, Button, Divider, Text, useDisclosure } from "@chakra-ui/react";

import { ChevronDownIcon, ChevronUpIcon } from "../../../components/icons";
import WasmRelay from "../../../services/wasm-relay";
import WasmRelayCard from "./components/wasm-relay-card";
import InternalRelayCard from "./components/internal-relay-card";
import CitrineRelayCard from "./components/citrine-relay-card";
import NostrRelayTrayCard from "./components/nostr-relay-tray-card";
import HostedRelayCard from "./components/hosted-relay-card";
import NoRelayCard from "./components/no-relay-card";
import SimpleView from "../../../components/layout/presets/simple-view";
import useCacheRelay from "../../../hooks/use-cache-relay";

export default function CacheRelayView() {
  const cacheRelay = useCacheRelay();
  const showAdvanced = useDisclosure({ defaultIsOpen: cacheRelay?.url === ":none:" || cacheRelay?.url === ":memory:" });

  return (
    <SimpleView title="缓存中继" maxW="4xl">
      <Text fontStyle="italic" mt="-2" px={{ base: "2", lg: 0 }}>
        缓存中继用于本地缓存事件以便于快速加载
      </Text>
      <InternalRelayCard />
      {WasmRelay.SUPPORTED && <WasmRelayCard />}
      {navigator.userAgent.includes("Android") ? <CitrineRelayCard /> : <NostrRelayTrayCard />}
      {window.CACHE_RELAY_ENABLED && <HostedRelayCard />}
      <Button w="full" variant="link" p="4" onClick={showAdvanced.onToggle}>
        <Divider />
        <Box as="span" ml="4" mr="2">
          Advanced
        </Box>
        {showAdvanced.isOpen ? <ChevronUpIcon boxSize={5} mr="2" /> : <ChevronDownIcon boxSize={5} mr="2" />}
        <Divider />
      </Button>
      {showAdvanced.isOpen && (
        <>
          <NoRelayCard />
        </>
      )}
    </SimpleView>
  );
}
