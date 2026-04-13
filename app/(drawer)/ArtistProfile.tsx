import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ArtistProfile() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const router = useRouter();
  const params = useLocalSearchParams();
  const artistName = params.artistName ? decodeURIComponent(params.artistName as string) : "Unknown Artist";
  const artistImage = params.artistImage ? decodeURIComponent(params.artistImage as string) : "https://via.placeholder.com/300";
  const description = params.description ? decodeURIComponent(params.description as string) : "No description available for this artist.";
  
 
  const rawListeners = params.monthlyListeners ? parseInt(params.monthlyListeners.toString().replace(/[^0-9]/g, ''), 10) : 24419528;
  const targetListeners = isNaN(rawListeners) ? 0 : rawListeners;

  useEffect(() => {
    
    Animated.timing(animatedValue, {
      toValue: targetListeners, 
      duration: 2500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [targetListeners]); 

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
     <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={styles.container}>
          <View style={styles.headerWrapper}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back(); 
                  } else {
                    router.push("/(drawer)/(tabs)/homepage"); 
                  }
                }} style={styles.backIcon}
              >
                <Entypo name="chevron-thin-left" size={25} color="black" />
              </TouchableOpacity>
              <Text style={styles.artistName}>Artist profile</Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.profileCardWrapper}>
         
              <Image
                source={{ uri: artistImage }}
                style={styles.profileImage}
              />
              <View style={styles.card}>
                
            
                <Text style={styles.listenerCount}>
                  {formatNumber(displayValue)}
                </Text>
                <Text style={styles.listenerLabel}>Monthly Listeners</Text>

                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>Trending Artist</Text>
                </View>

                <Text style={styles.description}>
                  {description}
                </Text>

                <View style={styles.footer}>
                  <Text style={styles.postBy}>Post by</Text>
                  {/* 6. TAMPILKAN NAMA ARTIS */}
                  <Text style={styles.footerArtist}>{artistName}</Text>

                  <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialIcon}>
                      <Entypo name="instagram" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                      <AntDesign name="twitter" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                      <FontAwesome name="facebook-f" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                      <Entypo name="link" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  contentContainer: { alignItems: "center", padding: 10 },
  headerWrapper: { width: "100%", backgroundColor: "#f0f0f0", paddingTop: 17 },
  header: { position: "relative", justifyContent: "center", alignItems: "center", borderBottomWidth: 0.3, borderBottomColor: "#a8a7a7ff", paddingVertical: 12, width: "100%" },
  backIcon: { position: "absolute", left: 10 },
  artistName: { fontSize: 20, fontWeight: "bold", color: "#000", textAlign: "center" },
  profileCardWrapper: { width: "100%", alignItems: "center", position: "relative", marginTop: 60 },
  profileImage: { width: 100, height: 100, borderRadius: 50, position: "absolute", top: -50, zIndex: 2 },
  card: { backgroundColor: "#004d40", borderRadius: 20, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, width: "100%", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4, alignItems: "center" },
  listenerCount: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  listenerLabel: { color: "white", fontSize: 14, textAlign: "center", marginBottom: 10 },
  rankContainer: { alignSelf: "center", backgroundColor: "#26a69a", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 15 },
  rankText: { color: "white", fontWeight: "600" },
  description: { color: "white", fontSize: 14, lineHeight: 20, textAlign: "justify" },
  footer: { alignItems: "center", marginTop: 30 },
  postBy: { color: "#7F8489", fontSize: 14, textAlign: "center", marginBottom: 2 },
  footerArtist: { color: "#FFFFFF", fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 15 },
  socialContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  socialIcon: { marginHorizontal: 8, width: 45, height: 45, borderRadius: 50, borderWidth: 1, borderColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
});