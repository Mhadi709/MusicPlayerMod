import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import MiniPlayer from "./MiniPlayer";

const MiniNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const homeRelatedPaths = ["/homepage", "/songs", "/podcasts", "/playlist","/MusicDetailScreen"];
  const hideNavbarRoutes = ["/DiscoverPage"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  const isHomeActive = homeRelatedPaths.includes(pathname);

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      {/* Navbar */}
      <View style={styles.container}>
        
        {/* Tombol Home */}
        <TouchableOpacity
          style={[styles.navItem, isHomeActive && styles.activeNav]}
          onPress={() => router.push("/homepage")}
        >
          <Ionicons
            name="home"
            size={26}
            color={isHomeActive ? "#fff" : "#b8c4d6"}
          />
          {isHomeActive && <Text style={styles.activeText}>Home</Text>}
        </TouchableOpacity>

        {/* Tombol Search */}
        <TouchableOpacity
          style={[
            styles.navItem,
            pathname === "/ExplorePage" && styles.activeNav,
          ]}
          onPress={() => router.push("/ExplorePage")}
        >
          <FontAwesome
            name="search"
            size={25}
            color={pathname === "/ExplorePage" ? "#fff" : "#b8c4d6"}
          />
          {pathname === "/ExplorePage" && (
            <Text style={styles.activeText}>Search</Text>
          )}
        </TouchableOpacity>

        {/* Tombol Profil */}
        <TouchableOpacity
          style={[styles.navItem, pathname === "/profil" && styles.activeNav]}
          onPress={() => router.push("/profil")}
        >
          <Feather
            name="user"
            size={25}
            color={pathname === "/profil" ? "#fff" : "#b8c4d6"}
          />
          {pathname === "/profil" && (
            <Text style={styles.activeText}>Profile</Text>
          )}
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
  activeText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
});

export default MiniNavbar;
