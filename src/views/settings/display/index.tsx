import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  Input,
  Select,
  Textarea,
  Link,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import localSettings from "../../../services/local-settings";
import useSettingsForm from "../use-settings-form";
import VerticalPageLayout from "../../../components/vertical-page-layout";

export default function DisplaySettings() {
  const { register, submit, formState } = useSettingsForm();

  const hideZapBubbles = useObservable(localSettings.hideZapBubbles);
  const enableNoteDrawer = useObservable(localSettings.enableNoteThreadDrawer);
  const showBrandLogo = useObservable(localSettings.showBrandLogo);

  return (
    <VerticalPageLayout flex={1}>
      <Heading size="md">Display Settings</Heading>
      <Flex as="form" onSubmit={submit} direction="column" gap="4">
        <FormControl>
          <FormLabel htmlFor="theme" mb="0">
            主题
          </FormLabel>
          <Select id="theme" {...register("theme")} maxW="sm">
            <option value="default">Default</option>
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
            <option value="none">无</option>
            <option value="md">普通 (~768px)</option>
            <option value="lg">宽 (~992px)</option>
            <option value="xl">特宽 (~1280px)</option>
          </Select>
          <FormHelperText>
            <span>这会限制时间线栏在桌面设备上的最大显示宽度</span>
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="maxPageWidth" mb="0">
          用户公钥颜色显示
          </FormLabel>
          <Select id="maxPageWidth" maxW="sm" {...register("showPubkeyColor")}>
            <option value="none">无</option>
            <option value="avatar">头像</option>
            <option value="underline">下划线</option>
          </Select>
          <FormHelperText>
            <span>控制用户的公钥颜色会如何显示</span>
          </FormHelperText>
        </FormControl>
        <FormControl>
          <Flex alignItems="center">
            <FormLabel htmlFor="blurImages" mb="0">
              模糊陌生人的媒体附件
            </FormLabel>
            <Switch id="blurImages" {...register("blurImages")} />
          </Flex>
          <FormHelperText>
            <span>启用: 你没有追随的用户发布的媒体文件会被添加模糊遮罩</span>
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
        <FormControl>
          <Flex alignItems="center">
            <FormLabel htmlFor="enableNoteDrawer" mb="0">
              在抽屉中打开嵌入内容
            </FormLabel>
            <Switch
              id="enableNoteDrawer"
              isChecked={enableNoteDrawer}
              onChange={() => localSettings.enableNoteThreadDrawer.next(!localSettings.enableNoteThreadDrawer.value)}
            />
          </Flex>
          <FormHelperText>
            <span>启用: 点击嵌入的笔记将会在侧边抽屉中打开它</span>
          </FormHelperText>
        </FormControl>
        <FormControl>
          <Flex alignItems="center">
            <FormLabel htmlFor="showBrandLogo" mb="0">
              显示 noStrudel Logo
            </FormLabel>
            <Switch
              id="showBrandLogo"
              isChecked={showBrandLogo}
              onChange={(e) => localSettings.showBrandLogo.next(e.currentTarget.checked)}
            />
          </Flex>
          <FormHelperText>
            <span>在侧边导航栏显示或隐藏 noStrudel 的 Logo</span>
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="muted-words" mb="0">
            静音关键词
          </FormLabel>
          <Textarea
            id="muted-words"
            {...register("mutedWords")}
            placeholder="热狗, 火腿肠, 香肠..."
            maxW="2xl"
          />
          <FormHelperText>
            <span>
            如果笔记中包含这些单词, 短语或标签那么将会被隐藏. 以逗号分隔, 不区分大小写.
            </span>
            <br />
            <span>要注意的是, 如果你添加了常用的词语, 可能会让时间线上所有的笔记被隐藏.</span>
          </FormHelperText>
        </FormControl>
        <Button
          ml="auto"
          isLoading={formState.isLoading || formState.isValidating || formState.isSubmitting}
          isDisabled={!formState.isDirty}
          colorScheme="primary"
          type="submit"
        >
          保存设置
        </Button>
      </Flex>
    </VerticalPageLayout>
  );
}
