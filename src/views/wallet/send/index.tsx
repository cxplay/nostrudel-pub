import { Button, Card, LinkBox, Text } from "@chakra-ui/react";

import SimpleView from "../../../components/layout/presets/simple-view";
import { ECashIcon, LightningIcon } from "../../../components/icons";
import HoverLinkOverlay from "../../../components/hover-link-overlay";
import RouterLink from "../../../components/router-link";

export default function WalletSendView() {
  return (
    <SimpleView title="发送" maxW="xl" center>
      <Card as={LinkBox} p="4" gap="4" display="flex" flexDirection="row" alignItems="center">
        <ECashIcon boxSize={10} />
        <HoverLinkOverlay as={RouterLink} to="/wallet/send/cashu" replace>
          <Text fontWeight="bold" fontSize="xl">
            ECash
          </Text>
        </HoverLinkOverlay>
      </Card>
      <Card as={LinkBox} p="4" gap="4" display="flex" flexDirection="row" alignItems="center">
        <LightningIcon boxSize={10} color="yellow.400" />
        <HoverLinkOverlay as={RouterLink} to="/wallet/pay/lightning" replace>
          <Text fontWeight="bold" fontSize="xl">
            闪电网络
          </Text>
        </HoverLinkOverlay>
      </Card>
      <Button as={RouterLink} to="/wallet" me="auto">
        返回
      </Button>
    </SimpleView>
  );
}
