import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type Props = {
  variant?: "horizontal" | "vertical";
};

export default function ShimmerPodcast({ variant = "horizontal" }: Props) {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const ShimmerBox = ({ w, h, style }: any) => (
    <View style={[styles.box, { width: w, height: h }, style]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={["#1c1c1c", "#2f2f2f", "#1c1c1c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );

  // 🔹 HORIZONTAL PODCAST CARD
  if (variant === "horizontal") {
    return (
      <View style={{ marginRight: 15 }}>
        <ShimmerBox w={111} h={139} style={{ borderRadius: 25 }} />
      </View>
    );
  }

  // 🔹 VERTICAL / RECOMMENDED PODCAST
  return (
    <View style={styles.vertical}>
      <ShimmerBox w={70} h={70} style={{ borderRadius: 15 }} />

      <View style={{ marginLeft: 15 }}>
        <ShimmerBox w={180} h={16} />
        <ShimmerBox w={120} h={12} style={{ marginTop: 6 }} />
        <ShimmerBox w={200} h={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#1c1c1c",
    overflow: "hidden",
  },
  vertical: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 19,
    height: 120,
    borderRadius: 20,
  },
});
