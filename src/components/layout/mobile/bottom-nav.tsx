import { Avatar, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { useActiveAccount } from "applesauce-react/hooks";
import { Link as RouterLink } from "react-router-dom";

import { DirectMessagesIcon, NotesIcon, NotificationsIcon, PlusCircleIcon, SearchIcon } from "../../icons";
import useRootPadding from "../../../hooks/use-root-padding";
import Rocket02 from "../../icons/rocket-02";
import UserAvatar from "../../user/user-avatar";
import NavDrawer from "./nav-drawer";

export default function MobileBottomNav() {
  useRootPadding({ bottom: "var(--chakra-sizes-14)" });
  const account = useActiveAccount();
  const drawer = useDisclosure();

  return (
    <>
      <Flex
        gap="2"
        p="2"
        borderTopWidth={1}
        hideFrom="md"
        bg="var(--chakra-colors-chakra-body-bg)"
        mb="var(--safe-bottom)"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="modal"
      >
        {account ? (
          <UserAvatar pubkey={account.pubkey} size="sm" onClick={drawer.onOpen} noProxy />
        ) : (
          <Avatar size="sm" src="/apple-touch-icon.png" onClick={drawer.onOpen} cursor="pointer" />
        )}
        <IconButton as={RouterLink} icon={<NotesIcon boxSize={6} />} aria-label="主页" flexGrow="1" size="md" to="/" />
        <IconButton
          as={RouterLink}
          icon={<SearchIcon boxSize={6} />}
          aria-label="搜索"
          flexGrow="1"
          size="md"
          to="/search"
        />
        <IconButton
          as={RouterLink}
          icon={<PlusCircleIcon boxSize={6} />}
          aria-label="创建"
          title="创建"
          variant="solid"
          colorScheme="primary"
          to="/new"
        />
        <IconButton
          as={RouterLink}
          icon={<DirectMessagesIcon boxSize={6} />}
          aria-label="消息"
          flexGrow="1"
          size="md"
          to="/messages"
        />
        <IconButton
          as={RouterLink}
          icon={<NotificationsIcon boxSize={6} />}
          aria-label="通知"
          flexGrow="1"
          size="md"
          to="/notifications"
        />
        <IconButton as={RouterLink} icon={<Rocket02 boxSize={6} />} aria-label="开始" to="/launchpad" />
      </Flex>
      <NavDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} />
    </>
  );
}
