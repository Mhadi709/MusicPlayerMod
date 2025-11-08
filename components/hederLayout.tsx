import React, { ReactNode, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, UIManager, LayoutAnimation, StatusBar } from "react-native";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation, useRouter, useSegments } from "expo-router"; 
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions } from "@react-navigation/native";
import MenuButton from "../components/MenuButton"; // sesuaikan path

type LayoutProps = {
  children: ReactNode; // isi konten tiap halaman
  
};
const hasProfileImage = true;

function FilterTabs() {
  const tabs = ["All", "Songs", "Podcasts", "Playlist"];
  const router = useRouter();
  const segments = useSegments();

  const active = segments.length > 0 ? segments[segments.length - 1] : "homepage";

  const handleTabPress = (tab: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (tab.toLowerCase() === "songs") {
      router.push("/(drawer)/(tabs)/songs");
    } else if (tab.toLowerCase() === "podcasts") {
      router.push("/(drawer)/(tabs)/podcasts");
    } else if (tab.toLowerCase() === "playlist") {
      router.push("/(drawer)/(tabs)/playlist");
    } else if (tab.toLowerCase() === "all") {
      router.push("/(drawer)/(tabs)/homepage");
    }
  };

  return (
    <View style={styles.filterContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.filterItem}
          onPress={() => handleTabPress(tab)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterTab,
              active?.toLowerCase() === tab.toLowerCase() && styles.activeFilterText,
            ]}
          >
            {tab}
          </Text>
          {(active?.toLowerCase() === tab.toLowerCase() ||
            (active === "homepage" && tab === "All")) && (
            <View style={styles.activeUnderline} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* HEADER */}
         <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push("/(drawer)/profil")}>
        {hasProfileImage ? (
          <Image
            source={require("../assets/images/Prifile.jpg")}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Entypo name="user" size={40} color="#757575" />
          </View>
        )}
      </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hey Karie,</Text>
          <Text style={styles.message}>Ready to Jam?</Text>
        </View>

   <View style={styles.icons}>
  <MenuButton />
</View>

      </View>

      {/* SEARCH */}
      <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('ExplorePage')}>
        <Entypo name="magnifying-glass" size={20} style={styles.searchIcon} />
        <Text style={styles.placeholderText}>
          Search for songs, artists, playlists...
        </Text>
      </TouchableOpacity>

      {/* FILTER */}
      <FilterTabs />

      {/* ISI HALAMAN */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  message: {
    fontSize: 14,
    color: "#757575",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f02f",
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
    color: "#757575",
  },
  placeholderText: {
    color: "#757575",
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  filterItem: {
    alignItems: "center",
  },
  filterTab: {
    fontSize: 16,
    color: "#757575",
  },
  activeFilterText: {
    color: "#19191aff",
  },
  activeUnderline: {
    marginTop: 2,
    height: 3,
    backgroundColor: "#2CA58D",
    borderRadius: 3,
    alignSelf: "stretch",
  },
});

export default Layout;
