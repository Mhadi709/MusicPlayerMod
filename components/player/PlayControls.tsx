import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

interface PlayControlsProps {
  iconColor?: string;
  iconSize?: number;
}

const PlayControls: React.FC<PlayControlsProps> = ({
  iconColor = "#fff",
  iconSize = 22,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.controls}>
      {/* Tombol Play/Pause */}
      <TouchableOpacity onPress={handlePlayPause}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={iconSize}
          color={iconColor}
          style={{ marginHorizontal: 6 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PlayControls;
