import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EventTemplate, VerifiedEvent } from "nostr-tools";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import { useActiveAccount } from "applesauce-react/hooks";
import { useSigningContext } from "../../../../providers/global/signing-provider";
import { bakery$, setBakeryURL } from "../../../../services/bakery";
import Panel from "../../../../components/dashboard/panel";

export function BakeryAuthPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const account = useActiveAccount();
  const { requestSignature } = useSigningContext();
  const [search] = useSearchParams();
  const remember = useDisclosure({ defaultIsOpen: true });
  const location = useLocation();
  const bakery = useObservable(bakery$);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: { auth: search.get("auth") ?? "" },
  });

  const authenticate = async (auth: string | ((evt: EventTemplate) => Promise<VerifiedEvent>)) => {
    if (!bakery) return;

    try {
      // if (!bakery.connected) await bakery.connect();
      // await bakery.authenticate(auth);

      navigate(location.state?.back || "/", { replace: true });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const authenticateWithNostr = async () => {
    try {
      if (!account) return navigate("/login", { state: { back: location } });

      if (remember.isOpen) localStorage.setItem("personal-node-auth", "nostr");

      await authenticate((draft) => requestSignature(draft) as Promise<VerifiedEvent>);
    } catch (error) {
      if (error instanceof Error) toast({ status: "error", description: error.message });
    }
  };

  const submit = handleSubmit(async (values) => {
    if (remember.isOpen) localStorage.setItem("personal-node-auth", values.auth);
    await authenticate(values.auth);
  });

  // automatically send the auth if its set on mount
  useEffect(() => {
    const relay = search.get("relay");
    if (relay) setBakeryURL(relay);
  }, []);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" h="full">
      <Panel as="form" label="AUTHENTICATE" minW="sm" onSubmit={submit}>
        {formState.isSubmitting ? (
          <Text>正在加载...</Text>
        ) : (
          <>
            <FormControl>
              <FormLabel htmlFor="auth">认证代码</FormLabel>
              <Input id="auth" {...register("auth", { required: true })} isRequired autoComplete="off" />
            </FormControl>

            <Flex mt="2" justifyContent="space-between">
              <Checkbox isChecked={remember.isOpen} onChange={remember.onToggle}>
                记住我
              </Checkbox>
              <Button type="submit" size="sm" colorScheme="primary">
                登录
              </Button>
            </Flex>
            {account && (
              <>
                <Flex gap="2" alignItems="center" my="2">
                  <Divider />
                  或
                  <Divider />
                </Flex>
                <Flex gap="2">
                  <Button type="button" onClick={authenticateWithNostr} colorScheme="purple" flex={1}>
                    使用 Nostr 登录
                  </Button>
                </Flex>
              </>
            )}
          </>
        )}
      </Panel>
    </Flex>
  );
}

export default function BakeryAuthView() {
  const location = useLocation();
  const bakery = useObservable(bakery$);
  const authenticated = useObservable(bakery?.authenticated$);

  if (authenticated) {
    return <Navigate to={location.state?.back ?? "/"} replace />;
  }

  return <BakeryAuthPage />;
}
