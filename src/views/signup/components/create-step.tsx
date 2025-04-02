import { useEffect, useState } from "react";
import { generateSecretKey, finalizeEvent, kinds } from "nostr-tools";
import { Avatar, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { bytesToHex } from "@noble/hashes/utils";
import { ProfileContent, unixNow } from "applesauce-core/helpers";

import { containerProps } from "./common";
import { nostrBuildUploadImage } from "../../../helpers/media-upload/nostr-build";
import { COMMON_CONTACT_RELAYS } from "../../../const";
import { DraftNostrEvent } from "../../../types/nostr-event";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import { SimpleAccount } from "applesauce-accounts/accounts";
import { useAccountManager } from "applesauce-react/hooks";

export default function CreateStep({
  metadata,
  profileImage,
  relays,
  onBack,
  onSubmit,
}: {
  metadata: ProfileContent;
  relays: string[];
  profileImage?: File;
  onBack: () => void;
  onSubmit: (secretKey: string) => void;
}) {
  const publish = usePublishEvent();
  const toast = useToast();
  const manager = useAccountManager();

  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

  const [loading, setLoading] = useState(false);
  const createProfile = async () => {
    setLoading(true);
    try {
      const key = generateSecretKey();

      const uploaded = profileImage
        ? await nostrBuildUploadImage(profileImage, async (draft) => finalizeEvent(draft, key))
        : undefined;

      // create profile
      const kind0 = finalizeEvent(
        {
          content: JSON.stringify({ ...metadata, picture: uploaded?.url }),
          created_at: unixNow(),
          kind: kinds.Metadata,
          tags: [],
        },
        key,
      );

      await publish("创建用户资料", kind0, [...relays, ...COMMON_CONTACT_RELAYS]);

      // login
      const account = SimpleAccount.fromKey(key);
      manager.addAccount(account);
      manager.setActive(account);

      // set relays
      const draft: DraftNostrEvent = {
        kind: kinds.RelayList,
        content: "",
        tags: relays.map((url) => ["r", url]),
        created_at: unixNow(),
      };
      const signed = finalizeEvent(draft, key);
      await publish("设置信箱中继", signed, relays);

      onSubmit(bytesToHex(key));
    } catch (e) {
      if (e instanceof Error) toast({ description: e.message, status: "error" });
    }
    setLoading(false);
  };

  return (
    <Flex gap="4" {...containerProps}>
      <Avatar size="xl" src={preview} />
      <Flex direction="column" alignItems="center">
        <Heading size="md">{metadata.displayName}</Heading>
        {metadata.about && <Text>{metadata.about}</Text>}
      </Flex>
      <Button w="full" colorScheme="primary" isLoading={loading} onClick={createProfile} autoFocus>
        创建用户资料
      </Button>
      <Button w="full" variant="link" onClick={onBack}>
        返回
      </Button>
    </Flex>
  );
}
