import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { EventTemplate, kinds } from "nostr-tools";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { usePublishEvent } from "../../../providers/global/publish-provider";
import { getSharableEventAddress } from "../../../services/relay-hints";

export default function EmojiPackCreateModal({ onClose, ...props }: Omit<ModalProps, "children">) {
  const publish = usePublishEvent();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const submit = handleSubmit(async (values) => {
    const draft: EventTemplate = {
      kind: kinds.Emojisets,
      created_at: dayjs().unix(),
      content: "",
      tags: [["d", values.title]],
    };

    const pub = await publish("Create emoji pack", draft);
    if (pub) navigate(`/emojis/${getSharableEventAddress(pub.event)}`);
  });

  return (
    <Modal onClose={onClose} size="xl" {...props}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={submit}>
        <ModalHeader p="4">创建表情包</ModalHeader>
        <ModalCloseButton />
        <ModalBody px="4" py="0">
          <FormControl isRequired>
            <FormLabel>名称</FormLabel>
            <Input type="name" {...register("title", { required: true })} autoComplete="off" />
          </FormControl>
        </ModalBody>

        <ModalFooter p="4">
          <Button mr="2" onClick={onClose}>
            取消
          </Button>
          <Button colorScheme="primary" type="submit">
            创建
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
