import { Card, CardBody, ComponentWithAs, Flex, Heading, IconProps, LinkBox, SimpleGrid, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import VerticalPageLayout from "../../components/vertical-page-layout";
import { MediaIcon, NotesIcon } from "../../components/icons";
import HoverLinkOverlay from "../../components/hover-link-overlay";

const NEW_TYPES: { title: string; path: string; summary?: string; icon: ComponentWithAs<"svg", IconProps> }[] = [
  { title: "Text Note", path: "/new/note", summary: "A short text post with media", icon: NotesIcon },
  { title: "Media Post", path: "/new/media", summary: "Image and video posts", icon: MediaIcon },
];

export default function NewView() {
  return (
    <VerticalPageLayout>
      <Heading size="lg">Create new...</Heading>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="2">
        {NEW_TYPES.map(({ title, path, icon: Icon, summary }) => (
          <Card as={LinkBox}>
            <CardBody display="flex" gap="4">
              <Icon boxSize={10} />
              <Flex gap="2" flexDirection="column">
                <Heading size="md">
                  <HoverLinkOverlay as={RouterLink} to={path}>
                    {title}
                  </HoverLinkOverlay>
                </Heading>

                {summary && <Text whiteSpace="pre-line">{summary}</Text>}
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VerticalPageLayout>
  );
}
