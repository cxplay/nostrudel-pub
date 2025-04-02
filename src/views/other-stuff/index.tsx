import { useState } from "react";
import { Heading, Input, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import VerticalPageLayout from "../../components/vertical-page-layout";
import AppCard from "./component/app-card";
import useRouteSearchValue from "../../hooks/use-route-search-value";
import useRecentIds from "../../hooks/use-recent-ids";
import { allApps, App, externalTools, internalTools } from "../../components/navigation/apps";
import { useBreakpointValue } from "../../providers/global/breakpoint-provider";

const tabs = ["all", "tools", "3rd-party-tools"];

export default function OtherStuffView() {
  const [search, setSearch] = useState("");
  const tab = useRouteSearchValue("tab", "all");
  const { recent: recentApps, useThing: useApp } = useRecentIds("apps");
  const autoFocusSearch = useBreakpointValue({ base: false, lg: true });

  const columns = { base: 1, lg: 2, xl: 3, "2xl": 4 };

  const sortByRecent = (a: App, b: App) => recentApps.indexOf(b.id) - recentApps.indexOf(a.id);
  const sortByName = (a: App, b: App) => {
    if (a.title === b.title) return 0;
    else if (a.title > b.title) return 1;
    else return -1;
  };

  const renderContent = () => {
    if (search.length > 0)
      return (
        <SimpleGrid spacing="2" columns={columns}>
          {allApps
            .filter(
              (app) =>
                app.title.toLowerCase().includes(search.toLowerCase()) ||
                app.description.toLowerCase().includes(search.toLowerCase()),
            )
            .map((app) => (
              <AppCard key={app.id} app={app} onClick={() => useApp(app.id)} />
            ))}
        </SimpleGrid>
      );

    return (
      <>
        {recentApps.length > 0 && (
          <>
            <Heading size="md" my="2">
              最近使用
            </Heading>
            <SimpleGrid spacing="2" columns={columns}>
              {recentApps.slice(0, 6).map((id) => {
                const app = allApps.find((a) => a.id === id);
                return app ? (
                  <AppCard
                    key={app.id}
                    app={app}
                    onClick={() => useApp(app.id)}
                    canFavorite={!externalTools.includes(app)}
                  />
                ) : null;
              })}
            </SimpleGrid>
          </>
        )}

        <Tabs
          mt="4"
          variant="soft-rounded"
          colorScheme="primary"
          index={tabs.indexOf(tab.value)}
          onChange={(v) => tab.setValue(tabs[v])}
        >
          <TabList gap="2">
            <Tab>All</Tab>
            <Tab>Tools</Tab>
            <Tab>3rd Party Tools</Tab>
          </TabList>
          <TabPanels>
            <TabPanel as={SimpleGrid} spacing="2" columns={columns} px="0" py="4">
              {allApps.sort(sortByName).map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => useApp(app.id)}
                  canFavorite={!externalTools.includes(app)}
                />
              ))}
            </TabPanel>
            <TabPanel as={SimpleGrid} spacing="2" columns={columns} px="0" py="4">
              {internalTools.sort(sortByName).map((app) => (
                <AppCard key={app.id} app={app} onClick={() => useApp(app.id)} />
              ))}
            </TabPanel>
            <TabPanel as={SimpleGrid} spacing="2" columns={columns} px="0" py="4">
              {externalTools.sort(sortByName).map((app) => (
                <AppCard key={app.id} app={app} onClick={() => useApp(app.id)} canFavorite={false} />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  };

  return (
    <VerticalPageLayout>
      <Heading size="lg" my="2">
        工具和其他
      </Heading>

      <Input
        type="search"
        placeholder="搜索应用"
        maxW="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus={autoFocusSearch}
      />

      {renderContent()}
    </VerticalPageLayout>
  );
}
