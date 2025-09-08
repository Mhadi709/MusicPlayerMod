import { Tabs } from "expo-router"; // Hapus import Stack karena tidak digunakan di sini
import React from "react";
import TabBarIcon from "../../../components/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ini yang akan menyembunyikan header untuk tab navigator ini
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tabs.Screen
        name="homepage" // cocok dengan app/(drawer)/(tabs)/homepage.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ExplorePage" // cocok dengan ExplorePage.tsx
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil" // pastikan ada file AccountPage.tsx
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
   <Tabs.Screen
  name="settings"
  options={{
    title: "Settings",
    href: null, // supaya tidak muncul di tab bar
    tabBarStyle: { display: "none" }, // sembunyikan navbar/tabbar di halaman ini
  }}
/>

      {/* Tab yang disembunyikan */}
      <Tabs.Screen name="DiscoverPage" options={{ href: null }} />
      <Tabs.Screen name="songs" options={{ href: null }} />
      <Tabs.Screen name="podcasts" options={{ href: null }} />
      <Tabs.Screen name="playlist" options={{ href: null }} />
      {/* <Tabs.Screen name="profil" options={{ href: null }} /> */}
    </Tabs>
  );
}