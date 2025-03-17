import { memo, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  Heading,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { nip19 } from "nostr-tools";

import { useActiveAccount } from "applesauce-react/hooks";
import useUserContactList from "../../../hooks/use-user-contact-list";
import { useWebOfTrust } from "../../../providers/global/web-of-trust-provider";
import UserAvatar from "../../../components/user/user-avatar";
import UserName from "../../../components/user/user-name";
import HoverLinkOverlay from "../../../components/hover-link-overlay";
import VerticalPageLayout from "../../../components/vertical-page-layout";
import useForceUpdate from "../../../hooks/use-force-update";

const UserCard = memo(({ pubkey, blindspot }: { pubkey: string; blindspot: string[] }) => {
  return (
    <Card display="block" p="4">
      <UserAvatar pubkey={pubkey} mr="4" float="left" />
      <Heading size="md" isTruncated>
        <HoverLinkOverlay as={RouterLink} to={`/discovery/blindspot/${nip19.npubEncode(pubkey)}`}>
          <UserName pubkey={pubkey} />
        </HoverLinkOverlay>
      </Heading>
      <Text>关注了你还没有关注的 {blindspot.length} 个用户</Text>
    </Card>
  );
});

export default function BlindspotHomeView() {
  const account = useActiveAccount()!;
  const [sort, setSort] = useState("quality"); // follows, quality

  const contacts = useUserContactList(account.pubkey);
  const graph = useWebOfTrust();

  const update = useForceUpdate();
  useEffect(() => {
    graph?.on("computed", update);
    return () => {
      graph?.off("computed", update);
    };
  }, [graph]);

  const pubkeys = useMemo(() => graph?.connections.get(account.pubkey), [contacts]);

  const blindspots = useMemo(() => {
    if (!contacts || !pubkeys) return [];

    const arr = Array.from(pubkeys)
      .map((pubkey) => {
        const following = graph?.connections.get(pubkey);
        const blindspot = following?.filter((p) => !pubkeys.includes(p) && p !== account.pubkey) ?? [];

        return { pubkey, blindspot };
      })
      .filter((p) => p.blindspot.length > 2);

    if (sort === "follows") {
      return arr.sort((a, b) => b.blindspot.length - a.blindspot.length);
    } else {
      // the average distance to pubkeys in the blindspot
      const quality = new Map<string, number>();
      for (const { pubkey, blindspot } of arr) {
        const total = blindspot.reduce((t, p) => t + (graph?.distance.get(p) ?? 0), 0);
        quality.set(pubkey, total / blindspot.length);
      }

      return arr.sort((a, b) => quality.get(a.pubkey)! - quality.get(b.pubkey)!);
    }
  }, [account.pubkey, pubkeys, graph, sort]);

  return (
    <VerticalPageLayout>
      <Box>
        <Heading>盲点透视</Heading>
        <Text fontStyle="italic">选择另一个用户查看他看到了什么你没有看到的东西.</Text>
      </Box>
      <Select ml="auto" maxW="48" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="quality">Quality</option>
        <option value="follows">Follows</option>
      </Select>

      {blindspots.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="4">
          {blindspots.map(({ pubkey, blindspot }) => (
            <UserCard key={pubkey} blindspot={blindspot} pubkey={pubkey} />
          ))}
        </SimpleGrid>
      ) : (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            没有盲点!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            没有找到任何盲点. 也许可以尝试关注一些人?
          </AlertDescription>
        </Alert>
      )}
    </VerticalPageLayout>
  );
}
