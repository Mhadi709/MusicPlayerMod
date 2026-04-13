import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import MenuButton from "@/components/common/MenuButton";
import { getAlbumList } from "../../services/music.api";

// --- TYPE ---
export type Album = {
  id: string;
  title: string;
  artist: string;
  image: string;
};

// --- KONFIGURASI GRID ---
const numColumns = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING_HORIZONTAL = 16;
const GAP = 10; // Jarak antar kartu
// Rumus: (Lebar Layar - Total Padding Kiri Kanan - Total Gap antar item) / Jumlah Kolom
const CARD_WIDTH = (SCREEN_WIDTH - (PADDING_HORIZONTAL * 2) - (GAP * (numColumns - 1))) / numColumns;

export default function AlbumPlaylistPage() {
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = React.useState<Album[]>([]); // Untuk hasil search
  const [loading, setLoading] = React.useState(true);
  
  // State Search & Animasi
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const searchAnim = React.useRef(new Animated.Value(0)).current; // 0 = Title, 1 = Search

  React.useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    setLoading(true);
    const data = await getAlbumList(30);
    setAlbums(data);
    setFilteredAlbums(data); // Default tampilkan semua
    setLoading(false);
  };

  // --- LOGIKA ANIMASI SEARCH ---
  const toggleSearch = () => {
    if (isSearching) {
      // Tutup Search
      Keyboard.dismiss();
      setSearchText("");
      setFilteredAlbums(albums); // Reset list
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // false karena kita animate width
      }).start(() => setIsSearching(false));
    } else {
      // Buka Search
      setIsSearching(true);
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = albums.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.artist.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(albums);
    }
  };

  // Interpolasi Animasi
  const searchBarWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "85%"], // Lebar input dari 0 ke 85%
  });
  
  const titleOpacity = searchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0], // Title menghilang
  });

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: Album }) => {
    if (!item.image) return null;

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/MusicDetailScreen", // Pastikan path ini benar di file struktur kamu
            params: {
              albumId: item.id,
              title: item.title,
              artist: item.artist,
              albumImage: encodeURIComponent(item.image),
            },
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          
          {/* --- HEADER DENGAN ANIMASI --- */}
          <View style={styles.headerContainer}>
            
            {/* Bagian Kiri (Menu & Title) */}
            <Animated.View style={[styles.titleSection, { opacity: titleOpacity, display: isSearching ? 'none' : 'flex' }]}>
               <MenuButton /> 
               {/* Note: Jika MenuButton punya margin sendiri, sesuaikan styles.title */}
               <Text style={styles.title}>Album Playlist</Text>
            </Animated.View>

            {/* Bagian Search Input (Muncul saat isSearching) */}
            <Animated.View style={[styles.searchSection, { width: searchBarWidth, opacity: searchAnim }]}>
              <View style={styles.searchInputWrapper}>
                <Feather name="search" size={20} color="#666" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Find album..."
                  style={styles.input}
                  value={searchText}
                  onChangeText={handleSearch}
                  autoFocus={isSearching}
                />
              </View>
            </Animated.View>

            {/* Tombol Search / Close Icon */}
            <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
              {isSearching ? (
                <Ionicons name="close" size={24} color="#000" />
              ) : (
                <Feather name="search" size={24} color="#1d1e1f" />
              )}
            </TouchableOpacity>
          </View>

          {/* --- CONTENT --- */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#2CA58D" />
          ) : (
            <FlatList
              data={filteredAlbums} // Pakai data yang sudah difilter
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              
              // Styling Grid agar Rapi
              columnWrapperStyle={{ gap: GAP }} // Jarak horizontal antar kolom
              contentContainerStyle={{ gap: GAP + 10, paddingBottom: 100 }} // Jarak vertikal antar baris
              
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                  No albums found.
                </Text>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  
  // Header Styles
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    overflow: 'hidden', // Agar animasi rapi
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1e1f",
  },
  
  // Search Styles
  searchSection: {
    height: 45,
    justifyContent: "center",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  iconButton: {
    padding: 5,
  },

  // Grid / Card Styles
  cardWrapper: {
    width: CARD_WIDTH, // Lebar dinamis
    alignItems: "center",
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH, // Persegi
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#eee', // Placeholder color
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "left", // Lebih rapi rata kiri biasanya untuk judul album
    color: "#333",
    width: "100%",
  },
});