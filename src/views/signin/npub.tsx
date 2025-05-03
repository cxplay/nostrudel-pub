import { useState } from "react";
import { Button, Flex, FormControl, FormHelperText, FormLabel, Input, Link, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAccountManager } from "applesauce-react/hooks";
import { ReadonlyAccount } from "applesauce-accounts/accounts";
import { ReadonlySigner } from "applesauce-signers";

import { normalizeToHexPubkey } from "../../helpers/nip19";
import QRCodeScannerButton from "../../components/qr-code/qr-code-scanner-button";

export default function SigninNpubView() {
  const navigate = useNavigate();
  const toast = useToast();
  const [npub, setNpub] = useState("");
  const manager = useAccountManager();
  // const [relayUrl, setRelayUrl] = useState(COMMON_CONTACT_RELAY);

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const pubkey = normalizeToHexPubkey(npub);
    if (!pubkey) return toast({ status: "error", title: "Invalid npub" });

    const account = new ReadonlyAccount(pubkey, new ReadonlySigner(pubkey));
    manager.addAccount(account);
    manager.setActive(account);
  };

  return (
    <Flex as="form" direction="column" gap="4" onSubmit={handleSubmit} w="full">
      <FormControl>
        <FormLabel>输入用户公钥</FormLabel>
        <Flex gap="2">
          <Input type="text" placeholder="npub1" isRequired value={npub} onChange={(e) => setNpub(e.target.value)} />
          <QRCodeScannerButton onResult={(v) => setNpub(v)} />
        </Flex>
        <FormHelperText>
          输入任何用户的公钥.{" "}
          <Link isExternal href="https://nostr.directory" color="blue.500" target="_blank">
            nostr.directory
          </Link>
        </FormHelperText>
      </FormControl>
      <Flex justifyContent="space-between" gap="2">
        <Button variant="link" onClick={() => navigate("../")}>
          返回
        </Button>
        <Button colorScheme="primary" ml="auto" type="submit">
          登录
        </Button>
      </Flex>
    </Flex>
  );
}
