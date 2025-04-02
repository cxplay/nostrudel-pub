import { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "../../../../components/icons";
import Trash01 from "../../../../components/icons/trash-01";

export default function EnableWithDelete({
  enable,
  enabled,
  wipe,
  isLoading,
  ...props
}: Omit<ButtonGroupProps, "children"> & {
  enable: () => void;
  enabled: boolean;
  wipe: () => Promise<void>;
  isLoading?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);
  const wipeDatabase = useCallback(async () => {
    try {
      setDeleting(true);
      await wipe();
      location.reload();
    } catch (error) {}
    setDeleting(false);
  }, []);

  return (
    <ButtonGroup isAttached {...props}>
      <Button colorScheme="primary" onClick={enable} isDisabled={enabled}>
        {enabled ? "已启用" : "启用"}
      </Button>
      <Menu>
        <MenuButton as={IconButton} icon={<ChevronDownIcon />} aria-label="More options" isLoading={isLoading} />
        <MenuList>
          <MenuItem icon={<Trash01 />} color="red.500" onClick={wipeDatabase}>
            清理数据库
          </MenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  );
}
