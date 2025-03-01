import React, { useMemo } from "react";
import { ChakraProvider, localStorageManager } from "@chakra-ui/react";
import { QueryStoreProvider } from "applesauce-react/providers";

import { SigningProvider } from "./signing-provider";
import buildTheme from "../../theme";
import useAppSettings from "../../hooks/use-user-app-settings";
import NotificationsProvider from "./notifications-provider";
import { UserEmojiProvider } from "./emoji-provider";
import BreakpointProvider from "./breakpoint-provider";
import DMTimelineProvider from "./dms-provider";
import PublishProvider from "./publish-provider";
import WebOfTrustProvider from "./web-of-trust-provider";
import { queryStore } from "../../services/event-store";
import EventFactoryProvider from "./event-factory-provider";

function ThemeProviders({ children }: { children: React.ReactNode }) {
  const { theme: themeName, primaryColor, maxPageWidth } = useAppSettings();
  const theme = useMemo(
    () => buildTheme(themeName, primaryColor, maxPageWidth !== "none" ? maxPageWidth : undefined),
    [themeName, primaryColor, maxPageWidth],
  );

  return (
    <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
      <BreakpointProvider>{children}</BreakpointProvider>
    </ChakraProvider>
  );
}

// Top level providers, should be render as close to the root as possible
export const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryStoreProvider queryStore={queryStore}>
      <ThemeProviders>
        <SigningProvider>
          <PublishProvider>
            <NotificationsProvider>
              <DMTimelineProvider>
                <UserEmojiProvider>
                  <EventFactoryProvider>
                    <WebOfTrustProvider>{children}</WebOfTrustProvider>
                  </EventFactoryProvider>
                </UserEmojiProvider>
              </DMTimelineProvider>
            </NotificationsProvider>
          </PublishProvider>
        </SigningProvider>
      </ThemeProviders>
    </QueryStoreProvider>
  );
};
