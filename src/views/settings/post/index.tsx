import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Select,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Switch,
} from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import useUsersMediaServers from "../../../hooks/use-user-media-servers";
import { useActiveAccount } from "applesauce-react/hooks";
import useSettingsForm from "../use-settings-form";
import localSettings from "../../../services/local-settings";
import SimpleView from "../../../components/layout/presets/simple-view";

export default function PostSettings() {
  const account = useActiveAccount();
  const { register, getValues, watch, submit, formState } = useSettingsForm();
  const { servers: mediaServers } = useUsersMediaServers(account?.pubkey);

  watch("mediaUploadService");

  const addClientTag = useObservable(localSettings.addClientTag);

  return (
    <SimpleView
      as="form"
      onSubmit={submit}
      title="贴文设置"
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
        <FormLabel htmlFor="theme" mb="0">
          媒体上传服务
        </FormLabel>
        <Select id="mediaUploadService" w="sm" {...register("mediaUploadService")}>
          <option value="nostr.build">nostr.build</option>
          <option value="blossom">Blossom</option>
        </Select>

        {getValues().mediaUploadService === "nostr.build" && (
          <>
            <FormHelperText>
              去注册并使用{" "}
              <Link href="https://nostr.build/login/" target="_blank" color="blue.500">
                nostr.build
              </Link>
              {" "}的付费账户是个更好的选择
            </FormHelperText>
          </>
        )}

        {getValues().mediaUploadService === "blossom" && (!mediaServers || mediaServers.length === 0) && (
          <Alert status="error" mt="2" flexWrap="wrap">
            <AlertIcon />
            <AlertTitle>没有媒体服务器!</AlertTitle>
            <AlertDescription>看起来你没有设置任何媒体服务器</AlertDescription>
            <Button as={RouterLink} colorScheme="primary" ml="auto" size="sm" to="/relays/media-servers">
              设置服务器
            </Button>
          </Alert>
        )}
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="noteDifficulty" mb="0">
          工作量证明 (PoW)
        </FormLabel>
        <Input
          id="noteDifficulty"
          {...register("noteDifficulty", { min: 0, max: 64, valueAsNumber: true })}
          step={1}
          maxW="sm"
        />
        <FormHelperText>
          <span>发帖时需要计算的工作量证明难度. 设置为 0 则表示禁用 PoW.</span>
        </FormHelperText>
      </FormControl>

      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="addClientTag" mb="0">
            添加客户端标签
          </FormLabel>
          <Switch
            id="addClientTag"
            isChecked={addClientTag}
            onChange={() => localSettings.addClientTag.next(!localSettings.addClientTag.value)}
          />
        </Flex>
        <FormHelperText>
          启用: 附加{" "}
          <Link isExternal href="https://github.com/nostr-protocol/nips/blob/master/89.md#client-tag">
            NIP-89
          </Link>{" "}
          客户端标签到事件中
        </FormHelperText>
      </FormControl>

      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="mirrorBlobsOnShare" mb="0">
            总是镜像媒体附件
          </FormLabel>
          <Switch id="mirrorBlobsOnShare" {...register("mirrorBlobsOnShare")} />
        </Flex>
        <FormHelperText>分享笔记时将所有媒体复制到你的个人 Blossom 服务器上</FormHelperText>
      </FormControl>
    </SimpleView>
  );
}
