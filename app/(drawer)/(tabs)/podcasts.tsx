import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Layout from "../../../components/layout/hederLayout";
import { LinearGradient } from 'expo-linear-gradient'; 
import { MaterialIcons } from '@expo/vector-icons';
import { searchPodcasts } from '@/services/taddy';
import ShimmerPodcast from '@/components/loading/ShimmerPodcast';
import { useRouter } from 'expo-router'; 
import MiniNavbar from '@/components/layout/MiniNavbar';

// 2. Update Type agar menyimpan data audio & seriesName
export type PodcastEpisode = {
  id: string;
  title: string;
  showName: string;
  publisher: string;
  duration: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  year: string;
  audioUrl: string;       
  seriesName: string;     
};

// 3. Update Komponen Item Horizontal (Terima onPress)
const PodcastItem: React.FC<{ item: PodcastEpisode; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.podcastItemContainer} onPress={onPress} activeOpacity={0.8}>
    <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />

    <LinearGradient
      colors={['rgba(12,45,39,0.3)', 'rgba(12,45,39,0.95)']}
      style={StyleSheet.absoluteFillObject}
    />

    <View style={styles.podcastInfoOverlay}>
      <Text style={styles.podcastTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.podcastShowName} numberOfLines={1} ellipsizeMode="tail">
        {item.category}
      </Text>
    </View>
  </TouchableOpacity>
);

// 4. Update Komponen Item Vertical (Terima onPress)
const RecommendedPodcastCard: React.FC<{ item: PodcastEpisode; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <LinearGradient
      colors={['#0B3129', '#219780']}
      style={styles.recommendedCard}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.recommendedThumbnail}
      />

      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>

        <Text style={styles.recommendedMeta}>
          {item.category} • {item.year}
        </Text>

        <Text style={styles.recommendedDesc} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
      </View>

      <View style={styles.playButton}>
        <MaterialIcons name="play-circle-filled" size={32} color="#12F0C4" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);
function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  // Sisa detik
  return `${m} min`; 
}
// 5. Update Mapper agar data audio & series tersimpan
export function mapTaddyPodcast(p: any): PodcastEpisode {
    return {
    id: p.uuid,
    title: p.name,
    showName: p.name,
    publisher: "-",
    duration: p.duration ? formatDuration(p.duration) : "Series", 
    thumbnailUrl: p.imageUrl || "https://via.placeholder.com/300",
    description: p.description || "",
    category: p.audioUrl ? "Episode" : "Podcast Series", 
    year: "2024",
    audioUrl: p.audioUrl || "", 
    
    seriesName: p.podcastSeries?.name || "Podcast",
  };
}

// 6. Komponen Utama
const PodcastsScreen: React.FC = () => {
  const router = useRouter(); // Init Router
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await searchPodcasts("Teknologi");
        const combined = [
          ...(result.podcastSeries ?? []),
          ...(result.podcastEpisodes ?? []),
        ];
        setPodcasts(combined.map(mapTaddyPodcast));
      } catch (e) {
        console.error("Taddy error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);


const handlePress = (item: any) => {
  const seriesId = item.id || item.uuid; 
 if (!seriesId) {
    return;
  }

  router.push({
    pathname: "/(drawer)/PodcastsDetailScreen",
    params: {
      uuid: seriesId,
      name: item.name || item.title,
      imageUrl: item.imageUrl || item.thumbnailUrl
    }
  });
};

  if (loading) {
    return (
      <Layout>
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerPodcast key={i} variant="horizontal" />
          ))}
        </View>
        <Text style={[styles.TopHeder, { marginTop: 30 }]}>
          Recommended <Text style={styles.SubTopHeder}>podcasts</Text>
        </Text>
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerPodcast key={i} variant="vertical" />
        ))}
      </Layout>
    );
  }

  return (
    <Layout>
      <FlatList
        data={podcasts}
        keyExtractor={(item) => item.id}
        // Render Vertical Items
        renderItem={({ item }) => (
          <RecommendedPodcastCard 
            item={item} 
            onPress={() => handlePress(item)} 
          />
        )}
        ListHeaderComponent={
          <>
            {/* Horizontal List */}
            <FlatList
              data={podcasts}
              renderItem={({ item }) => (
                <PodcastItem 
                  item={item} 
                  onPress={() => handlePress(item)} 
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: 24,
                paddingBottom: 24,
              }}
              style={{ height: 160 }}
            />

            <Text style={styles.TopHeder}>
              Recommended <Text style={styles.SubTopHeder}>podcasts</Text>
            </Text>
          </>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
       <MiniNavbar />
    </Layout>
  );
};

// Style tetap sama (pastikan styles terdefinisi di file Anda)
const styles = StyleSheet.create({
  podcastItemContainer: { width: 120, height: 120, marginRight: 12, borderRadius: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: '100%' },
  podcastInfoOverlay: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  podcastTitle: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  podcastShowName: { color: '#ccc', fontSize: 10 },
  
  recommendedCard: { flexDirection: 'row', marginHorizontal: 15, marginBottom: 12, borderRadius: 12, padding: 12, alignItems: 'center' },
  recommendedThumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  recommendedInfo: { flex: 1 },
  recommendedTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  recommendedMeta: { color: '#ccc', fontSize: 11, marginBottom: 4 },
  recommendedDesc: { color: '#bbb', fontSize: 11 },
  playButton: { marginLeft: 8 },

  TopHeder: { fontSize: 20, fontWeight: 'bold', color: '#000', marginHorizontal: 15, marginBottom: 10 },
  SubTopHeder: { fontWeight: '300', color: '#555' },
});

export default PodcastsScreen;