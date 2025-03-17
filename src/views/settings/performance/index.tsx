import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  Input,
  Link,
  FormErrorMessage,
  Select,
  Button,
} from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import { safeUrl } from "../../../helpers/parse";
import useSettingsForm from "../use-settings-form";
import localSettings from "../../../services/local-settings";
import SimpleView from "../../../components/layout/presets/simple-view";

function VerifyEventSettings() {
  const verifyEventMethod = useObservable(localSettings.verifyEventMethod);

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
  const enableKeyboardShortcuts = useObservable(localSettings.enableKeyboardShortcuts);

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
        <Flex alignItems="center">
          <FormLabel htmlFor="proxy-user-media" mb="0">
            代理用户资料图片
          </FormLabel>
          <Switch id="proxy-user-media" {...register("proxyUserMedia")} />
        </Flex>
        <FormHelperText>
          <span>启用: 使用 media.nostr.band 去获取最小的用户资料图片 (节约大约 50Mb 数据)</span>
          <br />
          <span>副作用: 一些用户资料图片可能已经过时或者直接无法加载</span>
        </FormHelperText>
      </FormControl>
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
          <FormLabel htmlFor="autoShowMedia" mb="0">
           显示嵌入
          </FormLabel>
          <Switch id="autoShowMedia" {...register("autoShowMedia")} />
        </Flex>
        <FormHelperText>禁用: 嵌入的内容会显示一个展开按钮</FormHelperText>
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
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="enableKeyboardShortcuts" mb="0">
            启用键盘快捷键
          </FormLabel>
          <Switch
            id="enableKeyboardShortcuts"
            isChecked={enableKeyboardShortcuts}
            onChange={(e) => localSettings.enableKeyboardShortcuts.next(e.currentTarget.checked)}
          />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="autoDecryptDMs" mb="0">
            自动解密私信
          </FormLabel>
          <Switch id="autoDecryptDMs" {...register("autoDecryptDMs")} />
        </Flex>
        <FormHelperText>启用: 自动解密私聊消息</FormHelperText>
      </FormControl>
      <VerifyEventSettings />
    </SimpleView>
  );
}
