import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useThrottle } from "react-use";
import dayjs from "dayjs";

import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { getEmojis, getPackName } from "applesauce-core/helpers/emoji";
import { kinds } from "nostr-tools";

import UserLink from "../../components/user/user-link";
import { ChevronLeftIcon } from "../../components/icons";
import { useActiveAccount } from "applesauce-react/hooks";
import { useDeleteEventContext } from "../../providers/route/delete-event-provider";
import useReplaceableEvent from "../../hooks/use-replaceable-event";
import EmojiPackMenu from "./components/emoji-pack-menu";
import EmojiPackFavoriteButton from "./components/emoji-pack-favorite-button";
import { DraftNostrEvent, NostrEvent } from "../../types/nostr-event";
import VerticalPageLayout from "../../components/vertical-page-layout";
import UserAvatarLink from "../../components/user/user-avatar-link";
import Timestamp from "../../components/timestamp";
import useParamsAddressPointer from "../../hooks/use-params-address-pointer";
import { usePublishEvent } from "../../providers/global/publish-provider";
import EventZapButton from "../../components/zap/event-zap-button";
import EventQuoteButton from "../../components/note/event-quote-button";

function AddEmojiForm({ onAdd }: { onAdd: (values: { shortcode: string; url: string }) => void }) {
  const { register, handleSubmit, watch, getValues, reset } = useForm({
    defaultValues: {
      shortcode: "",
      url: "",
    },
  });

  const submit = handleSubmit((values) => {
    onAdd(values);
    reset();
  });

  watch("url");
  const previewURL = useThrottle(getValues().url);

  return (
    <Flex as="form" gap="2" onSubmit={submit}>
      <Input
        placeholder="shortcode"
        {...register("shortcode", { required: true })}
        pattern="^[a-zA-Z0-9_-]+$"
        autoComplete="off"
        title="表情短代码, 不能包含空格"
      />
      <Input placeholder="https://example.com/emoji.png" {...register("url", { required: true })} autoComplete="off" />
      {previewURL && <Image aspectRatio={1} h="10" src={previewURL} />}
      <Button flexShrink={0} type="submit">
        Add
      </Button>
    </Flex>
  );
}

function EmojiTag({
  shortcode,
  url,
  onRemove,
  scale,
}: {
  shortcode: string;
  url: string;
  onRemove?: () => void;
  scale: number;
}) {
  return (
    <Tag>
      <Image
        key={shortcode + url}
        src={url}
        title={shortcode}
        alt={`:${shortcode}:`}
        w={scale}
        h={scale}
        ml="-1"
        mr="2"
        my="1"
        borderRadius="md"
        overflow="hidden"
      />
      <TagLabel flex={1}>{shortcode}</TagLabel>
      {onRemove && <TagCloseButton onClick={onRemove} />}
    </Tag>
  );
}

function EmojiPackPage({ pack }: { pack: NostrEvent }) {
  const navigate = useNavigate();
  const account = useActiveAccount();
  const publish = usePublishEvent();
  const { deleteEvent } = useDeleteEventContext();
  const [scale, setScale] = useState(10);

  const isAuthor = account?.pubkey === pack.pubkey;
  const emojis = getEmojis(pack);

  const [editing, setEditing] = useState(false);
  const [draftEmojis, setDraft] = useState(emojis);

  const startEdit = () => {
    setDraft(emojis);
    setEditing(true);
  };
  const addEmoji = (emoji: { shortcode: string; url: string }) => {
    setDraft((a) => a.concat(emoji));
  };
  const removeEmoji = (shortcode: string) => {
    setDraft((a) => a.filter((e) => e.shortcode !== shortcode));
  };
  const cancelEdit = () => {
    setDraft([]);
    setEditing(false);
  };
  const saveEdit = async () => {
    const draft: DraftNostrEvent = {
      kind: kinds.Emojisets,
      content: pack.content || "",
      created_at: dayjs().unix(),
      tags: [
        ...pack.tags.filter((t) => t[0] !== "emoji"),
        ...draftEmojis.map(({ shortcode, url }) => ["emoji", shortcode, url]),
      ],
    };

    const pub = await publish("Update emoji pack", draft);
    if (pub) setEditing(false);
  };

  return (
    <VerticalPageLayout>
      <Flex gap="2" alignItems="center">
        <Button onClick={() => navigate(-1)} leftIcon={<ChevronLeftIcon />}>
          返回
        </Button>

        <Spacer />

        <ButtonGroup>
          {isAuthor && (
            <>
              {!editing && (
                <Button colorScheme="primary" onClick={startEdit}>
                  编辑
                </Button>
              )}
              <Button colorScheme="red" onClick={() => deleteEvent(pack).then(() => navigate("/lists"))}>
                删除
              </Button>
            </>
          )}
          <EmojiPackMenu aria-label="More options" pack={pack} />
        </ButtonGroup>
      </Flex>

      <Flex gap="2" alignItems="center">
        <Heading size="lg" isTruncated>
          {getPackName(pack)}
        </Heading>
        <EmojiPackFavoriteButton pack={pack} size="sm" />
      </Flex>

      <Flex gap="2" alignItems="center">
        <Text>创建者:</Text>
        <UserAvatarLink pubkey={pack.pubkey} size="sm" />
        <UserLink pubkey={pack.pubkey} fontWeight="bold" />
      </Flex>
      <Text>
        更新于: <Timestamp timestamp={pack.created_at} />
      </Text>

      <ButtonGroup variant="ghost">
        <EventZapButton event={pack} />
        <EventQuoteButton event={pack} />
        <EmojiPackFavoriteButton pack={pack} />
      </ButtonGroup>

      {emojis.length > 0 && (
        <>
          {!editing && (
            <Flex alignItems="flex-end">
              <Heading size="md">表情</Heading>
              <ButtonGroup size="sm" isAttached ml="auto">
                <Button variant={scale === 10 ? "solid" : "outline"} onClick={() => setScale(10)}>
                  小
                </Button>
                <Button variant={scale === 16 ? "solid" : "outline"} onClick={() => setScale(16)}>
                  中
                </Button>
                <Button variant={scale === 24 ? "solid" : "outline"} onClick={() => setScale(24)}>
                  大
                </Button>
              </ButtonGroup>
            </Flex>
          )}
          <SimpleGrid columns={{ base: 2, sm: 3, md: 2, lg: 4, xl: 6 }} gap="2">
            {(editing ? draftEmojis : emojis).map(({ shortcode, url }) => (
              <EmojiTag
                key={shortcode + url}
                scale={scale}
                shortcode={shortcode}
                url={url}
                onRemove={editing ? () => removeEmoji(shortcode) : undefined}
              />
            ))}
          </SimpleGrid>
        </>
      )}

      {editing && (
        <Flex gap="2">
          <AddEmojiForm onAdd={addEmoji} />
          <Button ml="auto" onClick={cancelEdit}>
            取消
          </Button>
          <Button colorScheme="primary" onClick={saveEdit}>
            保存
          </Button>
        </Flex>
      )}
    </VerticalPageLayout>
  );
}

export default function EmojiPackView() {
  const coordinate = useParamsAddressPointer("addr");
  const pack = useReplaceableEvent(coordinate);

  if (!pack) {
    return (
      <>
        查找用户 <UserLink pubkey={coordinate.pubkey} /> 创建的表情包 "{coordinate.identifier}"
      </>
    );
  }

  return <EmojiPackPage pack={pack} />;
}
