// Import file SVG sebagai komponen React Native
import Rectangle428 from "../../../assets/images/Rectangle428.svg";
import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useRouter } from "expo-router";
import MiniNavbar from "../../../components/layout/MiniNavbar";
import { useAuth } from "../../../hooks/useAuth"; 
import { getUserPlaylistsApi } from "@/services/auth.api";

// --- Types (Tetap Sama) ---
type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnailUrl: string;
  category: string;
  year: string;
  description: string;
};

type PodcastEpisode = {
  id: string;
  title: string;
  showName: string;
  publisher: string;
  duration: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  year: string;
};

// --- Komponen No Playlist (Lampiran 2) ---
const NoPlaylistPlaceholder = () => (
  <View style={styles.emptyContainer}>
    <Image 
      source={require("../../../assets/images/NoPlyalist.png")} 
      style={styles.emptyImage} 
    />
    <Text style={styles.emptyTitle}>No Playlists Available</Text>
  </View>
);

// --- Card Song (Desain Tetap) ---
const SongCard: React.FC<{ item: any }> = ({ item }) => (
  <LinearGradient
    colors={["#0B3129", "#219780"]}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={styles.recommendedThumbnail} />
    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{item.title}</Text>
      <Text style={styles.recommendedMeta}>{item.category} • {item.year}</Text>
      <Text style={styles.recommendedDesc} numberOfLines={2}>{item.description}</Text>
    </View>
    <View style={styles.iconsContainer}>
      <TouchableOpacity style={styles.playButton}>
        <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 3 }}>
        <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

// --- Card Podcast (Desain Tetap) ---
const RecommendedPodcastCard: React.FC<{ item: any }> = ({ item }) => (
  <LinearGradient
    colors={["#0B3129", "#219780"]}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={styles.recommendedThumbnail} />
    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{item.title}</Text>
      <Text style={styles.recommendedMeta}>{item.category} • {item.year}</Text>
      <Text style={styles.recommendedDesc} numberOfLines={2}>{item.description}</Text>
    </View>
    <View style={styles.iconsContainer}>
      <TouchableOpacity style={styles.playButton}>
        <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 3 }}>
        <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const Profil: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isProfileIncomplete } = useAuth();
  // --- STATE DATA ---
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data dari Database saat halaman dibuka
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getUserPlaylistsApi(user.id);
      
      // MAPPING DATA DATABASE KE FORMAT CARD
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: "Your Playlist",
        thumbnailUrl: item.image || (item.track_ids?.length > 0 
          ? `https://usercontent.jamendo.com/?type=track&id=${item.track_ids[0]}&width=300` 
          : "https://via.placeholder.com/150"),
        category: item.type === "music" ? "Music" : "Podcast",
        year: new Date(item.created_at).getFullYear().toString(),
        description: `Total ${item.track_ids?.length || 0} items saved.`,
        type: item.type // music atau podcast
      }));

      setPlaylists(mappedData);
    } catch (error) {
      console.log("Error fetch profil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const profileImageUrl = user?.image || user?.picture;
  const fullName = user?.full_name || "Guest User";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <View style={StyleSheet.absoluteFill}>
        <Rectangle428 width={523} height={423} />
      </View>

      <View style={{ paddingTop: StatusBar.currentHeight || 50, paddingHorizontal: 20 }}>
        <View style={styles.profileRow}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.subText}>{playlists.length} Playlists • Connected</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
      <TouchableOpacity 
          style={[styles.editButton, isProfileIncomplete && { borderColor: '#FF4D4D', borderWidth: 1 }]} 
          onPress={() => router.push("/(drawer)/settings")}
        >
          <Text style={[styles.editText, isProfileIncomplete && { color: '#FF4D4D' }]}>
            {isProfileIncomplete ? "Lengkapi Profil" : "Edit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* DAFTAR GABUNGAN MUSIC & PODCAST */}
      {loading ? (
        <ActivityIndicator size="large" color="#2CA58D" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 13, marginTop: 16 }}
          renderItem={({ item }) =>
            item.type === "music" ? (
              <SongCard item={item} />
            ) : (
              <RecommendedPodcastCard item={item} />
            )
          }
          // TAMPILKAN PLACEHOLDER JIKA KOSONG (LAMPIRAN 2)
          ListEmptyComponent={<NoPlaylistPlaceholder />}
          ListFooterComponent={
            playlists.length > 0 ? (
              <TouchableOpacity style={styles.playlistButton}>
                <Text style={styles.endofsentence}>Lihat semua playlist</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      <MiniNavbar />
    </View>
  );
};


export default Profil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  rectangle: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1, 
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40, 
  },
  avatar: {
    width: 105,
    height: 107,
    borderRadius: 90,
    marginRight: 15,
    borderWidth: 2,
    marginBottom:9,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#161616ff",
  },
  subText: {
    fontSize: 11,
    color: "#979797",
    marginTop: 2,
  },
    actionContainer: {
      flexDirection: "row", 
      alignItems: "center", 
       marginTop:49,
    },

    editButton: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
      marginLeft:19,
    },

    editText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#000",
    },

    moreButton: {
      marginLeft: 8, // jarak kecil dari tombol Edit
    },
    
     avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  avatarPlaceholder: {
    backgroundColor: "#2CA58D",
    justifyContent: "center",
    alignItems: "center",
  },
endofsentence: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#000",           // teks hitam
  textAlign: "center",
},
playlistButton: {
  borderWidth: 2,          // tebal border
  borderColor: "#000",     // warna border hitam
  borderRadius: 12,        // biar rounded
  paddingHorizontal: 12,
  paddingVertical: 4,
  alignSelf: "center",     // biar rata tengah
  backgroundColor: "#fff", // background putih (atau transparan sesuai desain)
},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  recommendedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 19,
    marginTop: 3,
    height: 120,
    flex: 1,
  },
  recommendedThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: 15,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  recommendedMeta: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 4,
    marginTop: 3,
  },
  recommendedDesc: {
    fontSize: 12,
    color: "#A7A7A7",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyImage: { width: 250, height: 250, resizeMode: 'contain' },
  emptyTitle: { fontSize: 16, color: '#8e8e8e', marginTop: 15, fontWeight: '500' },
});
