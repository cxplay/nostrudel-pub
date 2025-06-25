import { NostrEvent } from "nostr-tools";
import { Box, Button, Flex, Heading, Image, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";

import { ThreadIcon } from "../../components/icons";
import useParamsAddressPointer from "../../hooks/use-params-address-pointer";
import useReplaceableEvent from "../../hooks/use-replaceable-event";
import VerticalPageLayout from "../../components/vertical-page-layout";
import {
  getArticleImage,
  getArticlePublishDate,
  getArticleSummary,
  getArticleTitle,
} from "../../helpers/nostr/long-form";
import UserLink from "../../components/user/user-link";
import UserAvatarLink from "../../components/user/user-avatar-link";
import UserDnsIdentityIcon from "../../components/user/user-dns-identity-icon";
import MarkdownContent from "../../components/markdown/markdown";
import ArticleMenu from "./components/article-menu";
import ArticleTags from "./components/article-tags";
import NoteReactions from "../../components/note/timeline-note/components/note-reactions";
import EventZapButton from "../../components/zap/event-zap-button";
import ZapBubbles from "../../components/note/timeline-note/components/zap-bubbles";
import BookmarkEventButton from "../../components/note/bookmark-button";
import EventQuoteButton from "../../components/note/event-quote-button";
import { GenericComments } from "../../components/comment/generic-comments";
import GenericCommentForm from "../../components/comment/generic-comment-form";
import EventShareButton from "../../components/note/timeline-note/components/event-share-button";

function ArticlePage({ article }: { article: NostrEvent }) {
  const image = getArticleImage(article);
  const title = getArticleTitle(article);
  const published = getArticlePublishDate(article);
  const summary = getArticleSummary(article);

  const comment = useDisclosure();

  return (
    <VerticalPageLayout pt={{ base: "2", lg: "8" }} pb="32" role="main" aria-label="文章内容">
      <article>
        <Box as="header" mx="auto" maxW="4xl" w="full" mb="2" role="heading">
          <ArticleMenu article={article} aria-label="文章选项" float="right" />
          <Heading as="h1" size="xl">
            {title}
          </Heading>
          {summary && (
            <Text as="p" role="doc-subtitle">
              {summary}
            </Text>
          )}
          <Box py="2" as="div" role="contentinfo">
            <UserAvatarLink pubkey={article.pubkey} float="left" mr="3" mb="2" aria-label="作者头像" />
            <UserLink
              pubkey={article.pubkey}
              fontWeight="bold"
              fontSize="xl"
              mr="2"
              tab="articles"
              aria-label="作者资料"
            />
            <UserDnsIdentityIcon pubkey={article.pubkey} aria-label="作者验证状态" />
            <br />
            <Text as="time" dateTime={dayjs.unix(published ?? article.created_at).format()}>
              {dayjs.unix(published ?? article.created_at).format("LL")}
            </Text>
          </Box>

          <Flex gap="2">
            <ArticleTags article={article} aria-label="文章标签" />
            <BookmarkEventButton event={article} aria-label="收藏文章" variant="ghost" ms="auto" size="sm" />
          </Flex>
        </Box>

        {image && (
          <Image src={image} maxW="6xl" w="full" mx="auto" maxH="60vh" alt="文章特色图片" loading="lazy" />
        )}

        <Box mx="auto" maxW="4xl" w="full" mb="8" as="section" role="article" mt="4">
          <ZapBubbles event={article} mb="2" aria-label="打闪回应" />
          <Flex gap="2" role="toolbar" aria-label="文章操作">
            <EventZapButton event={article} size="sm" variant="ghost" showEventPreview={false} aria-label="发送打闪" />
            <EventShareButton event={article} size="sm" variant="ghost" aria-label="分享文章" />
            <EventQuoteButton event={article} size="sm" variant="ghost" aria-label="引用文章" />
            <NoteReactions event={article} size="sm" variant="ghost" aria-label="回应文章" />
          </Flex>

          <Box fontSize="lg" as="div" className="article-content">
            <MarkdownContent event={article} />
          </Box>

          <Flex gap="2" role="toolbar" aria-label="文章操作" mt="4">
            <EventZapButton event={article} size="sm" variant="ghost" showEventPreview={false} aria-label="发送打闪" />
            <EventShareButton event={article} size="sm" variant="ghost" aria-label="分享文章" />
            <EventQuoteButton event={article} size="sm" variant="ghost" aria-label="引用文章" />
            <NoteReactions event={article} size="sm" variant="ghost" aria-label="回应文章" />
          </Flex>
        </Box>

        <Flex mx="auto" maxW="4xl" w="full" gap="2" direction="column" as="section" aria-label="评论选区">
          {comment.isOpen ? (
            <GenericCommentForm
              event={article}
              onCancel={comment.onClose}
              onSubmitted={comment.onClose}
              aria-label="添加评论"
            />
          ) : (
            <Button leftIcon={<ThreadIcon />} onClick={comment.onOpen} mr="auto" aria-expanded={comment.isOpen}>
              Comment
            </Button>
          )}

          <GenericComments event={article} aria-label="Article comments" />
        </Flex>
      </article>
    </VerticalPageLayout>
  );
}

export default function ArticleView() {
  const pointer = useParamsAddressPointer("naddr");

  const article = useReplaceableEvent(pointer);

  if (!article) return <Spinner />;

  return <ArticlePage article={article} />;
}
