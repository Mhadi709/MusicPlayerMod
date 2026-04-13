import React from "react";
import { View, Text } from "react-native";
import Toast from "react-native-toast-message";
import NowPlayingScreen from "./app/(drawer)/NowPlayingScreen";

const toastConfig = {
  myToastt: ({ text1 }: any) => (
    <View
      style={{
        width: "90%",
        backgroundColor: "#2CA58D",
        padding: 15,
        borderRadius: 12,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
    </View>
  ),
};

export default function App() {
  console.log("🔥 App Rendered"); // ✅ log ditaruh di luar return, bukan di dalam JSX

  return (
    <>
      <NowPlayingScreen />

      {/* ✅ Toast harus di root */}
      <Toast config={toastConfig} position="bottom" bottomOffset={80} />
    </>
  );
}
