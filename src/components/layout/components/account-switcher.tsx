import { Link as RouterLink } from "react-router-dom";
import { Flex, IconButton } from "@chakra-ui/react";

import { useActiveAccount } from "applesauce-react/hooks";
import { useContext } from "react";
import UserDnsIdentity from "../../user/user-dns-identity";
import NavItem from "./nav-item";
import LogIn01 from "../../icons/log-in-01";
import { CollapsedContext } from "../context";
import Users02 from "../../icons/users-02";
import UserAvatarLink from "../../user/user-avatar-link";
import UserLink from "../../user/user-link";
import accounts from "../../../services/accounts";

function AccountItem({ account, onClick }: { account: IAccount; onClick?: () => void }) {
  const metadata = useUserProfile(account.pubkey, []);
  const manager = useAccountManager();

  const handleClick = () => {
    accounts.setActive(account);
    if (onClick) onClick();
  };

  return (
    <Box display="flex" gap="2" alignItems="center">
      <Flex flex={1} gap="2" overflow="hidden" alignItems="center">
        <UserAvatar pubkey={account.pubkey} size="md" />
        <Flex direction="column" overflow="hidden" alignItems="flex-start">
          <Text isTruncated>{getDisplayName(metadata, account.pubkey)}</Text>
          <AccountTypeBadge fontSize="0.7em" account={account} />
        </Flex>
      </Flex>
      <ButtonGroup size="sm" variant="ghost">
        <Button onClick={handleClick} aria-label="切换账户">
          切换
        </Button>
        <IconButton
          icon={<CloseIcon />}
          aria-label="移除账户"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("移除这个账户吗?")) manager.removeAccount(account);
          }}
          colorScheme="red"
        />
      </ButtonGroup>
    </Box>
  );
}

export default function AccountSwitcher() {
  const account = useActiveAccount();

  const collapsed = useContext(CollapsedContext);

  return (
    <>
      {account ? (
        <Flex gap="2" alignItems="center" flexShrink={0} overflow="hidden">
          <UserAvatarLink pubkey={account.pubkey} noProxy size="md" />
          {!collapsed && (
            <>
              <Flex overflow="hidden" direction="column" w="Full" alignItems="flex-start">
                <UserLink pubkey={account.pubkey} fontWeight="bold" isTruncated whiteSpace="nowrap" />
                <UserDnsIdentity pubkey={account.pubkey} />
              </Flex>
              <IconButton
                as={RouterLink}
                to="/settings/accounts"
                ms="auto"
                aria-label="切换账户"
                onClick={modal.onToggle}
                flexShrink={0}
                size="md"
                variant="ghost"
                icon={<Users02 boxSize={5} />}
              />
            </>
          )}
        </Flex>
      ) : (
        <NavItem label="登录" icon={LogIn01} to="/signin" colorScheme="primary" variant="solid" />
      )}

      <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="2" px="4">
            账户
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="2" pt="0" px="2" display="flex" flexDirection="column" gap="2">
            {otherAccounts.map((account) => (
              <AccountItem key={account.pubkey} account={account} onClick={modal.onClose} />
            ))}
            <ButtonGroup w="full">
              <Button as={RouterLink} to="/settings/accounts" w="full" onClick={modal.onClose} variant="link">
                管理账户
              </Button>
              <Button
                leftIcon={<LogoutIcon boxSize={5} />}
                aria-label="注销"
                onClick={() => manager.clearActive()}
                flexShrink={0}
              >
                注销
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
