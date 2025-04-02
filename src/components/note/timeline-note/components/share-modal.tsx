import { useMemo, useState } from "react";
import {
  Button,
  Center,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { NostrEvent } from "nostr-tools";
import { useActiveAccount, useEventFactory } from "applesauce-react/hooks";
import { getMediaAttachments } from "applesauce-core/helpers";
import { getMediaAttachmentURLsFromContent } from "applesauce-content/helpers";
import { BlossomClient } from "blossom-client-sdk";

import { useSigningContext } from "../../../../providers/global/signing-provider";
import { usePublishEvent } from "../../../../providers/global/publish-provider";
import { EmbedEvent } from "../../../embed-event";
import useAppSettings from "../../../../hooks/use-user-app-settings";
import useUsersMediaServers from "../../../../hooks/use-user-media-servers";

export default function ShareModal({
  event,
  isOpen,
  onClose,
  ...props
}: Omit<ModalProps, "children"> & { event: NostrEvent }) {
  const { mirrorBlobsOnShare } = useAppSettings();
  const account = useActiveAccount();
  const publish = usePublishEvent();
  const factory = useEventFactory();
  const toast = useToast();

  const { requestSignature } = useSigningContext();
  const { servers } = useUsersMediaServers(account?.pubkey);
  const [mirror, setMirror] = useState(mirrorBlobsOnShare);
  const mediaAttachments = useMemo(() => {
    const attachments = getMediaAttachments(event)
      // filter out media attachments without hashes
      .filter((media) => !!media.sha256);

    // extra media attachments from content
    const content = getMediaAttachmentURLsFromContent(event.content)
      // remove duplicates
      .filter((media) => !attachments.some((a) => a.sha256 === media.sha256));

    return [...attachments, ...content];
  }, [event]);

  const canMirror = servers.length > 0 && mediaAttachments.length > 0;

  const [loading, setLoading] = useState("");
  const share = async () => {
    if (mirror && canMirror) {
      try {
        setLoading("正在请求 blob 镜像签名...");
        const auth = await BlossomClient.createUploadAuth(
          requestSignature,
          mediaAttachments.filter((m) => !!m.sha256).map((m) => m.sha256!),
        );

        setLoading("镜像 blobs...");
        for (const media of mediaAttachments) {
          // send mirror request to all servers
          await Promise.allSettled(
            servers.map((server) =>
              BlossomClient.mirrorBlob(
                server,
                {
                  sha256: media.sha256!,
                  url: media.url,
                  // TODO: these are not needed and should be removed
                  uploaded: 0,
                  size: media.size ?? 0,
                },
                { auth },
              ).catch((err) => {
                // ignore errors from individual servers
              }),
            ),
          );
        }
      } catch (error) {
        if (error instanceof Error)
          toast({ status: "error", title: `镜像媒体失败`, description: error.message });
      }
    }

    setLoading("正在分享...");
    const draft = await factory.share(event);

    setLoading("正在发布...");
    await publish("Share", draft);
    setLoading("");

    // close modal
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader px="4" py="2">
          分享笔记
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px="4" py="0">
          {loading ? (
            <Center>
              <Spinner /> {loading}
            </Center>
          ) : (
            <>
              <EmbedEvent event={event} />

              {canMirror && (
                <>
                  <Checkbox isChecked={mirror} onChange={() => setMirror(!mirror)} mt="4">
                    镜像媒体 ({mediaAttachments.length}) 到 Blossom 服务器 ({servers.length})
                  </Checkbox>
                  <Text fontSize="sm" color="GrayText">
                    将媒体复制到你的 Blossom 服务器以便日后查找
                  </Text>
                </>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter px="4" py="4">
          <Button variant="ghost" size="md" mr="auto" onClick={onClose} flexShrink={0}>
            取消
          </Button>
          <Button
            colorScheme="primary"
            variant="solid"
            onClick={() => share()}
            size="md"
            isLoading={!!loading}
            flexShrink={0}
          >
            分享
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
