import { useCallback, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { useNavigate } from "react-router-dom";
import { hexToBytes } from "@noble/hashes/utils";
import { useForm } from "react-hook-form";
import { decrypt } from "nostr-tools/nip49";
import { isHexKey } from "applesauce-core/helpers";

import { safeDecode } from "../../helpers/nip19";
import QRCodeScannerButton from "../../components/qr-code/qr-code-scanner-button";
import Eye from "../../components/icons/eye";
import EyeOff from "../../components/icons/eye-off";
import { useAccountManager } from "applesauce-react/hooks";
import { PasswordAccount, SimpleAccount } from "applesauce-accounts/accounts";
import { IAccount } from "applesauce-accounts";
import { PasswordSigner } from "applesauce-signers";

export default function SigninPrivateKeyView() {
  const navigate = useNavigate();
  const manager = useAccountManager();

  const [show, setShow] = useState(false);

  const { register, handleSubmit, setValue } = useForm({ defaultValues: { value: "" }, mode: "all" });

  const generateNewKey = useCallback(() => {
    const key = generateSecretKey();
    setValue("value", nip19.nsecEncode(key));
    setShow(true);
  }, [setValue, setShow]);

  const submit = handleSubmit(async ({ value }) => {
    let account: IAccount;

    if (isHexKey(value)) {
      account = SimpleAccount.fromKey(hexToBytes(value));
    } else if (value.startsWith("ncryptsec")) {
      const password = window.prompt("解密密码");
      if (password === null) throw new Error("需要密码");

      const key = decrypt(value, password);
      const passwordAccount = PasswordAccount.fromNcryptsec(getPublicKey(key), value);
      await passwordAccount.signer.unlock(password);
      account = passwordAccount;
    } else if (value.startsWith("nsec")) {
      const decode = safeDecode(value);
      if (decode?.type !== "nsec") throw new Error();

      const key = decode.data;
      const password = window.prompt("本地私钥加密密码, 用于保护私钥的安全");
      if (password) {
        const signer = new PasswordSigner();
        signer.key = key;
        await signer.setPassword(password);

        account = new PasswordAccount(getPublicKey(key), signer);
      } else {
        account = SimpleAccount.fromKey(decode.data);
      }
    } else throw new Error("无效的密钥");

    manager.addAccount(account);
    manager.setActive(account);
  });

  return (
    <Flex as="form" direction="column" gap="4" onSubmit={submit} w="full">
      <Alert status="warning" maxWidth="30rem">
        <AlertIcon />
        <Box>
          <AlertTitle>直接使用私钥是不安全的</AlertTitle>
          <AlertDescription>
            你应该使用浏览器扩展, 比如{" "}
            <Link isExternal href="https://getalby.com/" target="_blank">
              Alby
            </Link>
            {", "}
            <Link isExternal href="https://github.com/susumuota/nostr-keyx" target="_blank">
              nostr-keyx
            </Link>
            {" or "}
            <Link
              isExternal
              href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp"
              target="_blank"
            >
              Nos2x
            </Link>
          </AlertDescription>
        </Box>
      </Alert>

      <FormControl>
        <FormLabel>输入用户私钥</FormLabel>
        <Flex gap="2">
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="hex, nsec 或者 ncryptsec"
              {...register("value", { required: true })}
              isRequired
            />
            <InputRightElement>
              <IconButton
                h="1.75rem"
                size="sm"
                variant="ghost"
                onClick={() => setShow((v) => !v)}
                icon={show ? <EyeOff boxSize={5} /> : <Eye boxSize={5} />}
                aria-label="密码显示"
              />
            </InputRightElement>
          </InputGroup>
          <QRCodeScannerButton onResult={(v) => setValue("value", v)} />
        </Flex>
      </FormControl>

      <Flex justifyContent="space-between" gap="2">
        <Button variant="link" onClick={() => navigate("../")}>
          返回
        </Button>
        <Button ml="auto" onClick={generateNewKey}>
          新建
        </Button>
        <Button colorScheme="primary" type="submit">
          登录
        </Button>
      </Flex>
    </Flex>
  );
}
