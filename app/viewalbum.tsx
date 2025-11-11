import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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
import ShareModal from "../components/ui/ShareModal";
import MenuModal from "../components/MenuModal";

export default function ViewAlbum() {
  const songs = [
    { id: 1, title: "2 Much", artist: "Justin Bieber", year: "2021", image: require("../assets/images/Rectangle 464.png") },
    { id: 2, title: "Deserve You", artist: "Justin Bieber", image: require("../assets/images/Rectangle 464.png") },
    { id: 3, title: "Off My Face", artist: "Ghost", image: require("../assets/images/Rectangle 464.png") },
    { id: 4, title: "Ghost", artist: "Ghost", image: require("../assets/images/Rectangle 464.png") },
  ];

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);


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
  // ✅ Susunan isi menu dinamis
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
        setTimeout(() => setShareVisible(true), 200);
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

        {/* ✅ Gunakan komponen reusable */}
        <MenuModal
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          items={menuItems}
        />

        {/* ✅ Komponen ShareModal */}
        <ShareModal
          isShareVisible={shareVisible}
          setShareVisible={setShareVisible}
        />

        {/* Album Info */}
        <View style={styles.albumContainer}>
          <Image
            source={require("../assets/images/Rectangle 464.png")}
            style={styles.albumImage}
          />
          <Text style={styles.artistName}>Justin Bieber</Text>
          <Text style={styles.albumInfo}>2025 • 16 tracks</Text>

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
              placeholder="Ghost"
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Song List */}
       <ScrollView style={styles.songList} showsVerticalScrollIndicator={false}>
      {songs.map((song) => (
    <TouchableOpacity
      key={song.id}
      style={styles.songItem}
      activeOpacity={0.7} // efek transparan saat ditekan
      onPress={() => {
        // aksi saat item lagu ditekan
        console.log("Lagu dipilih:", song.title);
        // contoh: panggil fungsi play atau buka detail
        // playSong(song);
      }}
    >
      <Image source={song.image} style={styles.songImage} />
      <View style={styles.songText}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
      </View>

      {/* Tombol titik tiga untuk menu */}
      <Entypo
        onPress={() => {
          setMenuVisible(true);
          console.log("Menu lagu:", song.title);
        }}
        name="dots-three-vertical"
        size={16}
        color="gray"
        style={styles.songMenu}
      />
    </TouchableOpacity>
  ))}
</ScrollView>

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
