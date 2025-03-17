import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";

import RequireActiveAccount from "../../../components/router/require-active-account";
import { useActiveAccount } from "applesauce-react/hooks";
import MediaServerFavicon from "../../../components/favicon/media-server-favicon";
import { usePublishEvent } from "../../../providers/global/publish-provider";
import useUsersMediaServers from "../../../hooks/use-user-media-servers";
import DebugEventButton from "../../../components/debug-modal/debug-event-button";
import { cloneEvent } from "../../../helpers/nostr/event";
import useAppSettings from "../../../hooks/use-user-app-settings";
import useAsyncAction from "../../../hooks/use-async-action";
import { isServerTag } from "../../../helpers/nostr/blossom";
import { USER_BLOSSOM_SERVER_LIST_KIND, areServersEqual } from "blossom-client-sdk";
import SimpleView from "../../../components/layout/presets/simple-view";

function MediaServersPage() {
  const toast = useToast();
  const account = useActiveAccount()!;
  const publish = usePublishEvent();
  const { mediaUploadService, updateSettings } = useAppSettings();
  const { event, servers } = useUsersMediaServers(account.pubkey, undefined, true);

  const addServer = async (server: string) => {
    const draft = cloneEvent(USER_BLOSSOM_SERVER_LIST_KIND, event);
    draft.tags = [
      ...draft.tags.filter((t) => !isServerTag(t)),
      ...servers.map((server) => ["server", server.toString()]),
      ["server", server],
    ];
    await publish("添加媒体服务器", draft);
  };
  const removeServer = async (server: string) => {
    const draft = cloneEvent(USER_BLOSSOM_SERVER_LIST_KIND, event);
    draft.tags = [
      ...draft.tags.filter((t) => !isServerTag(t)),
      ...servers.filter((s) => !areServersEqual(s, server)).map((server) => ["server", server.toString()]),
    ];
    await publish("删除媒体服务器", draft);
  };
  const makeDefault = async (server: string) => {
    const draft = cloneEvent(USER_BLOSSOM_SERVER_LIST_KIND, event);
    draft.tags = [
      ...draft.tags.filter((t) => !isServerTag(t)),
      ["server", server.toString()],
      ...servers.filter((s) => !areServersEqual(s, server)).map((server) => ["server", server.toString()]),
    ];
    await publish("删除媒体服务器", draft);
  };

  const { run: switchToBlossom } = useAsyncAction(async () => {
    await updateSettings({ mediaUploadService: "blossom" });
  }, [updateSettings]);

  const { register, handleSubmit, reset, setValue } = useForm({ defaultValues: { server: "" } });

  const submit = handleSubmit(async (values) => {
    const url = new URL(values.server.startsWith("http") ? values.server : "https://" + values.server).toString();

    if (event?.tags.some((t) => isServerTag(t) && areServersEqual(t[1], url)))
      return toast({ status: "error", description: "服务器已经在列表中" });

    try {
      // test server
      const res = await fetch(url);
      if (!res.ok) throw new Error("连接到服务器失败");

      await addServer(url);
      reset();
    } catch (error) {
      toast({ status: "error", description: "服务器无法连接" });
    }
  });

  return (
    <SimpleView
      gap="2"
      title="媒体服务器"
      actions={event && <DebugEventButton event={event} size="sm" ml="auto" />}
      maxW="4xl"
    >
      <Text fontStyle="italic" mt="-2">
        <Link href="https://github.com/hzrd149/blossom" target="_blank" color="blue.500">
          Blossom
        </Link>{" "}
        媒体服务器用于发帖时托管你上传的图片和视频等多媒体资源
      </Text>

      {mediaUploadService !== "blossom" && (
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>未选择 Blossom</AlertTitle>
            <AlertDescription>
              除非你在设置中将 "媒体上传服务" 切换为 "Blossom", 否则这些服务器不会用于任何实际用途.
            </AlertDescription>
            <br />
            <Button size="sm" variant="outline" onClick={switchToBlossom}>
              切换为 Blossom
            </Button>
          </Box>
        </Alert>
      )}

      {servers.length === 0 && mediaUploadService === "blossom" && (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="xs"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            没有媒体服务器!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            你需要添加至少一个媒体服务器用于上传图片和视频
          </AlertDescription>
          <Divider maxW="96" w="full" my="2" />
          <Button onClick={() => setValue("server", "https://nostr.download/")}>Add nostr.download</Button>
        </Alert>
      )}

      <Flex direction="column" gap="2">
        {servers.map((server, i) => (
          <Flex
            gap="2"
            p="2"
            alignItems="center"
            borderWidth="1px"
            borderRadius="lg"
            key={server.toString()}
            borderColor={i === 0 ? "primary.500" : undefined}
          >
            <MediaServerFavicon server={server.toString()} size="sm" />
            <Link href={server.toString()} target="_blank" fontSize="lg">
              {new URL(server).hostname}
            </Link>

            <ButtonGroup size="sm" ml="auto">
              <Button
                variant={i === 0 ? "solid" : "ghost"}
                colorScheme={i === 0 ? "primary" : undefined}
                onClick={() => makeDefault(server.toString())}
                isDisabled={i === 0}
              >
                默认
              </Button>
              <IconButton
                aria-label="删除服务器"
                icon={<CloseIcon />}
                colorScheme="red"
                onClick={() => removeServer(server.toString())}
                variant="ghost"
              />
            </ButtonGroup>
          </Flex>
        ))}
      </Flex>

      {mediaUploadService === "blossom" && (
        <>
          <Flex as="form" onSubmit={submit} gap="2">
            <Input {...register("server", { required: true })} required placeholder="https://nostr.download" />
            <Button type="submit" colorScheme="primary">
              添加
            </Button>
          </Flex>
        </>
      )}
    </SimpleView>
  );
}

export default function MediaServersView() {
  return (
    <RequireActiveAccount>
      <MediaServersPage />
    </RequireActiveAccount>
  );
}
