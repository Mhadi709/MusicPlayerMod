import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MenuButton from "@/components/MenuButton";
import { LinearGradient } from "expo-linear-gradient";
import NodataBookmar from "@/components/NodataBookmar";
import SortMenu from "@/components/SortMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// --- Types ---
export interface Song {
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

export interface PodcastEpisode {
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
type Props = {
  dummySongs: Song[];
  dummyPodcasts: PodcastEpisode [];
};

// --- Dummy Data ---
const dummySongs: Song[] = [
  {
    id: "1",
    title: "Backburner",
    artist: "NIKI",
    album: "NIKI Album",
    duration: "3:57",
    thumbnailUrl: "https://picsum.photos/seed/song1/200",
    category: "Pop",
    year: "2022",
    description: "Song by NIKI",
  },
  {
    id: "2",
    title: "Dessert",
    artist: "Dawin",
    album: "Single",
    duration: "3:31",
    thumbnailUrl: "https://picsum.photos/seed/song2/200",
    category: "Pop",
    year: "2015",
    description: "Song by Dawin",
  },
];

const dummyPodcasts: PodcastEpisode[] = [
  {
    id: "1",
    title: "The Future of AI with Sam Altman",
    showName: "Tech Forward",
    publisher: "The Verge",
    duration: "45 min",
    thumbnailUrl: "https://picsum.photos/seed/podcast1/200",
    description: "Exploring how AI is shaping our future.",
    category: "Technology",
    year: "2023",
  },
  {
    id: '2',
    title: 'A Deep Dive into Stoicism',
    showName: 'The Daily Stoic',
    publisher: 'Ryan Holiday',
    duration: '28 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast2/200',
   description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
    category: 'health',
    year: '2024',
  },
  {
    id: '3',
    title: 'How to Build Good Habits',
    showName: 'The Knowledge Project',
    publisher: 'Farnam Street',
    duration: '1 hr 12 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast3/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
];

// --- Card Song ---
const SongCard: React.FC<{
  item: Song;
  onMorePress: (item: Song, ref: React.RefObject<View | null>) => void;
}> = ({ item, onMorePress }) => {
  const moreButtonRef = useRef<View | null>(null);

  return (
    <LinearGradient
      colors={["#0B3129", "#219780"]}
      start={{ x: 0.3, y: 0.3 }}
      end={{ x: 1, y: 1 }}
      style={styles.recommendedCard}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.recommendedThumbnail}
      />

      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle}>{item.title}</Text>
        <Text style={styles.recommendedMeta}>
          {item.artist} • {item.year}
        </Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.playButton}>
          <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
        </TouchableOpacity>

        <TouchableOpacity
          ref={moreButtonRef}
          onPress={() => onMorePress(item, moreButtonRef)}
        >
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


// --- Card Podcast ---
const PodcastCard: React.FC<{
  item: PodcastEpisode;
  onMorePress: (item: PodcastEpisode, ref: React.RefObject<View | null>) => void;
}> = ({ item, onMorePress }) => {
  const moreButtonRef = useRef<View | null>(null);

  return (
    <LinearGradient
      colors={["#0B3129", "#219780"]}
      start={{ x: 0.3, y: 0.3 }}
      end={{ x: 1, y: 1 }}
      style={styles.recommendedCard}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.recommendedThumbnail}
      />

      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle}>{item.title}</Text>
        <Text style={styles.recommendedMeta}>
          {item.publisher} • {item.year}
        </Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.playButton}>
          <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
        </TouchableOpacity>

        <TouchableOpacity
          ref={moreButtonRef}
          onPress={() => onMorePress(item, moreButtonRef)}
        >
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


export default function Bookmarks() {
  const [activeTab, setActiveTab] = useState<"music" | "podcast">("music");
  const [bookmarks, setBookmarks] = useState({
    music: dummySongs,
    podcast: dummyPodcasts,
  });

  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Song | PodcastEpisode | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

const handleMorePress = (
  item: Song | PodcastEpisode,
  ref: React.RefObject<View | null>
) => {
  setSelectedItem(item);
  ref.current?.measure(
    (_fx, _fy, _w, _h, px, py) => {
      setPopoverPos({ x: px, y: py });
      setModalVisible(true);
    }
  );
};

const handleSortChange = (option: string) => {
  if (activeTab === "music") {
    let sorted = [...bookmarks.music];

    if (option === "Baru Diputar") {
      sorted = sorted.sort((a, b) => b.year.localeCompare(a.year)); 
    } else if (option === "Baru Disimpan") {
      sorted = sorted.reverse(); // contoh aja, nanti bisa ganti sesuai field "savedAt"
    } else if (option === "Nama (Z-A)") {
      sorted = sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    setBookmarks((prev) => ({ ...prev, music: sorted }));
  }

  if (activeTab === "podcast") {
    let sorted = [...bookmarks.podcast];

    if (option === "Baru Diputar") {
      sorted = sorted.sort((a, b) => b.year.localeCompare(a.year));
    } else if (option === "Baru Disimpan") {
      sorted = sorted.reverse();
    } else if (option === "Nama (Z-A)") {
      sorted = sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    setBookmarks((prev) => ({ ...prev, podcast: sorted }));
  }
};



  const handleRemoveBookmark = () => {
    if (selectedItem) {
      setBookmarks((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(
          (item) => item.id !== selectedItem.id
        ),
      }));
    }
    setModalVisible(false);
  };


  const data: (Song | PodcastEpisode)[] =
    activeTab === "music" ? bookmarks.music : bookmarks.podcast;

  return (
     <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <MenuButton />
          <Text style={styles.title}>Bookmarks</Text>
        </View>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#1d1e1f" />
        </TouchableOpacity>
      </View>

      {/* Tab Switch */}
     <View style={{ marginLeft: 8, marginVertical: 8 }}>
  {/* Tab Button */}
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === "music" && styles.activeTab]}
      onPress={() => setActiveTab("music")}
    >
      <Text style={[styles.tabText, activeTab === "music" && { color: "#000" }]}>
        Music
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === "podcast" && styles.activeTab]}
      onPress={() => setActiveTab("podcast")}
    >
      <Text style={[styles.tabText, activeTab === "podcast" && { color: "#000" }]}>
        Podcasts
      </Text>
    </TouchableOpacity>
  </View>

  {/* Urutan di bawah tab */}
  <SortMenu onSortChange={handleSortChange} />
</View>


      {/* Empty State / List */}
      {data.length === 0 ? (
        <NodataBookmar songs={bookmarks.music} podcasts={bookmarks.podcast} />

      ) : (
        <FlatList<Song | PodcastEpisode>
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 13 }}
          renderItem={({ item }) =>
            activeTab === "music" ? (
              <SongCard item={item as Song} onMorePress={handleMorePress} />
            ) : (
              <PodcastCard
                item={item as PodcastEpisode}
                onMorePress={handleMorePress}
              />
            )
          }
        />
      )}

   {/* Modal More Options */}
<Modal
  transparent
  animationType="fade"
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={() => setModalVisible(false)}
  >
    <View
      style={[
        styles.modalPopover,
        {
          top: popoverPos.y,   // posisi Y sesuai tombol
          left: popoverPos.x - 150, // geser ke kiri biar gak keluar layar
        },
      ]}
    >
      <TouchableOpacity
        style={styles.modalOption}
        onPress={handleRemoveBookmark}
      >
        <Text style={styles.modalText}>Remove bookmark</Text>
        <Feather name="trash" size={20} color="black" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

    </View>
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
  recommendedTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  recommendedMeta: { fontSize: 12, color: "#D0D0D0", marginTop: 2 },
  iconsContainer: { flexDirection: "row", alignItems: "center" },
  playButton: { marginRight: 10 },

  // Modal
modalOverlay: {
  flex: 1,
  backgroundColor: "transparent", // hilangkan overlay gelap
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


});
