import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NostrEvent } from "nostr-tools";

import { WIKI_RELAYS } from "../../const";
import useCacheForm from "../../hooks/use-cache-form";
import useReplaceableEvent from "../../hooks/use-replaceable-event";
import { useActiveAccount } from "applesauce-react/hooks";
import { WIKI_PAGE_KIND, getPageSummary, getPageTitle, getPageTopic } from "../../helpers/nostr/wiki";
import { usePublishEvent } from "../../providers/global/publish-provider";
import VerticalPageLayout from "../../components/vertical-page-layout";
import MarkdownEditor from "./components/markdown-editor";
import { ErrorBoundary } from "../../components/error-boundary";
import { cloneEvent, replaceOrAddSimpleTag } from "../../helpers/nostr/event";
import FormatButton from "./components/format-toolbar";
import { getSharableEventAddress } from "../../services/relay-hints";

function EditWikiPagePage({ page }: { page: NostrEvent }) {
  const toast = useToast();
  const publish = usePublishEvent();
  const navigate = useNavigate();

  const topic = getPageTopic(page);

  const { register, setValue, getValues, handleSubmit, watch, formState, reset } = useForm({
    defaultValues: { content: page.content, title: getPageTitle(page) ?? topic, summary: getPageSummary(page, false) },
    mode: "all",
  });

  const clearFormCache = useCacheForm(
    "wiki-" + topic,
    // @ts-expect-error
    getValues,
    reset,
    formState,
  );

  watch("content");
  register("content", {
    minLength: 10,
    required: true,
  });

  const submit = handleSubmit(async (values) => {
    try {
      const draft = cloneEvent(WIKI_PAGE_KIND, page);
      draft.content = values.content;
      replaceOrAddSimpleTag(draft, "title", values.title);
      replaceOrAddSimpleTag(draft, "summary", values.summary);

      const pub = await publish("Publish Page", draft, WIKI_RELAYS, false);
      clearFormCache();
      navigate(`/wiki/page/${getSharableEventAddress(pub.event)}`, { replace: true });
    } catch (error) {
      if (error instanceof Error) toast({ description: error.message, status: "error" });
    }
  });

  return (
    <VerticalPageLayout as="form" h="full" onSubmit={submit}>
      <Heading>编辑 Wiki 页面</Heading>
      <Flex gap="2" wrap={{ base: "wrap", md: "nowrap" }}>
        <FormControl w={{ base: "full", md: "sm" }} isRequired flexShrink={0}>
          <FormLabel>栏目</FormLabel>
          <Input readOnly value={topic} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>标题</FormLabel>
          <Input {...register("title", { required: true })} autoComplete="off" />
        </FormControl>
      </Flex>
      <FormControl>
        <FormLabel>概述</FormLabel>
        <Textarea {...register("summary", { required: true })} isRequired />
      </FormControl>
      <Flex gap="2">
        <FormatButton
          getValue={() => getValues().content}
          setValue={(content) => setValue("content", content, { shouldDirty: true })}
        />
        <Spacer />
        <Button onClick={() => navigate(-1)}>取消</Button>
        <Button colorScheme="primary" type="submit" isLoading={formState.isSubmitting}>
          发布
        </Button>
      </Flex>
      <MarkdownEditor value={getValues().content} onChange={(v) => setValue("content", v)} />
    </VerticalPageLayout>
  );
}

export default function EditWikiPageView() {
  const account = useActiveAccount();
  if (!account) return <Navigate to="/" />;

  const topic = useParams().topic;
  if (!topic) return <Navigate to="/wiki" />;

  const page = useReplaceableEvent({ kind: WIKI_PAGE_KIND, pubkey: account.pubkey, identifier: topic });

  if (!page) return <Spinner />;

  return (
    <ErrorBoundary>
      <EditWikiPagePage page={page} />
    </ErrorBoundary>
  );
}
