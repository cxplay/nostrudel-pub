import { Divider, Flex, Link, Spacer, Text } from "@chakra-ui/react";

import {
  AppearanceIcon,
  DatabaseIcon,
  GithubIcon,
  LightningIcon,
  NotesIcon,
  PerformanceIcon,
  RelayIcon,
  SearchIcon,
  SpyIcon,
  VerifiedIcon,
} from "../../components/icons";
import { useActiveAccount } from "applesauce-react/hooks";
import Image01 from "../../components/icons/image-01";
import UserAvatar from "../../components/user/user-avatar";
import VersionButton from "../../components/version-button";
import SimpleNavItem from "../../components/layout/presets/simple-nav-item";
import Bell01 from "../../components/icons/bell-01";
import Share07 from "../../components/icons/share-07";
import Database01 from "../../components/icons/database-01";
import Mail02 from "../../components/icons/mail-02";
import SimpleParentView from "../../components/layout/presets/simple-parent-view";
import useBakery from "../../hooks/use-bakery";
import CheckCircleBroken from "../../components/icons/check-circle-broken";

function DividerHeader({ title }: { title: string }) {
  return (
    <Flex alignItems="center" gap="2">
      <Divider />
      <Text fontWeight="bold" fontSize="md">
        {title}
      </Text>
      <Divider />
    </Flex>
  );
}

export default function SettingsView() {
  const account = useActiveAccount();
  const bakery = useBakery();

  return (
    <SimpleParentView title="设置" path="/settings">
      {account && (
        <>
          <SimpleNavItem to="/settings/accounts" leftIcon={<UserAvatar size="xs" pubkey={account.pubkey} />}>
            账户
          </SimpleNavItem>
          <SimpleNavItem to="/settings/mailboxes" leftIcon={<Mail02 boxSize={6} />}>
            信箱
          </SimpleNavItem>
          <SimpleNavItem to="/settings/media-servers" leftIcon={<Image01 boxSize={6} />}>
            媒体服务器
          </SimpleNavItem>
          <SimpleNavItem to="/settings/search-relays" leftIcon={<SearchIcon boxSize={6} />}>
            搜索
          </SimpleNavItem>
          <SimpleNavItem to="/settings/identity" leftIcon={<VerifiedIcon boxSize={6} />}>
            域名身份
          </SimpleNavItem>
        </>
      )}

      <DividerHeader title="应用" />
      <SimpleNavItem to="/settings/display" leftIcon={<AppearanceIcon boxSize={5} />}>
        显示
      </SimpleNavItem>
      <SimpleNavItem to="/settings/relays" leftIcon={<RelayIcon boxSize={5} />}>
        中继
      </SimpleNavItem>
      <SimpleNavItem to="/settings/authentication" leftIcon={<CheckCircleBroken boxSize={5} />}>
        认证
      </SimpleNavItem>
      <SimpleNavItem to="/settings/cache" leftIcon={<Database01 boxSize={5} />}>
        缓存
      </SimpleNavItem>
      <SimpleNavItem to="/settings/post" leftIcon={<NotesIcon boxSize={5} />}>
        帖文
      </SimpleNavItem>
      <SimpleNavItem to="/settings/performance" leftIcon={<PerformanceIcon boxSize={5} />}>
        性能
      </SimpleNavItem>
      <SimpleNavItem to="/settings/lightning" leftIcon={<LightningIcon boxSize={5} />}>
        闪电网络
      </SimpleNavItem>
      <SimpleNavItem to="/settings/privacy" leftIcon={<SpyIcon boxSize={5} />}>
        隐私
      </SimpleNavItem>
      <SimpleNavItem to="/relays/cache/database" leftIcon={<DatabaseIcon boxSize={5} />}>
        数据库工具
      </SimpleNavItem>

      {bakery ? (
        <>
          <DividerHeader title="Bakery" />
          <SimpleNavItem to="/settings/bakery">General</SimpleNavItem>
          <SimpleNavItem to="/settings/bakery/notifications" leftIcon={<Bell01 boxSize={5} />}>
            通知
          </SimpleNavItem>
          <SimpleNavItem to="/settings/bakery/network" leftIcon={<Share07 boxSize={5} />}>
            网络
          </SimpleNavItem>
          <SimpleNavItem to="/settings/bakery/logs" leftIcon={<Database01 />}>
            服务日志
          </SimpleNavItem>
        </>
      ) : (
        <>
          {/* <DividerHeader title="bakery" />
            <SimpleNavItem to="/settings/bakery/connect">Connect</SimpleNavItem> */}
        </>
      )}

      <Flex alignItems="center">
        <Link isExternal href="https://github.com/hzrd149/nostrudel">
          <GithubIcon /> Github
        </Link>
        <Spacer />
        <VersionButton />
      </Flex>
    </SimpleParentView>
  );
}
