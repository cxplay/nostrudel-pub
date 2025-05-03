import {
  Flex,
  FormControl,
  FormHelperText,
  Input,
  Link,
  FormErrorMessage,
  Code,
  Switch,
  Button,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import { safeUrl } from "../../../helpers/parse";
import { createRequestProxyUrl } from "../../../helpers/request";
import useSettingsForm from "../use-settings-form";
import localSettings from "../../../services/local-settings";
import DefaultAuthModeSelect from "../../../components/settings/default-auth-mode-select";
import SimpleView from "../../../components/layout/presets/simple-view";

async function validateInvidiousUrl(url?: string) {
  if (!url) return true;
  try {
    const res = await fetch(new URL("/api/v1/stats", url));
    return res.ok || "无法连接实例";
  } catch (e) {
    return "无法连接实例";
  }
}

async function validateRequestProxy(url?: string) {
  if (!url) return true;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(createRequestProxyUrl("https://example.com", url), { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok || "无法连接实例";
  } catch (e) {
    return "无法连接实例";
  }
}

export default function PrivacySettings() {
  const { register, submit, formState } = useSettingsForm();

  const proactivelyAuthenticate = useObservable(localSettings.proactivelyAuthenticate);
  const debugApi = useObservable(localSettings.debugApi);

  return (
    <SimpleView
      as="form"
      onSubmit={submit}
      title="隐私"
      gap="4"
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
        <FormLabel>默认认证行为</FormLabel>
        <DefaultAuthModeSelect w="xs" rounded="md" flexShrink={0} />
        <FormHelperText>应用如何处理中继发起的身份认证请求</FormHelperText>
      </FormControl>

      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="proactivelyAuthenticate" mb="0">
            主动与中继进行身份认证
          </FormLabel>
          <Switch
            id="proactivelyAuthenticate"
            isChecked={proactivelyAuthenticate}
            onChange={(e) => localSettings.proactivelyAuthenticate.next(e.currentTarget.checked)}
          />
        </Flex>
        <FormHelperText>
          <span>一旦中继发起身份认证要求则立即进行身份认证</span>
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!formState.errors.twitterRedirect}>
        <FormLabel>Nitter 实例</FormLabel>
        <Input
          type="url"
          maxW="sm"
          placeholder="https://nitter.net/"
          {...register("twitterRedirect", { setValueAs: safeUrl })}
        />
        {formState.errors.twitterRedirect && (
          <FormErrorMessage>{formState.errors.twitterRedirect.message}</FormErrorMessage>
        )}
        <FormHelperText>
          Nitter 是一个专注于隐私的 Twitter 替代前端.{" "}
          <Link href="https://github.com/zedeus/nitter/wiki/Instances" isExternal color="blue.500">
            Nitter 实例清单
          </Link>
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!formState.errors.youtubeRedirect}>
        <FormLabel>Invidious 实例</FormLabel>
        <Input
          type="url"
          maxW="sm"
          placeholder="Invidious 实例 URL"
          {...register("youtubeRedirect", {
            validate: validateInvidiousUrl,
            setValueAs: safeUrl,
          })}
        />
        {formState.errors.youtubeRedirect && (
          <FormErrorMessage>{formState.errors.youtubeRedirect.message}</FormErrorMessage>
        )}
        <FormHelperText>
        Invidious 是一个专注于隐私的 YouTube 替代前端.{" "}
          <Link href="https://docs.invidious.io/instances" isExternal color="blue.500">
            Invidious 实例清单
          </Link>
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!formState.errors.redditRedirect}>
        <FormLabel>Teddit / Libreddit 实例</FormLabel>
        <Input
          type="url"
          placeholder="https://nitter.net/"
          maxW="sm"
          {...register("redditRedirect", { setValueAs: safeUrl })}
        />
        {formState.errors.redditRedirect && (
          <FormErrorMessage>{formState.errors.redditRedirect.message}</FormErrorMessage>
        )}
        <FormHelperText>
          Libreddit 和 Teddit 都是专注于隐私的 Reddit 替代前端.{" "}
          <Link
            href="https://github.com/libreddit/libreddit-instances/blob/master/instances.md"
            isExternal
            color="blue.500"
          >
            Libreddit 清单
          </Link>
          {", "}
          <Link href="https://codeberg.org/teddit/teddit#instances" isExternal color="blue.500">
            Teddit 清单
          </Link>
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!formState.errors.corsProxy}>
        <FormLabel>请求代理</FormLabel>
        {window.REQUEST_PROXY ? (
          <>
            <Input type="url" value={window.REQUEST_PROXY} onChange={() => {}} readOnly isDisabled />
            <FormHelperText color="red.500">
              这个 noStrudel 版本已经将请求代理配置硬编码为 <Code>{window.REQUEST_PROXY}</Code>
            </FormHelperText>
          </>
        ) : (
          <Input
            type="url"
            maxW="sm"
            placeholder="https://corsproxy.io/?<encoded_url>"
            {...register("corsProxy", { validate: validateRequestProxy })}
          />
        )}
        {formState.errors.corsProxy && <FormErrorMessage>{formState.errors.corsProxy.message}</FormErrorMessage>}
        <FormHelperText>
          用作后备 (绕过 CORS 限制) 或向 .onion 和 .i2p 域名发出请求.
          <br />
          可指向{" "}
          <Link href="https://github.com/Rob--W/cors-anywhere" isExternal color="blue.500">
            cors-anywhere
          </Link>{" "}
          或者{" "}
          <Link href="https://corsproxy.io/" isExternal color="blue.500">
            corsproxy.io
          </Link>{" "}
          实例.<br />
          可使用 <Code fontSize="0.9em">{`<url>`}</Code> 或者 <Code fontSize="0.9em">{`<encoded_url>`}</Code>
          注入原始或被编码的 URL 到请求代理 URL 中 (例如:{" "}
          <Code fontSize="0.9em" userSelect="all">{`https://corsproxy.io/?<encoded_url>`}</Code>)
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="loadOpenGraphData" mb="0">
            加载 Open Graph 数据
          </FormLabel>
          <Switch id="loadOpenGraphData" {...register("loadOpenGraphData")} />
        </Flex>
        <FormHelperText>
          <span>
            是否加载链接的{" "}
            <Link href="https://ogp.me/" isExternal color="blue.500">
              Open Graph
            </Link>{" "}
            数据
          </span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="debugApi" mb="0">
            启用 Debug API
          </FormLabel>
          <Switch
            id="debugApi"
            isChecked={debugApi}
            onChange={(e) => localSettings.debugApi.next(e.currentTarget.checked)}
          />
        </Flex>
        <FormHelperText>
          <Text>
            在页面中添加 window.noStrudel 以访问内部方法{" "}
            <Link
              href="https://github.com/hzrd149/nostrudel/blob/master/src/services/page-api.ts"
              target="_blank"
              color="blue.500"
            >
              查看源代码
            </Link>
          </Text>
          <Text color="orange.500" mt="1">
            警告: 该选项会暴露你的私钥和签名器.
          </Text>
        </FormHelperText>
      </FormControl>
    </SimpleView>
  );
}
