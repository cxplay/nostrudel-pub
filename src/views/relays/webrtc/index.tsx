import { useEffect } from "react";
import { Alert, AlertIcon, Button, ButtonGroup, Heading, Link, Text, useInterval } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import webRtcRelaysService from "../../../services/webrtc-relays";
import { QrCodeIcon } from "../../../components/icons";
import Connection from "./components/connection";
import useForceUpdate from "../../../hooks/use-force-update";
import SimpleView from "../../../components/layout/presets/simple-view";

export default function WebRtcRelaysView() {
  const update = useForceUpdate();
  useInterval(update, 1000);
  useEffect(() => {
    webRtcRelaysService.broker.on("call", update);

    return () => {
      webRtcRelaysService.broker.off("call", update);
    };
  }, [update]);

  const unanswered = webRtcRelaysService.pendingIncoming.length;

  return (
    <SimpleView
      title="WebRTC 中继"
      actions={
        <ButtonGroup size="sm" ml="auto">
          <Button as={RouterLink} to="/relays/webrtc/pair" leftIcon={<QrCodeIcon />}>
            配对{unanswered > 0 ? ` (${unanswered})` : ""}
          </Button>
          <Button as={RouterLink} to="/relays/webrtc/connect" colorScheme="primary">
            连接
          </Button>
        </ButtonGroup>
      }
    >
      <Text fontStyle="italic" mt="-2">
        WebRTC 中继是可以通过{" "}
        <Link href="https://webrtc.org/" target="_blank" color="blue.500">
          WebRTC
        </Link>{" "}访问的临时中继
      </Text>

      <Heading size="md" mt="2">
        连接:
      </Heading>
      {webRtcRelaysService.answered.length > 0 ? (
        webRtcRelaysService.answered.map(({ call, peer, pubkey }) => (
          <Connection
            key={pubkey}
            peer={peer}
            call={call}
            client={webRtcRelaysService.clients.get(pubkey)!}
            server={webRtcRelaysService.servers.get(pubkey)!}
          />
        ))
      ) : (
        <Alert status="info">
          <AlertIcon />
          还没有连接, 使用 "邀请" 或 "连接" 按钮进行对等连接
        </Alert>
      )}
    </SimpleView>
  );
}
