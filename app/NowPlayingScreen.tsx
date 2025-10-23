import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import Slider from "@react-native-community/slider";
import { AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import Toast, { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import ShareModal from "../components/ui/ShareModal";
import LirikModal from "../components/LirikModal";


export default function NowPlayingScreen() {
const [isMenuVisible, setMenuVisible] = useState(false);     
const [shareVisible, setShareVisible] = useState(false);
const [isLiked, setIsLiked] = useState(false);
const [isBookmarked, setIsBookmarked] = useState(false);
const [inPlaylist, setInPlaylist] = useState(false);
const [position, setPosition] = useState(106); // detik (1:46)
const duration = 244; // total 4:04
const [deviceIndex, setDeviceIndex] = useState(0);
const [highlightedIndex, setHighlightedIndex] = useState(0);
const [visible, setVisible] = useState(false);
const player = useVideoPlayer(require("@/assets/images/14315770_3830_2160_24fps.mp4"), (player) => {
  player.loop = true;
  player.muted = true;
  player.play();
});
const deviceIcons = [
  <Feather name="smartphone" size={24} color="white" key="phone" />,
  <FontAwesome name="laptop" size={24} color="white" key="laptop" />,
  <MaterialIcons name="speaker" size={24} color="white" key="speaker" />,
];
const toggleDevice = () => {
  setDeviceIndex((prev) => (prev + 1) % deviceIcons.length);
};
const lyrics = [
  "Don't remind me",
  "I'm minding my own damn business",
  "Don't try to find me",
  "I'm better left alone than in this",
  "It doesn't surprise me",
  "Do you really think that I could care",
];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % lyrics.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

   const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // 🔥 Tambahkan logika untuk play / pause audio di sini
  };
   const [showSongCard, setShowSongCard] = useState(false);

 const handleScroll = (event: any) => {
  const yOffset = event.nativeEvent.contentOffset.y;
  setShowSongCard(yOffset > 100); // muncul setelah scroll 120px
};
  const { toast } = useLocalSearchParams();

  useEffect(() => {
    if (toast === "save") {
      Toast.show({
        type: "myToast",
        text1: "Save to playlist",   
        position: "bottom",
        bottomOffset: 60,
      });
    }
  }, [toast]);
 return (
    <View style={styles.container}>
      <VideoView
        style={styles.backgroundVideo}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "#000"]}
        style={styles.bottomGradient}
      />
      {showSongCard && (
        <View style={styles.songCardContainer}>
          <View style={styles.songCard}>
            <Image
              source={require("../assets/images/Rectangle 464.png")}
              style={styles.albumArtSmall}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.songTitleCard}>Let Me Love You</Text>
              <Text style={styles.songArtistCard}>DJ Snake</Text>
            </View>
            <EvilIcons name="heart" size={28} color="black" />
          </View>
        </View>
      )}
      {/* Konten scrollable */}
      <ScrollView
        style={styles.overlay}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        onScroll={handleScroll}
        scrollEventThrottle={16} // biar smooth
      >
        <View style={styles.header}>
          <Entypo name="chevron-thin-down" size={24} color="white" />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.playingFrom}>Playing From Playlist</Text>
            <Text style={styles.judul}>mega hit mix</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Entypo name="dots-three-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Modal Bottom Sheet */}
        <Modal
          visible={isMenuVisible} 
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)} 
        >
          <TouchableOpacity
            style={styles.overlay1}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          >
            <View style={styles.modalContent}>
              {/* Like */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
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
                      text1: "No Longer Liked.",
                      position: "bottom",
                    });
                  }
                  setMenuVisible(false); 
                }}
              >
                {isLiked ? (
                  <AntDesign name="heart" size={24} color="black" />
                ) : (
                  <FontAwesome5 name="heart" size={24} color="black" />
                )}
              
                <Text style={styles.menuText}>
                  {isLiked ? "liked" : "Like"}
                </Text>
              </TouchableOpacity>
              {/* Hide song */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}> 
                <AntDesign name="minus-circle" size={24} color="black" />
                <Text style={styles.menuText}>Hide song</Text>
              </TouchableOpacity>
              {/* Add / Remove from playlist */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (!inPlaylist) {
                    router.push("/Addplaylist");
                    setInPlaylist(true);
                  } else {
                    setInPlaylist(false);
                    Toast.show({
                      type: "myToast",
                      text1: "Removed from Playlist",
                      position: "bottom",
                    });
                  }
                  setMenuVisible(false); 
                }}
              >
                <MaterialIcons
                  name={inPlaylist ? "remove-circle-outline" : "add-circle-outline"}
                  size={24}
                  color="black"
                />
                <Text style={styles.menuText}>
                  {inPlaylist ? "Remove from playlist" : "Add to playlist"}
                </Text>
              </TouchableOpacity>
              {/* Add to queue */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}> 
                <MaterialIcons name="queue-music" size={24} color="black" />
                <Text style={styles.menuText}>Add to queue</Text>
              </TouchableOpacity>
              {/* Share */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);  
                  setTimeout(() => {
                    setShareVisible(true); 
                  }, 200);
                }}
              >
                <Octicons name="share" size={24} color="black" />
                <Text style={styles.menuText}>Share</Text>
              </TouchableOpacity>

              {/* View album */}
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  router.push("/viewalbum"); 
                }}> 
                <MaterialIcons name="album" size={24} color="black" />
                <Text style={styles.menuText}>View album</Text>
              </TouchableOpacity>

              {/* View artist */}
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  router.push("/ArtistProfile"); 
                }}> 
                <Feather name="user" size={24} color="black" />
                <Text style={styles.menuText}>View artist</Text>
              </TouchableOpacity>

              {/* Bookmark toggle */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (!isBookmarked) {
                    setIsBookmarked(true);
                    Toast.show({
                      type: "myToast",
                      text1: "Save to Bookmark",
                      position: "bottom",
                    });
                  } else {
                    setIsBookmarked(false);
                    Toast.show({
                      type: "myToast",
                      text1: "Delete Bookmark",
                      position: "bottom",
                    });
                  }
                  setMenuVisible(false); 
                }}
              >
               
                {isBookmarked ? (
                  <MaterialIcons name="bookmark-remove" size={24} color="black" />
                ) : (
                  <Feather name="bookmark" size={24} color="black" />
                )}
               
                <Text style={styles.menuText}>
                  {isBookmarked ? "Delete Bookmark" : "Bookmarks"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
    {/* Modal Share */}
      <ShareModal
        isShareVisible={shareVisible}
        setShareVisible={setShareVisible}
      />     
        {/* Album + Info */}
        <View style={styles.content}>
          <View style={styles.songInfoRow}>
            <Image
              source={require("../assets/images/Rectangle 464.png")}
              style={styles.albumArt}
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={styles.songRow}>
                <Text style={styles.songTitle}>Let Me Love You</Text>
                <Feather name="heart" size={24} color="black" />
              </View>
              <Text style={styles.artist}>DJ Snake</Text>
            </View>
          </View>
          {/* Slider */}
          <Slider
            style={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={setPosition}
            minimumTrackTintColor="#0B3129"
            maximumTrackTintColor="#2CA58D"
            thumbTintColor="#0B3129"
          />
     <View style={styles.timeRow}>
  <Text style={styles.timeText}>{formatTime(position)}</Text>
  <Text style={styles.timeText}>{formatTime(duration)}</Text>
</View>


          {/* Controls */}
          <View style={styles.controls}>
            <Ionicons name="shuffle-sharp" size={24} color="#6C7072" />
            <Feather name="skip-back" size={24} color="white" />
             <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              {isPlaying ? (
                <AntDesign name="pause" size={28} color="white" /> 
              ) : (
                <Entypo name="controller-play" size={29} color="white" /> // ikon play
              )}
            </TouchableOpacity>
            <Feather name="skip-forward" size={24} color="white" />
            <Feather name="repeat" size={24} color="#6C7072" />
          </View>
        </View>
        {/* Current device bar */}
        <View style={styles.deviceBar}>
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={[styles.iconButton, { marginRight: 7 }]}
              onPress={toggleDevice}
            >
              {deviceIcons[deviceIndex]}
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Current device</Text>
              <Text style={styles.subtitle}>This phone</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}
             onPress={() => {
                  setMenuVisible(false);  
                  setTimeout(() => {
                    setShareVisible(true); 
                  }, 200);
                }}
            >
              <Feather name="share-2" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
    <View style={styles.lyricsCard}>
      {/* Header */}
    <View style={styles.lyricsHeader}>
      <View style={styles.iconCircle1}>
        <TouchableOpacity
        onPress={() => {
          setMenuVisible(false);
          setTimeout(() => {
            setShareVisible(true); // munculkan modal
          }, 200);
        }}
      >
        <Feather name="share-2" size={20} color="#666" />
      </TouchableOpacity>

      {/* 🔹 Modal lirik */}
      <LirikModal visible={shareVisible} setVisible={setShareVisible} />

      </View>
      <Text style={styles.lyricsTitle}>Lyrics</Text>
      <View style={styles.iconCircle1}>
        <AntDesign name="arrows-alt" size={20} color="#666" />
      </View>
    </View>
  {/* Inner rectangle untuk text */}
  <View style={styles.innerLyricsBox}>
    <ScrollView>
      {lyrics.map((line, index) => (
        <Text
          key={index}
          style={[
            styles.lyricsLine,
            index <= highlightedIndex
              ? styles.highlightedLyrics
              : styles.normalLyrics,
          ]}
        >
          {line}
        </Text>
      ))}
    </ScrollView>
  </View>
</View>
<View style={styles.artistCard}>
  <Text style={styles.artistTitle}>About the artist</Text>
  <TouchableOpacity
   activeOpacity={0.6} >
  <Image
    source={require("../assets/images/images.webp")}
    style={styles.artistImage}
  />
  </TouchableOpacity>
  <View style={styles.artistInfoRow}>
  <View style={{ flex: 1 }}>
    <Text style={styles.artistName}>Oliver Tree</Text>
    <Text style={styles.artistListeners}>24,419,528 monthly listeners</Text>
  </View>

<TouchableOpacity  onPress={() => {
setMenuVisible(false);
router.push("/ArtistProfile"); // ✅ arahkan ke app/ArtistProfile.tsx
        }}
style={styles.followButton}>
<Text style={styles.followText}>Follow</Text>
</TouchableOpacity>
</View>

  <Text style={styles.artistDesc}>
    An internet based vocalist, producer, writer, director and performance
    artist, Oliver Tree... <Text style={styles.seeMore}>See more</Text>
  </Text>
</View>
      </ScrollView>
    </View>
    
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000"  },
 backgroundVideo: {
  ...StyleSheet.absoluteFillObject,
  height: 640,
},

bottomGradient: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 880, // lebih tinggi dari sebelumnya biar nutup radius
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  overflow: "hidden",
},
  overlay: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 10,
  },
  judul: { fontSize: 14, fontWeight: "600", marginTop: 2, color: "#fff" },
  playingFrom: { fontSize: 12, color: "#666",fontWeight: "900", },
  content: { justifyContent: "center", marginTop: 299 },
  songInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  albumArt: { width: 92, height: 88, borderRadius: 8 },
  songRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  songTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  artist: { fontSize: 14, color: "#777" },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: -8,
    marginBottom: -19,
  },
  timeText: {
  color: "#fff", // warna putih, bisa kamu ubah sesuai tema
  fontSize: 13,
  fontWeight: "600",
},

  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: "#009688",
    borderRadius: 50,
    padding: 20,
  },
  // 🔥 Lyrics Card Style
lyricsCard: {
  backgroundColor: "#00D1A1", 
  borderRadius: 20,
  paddingVertical: 8,  
  paddingHorizontal: 0, 
  paddingBottom:0,
  width: "97%",        
  alignSelf: "center",
  marginTop: 20,
},


lyricsHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
  paddingHorizontal: 7, 
},

lyricsTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "white",
},

innerLyricsBox: {
  backgroundColor: "#00A384",
  borderTopLeftRadius: 12,  
  borderTopRightRadius: 12,  
  borderBottomLeftRadius: 12, 
  borderBottomRightRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  width: "100%",
},
lyricsLine: {
  fontSize: 18,
  marginBottom: 8,
},

highlightedLyrics: {
  color: "white",
  fontWeight: "900",
},

normalLyrics: {
  color: "#666", // abu gelap
},

  deviceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color:"#ffff"
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
 iconCircle: {
  backgroundColor: "white",
  borderRadius: 50,
  padding: 6,
  justifyContent: "center",
  alignItems: "center",
},
 iconCircle1: {
  backgroundColor: "white",
  borderRadius: 50,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
},

  iconButton: {
    marginLeft: 16,
  },
  //artis card
  artistCard: {
  backgroundColor: "#00A384",
  borderRadius: 20,
  padding: 16,
  marginTop: 16,
},
artistTitle: {
  color: "#fff",
  fontSize: 16,
  marginBottom: 8,
  fontWeight: "900"
},
artistImage: {
  width: 351,
  height: 251,
  borderRadius: 16,
  marginBottom: 12,
},
artistName: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
},
artistListeners: {
  color: "#cceee8",
  fontSize: 13,
  marginBottom: 12,
},
followButton: {
  backgroundColor: "#999",
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 20,
  marginLeft: 10,
},

followText: {
  color: "#fff",
  fontSize: 14,
},
artistDesc: {
  color: "#fff",
  fontSize: 13,
  lineHeight: 18,
  marginTop:2,
  marginBottom:5,
},
seeMore: {
  color: "#eee",
  fontWeight: "600",
},
artistInfoRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
},
//menu mokup
 overlay1: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#000",
  },

albumArtSmall: {
  width: 60,
  height: 60,
  borderRadius: 8,
},
songTitleCard: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
},
songArtistCard: {
  fontSize: 14,
  color: "#333",
},
songCardContainer: {
  position: "absolute",
  top: 60, // sesuaikan biar pas di bawah header
  left: 0,
  right: 0,
  zIndex: 10,
  paddingHorizontal: 16,
},
songCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#d3d3d3",
  padding: 10,
  borderRadius: 8,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
},


});
