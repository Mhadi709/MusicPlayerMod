import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Layout from "../../../components/layout/hederLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MiniNavbar from "@/components/layout/MiniNavbar";
import { useAuth } from "@/hooks/useAuth";
import { getUserPlaylistsApi } from "@/services/auth.api";
import { Image as ExpoImage } from 'expo-image'; 
import { useFocusEffect } from "expo-router"; 

const NoPlaylistPlaceholder = () => (
  <View style={Styles.emptyContainer}>
    <Image 
      source={require("../../../assets/images/NoPlyalist.png")} 
      style={Styles.emptyImage} 
    />
    <Text style={Styles.emptyTitle}>No Playlists Available</Text>
  </View>
);
function PlaylistCover({ item, covers }: { item: any; covers: string[] }) {
  if (covers.length >= 4) {
    return (
      <View style={coverStyles.grid}>
        {covers.map((uri, i) => (
          <ExpoImage key={i} source={{ uri }} style={coverStyles.gridItem} contentFit="cover" cachePolicy="memory-disk" />
        ))}
      </View>
    );
  }
  if (covers.length > 0) {
    return <ExpoImage source={{ uri: covers[0] }} style={coverStyles.single} contentFit="cover" cachePolicy="memory-disk" />;
  }
  return (
    <View style={coverStyles.placeholder}>
      <Text style={coverStyles.placeholderText}>{item.name?.substring(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const coverStyles = StyleSheet.create({
  grid: { width: 85, height: 85, flexDirection: "row", flexWrap: "wrap", borderRadius: 15, overflow: "hidden", marginRight: 15 },
  gridItem: { width: 42.5, height: 42.5 },
  single: { width: 85, height: 85, borderRadius: 15, marginRight: 15 },
  placeholder: { width: 85, height: 85, borderRadius: 15, marginRight: 15, backgroundColor: "#2CA58D", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
});

const PlaylistCard: React.FC<{ item: any; covers: string[]; onPress: () => void }> = ({ item, covers, onPress }) => {
  const getCoverUri = () => {
    if (item.image) return item.image;

    if (item.track_ids && item.track_ids.length > 0) {
      return `https://usercontent.jamendo.com/?type=track&id=${item.track_ids[0]}&width=300`;
    }

    // Fallback: Gunakan inisial nama playlist dengan background hijau brand Anda
    const initials = item.name ? encodeURIComponent(item.name) : "Playlist";
    return `https://ui-avatars.com/api/?name=${initials}&background=2CA58D&color=fff&size=300`;
  };
 return (
    <LinearGradient
      colors={["#0B3129", "#219780"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={Styles.playlistCard}
    >
      <TouchableOpacity onPress={onPress} style={Styles.cardContent}>
        {/* Ganti ExpoImage lama dengan PlaylistCover */}
    <PlaylistCover item={item} covers={covers} />

        <View style={Styles.playlistInfo}>
          <Text style={Styles.playlistTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={Styles.playlistMeta}>
            {(item.track_ids || []).length} Tracks • {new Date(item.created_at).getFullYear() || "2024"}
          </Text>
        </View>

        <View style={Styles.iconsContainer}>
          <TouchableOpacity style={Styles.playButton}>
            <MaterialIcons name="play-circle-filled" size={32} color="#12F0C4" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 5 }}>
            <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};
const SongsScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"music" | "podcast">("music");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) loadPlaylists();
    }, [user?.id])
  );

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getUserPlaylistsApi(user.id);
      console.log("Data loaded:", data.length, "items");
      setPlaylists(data);
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaylists = (playlists || []).filter(item => {
    const itemType = item.type || "music";
    return itemType === activeTab;
  });

  return (
    <Layout>
      <View style={{ flex: 1 }}>
        {/* Tab Switch */}
        <View style={Styles.tabContainer}>
          <TouchableOpacity
            style={[Styles.tabButton, activeTab === "music" && Styles.tabActive]}
            onPress={() => setActiveTab("music")}
          >
            <Text style={Styles.tabText}>Music</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.tabButton, activeTab === "podcast" && Styles.tabActive]}
            onPress={() => setActiveTab("podcast")}
          >
            <Text style={Styles.tabText}>Podcasts</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={Styles.sortButton}>
          <MaterialIcons name="swap-vert" size={22} color="#000" />
          <Text style={Styles.sortLabel}>Urutan</Text>
        </TouchableOpacity>

        {/* Kondisi Loading / Data Ada / Data Kosong */}
         {loading ? (
          <ActivityIndicator size="large" color="#2CA58D" style={{ marginTop: 50 }} />
        ) : filteredPlaylists.length > 0 ? (
          <FlatList
            data={filteredPlaylists}
            renderItem={({ item }) => (
              <PlaylistCard
                item={item}
                covers={[]} 
                onPress={() => router.push({
                  pathname: "/(drawer)/PlaylistDetailScreen",
                  params: {
                    playlistId: item.id,
                    initialName: item.name,
                    trackIds: JSON.stringify(item.track_ids || [])
                  }
                })}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoPlaylistPlaceholder />
        )}
      </View>
      <MiniNavbar />
    </Layout>
  );
};

const Styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  tabButton: {
    backgroundColor: "#2CA58D",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#1F7A67",
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
  },
  playlistCard: {
    borderRadius: 25,
    marginHorizontal: 10,
    marginBottom: 15,
    height: 110,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  playlistInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  playlistMeta: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 16,
    color: '#8e8e8e',
    marginTop: 20,
    fontWeight: '500',
  },
});

export default SongsScreen;