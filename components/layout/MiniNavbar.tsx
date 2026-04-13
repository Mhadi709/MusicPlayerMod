import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import MiniPlayer from "../player/MiniPlayer";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/hooks/useAuth";

const MiniNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showMiniPlayer } = usePlayer();
  const { isProfileIncomplete } = useAuth();

  // Daftar kata kunci path yang dianggap sebagai "Home"
  const homeRelatedPaths = [
    "homepage",        
    "songs",
    "podcasts",
    "playlist",
    "MusicDetailScreen",
    "PodcastsDetailScreen",
    "Featured",        
    "(tabs)",          
  ];
  const SearchRelatedPaths = [
    "ExplorePage",
    "ExploreThemeScreen",
  ];
  const hideNavbarRoutes = ["/DiscoverPage"];

  // Cek apakah harus disembunyikan
  const shouldHideNavbar = hideNavbarRoutes.some(route => pathname.includes(route));
  const isSearchActive = SearchRelatedPaths.some((path) => pathname.includes(path));
  const isHomeActive = 
    pathname === "/" || 
    homeRelatedPaths.some((path) => pathname.includes(path));

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      {showMiniPlayer && <MiniPlayer />}

      {/* Navbar */}
      <View style={styles.container}>
        {/* Home */}
        <TouchableOpacity
          style={[styles.navItem, isHomeActive && styles.activeNav]}
          onPress={() => router.push("/(drawer)/(tabs)/homepage")}
        >
          <Ionicons
            name="home"
            size={26}
            color={isHomeActive ? "#fff" : "#b8c4d6"}
          />
          {isHomeActive && <Text style={styles.activeText}>Home</Text>}
        </TouchableOpacity>

        {/* Search */}
        <TouchableOpacity
        style={[
          styles.navItem,
          isSearchActive && styles.activeNav, 
        ]}
        onPress={() => router.push("/ExplorePage")}
      >
        <FontAwesome
          name="search"
          size={25}
          color={isSearchActive ? "#fff" : "#b8c4d6"} 
        />
        {isSearchActive && (
          <Text style={styles.activeText}>Search</Text>
        )}
      </TouchableOpacity>

        {/* Profile */}
       <TouchableOpacity style={[styles.navItem, pathname.includes("profil") && styles.activeNav]} onPress={() => router.push("/profil")}>
          <View>
            <Feather
              name="user"
              size={25}
              color={pathname.includes("profil") ? "#fff" : "#b8c4d6"}
            />
            {isProfileIncomplete && (
              <View style={styles.redDotNavbar} />
            )}
          </View>
          {pathname.includes("profil") && <Text style={styles.activeText}>Profile</Text>}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(79,79,79,0.95)",
    borderRadius: 60,
    paddingVertical: 14,
    paddingHorizontal: 25,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: 280,
    position: "absolute",
    bottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
    zIndex: 1, 
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeNav: {
    backgroundColor: "#21A18A",
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  redDotNavbar: {
  position: 'absolute',
  top: -2,
  right: -2,
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#FF4D4D',
  borderWidth: 1.5,
  borderColor: '#fff',
},
  activeText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
});

export default MiniNavbar;