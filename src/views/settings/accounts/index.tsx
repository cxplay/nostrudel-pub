import { Box, Button, ButtonGroup, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PasswordSigner, SerialPortSigner, SimpleSigner } from "applesauce-signers";
import { useAccountManager, useAccounts, useObservable } from "applesauce-react/hooks";

import { useActiveAccount } from "applesauce-react/hooks";
import UserAvatar from "../../../components/user/user-avatar";
import UserName from "../../../components/user/user-name";
import UserDnsIdentity from "../../../components/user/user-dns-identity";
import AccountTypeBadge from "../../../components/accounts/account-info-badge";
import SimpleSignerBackup from "./components/simple-signer-backup";
import MigrateAccountToDevice from "./components/migrate-to-device";
import SimpleView from "../../../components/layout/presets/simple-view";

function AccountBackup() {
  const account = useActiveAccount()!;

  return (
    <>
      {account.signer instanceof SimpleSigner && account.signer.key && <SimpleSignerBackup />}
      {account.signer instanceof PasswordSigner && account.signer.ncryptsec && <SimpleSignerBackup />}
      {(account.signer instanceof SimpleSigner || account.signer instanceof PasswordSigner) &&
        SerialPortSigner.SUPPORTED && <MigrateAccountToDevice />}
    </>
  );
}

export default function AccountSettings() {
  const account = useActiveAccount()!;
  const accounts = useAccounts();
  const manager = useAccountManager();
  const navigate = useNavigate();

  return (
    <SimpleView
      title="账户设置"
      maxW="6xl"
      actions={
        <Button
          colorScheme="primary"
          ml="auto"
          size="sm"
          onClick={() => {
            manager.clearActive();
            navigate("/signin", { state: { from: location.pathname } });
          }}
        >
          添加账户
        </Button>
      }
    >
      <Flex gap="2" alignItems="center" wrap="wrap">
        <UserAvatar pubkey={account.pubkey} />
        <Box lineHeight={1}>
          <Heading size="md">
            <UserName pubkey={account.pubkey} />
          </Heading>
          <UserDnsIdentity pubkey={account.pubkey} />
        </Box>
        <AccountTypeBadge account={account} ml="4" />

        <Button onClick={() => manager.clearActive()} ml="auto">
          注销
        </Button>
      </Flex>

      <AccountBackup />

      <Flex gap="2" px="4" alignItems="Center" mt="4">
        <Divider />
        <Text fontWeight="bold" fontSize="md" whiteSpace="pre">
          其他账户
        </Text>
        <Divider />
      </Flex>

      {accounts
        .filter((a) => a.pubkey !== account.pubkey)
        .map((account) => (
          <Flex gap="2" alignItems="center" wrap="wrap" key={account.pubkey}>
            <UserAvatar pubkey={account.pubkey} />
            <Box lineHeight={1}>
              <Heading size="md">
                <UserName pubkey={account.pubkey} />
              </Heading>
              <UserDnsIdentity pubkey={account.pubkey} />
            </Box>
            <AccountTypeBadge account={account} ml="4" />

            <ButtonGroup size="sm" ml="auto">
              <Button onClick={() => manager.setActive(account)} variant="ghost">
                Switch
              </Button>
              <Button onClick={() => confirm("Remove account?") && manager.removeAccount(account)} colorScheme="red">
                Remove
              </Button>
            </ButtonGroup>
          </Flex>
        ))}
    </SimpleView>
  );
}
