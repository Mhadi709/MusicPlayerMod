import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export function ShimmerHorizontalCard() {
  return (
    <View style={styles.card}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.image}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
  },
  text: {
    width: 100,
    height: 14,
    borderRadius: 8,
  },
});
