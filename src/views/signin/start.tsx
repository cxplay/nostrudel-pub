import { lazy, useState } from "react";
import { Button, ButtonGroup, Divider, Flex, IconButton, Link, Spinner, Text, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AmberClipboardAccount, ExtensionAccount, SerialPortAccount } from "applesauce-accounts/accounts";
import { AmberClipboardSigner, ExtensionSigner, SerialPortSigner } from "applesauce-signers";
import { useAccountManager } from "applesauce-react/hooks";

import Key01 from "../../components/icons/key-01";
import Diamond01 from "../../components/icons/diamond-01";
import UsbFlashDrive from "../../components/icons/usb-flash-drive";
import HelpCircle from "../../components/icons/help-circle";

import { CAP_IS_ANDROID, CAP_IS_WEB } from "../../env";
import { AtIcon } from "../../components/icons";
import Package from "../../components/icons/package";
import Eye from "../../components/icons/eye";
const AndroidNativeSigners = lazy(() => import("./native"));

export default function LoginStartView() {
  const location = useLocation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const manager = useAccountManager();

  const signinWithExtension = async () => {
    if (window.nostr) {
      try {
        setLoading(true);

        const signer = new ExtensionSigner();
        const pubkey = await signer.getPublicKey();

        const account = new ExtensionAccount(pubkey, signer);
        manager.addAccount(account);
        manager.setActive(account);
      } catch (e) {
        if (e instanceof Error) toast({ description: e.message, status: "error" });
      }
      setLoading(false);
    } else {
      toast({ status: "warning", title: "无法找到浏览器扩展" });
    }
  };

  const signinWithSerial = async () => {
    if (SerialPortSigner.SUPPORTED) {
      try {
        setLoading(true);

        const signer = new SerialPortSigner();
        const pubkey = await signer.getPublicKey();
        const account = new SerialPortAccount(pubkey, signer);
        manager.addAccount(account);
        manager.setActive(account);
      } catch (e) {
        if (e instanceof Error) toast({ description: e.message, status: "error" });
      }
      setLoading(false);
    } else {
      toast({ status: "warning", title: "不支持 Serial" });
    }
  };

  const signinWithAmber = async () => {
    try {
      const signer = new AmberClipboardSigner();
      const pubkey = await signer.getPublicKey();
      const account = new AmberClipboardAccount(pubkey, signer);
      manager.addAccount(account);
      manager.setActive(account);
    } catch (e) {
      if (e instanceof Error) toast({ description: e.message, status: "error" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {window.nostr && (
        <Button onClick={signinWithExtension} leftIcon={<Key01 boxSize={6} />} w="full" colorScheme="primary">
          使用浏览器扩展登录
        </Button>
      )}
      <Button
        as={RouterLink}
        to="./address"
        state={location.state}
        w="full"
        colorScheme="blue"
        leftIcon={<AtIcon boxSize={6} />}
      >
        Nostr 地址
      </Button>
      {SerialPortSigner.SUPPORTED && (
        <ButtonGroup colorScheme="purple">
          <Button onClick={signinWithSerial} leftIcon={<UsbFlashDrive boxSize={6} />} w="xs">
            使用签名设备
          </Button>
          <IconButton
            as={Link}
            aria-label="什么是 NSD?"
            title="什么是 NSD?"
            isExternal
            href="https://github.com/lnbits/nostr-signing-device"
            icon={<HelpCircle boxSize={5} />}
          />
        </ButtonGroup>
      )}
      {CAP_IS_WEB && AmberClipboardSigner.SUPPORTED && (
        <ButtonGroup colorScheme="orange" w="full">
          <Button onClick={signinWithAmber} leftIcon={<Diamond01 boxSize={6} />} flex={1}>
            使用 Amber
          </Button>
          <IconButton
            as={Link}
            aria-label="什么是 Amber?"
            title="什么是 Amber?"
            isExternal
            href="https://github.com/greenart7c3/Amber"
            icon={<HelpCircle boxSize={5} />}
          />
        </ButtonGroup>
      )}
      {CAP_IS_ANDROID && <AndroidNativeSigners />}
      <Flex w="full" alignItems="center" gap="4">
        <Divider />
        <Text fontWeight="bold">或者</Text>
        <Divider />
      </Flex>
      <Flex gap="2">
        <Button
          flexDirection="column"
          h="auto"
          p="4"
          as={RouterLink}
          to="./nostr-connect"
          state={location.state}
          variant="outline"
        >
          <Package boxSize={12} />
          Nostr Connect
        </Button>
        <Button
          flexDirection="column"
          h="auto"
          p="4"
          as={RouterLink}
          to="./nsec"
          state={location.state}
          variant="outline"
        >
          <Key01 boxSize={12} />
          私钥
        </Button>
        <Button
          flexDirection="column"
          h="auto"
          p="4"
          as={RouterLink}
          to="./npub"
          state={location.state}
          variant="outline"
        >
          <Eye boxSize={12} />
          公钥
        </Button>
      </Flex>
      <Text fontWeight="bold" mt="4">
        还没有账户?
      </Text>
      <Button
        as={RouterLink}
        to="/signup"
        state={location.state}
        colorScheme="primary"
        variant="outline"
        maxW="xs"
        w="full"
      >
        注册
      </Button>
    </>
  );
}
