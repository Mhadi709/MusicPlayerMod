// app/_layout.tsx
import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlexAlignType } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import SplashScreen from "./splash";

//  Pastikan splash screen tidak langsung hilang
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashFinished, setSplashFinished] = useState(false);

  //  Sembunyikan splash bawaan Expo
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  //  Jalankan animasi splash selama 6 detik sebelum lanjut
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  //  Jika splash belum selesai, tampilkan animasi
  if (!splashFinished) {
    return <SplashScreen />;
  }

  //  Konfigurasi custom Toast
  const toastConfig = {
    myToast: ({ text1 }: any) => (
      <View style={styles.toastContainer}>
        <MaterialIcons
          name="bookmark-add"
          size={26}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),

    myunit: ({ text1 }: any) => (
      <View style={styles.toastContainerAlt}>
        <MaterialIcons
          name="favorite"
          size={26}
          color="#CC087D"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),

    copyToast: ({ text1 }: any) => (
      <View style={styles.toastSimple}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  //  Return utama (Stack + Toast)
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
        <Stack.Screen name="MusicDetailScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="choose-artists" options={{ headerShown: false }} />
      </Stack>

      {/*  Letakkan Toast di paling bawah */}
      <Toast config={toastConfig} position="bottom" bottomOffset={150} />
    </>
  );
}

//  StyleSheet rapi & kompatibel dengan TypeScript
const styles = StyleSheet.create({
  toastContainer: {
    width: "50%",
    backgroundColor: "#2CA58D",
    padding: 12,
    borderRadius: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center" as FlexAlignType,
    justifyContent: "center",
  },
  toastContainerAlt: {
    width: "50%",
    backgroundColor: "#2CA58D",
    padding: 12,
    borderRadius: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center" as FlexAlignType,
    justifyContent: "center",
  },
  toastSimple: {
    width: "50%",
    backgroundColor: "#2CA58D",
    padding: 12,
    borderRadius: 16,
    alignSelf: "center",
    alignItems: "center" as FlexAlignType,
    justifyContent: "center",
  },
  toastText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
