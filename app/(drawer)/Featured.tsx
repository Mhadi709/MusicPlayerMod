import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Animated, Dimensions, StatusBar,
  Platform, FlatList
} from "react-native";
import { Feather, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MenuButton from "@/components/common/MenuButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { searchPexelsVideos } from "@/services/pexels.api";
import { getMusicList } from "@/services/music.api";
import ShimmerVideoCard from "@/components/loading/ShimmerVideoCard";

const { height: SCREEN_H } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_H * 0.78;

// ─── SHIMMER LOADING LIST ─────────────────────────────────────────────────────
function ShimmerList() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {[1, 2].map((i) => (
        <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <ShimmerVideoCard />
        </View>
      ))}
    </View>
  );
}

// ─── OPTIMIZED VIDEO CARD ─────────────────────────────────────────────────────
const VideoCard = React.memo(
  ({ item, isVisible }: { item: any; isVisible: boolean }) => {
    const player = useVideoPlayer(isVisible ? item.videoUrl : null, (p) => {
      p.loop = true;
      p.muted = true;
    });

    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      if (!player) return;
      if (isVisible) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }, [isVisible, player]);

    const barAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.3))).current;

    useEffect(() => {
      if (!isVisible) {
        barAnims.forEach(a => a.setValue(0.3));
        return;
      }
      const animations = barAnims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 0.9, duration: 300 + i * 80, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.2, duration: 300 + i * 80, useNativeDriver: true }),
          ])
        )
      );
      animations.forEach(a => a.start());
      return () => animations.forEach(a => a.stop());
    }, [isVisible]);

    const toggleMute = () => {
      if (!player) return;
      player.muted = !isMuted;
      setIsMuted(!isMuted);
    };

    const togglePlay = () => {
      if (!player) return;
      if (isPlaying) { player.pause(); setIsPlaying(false); }
      else { player.play(); setIsPlaying(true); }
    };

    return (
      <View style={styles.cardContainer}>
        <View style={styles.videoCard}>
          {/* White base layer */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "#ffffff" }]} />

          {/* Video or thumbnail */}
          {isVisible && player ? (
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              nativeControls={false}
              contentFit="cover"
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              style={[StyleSheet.absoluteFill, { resizeMode: "cover" }]}
            />
          )}

          {/* Dark overlay */}
          <View style={styles.darkOverlay} />

          {/* UI Layer */}
          <View style={styles.uiLayer}>
            {/* TOP */}
            <View style={styles.topRow}>
              <View style={styles.profileRow}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.profileName}>Hey {item.artist_name},</Text>
                  <Text style={styles.profileSub}>Ready to Jam?</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playBtnSmall} onPress={togglePlay}>
                <FontAwesome6 name={isPlaying ? "pause" : "play"} size={14} color="#1C274C" />
              </TouchableOpacity>
            </View>

            {/* CENTER */}
            <View style={styles.centerInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.videoMeta}>
                {item.release_year || "2024"} • {item.total_tracks || "13"} songs
              </Text>
            </View>

            {/* BOTTOM */}
            <View style={styles.bottomRow}>
              <TouchableOpacity>
                <MaterialIcons name="repeat" size={24} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="random" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playBtnCenter} onPress={togglePlay}>
                <FontAwesome6 name={isPlaying ? "pause" : "play"} size={22} color="#1C274C" />
              </TouchableOpacity>
              <View style={styles.barsContainer}>
                {barAnims.map((anim, i) => (
                  <Animated.View key={i} style={[styles.bar, { transform: [{ scaleY: anim }] }]} />
                ))}
              </View>
              <TouchableOpacity onPress={toggleMute}>
                <Feather name={isMuted ? "volume-x" : "volume-2"} size={22} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  },
  (prev, next) => prev.isVisible === next.isVisible && prev.item.id === next.item.id
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function Featured() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleId, setVisibleId] = useState<string | null>(null);

  useEffect(() => { loadContent(); }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [tracks, videos] = await Promise.all([
        getMusicList(10),
        // Fetch 3 query berbeda → video tiap card bervariasi
        Promise.all([
          searchPexelsVideos("music concert", 4),
          searchPexelsVideos("abstract neon", 3),
          searchPexelsVideos("dance performance", 3),
        ]).then(results => results.flat()),
      ]);

      const merged = tracks
        .map((track: any, i: number) => ({
          ...track,
          videoUrl:
            videos[i % videos.length]?.video_files
              ?.filter((v: any) => v.width <= 720)
              ?.sort((a: any, b: any) => b.width - a.width)[0]?.link || "",
        }))
        .filter((item: any) => item.videoUrl);

      setData(merged);
      if (merged.length > 0) setVisibleId(merged[0].id);
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setVisibleId(viewableItems[0].item.id);
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <MenuButton />
          <Text style={styles.headerTitle}>Featured</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color="#1d1e1f" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search" size={22} color="#1d1e1f" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shimmer saat loading */}
        {loading ? (
          <ShimmerList />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VideoCard item={item} isVisible={item.id === visibleId} />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            snapToInterval={CARD_HEIGHT + 20}
            snapToAlignment="center"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === "android"}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={3}
            getItemLayout={(_, index) => ({
              length: CARD_HEIGHT + 20,
              offset: (CARD_HEIGHT + 20) * index,
              index,
            })}
            style={{ backgroundColor: "#fff" }}
            contentContainerStyle={{ backgroundColor: "#fff" }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1d1e1f", marginLeft: 12, flex: 1 },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center",
  },

  // ← backgroundColor putih di cardContainer dan videoCard
  cardContainer: {
    height: CARD_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  videoCard: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  uiLayer: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "space-between",
  },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: "#fff" },
  profileName: { color: "#fff", fontWeight: "700", fontSize: 14 },
  profileSub: { color: "rgba(255,255,255,0.65)", fontSize: 11 },
  playBtnSmall: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },

  centerInfo: { alignItems: "center" },
  videoTitle: {
    color: "#fff", fontSize: 28, fontWeight: "900",
    textAlign: "center", lineHeight: 34,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  videoMeta: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600", marginTop: 6 },

  bottomRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 8,
  },
  playBtnCenter: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.45)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)",
  },
  barsContainer: {
    flexDirection: "row", alignItems: "center",
    height: 32, width: 32, justifyContent: "center", gap: 2,
  },
  bar: { width: 3, height: 24, backgroundColor: "#fff", borderRadius: 2 },
});