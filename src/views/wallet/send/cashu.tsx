import { Button, Flex, Input, Select } from "@chakra-ui/react";
import { WalletBalanceQuery, WalletQuery, WalletTokensQuery } from "applesauce-wallet/queries";
import { useActionHub, useActiveAccount, useStoreQuery } from "applesauce-react/hooks";
import { CompleteSpend } from "applesauce-wallet/actions";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getEncodedToken, Token } from "@cashu/cashu-ts";
import { dumbTokenSelection } from "applesauce-wallet/helpers";

import SimpleView from "../../../components/layout/presets/simple-view";
import CashuMintName from "../../../components/cashu/cashu-mint-name";
import WalletUnlockButton from "../components/wallet-unlock-button";
import RouterLink from "../../../components/router-link";
import { getCashuWallet } from "../../../services/cashu-mints";

export default function WalletSendCashuView() {
  const navigate = useNavigate();
  const account = useActiveAccount()!;
  const wallet = useStoreQuery(WalletQuery, [account.pubkey]);
  const balance = useStoreQuery(WalletBalanceQuery, [account.pubkey]);
  const tokens = useStoreQuery(WalletTokensQuery, [account.pubkey, false]);

  const defaultMint = balance && Object.keys(balance).reduce((a, b) => (balance[a] > balance[b] ? a : b));

  const { register, getValues, watch, handleSubmit, formState } = useForm({
    defaultValues: { amount: 0, mint: defaultMint ?? "" },
    mode: "all",
  });

  watch("mint");

  const actions = useActionHub();
  const submit = handleSubmit(async (values) => {
    if (!tokens) return;
    const selected = dumbTokenSelection(tokens, values.amount, values.mint);
    const wallet = await getCashuWallet(values.mint);

    await wallet.mint.getKeySets();

    // swap tokens for send
    const send = await wallet.send(values.amount, selected.proofs);

    // save the change
    await actions.run(CompleteSpend, selected.events, { proofs: send.keep, mint: values.mint });

    // redirect to the token view
    const token: Token = {
      mint: values.mint,
      proofs: send.send,
    };
    navigate("/wallet/send/token", { state: { token: getEncodedToken(token) } });
  });

  return (
    <SimpleView as="form" title="发送 Cashu" maxW="xl" center onSubmit={submit}>
      {wallet?.locked && <WalletUnlockButton colorScheme="primary" mx="auto" size="lg" w="sm" />}

      <Select {...register("mint", { required: true })} isRequired>
        {balance &&
          Object.entries(balance).map(([mint, amount]) => (
            <option key={mint} value={mint}>
              <CashuMintName mint={mint} /> ({amount})
            </option>
          ))}
      </Select>
      <Input
        size="lg"
        type="number"
        min={1}
        max={getValues("mint") && balance ? balance[getValues("mint")] : undefined}
        {...register("amount", {
          required: true,
          min: 1,
          max: getValues("mint") && balance ? balance[getValues("mint")] : undefined,
          valueAsNumber: true,
        })}
      />

      <Flex direction="row-reverse">
        <Button type="submit" colorScheme="primary" isLoading={formState.isSubmitting} isDisabled={!formState.isValid}>
          创建
        </Button>
        <Button as={RouterLink} to="/wallet" me="auto">
          取消
        </Button>
      </Flex>
    </SimpleView>
  );
}
