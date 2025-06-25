import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableProps,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Spinner,
  Text,
  useEditableControls,
  useToast,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { getProfileContent, mergeRelaySets, parseNIP05Address, ProfileContent } from "applesauce-core/helpers";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { kinds } from "nostr-tools";
import { setContent } from "applesauce-factory/operations/event";
import { IdentityStatus } from "applesauce-loaders/helpers/dns-identity";
import { useAsync } from "react-use";

import SimpleView from "../../../components/layout/presets/simple-view";
import { useActiveAccount, useEventFactory, useEventStore } from "applesauce-react/hooks";
import useUserProfile from "../../../hooks/use-user-profile";
import dnsIdentityLoader from "../../../services/dns-identity-loader";
import WikiLink from "../../../components/markdown/wiki-link";
import RawValue from "../../../components/debug-modal/raw-value";
import { ExternalLinkIcon } from "../../../components/icons";
import useUserMailboxes from "../../../hooks/use-user-mailboxes";
import { useWriteRelays } from "../../../hooks/use-client-relays";
import { DEFAULT_LOOKUP_RELAYS } from "../../../const";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import RelayFavicon from "../../../components/relay-favicon";
import RouterLink from "../../../components/router-link";

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} aria-label="保存" />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} aria-label="取消" />
    </ButtonGroup>
  ) : (
    <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} aria-label="编辑" />
  );
}

function EditableIdentity() {
  const factory = useEventFactory();
  const eventStore = useEventStore();
  const account = useActiveAccount();
  const toast = useToast();
  const publish = usePublishEvent();

  const profile = useUserProfile(account?.pubkey);
  const mailboxes = useUserMailboxes();
  const publishRelays = useWriteRelays();

  const onSubmit: EditableProps["onSubmit"] = async (value) => {
    if (!account) return;
    try {
      const metadata = eventStore.getReplaceable(kinds.Metadata, account.pubkey);
      if (!metadata) throw new Error("无法找到用户资料");

      const profile = getProfileContent(metadata);
      const newProfile = { ...profile, nip05: value };
      const draft = await factory.modify(metadata, setContent(JSON.stringify(newProfile)));
      const signed = await account.signEvent(draft);

      await publish("更新 NIP-05", signed, mergeRelaySets(publishRelays, mailboxes?.outboxes, DEFAULT_LOOKUP_RELAYS));
    } catch (error) {
      if (error instanceof Error) toast({ status: "error", description: error.message });
    }
  };

  return (
    <Editable
      alignItems="center"
      defaultValue={profile?.nip05}
      fontSize="2xl"
      isPreviewFocusable={false}
      onSubmit={onSubmit}
    >
      <EditablePreview mr="2" />
      {/* Here is the custom input */}
      <Input as={EditableInput} w="xs" mr="2" />
      <EditableControls />
    </Editable>
  );
}

function IdentityDetails({ pubkey, profile }: { pubkey: string; profile: ProfileContent }) {
  const { value: identity, loading } = useAsync(async () => {
    if (!profile?.nip05) return null;
    const parsed = parseNIP05Address(profile.nip05);
    if (!parsed) return null;
    return await dnsIdentityLoader.fetchIdentity(parsed.name, parsed.domain);
  }, [profile?.nip05]);

  const renderDetails = () => {
    if (!identity) return null;

    switch (identity.status) {
      case IdentityStatus.Missing:
        return <Text color="red.500">无法在域名的 nostr.json 文件中找到身份</Text>;
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
              无效的域名身份! <CloseIcon />
            </Text>
          );
        else
          return (
            <Text color="green.500" fontWeight="bold">
              域名身份与公钥匹配 <CheckIcon />
            </Text>
          );
      default:
        return null;
    }
  };

  return (
    <>
      <EditableIdentity />
      {renderDetails()}
      {loading && <Spinner />}
      <RawValue heading="你的公钥" value={pubkey} />

      {identity?.status === IdentityStatus.Found && (
        <>
          <Heading size="md" mt="4">
            中继
          </Heading>
          <Text fontStyle="italic" mt="-2">
            你的域名身份中设置了 {identity.relays?.length ?? 0} 个中继
          </Text>

          {identity?.relays?.map((url) => (
            <Flex gap="2" alignItems="center" key={url}>
              <RelayFavicon relay={url} size="sm" />
              <Link as={RouterLink} to={`/relays/${encodeURIComponent(url)}`} isTruncated>
                {url}
              </Link>
            </Flex>
          ))}
        </>
      )}
    </>
  );
}

export default function DnsIdentityView() {
  const account = useActiveAccount();
  if (!account) return <Navigate to="/" />;

  const profile = useUserProfile(account.pubkey);

  return (
    <SimpleView
      title="域名身份"
      actions={
        <Link
          href="https://nostr.how/zh/guides/get-verified#self-hosted"
          isExternal
          color="blue.500"
          fontStyle="initial"
        >
          这是什么?
        </Link>
      }
    >
      {profile?.nip05 ? (
        <IdentityDetails pubkey={account.pubkey} profile={profile} />
      ) : (
        <>
          <Heading>没有设置域名身份</Heading>
          <RawValue heading="你的公钥" value={account.pubkey} />
          <Text>
            或在百科上阅读详细信息: <WikiLink topic="nip-05">NIP-05</WikiLink>
          </Text>
        </>
      )}
    </SimpleView>
  );
}
