import { Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { FileMetadata } from "applesauce-core/helpers";
import { PicturePostBlueprint } from "applesauce-factory/blueprints";
import { useEventFactory } from "applesauce-react/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SimpleView from "~/components/layout/presets/simple-view";
import useUploadFile from "~/hooks/use-upload-file";
import { usePublishEvent } from "~/providers/global/publish-provider";
import { getSharableEventAddress } from "~/services/relay-hints";
import PicturePostForm, { FormValues } from "./picture-post-form";

export default function NewPictureView() {
  const toast = useToast();
  const factory = useEventFactory();
  const publish = usePublishEvent();
  const uploadFile = useUploadFile();
  const navigate = useNavigate();

  const [loading, setLoading] = useState("");
  const submit = async (values: FormValues) => {
    const pictures: FileMetadata[] = [];

    let i = 0;
    for (const media of values.media) {
      setLoading(`正在上传 ${++i} of ${values.media.length}...`);

      const picture = await uploadFile.run(media.file);
      if (picture) pictures.push(picture);
    }

    setLoading("正在创建帖子...");
    let draft = await factory.create(PicturePostBlueprint, pictures, values.content, {
      contentWarning: values.nsfw ? values.nsfwReason : undefined,
    });

    setLoading("正在签名帖子...");
    const signed = await factory.sign(draft);

    setLoading("正在发布帖子...");
    await publish("发布图片", signed);

    toast({ status: "success", description: "已发布" });

    navigate(`/pictures/${getSharableEventAddress(signed)}`);
  };

  return (
    <SimpleView maxW="4xl" center title="图片帖子">
      {loading ? (
        <Flex gap="2" alignItems="center" justifyContent="center" h="full">
          <Spinner size="lg" />
          <Text>{loading}</Text>
        </Flex>
      ) : (
        <PicturePostForm onSubmit={submit} />
      )}
    </SimpleView>
  );
}
