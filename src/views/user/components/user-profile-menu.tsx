import { MenuItem, useDisclosure, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { nip19 } from "nostr-tools";

import { DotsMenuButton, MenuIconButtonProps } from "../../../components/dots-menu-button";
import {
  DirectMessagesIcon,
  CopyToClipboardIcon,
  CodeIcon,
  ExternalLinkIcon,
  MuteIcon,
  RelayIcon,
  SpyIcon,
  UnmuteIcon,
  ShareIcon,
} from "../../../components/icons";
import accountService from "../../../services/account";
import UserDebugModal from "../../../components/debug-modal/user-debug-modal";
import { useSharableProfileId } from "../../../hooks/use-shareable-profile-id";
import useUserMuteActions from "../../../hooks/use-user-mute-actions";
import useCurrentAccount from "../../../hooks/use-current-account";
import { useContext } from "react";
import { AppHandlerContext } from "../../../providers/route/app-handler-provider";
import PubkeyAccount from "../../../classes/accounts/pubkey-account";
import Telescope from "../../../components/icons/telescope";

export const UserProfileMenu = ({
  pubkey,
  showRelaySelectionModal,
  ...props
}: { pubkey: string; showRelaySelectionModal?: () => void } & Omit<MenuIconButtonProps, "children">) => {
  const toast = useToast();
  const account = useCurrentAccount();
  const infoModal = useDisclosure();
  const sharableId = useSharableProfileId(pubkey);
  const { isMuted, mute, unmute } = useUserMuteActions(pubkey);
  const { openAddress } = useContext(AppHandlerContext);

  const loginAsUser = () => {
    if (!accountService.hasAccount(pubkey)) accountService.addAccount(new PubkeyAccount(pubkey));
    accountService.switchAccount(pubkey);
  };

  return (
    <>
      <DotsMenuButton {...props}>
        <MenuItem onClick={() => openAddress(sharableId)} icon={<ExternalLinkIcon />}>
          在其他应用中查看...
        </MenuItem>
        {account?.pubkey !== pubkey && (
          <MenuItem onClick={isMuted ? unmute : mute} icon={isMuted ? <UnmuteIcon /> : <MuteIcon />} color="red.500">
            {isMuted ? "解除静音" : "静音"}
          </MenuItem>
        )}
        <MenuItem icon={<DirectMessagesIcon fontSize="1.5em" />} as={RouterLink} to={`/dm/${nip19.npubEncode(pubkey)}`}>
          私信
        </MenuItem>
        <MenuItem
          icon={<Telescope fontSize="1.5em" />}
          as={RouterLink}
          to={`/discovery/blindspot/${nip19.npubEncode(pubkey)}`}
        >
          盲点
        </MenuItem>
        <MenuItem icon={<SpyIcon fontSize="1.5em" />} onClick={() => loginAsUser()}>
          公钥登录
        </MenuItem>
        <MenuItem
          onClick={() => {
            const text = "https://njump.me/" + sharableId;
            if (navigator.clipboard) navigator.clipboard?.writeText(text);
            else toast({ description: text, isClosable: true, duration: null });
          }}
          icon={<ShareIcon />}
        >
          复制分享链接
        </MenuItem>
        <MenuItem
          onClick={() => {
            const text = "nostr:" + sharableId;
            if (navigator.clipboard) navigator.clipboard?.writeText(text);
            else toast({ description: text, isClosable: true, duration: null });
          }}
          icon={<CopyToClipboardIcon />}
        >
          复制嵌入代码
        </MenuItem>
        <MenuItem onClick={infoModal.onOpen} icon={<CodeIcon />}>
          查看原始数据
        </MenuItem>
        {showRelaySelectionModal && (
          <MenuItem icon={<RelayIcon />} onClick={showRelaySelectionModal}>
            中继选择
          </MenuItem>
        )}
      </DotsMenuButton>
      {infoModal.isOpen && (
        <UserDebugModal pubkey={pubkey} isOpen={infoModal.isOpen} onClose={infoModal.onClose} size="6xl" />
      )}
    </>
  );
};
