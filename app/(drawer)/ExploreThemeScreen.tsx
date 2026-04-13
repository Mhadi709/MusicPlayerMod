import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Image as ExpoImage } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMusicList } from "@/services/music.api";
import { searchPodcasts } from "@/services/taddy";
import { usePlayer } from "@/context/PlayerContext";
import MiniNavbar from "@/components/layout/MiniNavbar";

export default function ExploreThemeScreen() {
  const router = useRouter();
  const { type, theme, color } = useLocalSearchParams<{ type: string; theme: string; color: string }>();
  const { setTrack } = usePlayer();

  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [theme]);

  const loadData = async () => {
    try {
      setLoading(true);
      let results = [];

      if (type === 'music') {
        results = await getMusicList(20); 
      } else {
        const searchQuery = theme === 'Recommend Podcast' ? 'storytelling' : 'trending';
        const podcastRes = await searchPodcasts(searchQuery);
        results = podcastRes.podcastEpisodes || [];
      }
      setDataList(results);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // --- KOMPONEN COLLAGE 4 GAMBAR ---
  const ImageCollage = () => {
    // Ambil 4 gambar pertama dari data
    const imgs = dataList.slice(0, 4).map(item => item.image || item.imageUrl || item.thumbnailUrl);
    
    return (
      <View style={styles.collageContainer}>
        {imgs.map((uri, index) => (
          <ExpoImage 
            key={index} 
            source={{ uri }} 
            style={styles.collageImage} 
            contentFit="cover"
          />
        ))}
        {/* Jika data kurang dari 4, isi dengan placeholder */}
        {imgs.length < 4 && <View style={[styles.collageImage, {backgroundColor: '#eee'}]} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Collage Cover (Lampiran) */}
      <View style={styles.headerSection}>
         <ImageCollage />
      </View>

      {/* Info Tema */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.themeTitle}>{theme}</Text>
          <Text style={styles.themeSubtitle}>Mix {type === 'music' ? 'Music' : 'Podcast'}</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity><Ionicons name="heart-outline" size={24} color="black" /></TouchableOpacity>
            <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: color || '#2CA58D' }]}><Feather name="arrow-down" size={20} color="white" /></TouchableOpacity>
            <TouchableOpacity><Feather name="more-horizontal" size={22} color="black" /></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.playButton, { backgroundColor: color || '#2CA58D' }]}>
          <Ionicons name="play" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* List Lagu/Episode */}
      {loading ? (
        <ActivityIndicator size="large" color={color || "#2CA58D"} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.itemRow}
              onPress={() => {
                // Logika putar musik/podcast sesuai tipe
                router.push({
                   pathname: type === 'music' ? "/(drawer)/NowPlayingScreen" : "/(drawer)/NowPlayingPodcastScreen",
                   params: { 
                      id: item.id || item.uuid, 
                      title: item.name || item.title,
                      audio: encodeURIComponent(item.audio || item.audioUrl),
                      image: encodeURIComponent(item.image || item.imageUrl)
                   }
                });
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.name || item.title}</Text>
                <Text style={styles.itemArtist}>{item.artist_name || item.seriesName || "Unknown"}</Text>
              </View>
              <Feather name="more-horizontal" size={20} color="gray" />
            </TouchableOpacity>
          )}
        />
      )}
      <MiniNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 20 },
  backButton: { marginTop: 50, marginBottom: 15 },
  headerSection: { alignItems: 'center', marginVertical: 10 },
  
  // STYLE COLLAGE (2x2 Grid)
  collageContainer: {
    width: 220,
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10
  },
  collageImage: {
    width: '50%',
    height: '50%',
  },

  infoContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20 },
  textContainer: { flex: 1 },
  themeTitle: { fontSize: 26, fontWeight: "bold", color: "#000" },
  themeSubtitle: { fontSize: 14, color: "gray", marginTop: 4 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 15 },
  downloadBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  playButton: { width: 65, height: 65, borderRadius: 32.5, justifyContent: "center", alignItems: "center", elevation: 5 },
  
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 0.3, borderBottomColor: "#eee" },
  itemTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  itemArtist: { fontSize: 13, color: "gray", marginTop: 3 },
});