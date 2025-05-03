import { Code, Flex, Link, Text } from "@chakra-ui/react";
import { IdentityStatus } from "applesauce-loaders/helpers/dns-identity";
import { useActiveAccount } from "applesauce-react/hooks";
import { Link as RouterLink } from "react-router-dom";

import SimpleView from "../../../components/layout/presets/simple-view";
import RelayFavicon from "../../../components/relay-favicon";
import { useUserDNSIdentity } from "../../../hooks/use-user-dns-identity";

function RelayItem({ url }: { url: string }) {
  return (
    <Flex gap="2" alignItems="center">
      <RelayFavicon relay={url} size="sm" />
      <Link as={RouterLink} to={`/relays/${encodeURIComponent(url)}`} isTruncated>
        {url}
      </Link>
    </Flex>
  );
}

export default function NIP05RelaysView() {
  const account = useActiveAccount();
  const nip05 = useUserDNSIdentity(account?.pubkey);

  return (
    <SimpleView title="NIP-05 中继">
      <Text fontStyle="italic" mt="-2">
        这些中继无法通过 noStrudel 修改, 它们必须要在你的域名身份提供方手动配置{" "}
        <Code>/.well-known/nostr.json</Code> 文件
        <br />
        <Link
          href="https://nostr.how/zh/guides/get-verified#self-hosted"
          isExternal
          color="blue.500"
          fontStyle="initial"
        >
          阅读更多有关 NIP-05 的信息
        </Link>
      </Text>

      {nip05?.status === IdentityStatus.Found && nip05?.relays?.map((url) => <RelayItem key={url} url={url} />)}
    </SimpleView>
  );
}
