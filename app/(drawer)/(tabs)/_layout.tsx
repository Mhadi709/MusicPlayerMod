import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{headerShown: false, tabBarStyle: { display: "none" }, }}>
      <Tabs.Screen name="homepage" />
      <Tabs.Screen name="DiscoverPage" />
      <Tabs.Screen name="ExplorePage" />
      <Tabs.Screen name="profil" />
      <Tabs.Screen name="songs" />
      <Tabs.Screen name="playlist" />
      <Tabs.Screen name="podcasts" />
    </Tabs>
  );
}
