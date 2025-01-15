import { Suspense } from "react";
import { Divider, Flex, Link, Spacer, Spinner, Text } from "@chakra-ui/react";
import { Outlet, useMatch } from "react-router-dom";

import { useBreakpointValue } from "../../providers/global/breakpoint-provider";
import { ErrorBoundary } from "../../components/error-boundary";
import {
  AppearanceIcon,
  DatabaseIcon,
  GithubIcon,
  LightningIcon,
  NotesIcon,
  PerformanceIcon,
  SearchIcon,
  SpyIcon,
} from "../../components/icons";
import useCurrentAccount from "../../hooks/use-current-account";
import Image01 from "../../components/icons/image-01";
import UserAvatar from "../../components/user/user-avatar";
import VersionButton from "../../components/version-button";
import SimpleHeader from "../../components/layout/presets/simple-header";
import bakery from "../../services/bakery";
import SimpleNavItem from "../../components/layout/presets/simple-nav-item";
import Bell01 from "../../components/icons/bell-01";
import Share07 from "../../components/icons/share-07";
import Database01 from "../../components/icons/database-01";
import Mail02 from "../../components/icons/mail-02";

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
  const account = useCurrentAccount();
  const match = useMatch("/settings");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const showMenu = !isMobile || !!match;

  if (showMenu)
    return (
      <Flex overflow="hidden" flex={1} direction={{ base: "column", lg: "row" }}>
        <Flex overflowY="auto" overflowX="hidden" h="full" minW="xs" direction="column">
          <SimpleHeader title="Settings" />
          <Flex direction="column" p="2" gap="2">
            {account && (
              <>
                <SimpleNavItem to="/settings/accounts" leftIcon={<UserAvatar size="xs" pubkey={account.pubkey} />}>
                  Accounts
                </SimpleNavItem>
                <SimpleNavItem to="/settings/mailboxes" leftIcon={<Mail02 boxSize={6} />}>
                  Mailboxes
                </SimpleNavItem>
                <SimpleNavItem to="/settings/media-servers" leftIcon={<Image01 boxSize={6} />}>
                  Media Servers
                </SimpleNavItem>
                <SimpleNavItem to="/settings/search-relays" leftIcon={<SearchIcon boxSize={6} />}>
                  Search Relays
                </SimpleNavItem>
              </>
            )}

            <DividerHeader title="App" />
            <SimpleNavItem to="/settings/display" leftIcon={<AppearanceIcon boxSize={5} />}>
              Display
            </SimpleNavItem>
            <SimpleNavItem to="/settings/post" leftIcon={<NotesIcon boxSize={5} />}>
              Posts
            </SimpleNavItem>
            <SimpleNavItem to="/settings/performance" leftIcon={<PerformanceIcon boxSize={5} />}>
              Performance
            </SimpleNavItem>
            <SimpleNavItem to="/settings/lightning" leftIcon={<LightningIcon boxSize={5} />}>
              Lightning
            </SimpleNavItem>
            <SimpleNavItem to="/settings/privacy" leftIcon={<SpyIcon boxSize={5} />}>
              Privacy
            </SimpleNavItem>
            <SimpleNavItem to="/relays/cache/database" leftIcon={<DatabaseIcon boxSize={5} />}>
              Database Tools
            </SimpleNavItem>

            {bakery && (
              <>
                <DividerHeader title="Relay" />
                <SimpleNavItem to="/settings/bakery">Bakery</SimpleNavItem>
                <SimpleNavItem to="/settings/bakery/notifications" leftIcon={<Bell01 boxSize={5} />}>
                  Notifications
                </SimpleNavItem>
                <SimpleNavItem to="/settings/bakery/network" leftIcon={<Share07 boxSize={5} />}>
                  Network
                </SimpleNavItem>
                <SimpleNavItem to="/settings/bakery/logs" leftIcon={<Database01 />}>
                  Service Logs
                </SimpleNavItem>
              </>
            )}

            <Flex alignItems="center">
              <Link isExternal href="https://github.com/hzrd149/nostrudel">
                <GithubIcon /> Github
              </Link>
              <Spacer />
              <VersionButton />
            </Flex>
          </Flex>
        </Flex>
        {!isMobile && (
          <Suspense fallback={<Spinner />}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        )}
      </Flex>
    );
  else
    return (
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    );
}
