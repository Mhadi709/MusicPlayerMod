// Lokasi: app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Daftarkan layar yang ada di folder ini */}
      <Stack.Screen name="intro" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="OnboardingScreen1" />
      <Stack.Screen name="OnboardingScreen2" />
      <Stack.Screen name="splash" />
    </Stack>
  );
}