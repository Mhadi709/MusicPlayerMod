import 'dotenv/config';

export default {
  expo: {
    name: "Caroline",
    slug: "musicplayerfixed",
    owner: "aldianakbar",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Logo Mobile Apps.png",
    scheme: "com.anonymous.musicplayerfixed",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/Logo Mobile Apps.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.musicplayerfixed"
    },
   plugins: [
      "@react-native-google-signin/google-signin",
      [
        "expo-image",
        {
          "cachePolicy": "memory-disk"
        }
      ]
    ],
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.anonymous.musicplayerfixed",
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: "pan", 
      largeHeap: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/Logo Mobile Apps.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
      package: "com.anonymous.musicplayerfixed",
    },
    plugins: [
      
      "expo-router",
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
    ],
    
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "2f598bcd-1177-4762-a88d-0e6f124f5ee2", // Ini aman tetap di sini
      },
      // Bagian JAMENDO, PEXELS, dll bisa dihapus dari sini 
      // karena sudah otomatis terbaca lewat process.env di file lain
    },
  },
};