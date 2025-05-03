import { lazy } from "react";
import { Link, Text } from "@chakra-ui/react";
import { CacheRelay } from "nostr-idb";
import { Link as RouterLink } from "react-router-dom";

import WasmRelay from "../../../../services/wasm-relay";
import SimpleView from "../../../../components/layout/presets/simple-view";
import useCacheRelay from "../../../../hooks/use-cache-relay";

const WasmDatabasePage = lazy(() => import("./wasm"));
const InternalDatabasePage = lazy(() => import("./internal"));

export default function DatabaseView() {
  const cacheRelay = useCacheRelay();

  let content = (
    <Text>
      noStrudel 无法访问所选缓存中继的数据库{" "}
      <Link as={RouterLink} to="/relays/cache" color="blue.500">
        Change cache relay
      </Link>
    </Text>
  );

  if (cacheRelay instanceof WasmRelay) content = <WasmDatabasePage />;
  else if (cacheRelay instanceof CacheRelay) content = <InternalDatabasePage />;

  return <SimpleView title="事件缓存">{content}</SimpleView>;
}
