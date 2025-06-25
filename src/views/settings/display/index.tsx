import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { useObservableEagerState } from "applesauce-react/hooks";
import { Link as RouterLink } from "react-router-dom";

import SimpleView from "../../../components/layout/presets/simple-view";
import localSettings from "../../../services/local-settings";
import useSettingsForm from "../use-settings-form";

export default function DisplaySettings() {
  const { register, submit, formState } = useSettingsForm();

  const hideZapBubbles = useObservableEagerState(localSettings.hideZapBubbles);

  return (
    <SimpleView
      title="显示"
      as="form"
      onSubmit={submit}
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
          Save
        </Button>
      }
    >
      <FormControl>
        <FormLabel htmlFor="theme" mb="0">
          主题
        </FormLabel>
        <Select id="theme" {...register("theme")} maxW="sm">
          <option value="default">默认</option>
          <option value="chakraui">ChakraUI</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="colorMode" mb="0">
          色彩模式
        </FormLabel>
        <Select id="colorMode" {...register("colorMode")} maxW="sm">
          <option value="system">系统默认</option>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </Select>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="primaryColor" mb="0">
            强调色
          </FormLabel>
          <Input id="primaryColor" type="color" maxW="120" size="sm" {...register("primaryColor")} />
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="maxPageWidth" mb="0">
          最大页面宽度
        </FormLabel>
        <Select id="maxPageWidth" {...register("maxPageWidth")} maxW="sm">
          <option value="none">默认(无)</option>
          <option value="full">全宽</option>
          <option value="sm">窄</option>
          <option value="md">标准</option>
          <option value="lg">宽</option>
          <option value="xl">加宽</option>
        </Select>
        <FormHelperText>
          <span>这会限制时间线栏的最大显示宽度</span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="maxPageWidth" mb="0">
          用户公钥颜色显示
        </FormLabel>
        <Select id="maxPageWidth" maxW="sm" {...register("showPubkeyColor")}>
          <option value="md">常规</option>
          <option value="avatar">头像</option>
          <option value="underline">下划线</option>
        </Select>
        <FormHelperText>
          <span>控制用户的公钥颜色会如何显示</span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="hideUsernames" mb="0">
            隐藏用户名 (佚名模式)
          </FormLabel>
          <Switch id="hideUsernames" {...register("hideUsernames")} />
        </Flex>
        <FormHelperText>
          <span>
            启用: 隐藏用户名和资料图片{" "}
            <Link
              as={RouterLink}
              color="blue.500"
              to="/n/nevent1qqsxvkjgpc6zhydj4rxjpl0frev7hmgynruq027mujdgy2hwjypaqfspzpmhxue69uhkummnw3ezuamfdejszythwden5te0dehhxarjw4jjucm0d5sfntd0"
            >
              详情
            </Link>
          </span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="removeEmojisInUsernames" mb="0">
            隐藏用户名里的 Emoji
          </FormLabel>
          <Switch id="removeEmojisInUsernames" {...register("removeEmojisInUsernames")} />
        </Flex>
        <FormHelperText>
          <span>启用: 移除其他用户的用户名和显示名称中的 Emoji</span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="hideZapBubbles" mb="0">
            隐藏笔记中的单个打闪
          </FormLabel>
          <Switch
            id="hideZapBubbles"
            isChecked={hideZapBubbles}
            onChange={() => localSettings.hideZapBubbles.next(!localSettings.hideZapBubbles.value)}
          />
        </Flex>
        <FormHelperText>
          <span>启用: 隐藏时间线笔记中的单个打闪</span>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel htmlFor="show-content-warning" mb="0">
            显示内容警告 (CW)
          </FormLabel>
          <Switch id="show-content-warning" {...register("showContentWarning")} />
        </Flex>
        <FormHelperText>
          <span>启用: 对含有 NIP-36 (内容警告) 标记的笔记显示警告</span>
        </FormHelperText>
      </FormControl>
    </SimpleView>
  );
}
