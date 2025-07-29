// app/_layout.tsx (FINAL & PASTI MENAMPILKAN SPLASH KUSTOM)
import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import SplashScreen from './splash';

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  // Sembunyikan native splash screen secepat mungkin
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  // Jika Anda ingin splash kustom punya "durasi"
  useEffect(() => {
    setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 6000); // Tampilkan splash kustom selama 2 detik
  }, []);

  if (!splashAnimationFinished) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} /> 
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}