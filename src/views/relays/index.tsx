import { useActiveAccount } from "applesauce-react/hooks";
import { IdentityStatus } from "applesauce-loaders/helpers/dns-identity";

import Database01 from "../../components/icons/database-01";
import { AtIcon, RelayIcon, SearchIcon } from "../../components/icons";
import Mail02 from "../../components/icons/mail-02";
import { useUserDNSIdentity } from "../../hooks/use-user-dns-identity";
import UserSquare from "../../components/icons/user-square";
import Image01 from "../../components/icons/image-01";
import Server05 from "../../components/icons/server-05";
import SimpleNavItem from "../../components/layout/presets/simple-nav-item";
import SimpleParentView from "../../components/layout/presets/simple-parent-view";

export default function RelaysView() {
  const account = useActiveAccount();
  const nip05 = useUserDNSIdentity(account?.pubkey);

  return (
    <SimpleParentView title="中继" path="/relays">
      <SimpleNavItem to="/relays/app" leftIcon={<RelayIcon boxSize={6} />}>
        应用中继
      </SimpleNavItem>
      <SimpleNavItem to="/relays/cache" leftIcon={<Database01 boxSize={6} />}>
        缓存中继
      </SimpleNavItem>
      {account && (
        <>
          <SimpleNavItem to="/relays/mailboxes" leftIcon={<Mail02 boxSize={6} />}>
            信箱中继
          </SimpleNavItem>
          <SimpleNavItem to="/relays/media-servers" leftIcon={<Image01 boxSize={6} />}>
            媒体服务器
          </SimpleNavItem>
          <SimpleNavItem to="/relays/search" leftIcon={<SearchIcon boxSize={6} />}>
            搜索中继
          </SimpleNavItem>
        </>
      )}
      <SimpleNavItem to="/relays/webrtc" leftIcon={<Server05 boxSize={6} />}>
        WebRTC 中继
      </SimpleNavItem>
      {nip05?.status === IdentityStatus.Found && (
        <SimpleNavItem to="/relays/nip05" leftIcon={<AtIcon boxSize={6} />}>
          NIP-05 中继
        </SimpleNavItem>
      )}
      {account && (
        <>
          <SimpleNavItem to="/relays/contacts" leftIcon={<UserSquare boxSize={6} />}>
            通讯录中继
          </SimpleNavItem>
        </>
      )}
    </SimpleParentView>
  );
}
