import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import DefaultAuthModeSelect from "../../../../components/settings/default-auth-mode-select";
import authenticationSigner from "../../../../services/authentication-signer";
import RelayAuthCard from "../../../../components/relays/relay-auth-card";

export default function RelayAuthenticationTab() {
  const relayState = useObservable(authenticationSigner.relayState$);

  return (
    <>
      <Flex gap="2" px="2" pt="2" alignItems="center">
        <Text as="label" htmlFor="defaultAuthenticationMode">
          默认模式:
        </Text>
        <DefaultAuthModeSelect id="defaultAuthenticationMode" w="auto" />
      </Flex>
      <SimpleGrid spacing="2" columns={{ base: 1, md: 2 }} p="2">
        {Object.keys(relayState).map((relay) => (
          <RelayAuthCard key={relay} relay={relay} />
        ))}
      </SimpleGrid>
    </>
  );
}
