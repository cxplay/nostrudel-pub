import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  Switch,
} from "@chakra-ui/react";
import { useObservableEagerState } from "applesauce-react/hooks";

import SimpleView from "../../../components/layout/presets/simple-view";
import { safeUrl } from "../../../helpers/parse";
import localSettings from "../../../services/local-settings";
import useSettingsForm from "../use-settings-form";

function VerifyEventSettings() {
  const verifyEventMethod = useObservableEagerState(localSettings.verifyEventMethod);

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="verifyEventMethod" mb="0">
          事件验证方式
        </FormLabel>
        <Select
          value={verifyEventMethod}
          onChange={(e) => localSettings.verifyEventMethod.next(e.target.value)}
          maxW="sm"
        >
          <option value="wasm">WebAssembly</option>
          <option value="internal">内置</option>
          <option value="none">无</option>
        </Select>
        <FormHelperText>默认: 所有事件签名都会被检查</FormHelperText>
        <FormHelperText>WebAssembly: 在独立线程中检查事件签名</FormHelperText>
        <FormHelperText>无: 仅用户资料, 关注的人和可替换参数事件的签名才会被检查</FormHelperText>
      </FormControl>
    </>
  );
}

export default function PerformanceSettings() {
  const { register, submit, formState } = useSettingsForm();

  return (
    <SimpleView
      as="form"
      onSubmit={submit}
      gap="4"
      title="性能"
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
      <FormControl>
        <FormLabel htmlFor="imageProxy" mb="0">
          图片代理服务
        </FormLabel>
        <Input
          id="imageProxy"
          maxW="sm"
          type="url"
          {...register("imageProxy", {
            setValueAs: (v) => safeUrl(v) || v,
          })}
        />
        {formState.errors.imageProxy && <FormErrorMessage>{formState.errors.imageProxy.message}</FormErrorMessage>}
        <FormHelperText>
          <span>
            一个{" "}
            <Link href="https://github.com/willnorris/imageproxy" isExternal target="_blank">
              willnorris/imageproxy
            </Link>{" "}
            实例的 URL
          </span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="showReactions" mb="0">
            显示回应
          </FormLabel>
          <Switch id="showReactions" {...register("showReactions")} />
        </Flex>
        <FormHelperText>启用: 显示笔记的表情回应</FormHelperText>
      </FormControl>

      <VerifyEventSettings />
    </SimpleView>
  );
}
