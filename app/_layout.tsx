import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// ✅ Pastikan splash screen tidak langsung hilang
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (!splashAnimationFinished) {
    return <SplashScreen />;
  }

  // ✅ Konfigurasi custom Toast
  const toastConfig = {
    myToast: ({ text1 }: any) => (
      <View
        style={{
          width: "50%",
          backgroundColor: "#2CA58D",
          padding: 12,
          borderRadius: 16,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons
          name="bookmark-add"
          size={26}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {text1}
        </Text>
      </View>
    ),

    myunit: ({ text1 }: any) => (
      <View
        style={{
          width: "50%",
          backgroundColor: "#2CA58D",
          padding: 12,
          borderRadius: 16,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons
          name="favorite"
          size={26}
          color="#CC087D"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {text1}
        </Text>
      </View>
    ),

    copyToast: ({ text1 }: any) => (
      <View
        style={{
          width: "50%",
          backgroundColor: "#2CA58D",
          padding: 12,
          borderRadius: 16,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {text1}
        </Text>
      </View>
    ),
  };

  // ✅ Return utama
  return (
    <>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="NowPlayingScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Addplaylist" options={{ headerShown: false }} />
        <Stack.Screen name="ArtistProfile" options={{ headerShown: false }} />
        <Stack.Screen name="viewalbum" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="MusicDetailScreen" options={{ headerShown: false }}
/>

      </Stack>

      {/* ✅ Letakkan Toast di paling bawah */}
      <Toast config={toastConfig} position="bottom" bottomOffset={150} />
    </>
  );
}
