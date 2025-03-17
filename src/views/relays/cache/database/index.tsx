import { lazy } from "react";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { CacheRelay } from "nostr-idb";
import { Link as RouterLink } from "react-router-dom";

import BackButton from "../../../../components/router/back-button";
import { localRelay } from "../../../../services/local-relay";
import WasmRelay from "../../../../services/wasm-relay";
import MemoryRelay from "../../../../classes/memory-relay";

const MemoryDatabasePage = lazy(() => import("./memory"));
const WasmDatabasePage = lazy(() => import("./wasm"));
const InternalDatabasePage = lazy(() => import("./internal"));

export default function DatabaseView() {
  let content = (
    <Text>
      noStrudel 无法访问所选缓存中继的数据库{" "}
      <Link as={RouterLink} to="/relays/cache" color="blue.500">
        Change cache relay
      </Link>
    </Text>
  );

  if (localRelay instanceof WasmRelay) content = <WasmDatabasePage />;
  else if (localRelay instanceof CacheRelay) content = <InternalDatabasePage />;
  else if (localRelay instanceof MemoryRelay) content = <MemoryDatabasePage />;

  return (
    <Flex gap="2" direction="column" flex={1}>
      <Flex gap="2" direction="column">
        <Flex gap="2">
          <BackButton hideFrom="lg" size="sm" />
          <Heading size="lg">数据库工具</Heading>
        </Flex>

        {content}
      </Flex>
    </Flex>
  );
}
