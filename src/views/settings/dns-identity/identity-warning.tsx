import { Link, Text } from "@chakra-ui/react";
import { Identity, IdentityStatus } from "applesauce-loaders/helpers/dns-identity";
import { ExternalLinkIcon } from "../../../components/icons";

export default function DNSIdentityWarning({ identity, pubkey }: { pubkey: string; identity: Identity }) {
  switch (identity?.status) {
    case IdentityStatus.Missing:
      return <Text color="red.500">无法在域名的 nostr.json 文件中找到有效身份声明</Text>;
    case IdentityStatus.Error:
      return (
        <Text color="yellow.500">
          由于 CORS 错误无法检查域名身份{" "}
          <Link
            color="blue.500"
            href={`https://cors-test.codehappy.dev/?url=${encodeURIComponent(`https://${identity.domain}/.well-known/nostr.json?name=${identity.name}`)}&method=get`}
            isExternal
          >
            Test
            <ExternalLinkIcon ml="1" />
          </Link>
        </Text>
      );
    case IdentityStatus.Found:
      if (identity.pubkey !== pubkey)
        return (
          <Text color="red.500" fontWeight="bold">
            无效的域名身份
          </Text>
        );
    default:
      return null;
  }
}
