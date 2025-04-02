import { useEffect } from "react";
import { Alert, AlertIcon, Button, CloseButton, Flex, Heading, Input, Text, useInterval } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useObservable } from "applesauce-react/hooks";

import webRtcRelaysService from "../../../services/webrtc-relays";
import NostrWebRtcBroker from "../../../classes/webrtc/nostr-webrtc-broker";
import QRCodeScannerButton from "../../../components/qr-code/qr-code-scanner-button";
import UserAvatar from "../../../components/user/user-avatar";
import UserName from "../../../components/user/user-name";
import localSettings from "../../../services/local-settings";
import useForceUpdate from "../../../hooks/use-force-update";
import SimpleView from "../../../components/layout/presets/simple-view";

export default function WebRtcConnectView() {
  const update = useForceUpdate();
  useInterval(update, 1000);

  useEffect(() => {
    webRtcRelaysService.broker.on("call", update);
    return () => {
      webRtcRelaysService.broker.off("call", update);
    };
  }, [update]);

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    defaultValues: {
      uri: "",
    },
    mode: "all",
  });

  const connect = handleSubmit(async (values) => {
    webRtcRelaysService.connect(values.uri);
    localSettings.webRtcRecentConnections.next([...localSettings.webRtcRecentConnections.value, values.uri]);
    reset();
  });

  const recent = useObservable(localSettings.webRtcRecentConnections)
    .map((uri) => ({ ...NostrWebRtcBroker.parseNostrWebRtcURI(uri), uri }))
    .filter(({ pubkey }) => !webRtcRelaysService.broker.peers.has(pubkey));

  return (
    <SimpleView title="连接 WebRTC 中继">
      <Text fontStyle="italic" mt="-2">
        扫描或粘贴你要连接的 WebRTC 中继 URI
      </Text>

      <Flex as="form" gap="2" onSubmit={connect}>
        <Input placeholder="webrtc+nostr:npub1..." {...register("uri")} autoComplete="off" />
        <QRCodeScannerButton onResult={(data) => setValue("uri", data)} />
        <Button colorScheme="primary" type="submit" isLoading={formState.isSubmitting}>
          连接
        </Button>
      </Flex>

      {recent.length > 0 && (
        <>
          <Heading size="md" mt="2">
            最近连接:
          </Heading>
          {recent.map(({ pubkey, uri }) => (
            <Flex key={pubkey} borderWidth="1px" rounded="md" p="2" alignItems="center" gap="2">
              <UserAvatar pubkey={pubkey} size="sm" />
              <UserName pubkey={pubkey} />
              <Button
                size="sm"
                ml="auto"
                colorScheme="primary"
                onClick={() => {
                  webRtcRelaysService.connect(uri);
                  update();
                }}
              >
                连接
              </Button>
              <CloseButton
                onClick={() =>
                  localSettings.webRtcRecentConnections.next(
                    localSettings.webRtcRecentConnections.value.filter((u) => u !== uri),
                  )
                }
              />
            </Flex>
          ))}
        </>
      )}

      <Heading size="md" mt="4">
        正在连接中的请求:
      </Heading>
      {webRtcRelaysService.pendingOutgoing.length > 0 ? (
        <>
          {webRtcRelaysService.pendingOutgoing.map(({ call, peer }) => (
            <Flex key={call.id} borderWidth="1px" rounded="md" p="2" alignItems="center" gap="2">
              {peer.peer && (
                <>
                  <UserAvatar pubkey={peer.peer} size="sm" />
                  <UserName pubkey={peer.peer} />
                </>
              )}
              <Text>{peer.connection.connectionState}</Text>
            </Flex>
          ))}
        </>
      ) : (
        <Alert status="info">
          <AlertIcon />
          没有连接请求
        </Alert>
      )}
    </SimpleView>
  );
}
