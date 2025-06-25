import { Divider, Flex, Link, Spacer, Text } from "@chakra-ui/react";

import { useActiveAccount } from "applesauce-react/hooks";
import {
  AppearanceIcon,
  DatabaseIcon,
  GithubIcon,
  LightningIcon,
  MuteIcon,
  NotesIcon,
  PerformanceIcon,
  RelayIcon,
  SearchIcon,
  SpyIcon,
  VerifiedIcon,
} from "../../components/icons";
import CheckCircleBroken from "../../components/icons/check-circle-broken";
import CpuChip01 from "../../components/icons/cpu-chip-01";
import Database01 from "../../components/icons/database-01";
import FilterFunnel02 from "../../components/icons/filter-funnel-02";
import Image01 from "../../components/icons/image-01";
import Mail02 from "../../components/icons/mail-02";
import Share07 from "../../components/icons/share-07";
import SimpleNavItem from "../../components/layout/presets/simple-nav-item";
import SimpleParentView from "../../components/layout/presets/simple-parent-view";
import UserAvatar from "../../components/user/user-avatar";
import VersionButton from "../../components/version-button";
import User01 from "../../components/icons/user-01";

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

  return (
    <SimpleParentView title="设置" path="/settings">
      {account && (
        <>
          <SimpleNavItem to="/settings/accounts" leftIcon={<UserAvatar size="xs" pubkey={account.pubkey} />}>
            账户
          </SimpleNavItem>
          <SimpleNavItem to="/settings/profile" leftIcon={<User01 boxSize={5} />}>
            资料
          </SimpleNavItem>
          <SimpleNavItem to="/settings/mailboxes" leftIcon={<Mail02 boxSize={5} />}>
            信箱
          </SimpleNavItem>
          <SimpleNavItem to="/settings/media-servers" leftIcon={<Image01 boxSize={5} />}>
            媒体服务器
          </SimpleNavItem>
          <SimpleNavItem to="/settings/search-relays" leftIcon={<SearchIcon boxSize={5} />}>
            搜索
          </SimpleNavItem>
          <SimpleNavItem to="/settings/identity" leftIcon={<VerifiedIcon boxSize={5} />}>
            域名身份
          </SimpleNavItem>
        </>
      )}
      <SimpleNavItem to="/settings/social-graph" leftIcon={<Share07 boxSize={5} />}>
        社交图谱
      </SimpleNavItem>
      <SimpleNavItem to="/settings/mutes" leftIcon={<MuteIcon boxSize={5} />}>
        静音
      </SimpleNavItem>

      <DividerHeader title="APP" />
      <SimpleNavItem to="/settings/display" leftIcon={<AppearanceIcon boxSize={5} />}>
        显示
      </SimpleNavItem>
      <SimpleNavItem to="/settings/policies" leftIcon={<FilterFunnel02 boxSize={5} />}>
        内容策略
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
      <SimpleNavItem to="/settings/messages" leftIcon={<Mail02 boxSize={5} />}>
        消息
      </SimpleNavItem>
      <SimpleNavItem to="/settings/background-worker" leftIcon={<CpuChip01 boxSize={5} />}>
        后台任务
      </SimpleNavItem>
      <SimpleNavItem to="/relays/cache/database" leftIcon={<DatabaseIcon boxSize={5} />}>
        数据库工具
      </SimpleNavItem>

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
