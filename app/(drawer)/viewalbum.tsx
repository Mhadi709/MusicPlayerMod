import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Entypo,
  FontAwesome5,
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import MenuModal from "../../components/common/MenuModal";
import UnifiedShareModal from "@/components/common/UnifiedShareModal";
import { useLocalSearchParams } from "expo-router";
import { getMusicList, searchMusicJamendo } from "@/services/music.api";
import { Image as ExpoImage } from "expo-image";
import { navigateToNowPlaying } from "@/utils/navigation";

export default function ViewAlbum() {
  const { artistName, albumName, albumImage } = useLocalSearchParams();
  
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch lagu dari Jamendo berdasarkan artist
  useEffect(() => {
    fetchAlbumSongs();
  }, [artistName]);

  const fetchAlbumSongs = async () => {
    try {
      setLoading(true);
      // Cari lagu berdasarkan nama artist
      const results = await searchMusicJamendo(
        (artistName as string) || "popular", 
        16
      );
      setSongs(results);
    } catch (e) {
      console.log("Error fetch songs:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filter berdasarkan search
  const filteredSongs = songs.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareSource, setShareSource] = useState<
    "menu" | "icon" | "lyrics" | null
  >(null);

  const download = {
    icon: <Feather name="download" size={22} color="black" />,
    label: "Download",
    onPress: () => {
      Toast.show({
        type: "success",
        text1: "Downloading...",
        position: "bottom",
      });
    },
  };
  const menuItems = [
    {
      icon: isLiked
        ? <AntDesign name="heart" size={24} color="black" />
        : <FontAwesome5 name="heart" size={24} color="black" />,
      label: isLiked ? "Liked" : "Like",
      onPress: () => {
        if (!isLiked) {
          setIsLiked(true);
          Toast.show({
          type: "myunit",
            text1: "You like this song",
            position: "bottom",
          });
        } else {
          setIsLiked(false);
          Toast.show({
           type: "myunit",
            text1: "remove to like",
            position: "bottom",
          });
        }
      },
    },
    {
      icon: <MaterialCommunityIcons name="playlist-music-outline" size={22} color="black" />,
      label: "Add to playlist",
      onPress: () => {
        Toast.show({
          type: "info",
          text1: "Added to playlist",
          position: "bottom",
        });
      },
    },
    {
      icon: <Feather name="download" size={22} color="black" />,
      label: "Download",
      onPress: () => {
        Toast.show({
          type: "success",
          text1: "Downloading...",
          position: "bottom",
        });
      },
    },
    {
      icon: <Octicons name="share" size={22} color="black" />,
      label: "Share",
      onPress: () => {
          setShareSource("menu"); 
          setTimeout(() => {
            setShareVisible(true);
          }, 300);
      },
    },
    {
      icon: <Feather name="user" size={24} color="black" />,
      label: "View artist",
      onPress: () => {
        router.push("/ArtistProfile");
      },
    },
    {
      icon: isBookmarked
        ? <MaterialIcons name="bookmark-remove" size={24} color="black" />
        : <Feather name="bookmark" size={24} color="black" />,
      label: isBookmarked ? "Delete Bookmark" : "Bookmark",
      onPress: () => {
        if (!isBookmarked) {
          setIsBookmarked(true);
          Toast.show({
            type: "success",
            text1: "Saved to bookmarks",
            position: "bottom",
          });
        } else {
          setIsBookmarked(false);
          Toast.show({
            type: "info",
            text1: "Bookmark removed",
            position: "bottom",
          });
        }
      },
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-thin-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ViewAlbum</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Entypo name="dots-three-vertical" size={18} color="black" />
          </TouchableOpacity>
        </View>

        {/*  Gunakan komponen reusable */}
        <MenuModal
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          items={menuItems}
        />

        {/* Komponen ShareModal */}
      <UnifiedShareModal
  visible={shareVisible}
  setVisible={setShareVisible}
  source={shareSource}   // ← "menu"
  title="Song Title"
  artist="Artist Name"
  image="https://example.com/cover.jpg"

    />

        {/* Album Info */}
       <View style={styles.albumContainer}>
        <ExpoImage
          source={{ uri: (albumImage as string) || songs[0]?.image || "https://via.placeholder.com/300" }}
          style={styles.albumImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <Text style={styles.artistName}>
          {artistName || songs[0]?.artist_name || "Unknown Artist"}
        </Text>
        <Text style={styles.albumInfo}>
          {new Date().getFullYear()} • {songs.length} tracks
        </Text>

          <View style={styles.musicInfo}>
            <View style={styles.leftInfo}>
              <MaterialCommunityIcons name="music-note-outline" size={22} color="black" />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.musicTitle}>Music</Text>
                <Text style={styles.likes}>178,426 likes • 3h 25min</Text>
              </View>
            </View>
            <View style={styles.rightIcons}>
              <Ionicons name="shuffle-sharp" size={22} color="gray" style={styles.icon} />
              <TouchableOpacity onPress={download.onPress}>
              <AntDesign name="download" size={20} color="gray" style={styles.icon} />
            </TouchableOpacity>
             <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Entypo name="dots-three-vertical" size={20} color="gray" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
 {/* Search Bar */}
       <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Cari lagu..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
{loading ? (
  <ActivityIndicator size="large" color="#2CA58D" style={{ marginTop: 30 }} />
) : (
  <ScrollView style={styles.songList} showsVerticalScrollIndicator={false}>
    {filteredSongs.map((song) => (
      <TouchableOpacity
        key={song.id}
        style={styles.songItem}
        activeOpacity={0.7}
        onPress={() => navigateToNowPlaying(router, {
          id: song.id,
          name: song.name || song.title,           
          artist_name: song.artist_name || song.artist, 
          audio: song.audio || song.audioUrl,    
          image: song.image,
        })}
      >
        <ExpoImage
          source={{ uri: song.image || "https://via.placeholder.com/300" }}
          style={styles.songImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={styles.songText}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {song.name || song.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.artist_name || song.artist}
          </Text>
        </View>
        <Entypo
          onPress={() => setMenuVisible(true)}
          name="dots-three-vertical"
          size={16}
          color="gray"
          style={styles.songMenu}
        />
      </TouchableOpacity>
    ))}
  </ScrollView>
)}

      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  albumContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  artistName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  albumInfo: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  musicInfo: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width:"90%",
  marginTop: 10,
},
leftInfo: {
  flexDirection: "row",
  alignItems: "center",
},
musicTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "black",
},

likes: {
  fontSize: 13,
  color: "gray",
},

rightIcons: {
  flexDirection: "row",
  alignItems: "center",
},

icon: {
  marginLeft: 15,
},

searchContainer: {
  marginHorizontal: 9,
  marginTop: 15,
},

searchBox: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1, // stroke (garis tepi)
  borderColor: "#ccc", // warna garis tepi
  borderRadius: 8,
  paddingHorizontal: 5,
  paddingVertical: 2,
  backgroundColor: "transparent", // tanpa warna isi
},

searchIcon: {
  marginRight: 8,
},

searchInput: {
  flex: 1,
  fontSize: 16,
  color: "#000",
},


  songList: {
    marginTop: 20,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  songText: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  songArtist: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  songMenu: {
    marginLeft: 10,
  },
  overlay1: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.3)",
  justifyContent: "flex-end",
},

modalContent: {
  backgroundColor: "#EAEAEA", // abu muda
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingVertical: 20,
  paddingHorizontal: 25,
  width: "100%",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: -2 },
  shadowRadius: 5,
  elevation: 10,
},

menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
},

menuText: {
  fontSize: 16,
  marginLeft: 12,
  color: "black",
},

});
