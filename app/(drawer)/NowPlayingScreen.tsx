import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet,  TouchableOpacity, ScrollView, Modal, Animated, Easing, ActivityIndicator, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import { AntDesign, Entypo, Feather, FontAwesome5, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { searchPexelsVideos } from "@/services/pexels.api";
import UnifiedShareModal from "@/components/common/UnifiedShareModal";
import { usePlayer } from "@/context/PlayerContext";
import { toggleBookmarkApi, toggleFavoriteApi } from "@/services/auth.api";
import { useAuth } from "@/hooks/useAuth";

export default function NowPlayingScreen() {
  const params = useLocalSearchParams();
  const { id, title, artist, image, audio, monthly_listeners, artistDescription, type } = params;
  const { user } = useAuth();
  const {
    isPlaying, position, duration, playPause, 
    handleNext, handlePrev, seekTo, setTrack, 
    toggleRepeat, repeatMode, toggleShuffle, isShuffle,
    stopAndClear, currentTrack
  } = usePlayer();

  const lyricsScrollRef = useRef<ScrollView>(null);
  const hasLoadedRef = useRef(false)
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);
  const [shareSource, setShareSource] = useState<"menu" | "icon" | "lyrics" | null>(null);
  const [isShareVisible, setShareVisible] = useState(false);
  const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [enableVideo, setEnableVideo] = useState(true);
  // Decode dengan useMemo (stabil per ID)
const displayImage = useMemo(() => {
  if (!image) return "https://via.placeholder.com/300";
  const decoded = decodeURIComponent(image as string);
  // Resize agresif ke 300x300 saja — cukup untuk UI
  if (decoded.includes('jamendo')) return `${decoded}?width=300`;
  if (decoded.includes('pexels')) return `${decoded}?w=300&h=300&fit=crop`;
  return decoded;
}, [id]);

  
useEffect(() => {
  return () => {
    ExpoImage.clearMemoryCache?.();
    ExpoImage.clearDiskCache?.();  // ← tambah ini
  };
}, []);

  const audioUrl = useMemo(() => 
    audio ? decodeURIComponent(audio as string) : null
  , [id]);

  // Load track sekali per ID
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (audioUrl && audioUrl !== "undefined" && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      
      console.log("🎵 Memuat lagu:", title);
      
      setTrack({
        title: title as string,
        artist: artist as string,
        image: displayImage,
        audio: audioUrl,
      });

      loadLazyData();
    }
  }, [audioUrl]);

   useEffect(() => {
    hasLoadedRef.current = false;
    
    // ✅ Clear timer sebelumnya jika ada
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, [id]);
  
  // Auto-scroll lyrics
  useEffect(() => {
    if (lyrics.length > 0 && duration > 0) {
      const currentLine = Math.floor((position / duration) * lyrics.length);
      if (currentLine !== highlightedIndex) {
        setHighlightedIndex(currentLine);
        lyricsScrollRef.current?.scrollTo({ y: currentLine * 35, animated: true });
      }
    }
  }, [position, lyrics.length, duration]);

  const loadLazyData = async () => {
    setVideoSource(null);
    setVideoReady(false);
    setLyrics([]);
    setLyricsLoading(true);
    
    try {
      const lyricsRes = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist as string)}/${encodeURIComponent(title as string)}`
      );
      const lyricsData = await lyricsRes.json();
      setLyrics(lyricsData.lyrics ? lyricsData.lyrics.split("\n") : ["No lyrics available"]);
    } catch (error) {
      setLyrics(["Lyrics not found"]);
    } finally {
      setLyricsLoading(false);
    }

 // Di loadLazyData, ganti bagian fetch video
    try {
      const vids = await searchPexelsVideos(artist as string, 1);
      const videoFiles = vids?.[0]?.video_files;
      if (videoFiles) {
        // Ambil resolusi TERENDAH, bukan tertinggi
        const lowest = videoFiles
          .filter((v: any) => v.width <= 480) // ← max 480p
          .sort((a: any, b: any) => a.width - b.width)[0]; // ascending
        if (lowest?.link) {
          setVideoSource(lowest.link);
          setVideoReady(true);
        }
      }
    } catch (error) {
      console.log("Video error:", error);
    }
  };

 useEffect(() => {
    if (audioUrl && audioUrl !== "undefined" && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      
      //  Clear timer lama jika ada
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }

      // Set timer baru
      loadTimerRef.current = setTimeout(() => {
        console.log("🎵 Memuat lagu:", title);
        
        setTrack({
          title: title as string,
          artist: artist as string,
          image: displayImage,
          audio: audioUrl,
        });

        loadLazyData();
        loadTimerRef.current = null;
      }, 400); //  400ms delay

      //  Cleanup timer saat unmount
      return () => {
        if (loadTimerRef.current) {
          clearTimeout(loadTimerRef.current);
          loadTimerRef.current = null;
        }
      };
    }
  }, [audioUrl]);
  const videoPlayer = useVideoPlayer(videoSource || "", (player) => {
    if (videoSource && videoReady) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  });



  const handleToggleLike = async () => {
    if (!user?.id) return;
    try {
      setIsLikeLoading(true);
      await toggleFavoriteApi({
        userId: user.id, songId: id as string, title: title as string,
        artist: artist as string, image: displayImage, audio: audioUrl || ""
      });
      setIsLiked(!isLiked);
      Toast.show({ type: "myunit", text1: !isLiked ? "Liked" : "Removed", position: "bottom" });
    } catch (e) { console.log(e); } 
    finally { setIsLikeLoading(false); setMenuVisible(false); }
  };

  const handleToggleBookmark = async () => {
    if (!user?.id) return;
    try {
      setIsBookmarking(true);
      // PERBAIKAN: Kirim itemId sesuai interface API
      await toggleBookmarkApi({
        userId: user.id, itemId: id as string, title: title as string,
        artist: artist as string, image: displayImage, type: (type as any) || "music"
      });
      setIsBookmarked(!isBookmarked);
      Toast.show({ type: "myToast", text1: "Bookmark updated", position: "bottom" });
    } catch (e) { console.log(e); } 
    finally { setIsBookmarking(false); setMenuVisible(false); }
  };
  const handleSliderChange = (val: number) => {
    setIsSliding(true);
    setSlidingValue(val);
  };

  const handleSliderComplete = async (val: number) => {
    await seekTo(val);
    setIsSliding(false);
  };

  // Display position yang benar
  const displayPosition = isSliding ? slidingValue : position;
  // --- UI RENDER ---
  return (
    <View style={styles.container}>
      {/* BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill}>
        <ExpoImage source={{ uri: displayImage }} style={styles.backgroundVideo} blurRadius={30} />
       {videoSource && videoReady && (
          <VideoView
            key={videoSource} 
            player={videoPlayer}
            style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            contentFit="cover"
          />
        )}
      </View>

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)", "#000"]} style={styles.bottomGradient} />

      <ScrollView style={styles.overlay} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Entypo name="chevron-thin-down" size={24} color="white" /></TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.playingFrom}>Now Playing</Text>
            <Text style={styles.judul} numberOfLines={1}>{title}</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuVisible(true)}><Entypo name="dots-three-vertical" size={20} color="white" /></TouchableOpacity>
        </View>

        {/* Song Info */}
        <View style={styles.content}>
          <ExpoImage source={{ uri: displayImage }} style={styles.albumArt} />
          <View style={styles.songInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.songTitle} numberOfLines={1}>{title}</Text>
              <Text style={styles.artistText}>{artist}</Text>
            </View>
            <TouchableOpacity onPress={handleToggleLike}>
              <AntDesign name={isLiked ? "heart" : "hearto"} size={26} color={isLiked ? "#2CA58D" : "white"} />
            </TouchableOpacity>
          </View>

          {/* Player Controls */}
        <Slider
            style={{ width: "100%", height: 40 }}
            value={displayPosition}
            minimumValue={0}
            maximumValue={duration || 1}
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSliderComplete}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#555"
            thumbTintColor="#fff"
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleShuffle}><Ionicons name="shuffle" size={26} color={isShuffle ? "#1DB954" : "#999"} /></TouchableOpacity>
            <TouchableOpacity onPress={handlePrev}><Feather name="skip-back" size={30} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={playPause} style={styles.playButtonMain}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}><Feather name="skip-forward" size={30} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={toggleRepeat}><Feather name="repeat" size={26} color={repeatMode !== "off" ? "#1DB954" : "#999"} /></TouchableOpacity>
          </View>
        </View>

    
        {/* Lyrics Section */}
       <View style={styles.lyricsCard}>
          {/* Lyrics Header */}
          <View style={styles.lyricsHeader}>
            <View style={styles.iconCircle1}>
              <TouchableOpacity onPress={() => { setShareSource("lyrics"); setTimeout(() => setShareVisible(true), 200); }}>
                <Feather name="share-2" size={18} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.lyricsTitle}>Lyrics</Text>
            <View style={styles.iconCircle1}>
              <AntDesign name="arrowsalt" size={18} color="#666" />
            </View>
          </View>

          {/* Inner rectangle untuk text lirik */}
          <View style={styles.innerLyricsBox}>
            {lyricsLoading ? (
              <ActivityIndicator size="small" color="#1DB954" style={{ marginVertical: 20 }} />
            ) : lyricsError ? (
              <Text style={styles.lyricsError}>{lyricsError}</Text>
            ) : (
              <ScrollView 
                style={styles.lyricsScroll} 
                nestedScrollEnabled={true} 
                showsVerticalScrollIndicator={false}
              >
                {lyrics.map((line, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.lyricsLine,
                      index <= highlightedIndex ? styles.highlightedLyrics : styles.normalLyrics,
                    ]}
                  >
                    {line}
                  </Text>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
       

        {/* Artist About Card */}
      <View style={styles.artistCard}>
            <Text style={styles.artistTitle}>About the artist</Text>
            <TouchableOpacity>
              <ExpoImage
                source={image ? { uri: displayImage } : require("../../assets/images/images.webp")}
                style={styles.artistImage}
              />
            </TouchableOpacity>

            <View style={styles.artistInfoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.artistNameText}>{artist || "Unknown Artist"}</Text>
                <Text style={styles.artistListeners}>
                  {monthly_listeners ? `${Number(monthly_listeners).toLocaleString()} monthly listeners` : "— monthly listeners"}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  router.push({
                    pathname: "/ArtistProfile",
                    params: {
                      artistName: artist, 
                      artistImage: encodeURIComponent(displayImage), 
                      monthlyListeners: monthly_listeners ? monthly_listeners.toLocaleString() : "125,943",
                      description: artistDescription || "Biography not available." 
                    }
                  });
                }}
                style={styles.followButton}
              >
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.artistDesc} numberOfLines={3}>
              {artistDescription ?? "Artist description is not available."} <Text style={styles.seeMore}>See more</Text>
            </Text>
          </View>

        </ScrollView>

   {/* --- Modal Menu Bottom Sheet --- */}
    <Modal
      visible={isMenuVisible}
      transparent
      animationType="slide" 
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity
        style={styles.overlay1}
        activeOpacity={1}
        onPressOut={() => setMenuVisible(false)}
      >
        <View style={styles.modalContent}>
          {/* Item: Like */}
          <TouchableOpacity
            style={[styles.menuItem, isLikeLoading && { opacity: 0.5 }]}
            onPress={handleToggleLike}
            disabled={isLikeLoading}
          >
            {isLiked ? (
              <AntDesign name="heart" size={24} color="#2CA58D" />
            ) : (
              <FontAwesome5 name="heart" size={24} color="black" />
            )}
            <Text style={[styles.menuText, isLiked && { color: "#2CA58D" }]}>
              {isLiked ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>

          {/* Item: Hide Song */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
            <Feather name="minus-circle" size={24} color="black" />
            <Text style={styles.menuText}>Hide song</Text>
          </TouchableOpacity>

          {/* Item: Add to Playlist */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push({
                pathname: "/Addplaylist",
               params: { 
                trackId: id,
                type: "music" // ← tambah ini
              }
              });
            }}
          >
            <MaterialIcons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Add to playlist</Text>
          </TouchableOpacity>

          {/* Item: Share */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              setShareSource("menu");
              setTimeout(() => setShareVisible(true), 300);
            }}
          >
            <Octicons name="share" size={24} color="black" />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>

          {/* Item: Bookmark */}
          <TouchableOpacity
            style={[styles.menuItem, isBookmarking && { opacity: 0.5 }]}
            onPress={handleToggleBookmark}
            disabled={isBookmarking}
          >
            {isBookmarking ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <>
                {isBookmarked ? (
                  <MaterialIcons name="bookmark-remove" size={24} color="#1F7A67" />
                ) : (
                  <Feather name="bookmark" size={24} color="black" />
                )}
                <Text style={[styles.menuText, isBookmarked && { color: "#1F7A67" }]}>
                  {isBookmarked ? "Remove Bookmark" : "Bookmarks"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
      

      {/* MODALS */}
      <UnifiedShareModal visible={isShareVisible} setVisible={setShareVisible} source={shareSource} title={title as string} artist={artist as string} image={displayImage} lyrics={lyrics} />
    </View>
  );
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backgroundVideo: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  bottomGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: "100%" },
  overlay: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50, marginBottom: 20 },
  judul: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  playingFrom: { color: "#999", fontSize: 10, textTransform: 'uppercase' },
  content: { marginTop: 20, alignItems: 'center' },
  albumArt: { width: 320, height: 320, borderRadius: 15, marginBottom: 30 },
  songInfoRow: { flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: 20 },
  songTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  artistText: { color: '#bbb', fontSize: 16 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  timeText: { color: '#999', fontSize: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: 20 },
  playButtonMain: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2CA58D', justifyContent: 'center', alignItems: 'center' },
 lyricsCard: { 
    marginTop: 20, 
    width: '100%', 
    borderRadius: 25, 
    overflow: 'hidden',
    backgroundColor: "#12F0C4",
    paddingTop: 7, 
  },
 innerLyricsBox: {
    backgroundColor: "#00A384", 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 120, 
    width: '100%',
  },
  lyricsTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  lyricsLine: { color: '#fff', fontSize: 16, marginBottom: 8, opacity: 0.8 },
  artistCard: { marginTop: 40, backgroundColor: '#12F0C4', borderRadius: 20, padding: 20, marginBottom: 50 },
  artistTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  artistImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  artistNameText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  artistDesc: { color: '#bbb', fontSize: 14, lineHeight: 20 },
   overlay1: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    minHeight: 300, 
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
    color: "#333",
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
artistListeners: {
  color: "#cceee8",
  fontSize: 13,
  marginBottom: 12,
},
artistInfoRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
},
seeMore: {
  color: "#eee",
  fontWeight: "600",
},


lyricsScroll: {
  flex: 1,
},
highlightedLyrics: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
normalLyrics: {
  color: "rgba(28, 228, 38, 0.78)",
  fontSize: 16,
  marginBottom: 10,
},
iconCircle1: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
},
 lyricsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, 
    paddingHorizontal: 15, 
  },
 lyricsError: {
    textAlign: "center",
    color: "#ff4d4f",
    marginTop: 20,
  },

});