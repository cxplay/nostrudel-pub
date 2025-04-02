import { Select, SelectProps } from "@chakra-ui/react";
import { useObservable } from "applesauce-react/hooks";

import localSettings from "../../services/local-settings";
import { RelayAuthMode } from "../../services/authentication-signer";

export default function RelayAuthModeSelect({
  relay,
  ...props
}: { relay: string } & Omit<SelectProps, "value" | "onChange" | "children">) {
  const defaultMode = useObservable(localSettings.defaultAuthenticationMode);
  const relayMode = useObservable(localSettings.relayAuthenticationMode);

  const authMode = relayMode.find((r) => r.relay === relay)?.mode ?? "";

  const setAuthMode = (mode: RelayAuthMode | "") => {
    const existing = relayMode.find((r) => r.relay === relay);

    if (!mode) {
      if (existing) localSettings.relayAuthenticationMode.next(relayMode.filter((r) => r.relay !== relay));
    } else {
      if (existing)
        localSettings.relayAuthenticationMode.next(relayMode.map((r) => (r.relay === relay ? { relay, mode } : r)));
      else localSettings.relayAuthenticationMode.next([...relayMode, { relay, mode }]);
    }
  };

  return (
    <Select value={authMode} onChange={(e) => setAuthMode(e.target.value as RelayAuthMode)} {...props}>
      <option value="">默认 ({defaultMode})</option>
      <option value="always">总是</option>
      <option value="ask">询问</option>
      <option value="never">从不</option>
    </Select>
  );
}
