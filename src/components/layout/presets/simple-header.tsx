import { ReactNode } from "react";
import { Flex, FlexProps, Heading } from "@chakra-ui/react";

import { BackIconButton } from "../../router/back-button";

export default function SimpleHeader({
  children,
  title,
  icon,
  ...props
}: Omit<FlexProps, "title"> & { title?: ReactNode; icon?: ReactNode }) {
  return (
    <Flex
      p="2"
      borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
      alignItems="center"
      gap="2"
      minH="14"
      position="sticky"
      top="var(--safe-top)"
      mt="var(--safe-top)"
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
      zIndex="modal"
      {...props}
    >
      <BackIconButton hideFrom="lg" />
      {icon}
      <Heading fontWeight="bold" size="md" ml={{ base: 0, md: "2" }} whiteSpace="pre" isTruncated>
        {title}
      </Heading>
      {children}
    </Flex>
  );
}
