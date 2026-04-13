import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function ShimmerVideoCard() {
  return (
    <View style={styles.wrapper}>
      {/* Video */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.video}
      />

      {/* Overlay text */}
      <View style={styles.overlay}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.title}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.meta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: 240,
    borderRadius: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  title: {
    width: 160,
    height: 18,
    borderRadius: 8,
    marginBottom: 8,
  },
  meta: {
    width: 120,
    height: 14,
    borderRadius: 8,
  },
});
