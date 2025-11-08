import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";

const MiniPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const totalDuration = 244; // detik (4:04)

  // Format waktu ke menit:detik
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const currentTime = (progress / 100) * totalDuration;

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={["#0B3129", "#219780"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}

      >
        {/* Album dan Info */}
        <View style={styles.row}>
          <Image
            source={require("../assets/images/Justin Bieber.jpg")}
            style={styles.albumArt}
          />

          <View style={styles.info}>
            <Text style={styles.title}>Don't Forget Your Roots - 2021</Text>
            <Text style={styles.artist}>Six60</Text>
          </View>

          {/* Kontrol */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={handlePlayPause}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={22}
                color="#fff"
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>

            <Feather
              name="heart"
              size={20}
              color="#fff"
              style={{ marginHorizontal: 6 }}
            />
            <Ionicons
              name="volume-high"
              size={20}
              color="#fff"
              style={{ marginHorizontal: 6 }}
            />
          </View>
        </View>

        {/* Progress bar + waktu */}
<View style={styles.progressContainer}>
  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

  <Slider
    style={{ flex: 1, height: 40 }}
    minimumValue={0}
    maximumValue={100}
    value={progress}
    onValueChange={(val) => setProgress(val)}
    onSlidingStart={() => console.log("Mulai geser")}
    onSlidingComplete={(val) => console.log("Geser selesai:", val)}
    minimumTrackTintColor="#fff"
    maximumTrackTintColor="rgba(255,255,255,0.3)"
    thumbTintColor="#fff"
    collapsable={false}
  />

  <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
  </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 110, // jarak dari navbar
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99,
    elevation: 10,
  },
  container: {
    width: "88%",
    borderRadius: 16,
    paddingVertical: 8, // ⬅️ lebih kecil dari 12
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
    width: 40, // ⬅️ dari 45 jadi lebih kecil
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  info: {
    flex: 1,
  },
 title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14, // ⬅️ font lebih kecil
  },
  artist: {
    color: "#cce6e3",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
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
