import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Animated, ActivityIndicator, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import { AntDesign, Entypo, Feather, FontAwesome5, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { searchPexelsVideos } from "@/services/pexels.api";
import { searchPodcasts } from "@/services/taddy";
import UnifiedShareModal from "@/components/common/UnifiedShareModal";
import { usePlayer } from "@/context/PlayerContext";
import { toggleBookmarkApi, toggleFavoriteApi } from "@/services/auth.api"; 
import { useAuth } from "@/hooks/useAuth";

export default function NowPlayingPodcastScreen() {
  const params = useLocalSearchParams();
  const { uuid, title, description, audioUrl, imageUrl, seriesName } = params;
  const { user } = useAuth();
  const { isPlaying, position, duration, playPause, handleNext, handlePrev, seekTo, setTrack, repeatMode, toggleRepeat, toggleShuffle, isShuffle } = usePlayer();

  const isMounted = useRef(true);
  const hasLoadedRef = useRef<string | null>(null);
  
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [relatedEpisodes, setRelatedEpisodes] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);
  const [isShareVisible, setShareVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // --- 1. DATA PREPARATION ---
const displayImage = useMemo(() => {
  if (!imageUrl) return "https://via.placeholder.com/300";
  const decoded = decodeURIComponent(imageUrl as string);
  // Tambah resize parameter
  if (decoded.includes('?')) return `${decoded}&w=300&h=300`;
  return `${decoded}?w=300&h=300`;
}, [uuid]);

  const displayAudio = useMemo(() => audioUrl ? decodeURIComponent(audioUrl as string) : null, [uuid]);
  const displayTitle = useMemo(() => title ? decodeURIComponent(title as string) : "Podcast", [uuid]);
  const cleanDescription = useMemo(() => description ? decodeURIComponent(description as string).replace(/<[^>]*>?/gm, '') : "No description", [uuid]);

  function generateFakeListeners(name: any) {
    if (!name || typeof name !== 'string') return 50000;
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return Math.abs(hash % 10000000) + 50000;
  }
  const listeners = useMemo(() => generateFakeListeners(seriesName), [seriesName]);

  const handleSliderChange = (val: number) => { setIsSliding(true); setSlidingValue(val); };
  const handleSliderComplete = async (val: number) => { await seekTo(val); setIsSliding(false); };
  const displayPosition = isSliding ? slidingValue : position;

  // --- 2. SEQUENTIAL LOADING EFFECT (AUDIO -> VIDEO) ---
  useEffect(() => {
    isMounted.current = true;
    if (!displayAudio || displayAudio === "undefined" || hasLoadedRef.current === displayAudio) return;

    const startLoading = async () => {
      hasLoadedRef.current = displayAudio;
      // Load Audio Dulu
      await setTrack({ title: displayTitle, artist: (seriesName as string) || "Podcast", image: displayImage, audio: displayAudio });

      // Beri jeda 1.5 detik baru load video & data berat biar gak crash RAM
      setTimeout(() => {
        if (isMounted.current) loadExtraData();
      }, 2500); 
    };

    startLoading();
   return () => {
  isMounted.current = false;
      ExpoImage.clearMemoryCache?.();
      setVideoSource(null);
      setVideoReady(false);
    };
  }, [uuid, displayAudio]);

  const loadExtraData = async () => {
    setVideoSource(null); setVideoReady(false); setLoadingRelated(true);
      try {
        const vids = await searchPexelsVideos("podcast microphone", 1);
        const videoFiles = vids?.[0]?.video_files;
        if (videoFiles && isMounted.current) {
          const lowest = videoFiles
            .filter((v: any) => v.width <= 480)
            .sort((a: any, b: any) => a.width - b.width)[0];
          if (lowest?.link) {
            setVideoSource(lowest.link);
            setVideoReady(true);
          }
        }
      } catch (e) {}
    try {
      const result = await searchPodcasts(seriesName as string || "podcast");
      if (result?.podcastEpisodes && isMounted.current) setRelatedEpisodes(result.podcastEpisodes.slice(0, 3));
    } catch (e) {} finally { if (isMounted.current) setLoadingRelated(false); }
  };

  const videoPlayer = useVideoPlayer(videoSource || "", (player) => {
    if (videoSource && videoReady) { player.loop = true; player.muted = true; player.play(); }
  });

  // --- 3. HANDLERS ---
  const handleToggleLike = async () => {
    if (!user?.id) return ;
    try {
      setIsLikeLoading(true);
      await toggleFavoriteApi({ userId: user.id, songId: uuid as string, title: displayTitle, artist: seriesName as string, image: displayImage, audio: displayAudio || "" });
      setIsLiked(!isLiked);
    } catch (e) {} finally { setIsLikeLoading(false); setMenuVisible(false); }
  };

  const handleToggleBookmark = async () => {
    if (!user?.id) return ;
    try {
      setIsBookmarking(true);
      await toggleBookmarkApi({ userId: user.id, itemId: uuid as string, title: displayTitle, artist: seriesName as string, image: displayImage, type: "podcast" });
      setIsBookmarked(!isBookmarked);
    } catch (e) {} finally { setIsBookmarking(false); setMenuVisible(false); }
  };

  if (!uuid) return <View style={{flex:1, backgroundColor:'#000'}} />;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={StyleSheet.absoluteFill}>
         <ExpoImage 
            source={{ uri: displayImage }} 
            style={styles.backgroundVideo} 
            blurRadius={10} 
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
     
        {videoSource && videoReady && (
          <VideoView key={videoSource} player={videoPlayer} style={[StyleSheet.absoluteFill, { opacity: 0.4 }]} contentFit="cover" />
        )}
      </View>
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)", "#000"]} style={styles.gradient} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Entypo name="chevron-thin-down" size={24} color="white" /></TouchableOpacity>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.playingFrom}>PODCAST</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{seriesName}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}><Entypo name="dots-three-vertical" size={20} color="white" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.playerSection}>
          <ExpoImage source={{ uri: displayImage }} style={styles.albumArt} />
          <Text style={styles.episodeTitle} numberOfLines={2}>{displayTitle}</Text>
          <Text style={styles.seriesTitle}>{seriesName}</Text>
          <Slider style={{ width: "100%", height: 40, marginTop: 20 }} value={displayPosition} minimumValue={0} maximumValue={duration || 1} onValueChange={handleSliderChange} onSlidingComplete={handleSliderComplete} minimumTrackTintColor="#12D18E" thumbTintColor="#fff" />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.controls}>
             <TouchableOpacity onPress={toggleShuffle}><MaterialIcons name="shuffle" size={24} color={isShuffle ? "#12D18E" : "white"} /></TouchableOpacity>
             <TouchableOpacity onPress={handlePrev}><MaterialIcons name="skip-previous" size={40} color="white" /></TouchableOpacity>
             <TouchableOpacity onPress={playPause} style={styles.playButton}><Ionicons name={isPlaying ? "pause" : "play"} size={35} color="white" /></TouchableOpacity>
             <TouchableOpacity onPress={handleNext}><MaterialIcons name="skip-next" size={40} color="white" /></TouchableOpacity>
             <TouchableOpacity onPress={toggleRepeat}><MaterialIcons name={repeatMode !== "off" ? "repeat-one" : "repeat"} size={24} color={repeatMode !== "off" ? "#12D18E" : "white"} /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.tealCard}>
          <Text style={styles.cardTitle}>Tentang Episode</Text>
          <Text style={styles.cardText} numberOfLines={4}>{cleanDescription}</Text>
        </View>

        <View style={styles.tealCard}>
          <Text style={styles.cardTitle}>Tentang Podcast</Text>
          <Text style={styles.artistNameLarge}>{seriesName}</Text>
          <Text style={styles.monthlyListeners}>{listeners.toLocaleString()} monthly listeners</Text>
        </View>

        <View style={styles.tealCard}>
           <Text style={[styles.cardTitle, {marginBottom: 15}]}>Episode Terkait</Text>
           {loadingRelated ? <ActivityIndicator color="white" /> : (
             <View style={styles.relatedRow}>
                {relatedEpisodes.map((ep, idx) => (
                  <TouchableOpacity key={idx}><ExpoImage source={{ uri: ep.imageUrl }} style={styles.relatedImage} /></TouchableOpacity>
                ))}
             </View>
           )}
        </View>
      </ScrollView>

      <Modal visible={isMenuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.overlay1} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleToggleLike}>
              <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "#12D18E" : "black"} />
              <Text style={styles.menuText}>{isLiked ? "Liked" : "Like"}</Text>
            </TouchableOpacity>
           <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            router.push({
              pathname: "/Addplaylist",
             params: { 
                trackId: uuid as string,
                type: "podcast" 
              }
            });
          }}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="black" />
          <Text style={styles.menuText}>Add to playlist</Text>
        </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleToggleBookmark}>
              <MaterialIcons name={isBookmarked ? "bookmark-remove" : "bookmark"} size={24} color={isBookmarked ? "#12D18E" : "black"} />
              <Text style={styles.menuText}>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backgroundVideo: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  gradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: "100%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50, paddingHorizontal: 20 },
  playingFrom: { color: "#999", fontSize: 10, fontWeight: 'bold' },
  headerTitle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  playerSection: { alignItems: 'center', marginTop: 20 },
  albumArt: { width: 300, height: 300, borderRadius: 15, marginBottom: 25 },
  episodeTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: 'center', paddingHorizontal: 10 },
  seriesTitle: { color: "#12D18E", fontSize: 16, marginTop: 5 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5 },
  timeText: { color: '#999', fontSize: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginTop: 20 },
  playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#12D18E', justifyContent: 'center', alignItems: 'center' },
  tealCard: { backgroundColor: 'rgba(18, 209, 142, 0.15)', borderRadius: 20, padding: 20, marginTop: 25 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardText: { color: '#ddd', fontSize: 14, lineHeight: 20 },
  artistNameLarge: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  monthlyListeners: { color: '#999', fontSize: 14, marginVertical: 5 },
  relatedRow: { flexDirection: 'row', gap: 10 },
  relatedImage: { width: 80, height: 80, borderRadius: 10 },
  overlay1: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingVertical: 25, paddingHorizontal: 20, minHeight: 150 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  menuText: { fontSize: 16, marginLeft: 15, color: "#333" },
});