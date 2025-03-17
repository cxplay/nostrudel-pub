import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Select,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Switch,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useObservable } from "applesauce-react/hooks";

import { EditIcon } from "../../../components/icons";
import { useContextEmojis } from "../../../providers/global/emoji-provider";
import useUsersMediaServers from "../../../hooks/use-user-media-servers";
import useCurrentAccount from "../../../hooks/use-current-account";
import useSettingsForm from "../use-settings-form";
import VerticalPageLayout from "../../../components/vertical-page-layout";
import localSettings from "../../../services/local-settings";

export default function PostSettings() {
  const account = useCurrentAccount();
  const { register, setValue, getValues, watch, submit, formState } = useSettingsForm();
  const emojiPicker = useDisclosure();
  const { servers: mediaServers } = useUsersMediaServers(account?.pubkey);

  const emojis = useContextEmojis();
  const [emojiSearch, setEmojiSearch] = useState("");

  watch("quickReactions");
  watch("mediaUploadService");
  const filteredEmojis = useMemo(() => {
    const values = getValues();
    if (emojiSearch.trim()) {
      const noCustom = emojis.filter((e) => e.char && !e.url && !values.quickReactions.includes(e.char));
      return matchSorter(noCustom, emojiSearch.trim(), { keys: ["keywords", "char"] }).slice(0, 10);
    }
    return [];
  }, [emojiSearch, getValues().quickReactions]);

  const addEmoji = (char: string) => {
    const values = getValues();
    if (values.quickReactions.includes(char)) return;
    setValue("quickReactions", values.quickReactions.concat(char), { shouldTouch: true, shouldDirty: true });
  };
  const removeEmoji = (char: string) => {
    const values = getValues();
    if (!values.quickReactions.includes(char)) return;
    setValue(
      "quickReactions",
      values.quickReactions.filter((e) => e !== char),
      { shouldTouch: true, shouldDirty: true },
    );
  };

  const addClientTag = useObservable(localSettings.addClientTag);

  return (
    <VerticalPageLayout as="form" onSubmit={submit} flex={1}>
      <Heading size="md">贴文设置</Heading>
      <Flex direction="column" gap="4">
        <FormControl>
          <FormLabel htmlFor="quickReactions" mb="0">
            快速回应
          </FormLabel>
          <Flex gap="2" wrap="wrap">
            {getValues().quickReactions.map((char, i) => (
              <Tag key={char + i} size="lg">
                <TagLabel>{char}</TagLabel>
                {emojiPicker.isOpen && <TagCloseButton onClick={() => removeEmoji(char)} />}
              </Tag>
            ))}
            {!emojiPicker.isOpen && (
              <Button size="sm" onClick={emojiPicker.onOpen} leftIcon={<EditIcon />}>
                自定义
              </Button>
            )}
          </Flex>
          {emojiPicker.isOpen && (
            <>
              <Input
                type="search"
                w="sm"
                h="8"
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                my="2"
              />
              <Flex gap="2" wrap="wrap">
                {filteredEmojis.map((emoji) => (
                  <IconButton
                    key={emoji.char}
                    icon={<span>{emoji.char}</span>}
                    aria-label={`Add ${emoji.name}`}
                    title={`Add ${emoji.name}`}
                    variant="outline"
                    size="sm"
                    fontSize="lg"
                    onClick={() => addEmoji(emoji.char)}
                  />
                ))}
              </Flex>
            </>
          )}
        </FormControl>
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
            <span>发帖时需要计算的工作量证明尺度. 设置为 0 则表示禁用 PoW.</span>
          </FormHelperText>
        </FormControl>

        <FormControl>
          <Flex alignItems="center">
            <FormLabel htmlFor="autoShowMedia" mb="0">
              添加客户端标签
            </FormLabel>
            <Switch
              id="autoShowMedia"
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
