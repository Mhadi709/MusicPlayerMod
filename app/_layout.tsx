import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 6000);
  }, []);

  if (!splashAnimationFinished) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} /> 
       <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
