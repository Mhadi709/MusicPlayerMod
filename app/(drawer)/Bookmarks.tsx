import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MenuButton from "@/components/common/MenuButton";
import { LinearGradient } from "expo-linear-gradient";
import NodataBookmar from "@/components/common/NodataBookmar";
import SortMenu from "@/components/layout/SortMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { getBookmarksApi, toggleBookmarkApi } from "@/services/auth.api";
import UniversalAlert, { UniversalAlertProps } from "@/components/common/UniversalAlert";


export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  year: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  publisher: string;
  thumbnailUrl: string;
  year: string;
}

const SongCard: React.FC<{
  item: any;
  onMorePress: (item: any, ref: React.RefObject<View | null>) => void;
}> = ({ item, onMorePress }) => {
  const moreButtonRef = useRef<View | null>(null);
  if (!item) return null;

  return (
    <LinearGradient colors={["#0B3129", "#219780"]} style={styles.recommendedCard}>
      <Image 
        source={{ uri: item.image || item.thumbnailUrl || "https://via.placeholder.com/150" }} 
        style={styles.recommendedThumbnail} 
      />
      <View style={styles.recommendedInfo}>
        <Text style={[styles.recommendedTitle, { color: '#fff' }]}>
           {item.title || "Untitled"}
        </Text>
        <Text style={[styles.recommendedMeta, { color: '#ddd' }]}>
           {item.artist || "Unknown Artist"} • {item.year || "2024"}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.playButton}>
          <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
        </TouchableOpacity>
        <TouchableOpacity ref={moreButtonRef} onPress={() => onMorePress(item, moreButtonRef)}>
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// --- 3. KOMPONEN PODCAST CARD ---
const PodcastCard: React.FC<{
   item: any;
  onMorePress: (item: any, ref: React.RefObject<View | null>) => void;
}> = ({ item, onMorePress }) => {
  const moreButtonRef = useRef<View | null>(null);
  return (
    <LinearGradient colors={["#0B3129", "#219780"]} style={styles.recommendedCard}>
      <Image 
        source={{ uri: item.image || "https://via.placeholder.com/150" }} 
        style={styles.recommendedThumbnail} 
      />
      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle}>{item.title}</Text>
         <Text style={styles.recommendedMeta}>{item.artist || "Unknown"} • {item.year || "2024"}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.playButton}>
          <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
        </TouchableOpacity>
        <TouchableOpacity ref={moreButtonRef} onPress={() => onMorePress(item, moreButtonRef)}>
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


export default function Bookmarks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"music" | "podcast">("music");
  const [loading, setLoading] = useState(true);

  // State Data Database
  const [bookmarks, setBookmarks] = useState({
    music: [] as Song[],
    podcast: [] as PodcastEpisode[],
  });

  // State Alert poup
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  // 1. FETCH DATA DARI DATABASE SAAT HALAMAN DIBUKA
  useEffect(() => {
    if (user?.id) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
  try {
    setLoading(true);
    const rawData = await getBookmarksApi(user.id);
    
    const cleanedData = (rawData || []).map((doc: any) => {
      if (doc.item) {
        return {
          ...doc.item,
          type: doc.type,
          dbId: doc.id 
        };
      }
      return doc;
    });

    setBookmarks({
      music: cleanedData.filter((i: any) => i.type === "music"),
      podcast: cleanedData.filter((i: any) => i.type === "podcast"),
    });
  } catch (error) {
    console.log("Error fetch bookmarks:", error);
  } finally {
    setLoading(false);
  }
};

  // 2. FUNGSI HAPUS BOOKMARK DARI DATABASE
  const handleRemoveBookmark = async () => {
    if (!selectedItem || !user?.id) return;

    try {
      setModalVisible(false);

      await toggleBookmarkApi({
        userId: user.id,
        itemId: selectedItem.id,
        title: selectedItem.title,
        artist: selectedItem.artist || selectedItem.publisher || "Unknown",
        image: selectedItem.image || selectedItem.thumbnailUrl,
        type: activeTab
      });

      setBookmarks((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item.id !== selectedItem.id),
      }));

    } catch (error) {
      setAlertConfig({
        type: 'error',
        title: 'Gagal Menghapus!',
        message: 'Gagal menghapus bookmark, silakan coba lagi.',
        confirmText: 'Coba Lagi',
      });
      setAlertVisible(true);
      loadBookmarks();
    }
  };

  const NoBookmarkPlaceholder = () => (
  <View style={styles.emptyCenterContainer}>
    <Image 
      source={require("@/assets/images/NoBookmark.png")} // Sesuai nama di asset Anda
      style={styles.noBookmarkIcon} 
    />
    <Text style={styles.noBookmarkTitle}>No Bookmarks</Text>
    <Text style={styles.noBookmarkSubtitle}>
      Your bookmarks list is still empty. Start saving your favorite songs or albums here.
    </Text>
  </View>
);

  const handleMorePress = (item: any, ref: React.RefObject<View | null>) => {
    setSelectedItem(item);
    ref.current?.measure((_fx, _fy, _w, _h, px, py) => {
      setPopoverPos({ x: px, y: py });
      setModalVisible(true);
    });
  };

  const data = activeTab === "music" ? bookmarks.music : bookmarks.podcast;

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 1. HEADER (Tetap di paling atas) */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <MenuButton />
          <Text style={styles.title}>Bookmarks</Text>
        </View>
        <TouchableOpacity><Feather name="search" size={24} color="#1d1e1f" /></TouchableOpacity>
      </View>

      {/* 2. TAB SWITCH & SORT (Hanya membungkus tab dan urutan) */}
      <View style={{ marginLeft: 8, marginVertical: 8 }}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, activeTab === "music" && styles.activeTab]} onPress={() => setActiveTab("music")}>
            <Text style={[styles.tabText, activeTab === "music" && { color: "#f5f5f5" }]}>Music</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === "podcast" && styles.activeTab]} onPress={() => setActiveTab("podcast")}>
            <Text style={[styles.tabText, activeTab === "podcast" && { color: "#f8f8f8" }]}>Podcasts</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 15 }}>
          <SortMenu onSortChange={() => {}} />
        </View>
      </View> 
    
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1F7A67" />
          </View>
        ) : (data && data.length > 0) ? (
       <FlatList
        data={data as any[]}
         keyExtractor={(item) => item.id || Math.random().toString()} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 13, paddingBottom: 80 }}
        renderItem={({ item }) => {
        
          if (activeTab === "music") {
            return <SongCard item={item} onMorePress={handleMorePress} />;
          } else {
            return <PodcastCard item={item} onMorePress={handleMorePress} />;
          }
        }}
      />
        ) : (
          <NoBookmarkPlaceholder />
        )}
      </View>

      <UniversalAlert
        {...(alertConfig as UniversalAlertProps)}
        visible={alertVisible}
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
      />
      {/* 4. MODAL POPOVER */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={[styles.modalPopover, { top: popoverPos.y, left: popoverPos.x - 150 }]}>
            <TouchableOpacity style={styles.modalOption} onPress={handleRemoveBookmark}>
              <Text style={styles.modalText}>Remove bookmark</Text>
              <Feather name="trash" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // jarak kecil antara MenuButton dan Title (React Native 0.71+)
  },
  title: { fontSize: 20, fontWeight: "600", color: "#1d1e1f" },

  // Empty State
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#1d1e1f", marginTop: 12 },
  emptySubtitle: {
    fontSize: 14,
    color: "#898A8D",
    textAlign: "center",
    marginTop: 6,
  },

  // Tab
  tabContainer: { flexDirection: "row", justifyContent: "flex-start", marginVertical: 8 , marginLeft:8,},
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#E5E5E5",
  },
  activeTab: { backgroundColor: "#1F7A67" },
  tabText: { color: "#fff", fontWeight: "600" },

  // Cards
  recommendedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  recommendedThumbnail: { width: 60, height: 60, borderRadius: 10 },
  recommendedInfo: { flex: 1, marginLeft: 10 },
  recommendedTitle: { fontSize: 16, fontWeight: 'bold', },
  recommendedMeta: { fontSize: 12, color: "#D0D0D0", marginTop: 2 },
  iconsContainer: { flexDirection: "row", alignItems: "center" },
  playButton: { marginRight: 10 },

  // Modal
modalOverlay: {
  flex: 1,
  backgroundColor: "transparent", 
},

modalPopover: {
  position: "absolute",
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingVertical: 8,
  paddingHorizontal: 10,
  shadowColor: "#000",
  shadowOpacity: 0.14,
  shadowRadius: 4,
  elevation: 4,
},

modalOption: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 160,
},

modalText: {
  fontSize: 14,
  color: "#000",
  marginRight: 10,
},
 emptyCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 0, 
  },
  noBookmarkIcon: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 20,
    opacity: 0.8,
  },
  noBookmarkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  noBookmarkSubtitle: {
    fontSize: 14,
    color: '#898A8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
