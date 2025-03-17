import { Button as BitcoinConnectButton } from "@getalby/bitcoin-connect-react";
import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Switch,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import useSettingsForm from "../use-settings-form";
import SimpleView from "../../../components/layout/presets/simple-view";

export default function LightningSettings() {
  const { register, submit, formState } = useSettingsForm();

  return (
    <SimpleView
      as="form"
      onSubmit={submit}
      gap="4"
      title="闪电网络"
      actions={
        <Button
          ml="auto"
          isLoading={formState.isLoading || formState.isValidating || formState.isSubmitting}
          isDisabled={!formState.isDirty}
          colorScheme="primary"
          type="submit"
          flexShrink={0}
          size="sm"
        >
          保存
        </Button>
      }
    >
      <BitcoinConnectButton />
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="autoPayWithWebLN" mb="0">
            使用 WebLN 自动支付
          </FormLabel>
          <Switch id="autoPayWithWebLN" {...register("autoPayWithWebLN")} />
        </Flex>

        <FormHelperText>
          <span>启用: 当可用时尝试使用 WebLN 自动付款</span>
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="customZapAmounts" mb="0">
          打闪金额
        </FormLabel>
        <Input
          id="customZapAmounts"
          maxW="sm"
          autoComplete="off"
          {...register("customZapAmounts", {
            validate: (v) => {
              if (!/^[\d,]*$/.test(v)) return "必须是逗号分隔的数字列表";
              return true;
            },
          })}
        />
        {formState.errors.customZapAmounts && (
          <FormErrorMessage>{formState.errors.customZapAmounts.message}</FormErrorMessage>
        )}
        <FormHelperText>
          <span>以逗号分隔的自定义打闪金额列表</span>
        </FormHelperText>
      </FormControl>
    </SimpleView>
  );
}
