import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { searchPodcasts } from "@/services/taddy";

/* ================== TYPE ================== */
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
};

/* ================== MAPPER ================== */
function mapTaddyPodcast(p: any): PodcastEpisode {
  return {
    id: p.uuid || p.id,
    title: p.title || p.name || "Untitled",
    publisher:
      p.podcastSeries?.title ||
      p.publisher ||
      "Podcast",
    thumbnailUrl:
      p.imageUrl ||
      p.podcastSeries?.imageUrl ||
      "https://via.placeholder.com/300",

    description: p.description || "",
    category: "Podcast",
    year: "2024",
    duration: "—",
    showName: p.podcastSeries?.title || "",
  };
}


/* ================== COMPONENT ================== */
export default function PodcastCard() {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await searchPodcasts("music");

        const combined = [
          ...(result?.podcastSeries ?? []),
          ...(result?.podcastEpisodes ?? []),
        ];

        setPodcasts(combined.map(mapTaddyPodcast));
      } catch (e) {
        console.log("Podcast error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const renderItem = ({ item }: { item: PodcastEpisode }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{item.publisher}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      {/* ===== HEADER ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Podcasts</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          horizontal
          data={podcasts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 13,
    color: "#1DB954",
  },
  loading: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 140,
    marginLeft: 16,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  author: {
    fontSize: 12,
    color: "#666",
  },
});
