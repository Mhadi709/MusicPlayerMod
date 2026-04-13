import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { usePlayer } from "@/context/PlayerContext";

const MiniPlayer = () => {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    playPause,
    seekTo,
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#0B3129", "#219780"]}
        style={styles.container}
      >
        <View style={styles.row}>
         
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/NowPlayingScreen")}
          >
            <Image
              source={{ uri: currentTrack.image }}
              style={styles.albumArt}
            />
          </TouchableOpacity>

          {/* INFO */}
          <TouchableOpacity
            style={styles.info}
            onPress={() => router.replace("/(drawer)/NowPlayingScreen")}
          >
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </TouchableOpacity>

          {/* KONTROL */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPause}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>

            <Feather name="heart" size={18} color="#fff" />
            <Ionicons name="volume-high" size={18} color="#fff" />
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>

          <Slider
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#fff"
          />

          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 110, 
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99,
    elevation: 10,
  },
  container: {
    width: "88%",
    borderRadius: 16,
    paddingVertical: 8, 
    paddingHorizontal: 10,
    shadowColor: "#000",
    backgroundColor: "rgba(0,255,0,0.3)",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  albumArt: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  info: {
  flex: 1,
  marginRight: 8,
},
title: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
},
artist: {
  color: "#cce6e3",
  fontSize: 12,
},

controls: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

  progressContainer: {
  flexDirection: "row",
  alignItems: "center",
  width: "90%",
  alignSelf: "center",
  marginTop: 4,
  zIndex: 20,
},

  slider: {
    width: "100%",
    height: 25,
    zIndex: 100,
  },
  timeText: {
    color: "#cce6e3",
    fontSize: 12,
    marginHorizontal: 6,
  },
});

export default MiniPlayer;
