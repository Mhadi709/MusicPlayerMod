import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MiniNavbar from "../components/MiniNavbar";
import ModalBottomSheet from "@/components/ModalBottomSheet";

export default function MusicDetailScreen() {
  const router = useRouter();
  const [currentSong, setCurrentSong] = useState("From Me to You - Mono / Remastered");
  const [isPlaying, setIsPlaying] = useState(true);
const [isMenuVisible, setMenuVisible] = useState(false);


  const songs = [
    { id: "1", title: "Love Me Do - Mono / Remastered" },
    { id: "2", title: "From Me to You - Mono / Remastered" },
    { id: "3", title: "She Loves You - Mono / Remastered" },
  ];

 

  return (
    <View style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Cover Album */}
      <View style={styles.albumContainer}>
        <Image
          source={require("../assets/images/gambar1.png")}
          style={styles.albumCover}
        />
      </View>
      {/* Info Album */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.albumTitle}>1 (Remastered)</Text>
          <View style={styles.artistRow}>
            <Image
              source={require("../assets/images/gambar1.png")} // foto kecil artis jika ada
              style={styles.artistImage}
            />
            <Text style={styles.artist}>The Beatles</Text>
          </View>
          <Text style={styles.albumYear}>Album • 2000</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={22} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadButton}>
              <Feather name="arrow-down" size={22} color="black" />
            </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Feather name="more-horizontal" size={20} color="black" />
      </TouchableOpacity>

      {/* Modal Bottom Sheet */}
     <ModalBottomSheet visible={isMenuVisible} onClose={() => setMenuVisible(false)} />

          </View>
        </View>
        {/* Tombol Play/Pause */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Foundation name="pause" size={28} color="white" />
          ) : (
            <Ionicons name="play" size={28} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* Daftar Lagu */}
<FlatList
  data={songs}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.songRow}
      onPress={() => setCurrentSong(item.title)}
    >
      {/* Hanya tampilkan icon saat lagu dipilih */}
      {item.title === currentSong && (
        <MaterialCommunityIcons
          name="radio-tower"
          size={20}
          color="#1DB954"
          style={{ marginRight: 8 }}
        />
      )}

      <View>
        <Text
          style={[
            styles.songTitle,
            { color: item.title === currentSong ? "#1DB954" : "black" },
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.songArtist}>The Beatles</Text>
      </View>

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setMenuVisible(true)}
      >
        <Feather name="more-horizontal" size={22} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  )}
/>

      <MiniNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 10,
  },
  albumContainer: {
    alignItems: "center",
  },
  albumCover: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  textContainer: {
    flex: 1,
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  artistImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  artist: {
    fontSize: 16,
    color: "black",
  },
   moreButton: {
    width: 35,
    height: 35,
    marginLeft: "auto" 
  },
  albumYear: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 15,
  },
downloadButton: {
  backgroundColor: "#2CA58D",
  width: 25,
  height: 25,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 5,
},
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2CA58D",
    justifyContent: "center",
    alignItems: "center",
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: "#eee",
  },
  songTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
  songArtist: {
    marginLeft: 10,
    fontSize: 13,
    color: "gray",
  },
});
