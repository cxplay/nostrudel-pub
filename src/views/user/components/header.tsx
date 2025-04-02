import { Flex, Heading, IconButton, Spacer } from "@chakra-ui/react";
import { ReadonlyAccount } from "applesauce-accounts/accounts";
import { useNavigate } from "react-router-dom";

import { EditIcon } from "../../../components/icons";
import UserAvatar from "../../../components/user/user-avatar";
import UserDnsIdentity from "../../../components/user/user-dns-identity";
import { useActiveAccount } from "applesauce-react/hooks";
import useUserProfile from "../../../hooks/use-user-profile";
import { UserProfileMenu } from "./user-profile-menu";
import { UserFollowButton } from "../../../components/user/user-follow-button";
import { useBreakpointValue } from "../../../providers/global/breakpoint-provider";
import UserName from "../../../components/user/user-name";

export default function Header({
  pubkey,
  showRelaySelectionModal,
}: {
  pubkey: string;
  showRelaySelectionModal: () => void;
}) {
  const navigate = useNavigate();
  const metadata = useUserProfile(pubkey);

  const account = useActiveAccount();
  const isSelf = pubkey === account?.pubkey;

  const showExtraButtons = useBreakpointValue({ base: false, sm: true });

  return (
    <Flex direction="column" gap="2" px="2" pt="2">
      <Flex gap="2" alignItems="center">
        <UserAvatar pubkey={pubkey} size="sm" noProxy mr="2" />
        <Heading size="md" isTruncated>
          <UserName pubkey={pubkey} />
        </Heading>
        <UserDnsIdentity pubkey={pubkey} onlyIcon />
        <Spacer />
        {isSelf && !(account instanceof ReadonlyAccount) && (
          <IconButton
            icon={<EditIcon />}
            aria-label="编辑资料"
            title="编辑资料"
            size="sm"
            colorScheme="primary"
            onClick={() => navigate("/profile")}
          />
        )}
        {showExtraButtons && !isSelf && <UserFollowButton pubkey={pubkey} size="sm" />}
        <UserProfileMenu
          pubkey={pubkey}
          aria-label="更多选项"
          size="sm"
          showRelaySelectionModal={showRelaySelectionModal}
        />
      </Flex>
    </Flex>
  );
}
