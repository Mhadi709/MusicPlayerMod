import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context"; 
import MenuButton from "../common/MenuButton";
import { useAuth } from "../../hooks/useAuth"; 
type LayoutProps = {
  children: ReactNode;
};
const user = {
  name: "Sophia Rose",
  image: null, 
};

// --- FUNGSI HELPER ---
const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const FilterTabs: React.FC = () => {
  const tabs = ["All", "Songs", "Podcasts", "Playlist"];
  const router = useRouter();
  const segments = useSegments();

  const currentSegment = segments.at(-1); 

  // Tentukan tab mana yang aktif berdasarkan URL
  let activeTab = "All"; 
  if (currentSegment === "songs") activeTab = "Songs";
  else if (currentSegment === "podcasts") activeTab = "Podcasts";
  else if (currentSegment === "playlist") activeTab = "Playlist";

  const handleTabPress = (tab: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    switch (tab.toLowerCase()) {
      case "songs":
        router.push("/(drawer)/(tabs)/songs");
        break;
      case "podcasts":
        router.push("/(drawer)/(tabs)/podcasts");
        break;
      case "playlist":
        router.push("/(drawer)/(tabs)/playlist");
        break;
      default: // Case "All"
        router.push("/(drawer)/(tabs)/homepage");
    }
  };

  return (
    <View style={styles.filterContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.filterItem}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.filterTab,
                isActive && styles.activeFilterText,
              ]}
            >
              {tab}
            </Text>
            {/* Garis Bawah Hijau */}
            {isActive && <View style={styles.activeUnderline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ================= MAIN LAYOUT ================= */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  
  // 2. AMBIL DATA USER DARI DATABASE (GLOBAL STATE)
  const { user } = useAuth();

  // Ambil nama depan saja untuk sapaan (Hey [Nama],)
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Guest";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }} edges={['top']}>
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/profil")}>
          {/* 3. TAMPILKAN FOTO DARI DATABASE JIKA ADA */}
          {user?.image || user?.picture ? (
            <Image 
              source={{ uri: user.image || user.picture }} 
              style={styles.profileImage} 
            />
          ) : (
            // Avatar Placeholder Inisial jika foto tidak ada
            <View style={[styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {getInitials(user?.full_name || "User")}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.textContainer}>
          {/* 4. GANTI "Hey Karie" DENGAN NAMA USER DARI DATABASE */}
          <Text style={styles.greeting}>Hey {firstName}</Text>
          <Text style={styles.message}>Start your session</Text>
        </View>

        <MenuButton />
      </View>

      {/* SEARCH, FILTER, & CONTENT TETAP SAMA */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("ExplorePage")}
      >
        <Entypo name="magnifying-glass" size={20} color="#757575" />
        <Text style={styles.placeholderText}>
          Search for songs, artists, playlists...
        </Text>
      </TouchableOpacity>

      <FilterTabs />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>{children}</View>
    </SafeAreaView>
  );
};


export default Layout;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: Platform.OS === 'android' ? 10 : 0, 
  },
  
 
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  avatarPlaceholder: {
    width: 40,       
    height: 40,
    borderRadius: 20, 
    backgroundColor: "#2CA58D", 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,     
    fontWeight: "bold",
  },

  textContainer: { flex: 1 },
  greeting: { fontSize: 16, fontWeight: "bold", color: "#333" },
  message: { fontSize: 14, color: "#757575" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 45, 
    borderRadius: 25,
    backgroundColor: "#fff", 
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  placeholderText: { marginLeft: 10, color: "#9E9E9E" },

  // Tabs
  filterContainer: {
    flexDirection: "row",
    gap: 20, 
    paddingHorizontal: 20,
    paddingBottom: 10, 
    marginBottom: 10,
  },
  filterItem: { 
    alignItems: "center",
    paddingBottom: 5, 
  },
  filterTab: { 
    fontSize: 16, 
    color: "#757575",
    fontWeight: "500",
  },
  activeFilterText: { 
    color: "#2CA58D", 
    fontWeight: "700" 
  },
  activeUnderline: {
    marginTop: 4,
    height: 3,
    backgroundColor: "#2CA58D",
    width: 20, 
    borderRadius: 2,
  },
});