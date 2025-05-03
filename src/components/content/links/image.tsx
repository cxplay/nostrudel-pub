import {
  Button,
  ButtonProps,
  Code,
  Image,
  ImageProps,
  Link,
  LinkProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import {
  getHashFromURL,
  getServersFromServerListEvent,
  handleImageFallbacks,
  USER_BLOSSOM_SERVER_LIST_KIND,
} from "blossom-client-sdk";
import { NostrEvent } from "nostr-tools";
import { forwardRef, MouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";

import { buildImageProxyURL } from "../../../helpers/image";
import { isImageURL } from "../../../helpers/url";
import useElementTrustBlur from "../../../hooks/use-element-trust-blur";
import useAppSettings from "../../../hooks/use-user-app-settings";
import { useMediaOwnerContext } from "../../../providers/local/media-owner-provider";
import { eventStore } from "../../../services/event-store";
import { useRegisterSlide } from "../../lightbox-provider";
import ExpandableEmbed from "../components/expandable-embed";

export type TrustImageProps = ImageProps;

export const TrustImage = forwardRef<HTMLImageElement, TrustImageProps>((props, ref) => {
  const { blurImages } = useAppSettings();
  const { onClick, style } = useElementTrustBlur();

  const handleClick = useCallback<MouseEventHandler<HTMLImageElement>>(
    (e) => {
      onClick(e);
      if (props.onClick && !e.isPropagationStopped()) {
        props.onClick(e);
      }
    },
    [onClick, props.onClick],
  );

  if (!blurImages) return <Image {...props} ref={ref} />;
  else return <Image {...props} onClick={handleClick} style={{ ...style, ...props.style }} ref={ref} />;
});

export type EmbeddedImageProps = Omit<LinkProps, "children" | "href" | "onClick"> & {
  src?: string;
  event?: NostrEvent;
  imageProps?: TrustImageProps;
};

export function getPubkeyMediaServers(pubkey?: string) {
  if (!pubkey) return;

  return new Promise<URL[] | undefined>((res) => {
    const event = eventStore.getReplaceable(USER_BLOSSOM_SERVER_LIST_KIND, pubkey);
    const servers = event && getServersFromServerListEvent(event);

    if (servers) res(servers);
  });
}

export function useImageThumbnail(src?: string) {
  return (src && buildImageProxyURL(src, "512,fit")) ?? src;
}

export function EmbeddedImage({ src, event, imageProps, ...props }: EmbeddedImageProps) {
  const owner = useMediaOwnerContext();
  const thumbnail = useImageThumbnail(src);

  const ref = useRef<HTMLImageElement | null>(null);
  const { show } = useRegisterSlide(ref, src ? { type: "image", src, event } : undefined);
  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      !e.isPropagationStopped() && show();
      e.preventDefault();
    },
    [show],
  );

  useEffect(() => {
    if (ref.current) handleImageFallbacks(ref.current, getPubkeyMediaServers);
  }, []);

  return (
    <Link href={src} isExternal onClick={handleClick} display="inline-block" {...props}>
      <TrustImage
        {...imageProps}
        src={thumbnail}
        cursor="pointer"
        ref={ref}
        onClick={handleClick}
        data-pubkey={owner}
      />
    </Link>
  );
}

function VerifyImageButton({
  src,
  original,
  ...props
}: { src: URL; original: string } & Omit<ButtonProps, "children" | "onClick">) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const modal = useDisclosure();
  const [downloaded, setDownloaded] = useState<string>();
  const [matches, setMatches] = useState<boolean>();
  const verify = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (matches !== undefined) return modal.onOpen();

      setLoading(true);
      try {
        const buff = await fetch(src).then((res) => res.arrayBuffer());
        const downloaded = bytesToHex(sha256.create().update(new Uint8Array(buff)).digest());
        setDownloaded(downloaded);

        setMatches(original === downloaded);
      } catch (error) {
        if (error instanceof Error) toast({ status: "error", description: error.message });
      }
      setLoading(false);
    },
    [src, matches],
  );

  return (
    <>
      <Button
        onClick={verify}
        isLoading={loading}
        colorScheme={matches === undefined ? undefined : matches ? "green" : "red"}
        {...props}
      >
        [ {matches === undefined ? "验证" : matches ? "有效" : "无效!"} ]
      </Button>
      {modal.isOpen && downloaded && (
        <Modal isOpen={modal.isOpen} onClose={modal.onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader p="4">无效的 Hash</ModalHeader>
            <ModalCloseButton />
            <ModalBody px="4" pb="4" pt="0">
              <Text fontWeight="bold">原始:</Text>
              <Code>{original}</Code>

              <Text fontWeight="bold">已下载:</Text>
              <Code>{downloaded}</Code>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

// nostr:nevent1qqsfhafvv705g5wt8rcaytkj6shsshw3dwgamgfe3za8knk0uq4yesgpzpmhxue69uhkummnw3ezuamfdejszrthwden5te0dehhxtnvdakqsrnltk
export function renderImageUrl(match: URL) {
  if (!isImageURL(match)) return null;

  const hash = getHashFromURL(match);

  return (
    <ExpandableEmbed
      label="图片"
      url={match}
      actions={hash ? <VerifyImageButton src={match} original={hash} zIndex={1} /> : undefined}
    >
      <EmbeddedImage src={match.toString()} imageProps={{ maxH: ["initial", "35vh"] }} />
    </ExpandableEmbed>
  );
}
