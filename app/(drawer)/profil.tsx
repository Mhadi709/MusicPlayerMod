// Import file SVG sebagai komponen React Native
import Rectangle428 from "../../assets/images/Rectangle428.svg";
import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MiniNavbar from "../../components/MiniNavbar";

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
  description: ReactNode;
  category: ReactNode;
  year: ReactNode;
  id: string;
  title: string;
  showName: string;
  publisher: string;
  duration: string;
  thumbnailUrl: string;
  
};

const dummySongs: Song[] = [
  {
    id: '1',
    title: 'Glimpse of Us',
    artist: 'Joji',
    album: 'SMITHEREENS',
    duration: '3:53',
    thumbnailUrl: 'https://picsum.photos/seed/song1/200',
    category: 'Pop',
    year: '2022',
    description: 'Hit single dari album SMITHEREENS.',
  },
  {
    id: '2',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: '2:47',
    thumbnailUrl: 'https://picsum.photos/seed/song2/200',
    category: 'Pop',
    year: '2022',
    description: 'Lagu populer dari Harry Styles.',
  },
];
const dummyPodcasts: PodcastEpisode[] = [
  {
   id: '11',
  title: 'The Future of AI with Sam Altman',
  showName: 'Tech Forward',
  publisher: 'The Verge',
  duration: '45 min',
  thumbnailUrl: 'https://picsum.photos/seed/podcast1/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'Technology',
  year: '2023',
  },
  {
    id: '22',
    title: 'A Deep Dive into Stoicism',
    showName: 'The Daily Stoic',
    publisher: 'Ryan Holiday',
    duration: '28 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast2/200',
   description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
    category: 'health',
    year: '2024',
  },
];

// --- Card Song ---
const SongCard: React.FC<{ item: Song }> = ({ item }) => (
  <LinearGradient
    colors={["#0B3129", "#219780"]}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={styles.recommendedThumbnail} />

    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{item.title}</Text>
      <Text style={styles.recommendedMeta}>
        {item.category} • {item.year}
      </Text>
      <Text style={styles.recommendedDesc}>{item.description}</Text>
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

// --- Card Podcast ---
const RecommendedPodcastCard: React.FC<{ item: PodcastEpisode }> = ({ item }) => (
  <LinearGradient
    colors={["#0B3129", "#219780"]}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={styles.recommendedThumbnail} />

    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{item.title}</Text>
      <Text style={styles.recommendedMeta}>
        {item.category} • {item.year}
      </Text>
      <Text style={styles.recommendedDesc}>{item.description}</Text>
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

type CombinedItem =
  | (Song & { type: "song" })
  | (PodcastEpisode & { type: "podcast" });

// Gabungkan songs + podcasts
const combinedData: CombinedItem[] = [
  ...dummySongs.map((item) => ({ ...item, type: "song" as const })),
  ...dummyPodcasts.map((item) => ({ ...item, type: "podcast" as const })),
];


const Profil: React.FC = () => {
   return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      {/* Background SVG */}
      <View style={StyleSheet.absoluteFill}>
        <Rectangle428 width={523} height={423} />
      </View>

      {/* Profil Header */}
      <View style={{ paddingTop: StatusBar.currentHeight || 50 }}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Akbar Azidikin</Text>
            <Text style={styles.subText}>15 Playlists • 250 Songs Saved</Text>
          </View>
        </View>
      </View>

      {/* Tombol Edit dan More */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(drawer)/(tabs)/settings")}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Daftar Lagu / Podcast */}
      <FlatList
        data={combinedData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110, // ruang agar tidak ketutupan navbar
          paddingHorizontal: 13,
          marginTop: 16,
        }}
        renderItem={({ item }) =>
          item.type === "song" ? (
            <SongCard item={item} />
          ) : (
            <RecommendedPodcastCard item={item} />
          )
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.playlistButton}>
            <Text style={styles.endofsentence}>Lihat semua playlist</Text>
          </TouchableOpacity>
        }
      />

      {/* Mini Navbar */}
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
});
