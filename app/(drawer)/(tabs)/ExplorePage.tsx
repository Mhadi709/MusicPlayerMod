import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MiniNavbar from "../../../components/layout/MiniNavbar";
import LastPlayedList from "@/components/common/LastPlayedList";
import PodcastCard from "@/components/common/PodcastCard";
import { getArtists } from "@/services/music.api";


export default function HomeScreen() {
  const router = useRouter();
  const [artists, setArtists] = React.useState<any[]>([]);

  useEffect(() => {
    const loadArtists = async () => {
      try {
      const res = await getArtists(20); 
        setArtists(
          res.map((a: any) => ({
            id: a.id,
            name: a.name,
            image: a.image || "https://via.placeholder.com/150",
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };

    loadArtists();
  }, []);

  const handleSearchPress = () => {
    requestAnimationFrame(() => {
      router.push("/DiscoverPage");
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
           <FlatList
              data={[]}
              renderItem={() => null} 
              keyExtractor={() => "header"}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  Recommended for you today
                </Text>
              </View>

              {/* Search */}
              <TouchableOpacity
                style={styles.searchContainer}
                onPress={handleSearchPress}
                activeOpacity={0.8}
              >
                <Feather
                  name="search"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <Text style={styles.placeholderText}>
                  Search for songs, artists, playlists...
                </Text>
              </TouchableOpacity>
                    {/* Explore */}
                  <View style={styles.exploreSection}>
                    <Text style={styles.exploreTitle}>Start Exploring</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.exploreRow}
                    >
                  <TouchableOpacity 
                      style={[styles.exploreChip, { backgroundColor: "#E8A838" }]}
                      onPress={() => router.push({ pathname: "/(drawer)/ExploreThemeScreen", params: { type: 'music', theme: 'Top Hits Musik', color: '#E8A838' }})}
                    >
                      <Text style={styles.exploreChipText}>Top Hits Musik</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.exploreChip, { backgroundColor: "#3A9E8F" }]}
                      onPress={() => router.push({ pathname: "/(drawer)/ExploreThemeScreen", params: { type: 'podcast', theme: 'Recommend Podcast', color: '#3A9E8F' }})}
                    >
                      <Text style={styles.exploreChipText}>Recommend Podcast</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.exploreChip, { backgroundColor: "#B03A9E" }]}
                      onPress={() => router.push({ pathname: "/(drawer)/ExploreThemeScreen", params: { type: 'music', theme: 'New Releases Song', color: '#B03A9E' }})}
                    >
                      <Text style={styles.exploreChipText}>New Releases Song</Text>
                    </TouchableOpacity>
                    </ScrollView>
                  </View>
              {/* Last Played */}
              <LastPlayedList data={artists} />
                <PodcastCard />
            </>
          )}
        />
      </SafeAreaView>
      <MiniNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },

  section: {
    marginTop: 15,
    paddingBottom: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  seeAll: { color: "#1DB954", fontSize: 14 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F3F3",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    height: 62,
  },
  searchIcon: { marginRight: 10 },
  placeholderText: { color: "#666", fontSize: 16 },

exploreSection: {
  paddingVertical: 16,
  paddingHorizontal: 16,
  backgroundColor: "#fff",
},
exploreTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 14,
  color: "#000",
},
exploreRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  paddingRight: 16,
},
exploreChip: {
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
},
exploreChipText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
},
});
