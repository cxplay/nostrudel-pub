import { Select, SelectProps } from "@chakra-ui/react";
import { useObservableEagerState } from "applesauce-react/hooks";

import { RelayAuthMode } from "../../services/authentication-signer";
import localSettings from "../../services/local-settings";

export default function DefaultAuthModeSelect({ ...props }: Omit<SelectProps, "children" | "value" | "onChange">) {
  const defaultAuthenticationMode = useObservableEagerState(localSettings.defaultAuthenticationMode);

  return (
    <Select
      value={defaultAuthenticationMode}
      onChange={(e) => localSettings.defaultAuthenticationMode.next(e.target.value as RelayAuthMode)}
      {...props}
    >
      <option value="always">总是认证 (always)</option>
      <option value="ask">每次都询问 (ask)</option>
      <option value="never">从不认证 (never)</option>
    </Select>
  );
}
