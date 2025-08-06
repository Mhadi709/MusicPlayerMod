// app/_layout.tsx (DIMODIFIKASI UNTUK DEVELOPMENT "CHOOSE ARTISTS")
import { Stack } from 'expo-router';

// Kita tidak lagi memerlukan hook atau komponen lain untuk sementara
// import * as ExpoSplashScreen from 'expo-splash-screen';
// import { useEffect, useState } from 'react';
// import SplashScreen from './splash';

export default function RootLayout() {
  // Semua logika untuk splash screen kita hapus/komentari untuk sementara
  // agar bisa langsung menuju ke layar yang kita inginkan.

  return (
    <Stack>
      {/*
        ==================================================================
        JADIKAN LAYAR INI SATU-SATUNYA ATAU YANG PERTAMA
        Ini memberitahu Expo Router untuk langsung menjalankan layar ini.
        ==================================================================
      */}
      <Stack.Screen name="choose-artists" options={{ headerShown: false }} />

      {/*
        Rute-rute lain bisa dihapus atau dikomentari untuk kebersihan
        selama Anda fokus pada satu halaman ini.
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} /> 
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      */}
    </Stack>
  );
}