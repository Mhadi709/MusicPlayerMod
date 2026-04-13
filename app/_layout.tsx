import { Stack, useRouter, useSegments } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import CustomSplashScreen from "./(onboarding)/splash";
import { PlayerProvider } from "@/context/PlayerContext";
import { Audio } from 'expo-av';
import { AlertProvider } from "@/context/AlertContext";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { PlaylistProvider } from "@/context/PlaylistContext";
ExpoSplashScreen.preventAutoHideAsync();

// --- BAGIAN 1: LOGIKA NAVIGASI (Yang menggunakan data Context) ---
function RootNavigation() {
  const { user, isAppReady } = useAuthContext();
  const [splashFinished, setSplashFinished] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah ada user & app ready, langsung skip splash
    if (isAppReady && user) {
      setSplashFinished(true);
      return;
    }

    // Hanya tampilkan splash timer untuk user baru / belum login
    if (isAppReady && !user) {
      const timer = setTimeout(() => {
        setSplashFinished(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAppReady, user]);

useEffect(() => {
  if (!isAppReady || !splashFinished) return;

  const inAuthGroup = segments[0] === "(auth)";
  const inOnboardingGroup = segments[0] === "(onboarding)";
  const inDrawerGroup = segments[0] === "(drawer)";
  const isVerified = user?.is_verified === true || user?.phone;
  const isSetupDone = user?.setup_complete === true;

  if (user) {
    if (isVerified && isSetupDone && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(drawer)/(tabs)/homepage");
    }
    // ← Hapus else if ini — ini yang menyebabkan stuck di homepage
    // } else if (isVerified && isSetupDone) {
    //   router.replace("/(drawer)/(tabs)/homepage");
    // }
  } else {
    if (!inAuthGroup && !inOnboardingGroup) {
      router.replace("/(onboarding)/welcome");
    }
  }

  ExpoSplashScreen.hideAsync().catch(() => {});
}, [user, isAppReady, splashFinished, segments]);

  // Tampilkan splash hanya saat belum ready ATAU user baru (belum login)
  if (!isAppReady || !splashFinished) {
    return <CustomSplashScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <Toast config={toastConfig} position="bottom" bottomOffset={100} />
    </>
  );
}

// --- BAGIAN 2: WRAPPER UTAMA (Penyedia data / Provider) ---
export default function RootLayout() {
  useEffect(() => {
    return () => {
      Audio.setAudioModeAsync({ staysActiveInBackground: false });
    };
  }, []);

 return (
  <AuthProvider>
    <AlertProvider>
      <PlayerProvider>
        <PlaylistProvider> 
          <RootNavigation /> 
        </PlaylistProvider>
      </PlayerProvider>
    </AlertProvider>
  </AuthProvider>
);
}

  // Config Toast 
  const toastConfig = {
    myToast: ({ text1 }: any) => (
      <View style={styles.toastContainer}>
        <MaterialIcons name="bookmark-add" size={26} color="white" style={{ marginRight: 8,alignSelf: "center" }} />
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    myunit: ({ text1 }: any) => (
      <View style={styles.toastContainerAlt}>
        <MaterialIcons name="favorite" size={26} color="#CC087D" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    copyToast: ({ text1 }: any) => (
      <View style={styles.toastSimple}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    //snackbar popup
    snackWarning: ({ text1, props }: any) => (
    <View style={styles.snackWarning}>
      <Ionicons name="warning-outline" size={20} color="white" style={{ marginRight: 8 }} />
      <Text style={styles.snackText} numberOfLines={2}>{text1}</Text>
      {props?.actionText && (
        <TouchableOpacity onPress={props.onAction} style={styles.snackAction}>
          <Text style={styles.snackActionText}>{props.actionText}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => Toast.hide()} style={{ marginLeft: 8 }}>
        <AntDesign name="close" size={16} color="white" />
      </TouchableOpacity>
    </View>
  ),

  snackError: ({ text1, props }: any) => (
    <View style={styles.snackError}>
      <Ionicons name="alert-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
      <Text style={styles.snackText} numberOfLines={2}>{text1}</Text>
      {props?.actionText && (
        <TouchableOpacity onPress={props.onAction} style={styles.snackAction}>
          <Text style={styles.snackActionText}>{props.actionText}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => Toast.hide()} style={{ marginLeft: 8 }}>
        <AntDesign name="close" size={16} color="white" />
      </TouchableOpacity>
    </View>
  ),

  snackInfo: ({ text1 }: any) => (
  <View style={styles.snackInfo}>
    <Ionicons name="information-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
    <Text style={styles.snackText} numberOfLines={2}>{text1}</Text>
    <TouchableOpacity onPress={() => Toast.hide()} style={{ marginLeft: 8 }}>
      <AntDesign name="close" size={16} color="white" />
    </TouchableOpacity>
  </View>
),
  };


const styles = StyleSheet.create({
    toastContainer: { flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2CA58D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,       
    position: 'absolute',      
    bottom: 80,                
    alignSelf: 'center',       
    minWidth: 140,             
     },
    toastContainerAlt: { width: "50%", backgroundColor: "#2CA58D", padding: 12, borderRadius: 16, alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "center" },
    toastSimple: { width: "50%", backgroundColor: "#2CA58D", padding: 12, borderRadius: 16, alignSelf: "center", alignItems: "center", justifyContent: "center" },
    toastText: { color: "white", fontWeight: "bold", fontSize: 16 },

    snackWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    minHeight: 52,
},
snackError: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EF4444',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginHorizontal: 16,
  minHeight: 52,
},
snackText: {
  color: 'white',
  fontWeight: '600',
  fontSize: 14,
  flex: 1,
},
snackAction: {
  marginLeft: 12,
  paddingHorizontal: 8,
},
snackActionText: {
  color: 'white',
  fontWeight: '800',
  fontSize: 14,
  textDecorationLine: 'underline',
},
snackInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3B82F6',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginHorizontal: 16,
  minHeight: 52,
},
});