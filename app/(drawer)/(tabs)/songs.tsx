import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Layout from "../../../components/layout/hederLayout";
import { LinearGradient } from 'expo-linear-gradient';
import { searchMusicJamendo1 } from "../../../services/music.api";
import { ShimmerSongCard } from '@/components/loading/ShimmerSongCard';
import { navigateToNowPlaying } from '@/utils/navigation';
import MiniNavbar from '@/components/layout/MiniNavbar';
import { useRouter } from 'expo-router'; // 1. IMPORT USEROUTER

type Song = {
  description: string | undefined;
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  subtitle: string;
  artworkUrl: string;
  audio: string;        
  Tipemusic?: string;
  listeners?: number;
};

const SongsScreen: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    getSongs();
  }, []);

  const getSongs = async () => {
    try {
      const response = await searchMusicJamendo1("pop");
      if (!response?.results) return;

      const mappedData: Song[] = response.results.map((item: any, index: number) => ({
        id: item.id.toString(),
        title: item.name,
        artist: item.artist_name,
        album: item.album_name ?? "-",
        duration: "3:00",
        subtitle: `${item.artist_name} and more`,
        artworkUrl: item.image || "https://picsum.photos/200",
        audio: item.audio,
        Tipemusic: `Daily Mix ${index + 1}`,
        listeners: Math.floor(Math.random() * 5_000_000) + 500_000,
        description: `Enjoy the best pop music from ${item.artist_name}`
      }));

      setSongs(mappedData);
    } catch (e) {
      console.log("ERR FETCH JAMENDO:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header1}>Recently Played</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(5)].map((_, i) => <ShimmerSongCard key={i} />)}
          </ScrollView>
        </ScrollView>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header1}>Recently Played</Text>
        <FlatList
          data={songs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() =>
                // 4. KIRIM 2 ARGUMEN: router dan data lagu
                navigateToNowPlaying(router, {
                  id: item.id,
                  name: item.title,
                  artist_name: item.artist,
                  audio: item.audio,
                  image: item.artworkUrl,
                  monthly_listeners: item.listeners,
                })
              }
            >
              <LinearGradient colors={["#0B3129", "#22977E"]} style={styles.recentContainer}>
                <Image source={{ uri: item.artworkUrl }} style={styles.artwork} />
                <Text style={styles.recentText} numberOfLines={1}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />

        <View style={styles.section}>
          <Text style={styles.subHeader}>To Get You Started</Text>
          <FlatList
            data={songs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `started-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigateToNowPlaying(router, {
                    id: item.id,
                    name: item.title,
                    artist_name: item.artist,
                    audio: item.audio,
                    image: item.artworkUrl,
                  })
                }
              >
                <LinearGradient colors={["#0B3129", "#22977E"]} style={styles.cardContainer}>
                  <Image source={{ uri: item.artworkUrl }} style={styles.mixArtwork} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.mixTitle} numberOfLines={1}>{item.Tipemusic}</Text>
                    <Text style={styles.mixSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Try Something Else</Text>
          <FlatList
            data={songs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `try-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigateToNowPlaying(router, {
                    id: item.id,
                    name: item.title,
                    artist_name: item.artist,
                    audio: item.audio,
                    image: item.artworkUrl,
                    artistDescription: item.description,
                  })
                }
              >
                <LinearGradient colors={["#0B3129", "#22977E"]} style={styles.cardContainer}>
                  <Image source={{ uri: item.artworkUrl }} style={styles.mixArtwork} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.mixSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <MiniNavbar />
    </Layout>
  );
};

// ... Styles tetap sama ...
const styles = StyleSheet.create({
  section: { marginTop: 25 }, 
  header1: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1b1a1aff", paddingHorizontal: 10, marginTop: 20 },
  subHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#111010ff", paddingHorizontal: 10 },
  recentContainer: { width: 107, height: 130, borderRadius: 20, justifyContent: "center", alignItems: "center", padding: 10 },
  recentText: { fontSize: 12, color: "#fff", marginTop: 5, textAlign: "center", width: '90%' },
  artwork: { width: 70, height: 70, borderRadius: 13, backgroundColor: "#1DB954" },
  cardContainer: { width: 150, borderRadius: 8, overflow: 'hidden' },
  mixArtwork: { width: '100%', height: 140, borderRadius: 11, backgroundColor: '#e0e0e0' },
  infoContainer: { paddingTop: 8, paddingHorizontal: 10, paddingBottom: 10 },
  mixTitle: { fontSize: 16, fontWeight: "bold", color: "#F5EEDD" },
  mixSubtitle: { fontSize: 12, color: "#E0E0E0", marginTop: 4 },
});

export default SongsScreen;