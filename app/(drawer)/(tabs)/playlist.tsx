import React, { ReactNode, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, } from "react-native";
import { useRouter, useSegments } from "expo-router"; // Ingat useSegments hanya jika Anda membutuhkannya
import Layout from "@/components/hederLayout"; // Sesuaikan path jika berbeda
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Pastikan expo-linear-gradient sudah diinstal

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

// 2. Buat data dummy untuk ditampilkan dalam daftar
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
  {
    id: '3',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: '3:20',
    thumbnailUrl: 'https://picsum.photos/seed/song3/200',
    category: 'Pop',
    year: '2022',
    description: 'Single utama dari album Midnights.',
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    thumbnailUrl: 'https://picsum.photos/seed/song4/200',
    category: 'Synthwave',
    year: '2020',
    description: 'Lagu mega-hit dari The Weeknd.',
  },
  {
    id: '5',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: '5:55',
    thumbnailUrl: 'https://picsum.photos/seed/song5/200',
    category: 'Rock',
    year: '1975',
    description: 'Klasik sepanjang masa dari Queen.',
  },
];

const dummyPodcasts: PodcastEpisode[] = [
  {
   id: '1',
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
  {
    id: '4',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
  {
    id: '5',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
  {
    id: '6',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
];

// --- Card Song ---
const SongCard: React.FC<{ item: Song }> = ({ item }) => (
  <LinearGradient
    colors={["#0B3129", "#219780"]}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={Styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={Styles.recommendedThumbnail} />

    <View style={Styles.recommendedInfo}>
      <Text style={Styles.recommendedTitle}>{item.title}</Text>
      <Text style={Styles.recommendedMeta}>
        {item.category} • {item.year}
      </Text>
      <Text style={Styles.recommendedDesc}>{item.description}</Text>
    </View>

    <View style={Styles.iconsContainer}>
      <TouchableOpacity style={Styles.playButton}>
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
    style={Styles.recommendedCard}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={Styles.recommendedThumbnail} />

    <View style={Styles.recommendedInfo}>
      <Text style={Styles.recommendedTitle}>{item.title}</Text>
      <Text style={Styles.recommendedMeta}>
        {item.category} • {item.year}
      </Text>
      <Text style={Styles.recommendedDesc}>{item.description}</Text>
    </View>

    <View style={Styles.iconsContainer}>
      <TouchableOpacity style={Styles.playButton}>
        <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 3 }}>
        <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

// --- Screen utama ---

const SongsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"music" | "podcast">("music"); // default music

  return (
    <Layout>
      <>
        {/* Tab Switch */}
        <View style={Styles.container}>
          <TouchableOpacity
            style={[Styles.button, activeTab === "music" && { backgroundColor: "#1F7A67" }]}
            onPress={() => setActiveTab("music")}
          >
            <Text style={Styles.buttonText}>Music</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button, activeTab === "podcast" && { backgroundColor: "#1F7A67" }]}
            onPress={() => setActiveTab("podcast")}
          >
            <Text style={Styles.buttonText}>Podcasts</Text>
          </TouchableOpacity>
        </View>

        {/* Urutan Button */}
        <TouchableOpacity style={Styles.containerr}>
          <MaterialIcons name="swap-vert" size={22} color="#000" />
          <Text style={Styles.label}>Urutan</Text>
        </TouchableOpacity>

        {/* FlatList ganti sesuai tab */}
        {activeTab === "music" ? (
          <FlatList
            data={dummySongs}
            renderItem={({ item }) => <SongCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 6 }}
          />
        ) : (
          <FlatList
            data={dummyPodcasts}
            renderItem={({ item }) => <RecommendedPodcastCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 6 }}
          />
        )}
      </>
    </Layout>
  );
};

// --- Styles ---
const Styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#2CA58D",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  containerr: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
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

export default SongsScreen;  // <-- WAJIB
