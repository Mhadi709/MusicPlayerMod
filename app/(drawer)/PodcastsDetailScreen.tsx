import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPodcastDetail } from "../../services/taddy";
import { usePlayer } from "@/context/PlayerContext";
import Toast from "react-native-toast-message";


export default function PodcastsDetailScreen() {
  const router = useRouter();
  const { uuid, name, imageUrl } = useLocalSearchParams<{ uuid: string; name: string; imageUrl: string }>();
  const [podcast, setPodcast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setTrack } = usePlayer();
  useEffect(() => {
    if (uuid && uuid !== "undefined") {
      loadData();
    }
  }, [uuid]);

 const loadData = async () => {
  try {
    setLoading(true);
    const data = await getPodcastDetail(uuid as string);

    if (data) {
      setPodcast(data);
    } else {
      Toast.show({
        type: 'snackInfo',
        text1: 'Podcast tidak ditemukan di database Taddy.',
        position: 'bottom',
        bottomOffset: 80,
        visibilityTime: 3000,
      });
    }
  } catch (e) {
    Toast.show({
      type: 'snackError',
      text1: 'Gagal memuat podcast, silakan coba lagi.',
      position: 'bottom',
      bottomOffset: 80,
      visibilityTime: 3000,
    });
  } finally {
    setLoading(false);
  }
};
  const handlePlayEpisode = (ep: any) => {
    const audioUri = ep.audioUrl;
    
    // 1. Set track ke player context
    setTrack({
      title: ep.name,
      artist: podcast?.name || "Podcast",
      image: imageUrl,
      audio: audioUri,
    });

    // 2. Arahkan ke NowPlaying
     router.push({
      pathname: "/(drawer)/NowPlayingPodcastScreen",
        params: {
       uuid: ep.uuid,
      title: ep.name,
      seriesName: podcast?.name, 
      imageUrl: encodeURIComponent(imageUrl),
      audioUrl: encodeURIComponent(ep.audioUrl), 
      description: encodeURIComponent(ep.description || ""),
      type: "podcast"
    }
  });
  };

  return (
    <View style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Cover Podcast */}
      <View style={styles.albumContainer}>
        <Image source={{ uri: imageUrl }} style={styles.albumCover} />
      </View>

      {/* Info Podcast */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.albumTitle} numberOfLines={2}>{name}</Text>
          <View style={styles.artistRow}>
             <FontAwesome name="podcast" size={18} color="#2CA58D" />
             <Text style={styles.artistName}> {podcast?.name || "Loading series..."}</Text>
          </View>
          <Text style={styles.albumYear}>Podcast Series</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity><Ionicons name="heart-outline" size={22} color="black" /></TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton}><Feather name="arrow-down" size={20} color="white" /></TouchableOpacity>
            <TouchableOpacity><Feather name="more-horizontal" size={22} color="black" /></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={() => podcast?.episodes && handlePlayEpisode(podcast.episodes[0])}>
          <Ionicons name="play" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Daftar Episode */}
      {loading ? (
        <ActivityIndicator size="large" color="#2CA58D" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          // PERBAIKAN: Gunakan data dari state 'podcast'
          data={podcast?.episodes || []}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.episodeRow} onPress={() => handlePlayEpisode(item)}>
              <View style={styles.iconBox}>
                 <FontAwesome name="podcast" size={20} color="#2CA58D" />
              </View>

              <View style={styles.episodeContent}>
                <Text style={styles.episodeTitle} numberOfLines={1}>
                   {item.name}
                </Text>
                <Text style={styles.episodeDesc} numberOfLines={2}>
                  {item.description?.replace(/<[^>]*>?/gm, '') || "No description available."}
                </Text>
              </View>

              <TouchableOpacity style={styles.moreButton}>
                <Feather name="more-horizontal" size={20} color="gray" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20}}>No episodes found.</Text>}
        />
      )}
 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 20 },
  backButton: { marginTop: 50, marginBottom: 10 },
  albumContainer: { alignItems: "center" },
  albumCover: { width: 220, height: 220, borderRadius: 15, elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  infoContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20 },
  textContainer: { flex: 1 },
  albumTitle: { fontSize: 22, fontWeight: "bold", color: "#000" },
  artistRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  artistName: { fontSize: 16, color: "#333", fontWeight: '500' },
  albumYear: { fontSize: 13, color: "gray", marginTop: 5 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 15 },
  downloadButton: { backgroundColor: "#2CA58D", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#2CA58D", justifyContent: "center", alignItems: "center", elevation: 5 },
  episodeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 0.3, borderBottomColor: "#eee" },
  iconBox: { width: 40, alignItems: 'center' },
  episodeContent: { flex: 1, marginLeft: 10 },
  episodeTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  episodeDesc: { fontSize: 13, color: "gray", marginTop: 4 },
  moreButton: { padding: 5 }
});