import { useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import WasmRelay from "../../../../services/wasm-relay";
import EnableWithDelete from "./enable-with-delete";
import useCacheRelay from "../../../../hooks/use-cache-relay";
import { setCacheRelayURL } from "../../../../services/cache-relay";

export default function WasmRelayCard() {
  const cacheRelay = useCacheRelay();
  const enabled = cacheRelay instanceof WasmRelay;
  const [enabling, setEnabling] = useState(false);
  const enable = async () => {
    try {
      setEnabling(true);
      await setCacheRelayURL("nostr-idb://wasm-worker");
    } catch (error) {}
    setEnabling(false);
  };

  const wipe = async () => {
    if (cacheRelay instanceof WasmRelay) {
      await cacheRelay.wipe();
    } else {
      // import and delete database
      console.log("正在将 Worker 导入以清除数据库");
      const { default: worker } = await import("../../../../services/wasm-relay/worker");
      await worker.wipe();
    }
  };

  return (
    <Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
      <CardHeader p="4" display="flex" gap="2" alignItems="center">
        <Heading size="md">内部 SQLite 缓存</Heading>
        <EnableWithDelete size="sm" ml="auto" enable={enable} enabled={enabled} wipe={wipe} isLoading={enabling} />
      </CardHeader>
      <CardBody p="4" pt="0">
        <Text mb="2">
          使用{" "}
          <Link
            href="https://git.v0l.io/Kieran/snort/src/branch/main/packages/worker-relay"
            isExternal
            color="blue.500"
          >
            @snort/worker-relay
          </Link>{" "}
          在浏览器里运行 SQLite.
        </Text>
        <Text>容量: 无限</Text>
        <Text>性能: 比浏览器缓存稍慢</Text>
        <Text color="yellow.500">注意: 会将应用的初始化时间延长大约 2 秒</Text>
        <Text color="yellow.500">注意: 在多窗口下运行效果不太良好</Text>
      </CardBody>
      {enabled && (
        <CardFooter p="4" pt="0">
          <Button size="sm" colorScheme="primary" ml="auto" as={RouterLink} to="/relays/cache/database">
            数据库工具
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
