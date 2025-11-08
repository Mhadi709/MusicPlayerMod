import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { AntDesign, Feather, FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import MenuButton from "@/components/MenuButton";

// contoh asset video (pakai hook video player kamu)
import video1 from "../../assets/videos/Video1.mp4";
import profilePic from "../../assets/images/Prifile.jpg";
import ArrowReload from "../../assets/images/arrow-reload 3.svg";
import { useVideoPlayer, VideoView } from "expo-video";

type VideoCardProps = {
  source: any;        // bisa diganti jadi `string | number` atau tipe player kamu
  title: string;
  meta: string;
  genre?: string;
  customStyle?: any;
};

const VideoCard: React.FC<VideoCardProps> = ({ source, title, meta, genre, customStyle }) => {
  // pakai player hook kamu
  const player = useVideoPlayer(source);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    if (player) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  }, [player]);

  
   const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  // fungsi bikin animasi naik-turun
  const animateBar = (anim: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 20, // tinggi naik
          duration: 300,
          delay,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 5, // balik turun
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBar(anim1, 0);
    animateBar(anim2, 150);
    animateBar(anim3, 300);
  }, []);

  return (
    <View style={styles.videoCard}>
      <View style={styles.videoContainer}>
      <VideoView
  player={player}
  style={styles.video}
  nativeControls={false}
  fullscreenOptions={{ enable: true }}
  contentFit="cover"
/>

      </View>

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Atas: profile + teks + play button */}
        <View style={styles.topOverlay}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={profilePic} style={styles.profileImage} />
            <View>
              <Text style={styles.profileName}>Hey Karie,</Text>
              <Text style={styles.profileSub}>Ready to Jam?</Text>
            </View>
          </View>

          <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <AntDesign name="pause" size={28} color="#1C274C" />
        ) : (
          <FontAwesome6 name="play" size={28} color="#1C274C" />
        )}
      </TouchableOpacity>
    </View>


        {/* Tengah: judul playlist */}
     <View style={styles.centerInfo}>
  <Text style={styles.videoTitle}>{title}</Text>
  <Text style={styles.videoMeta}>{meta}</Text>
</View>


        {/* Bawah: ikon kontrol */}
        <View style={styles.bottomOverlay}>
          <TouchableOpacity>
            <ArrowReload width={26} height={26} fill="#fff" />
          </TouchableOpacity>
       
        <FontAwesome name="random" size={24} color="#fff" style={styles.icon} />
         <View style={styles.container1}>
      
      <View style={styles.bars}>
        <Animated.View
          style={[styles.bar, { height: anim1 }]}
        />
        <Animated.View
          style={[styles.bar, { height: anim2 }]}
        />
        <Animated.View
          style={[styles.bar, { height: anim3 }]}
        />
      </View>
    </View>

         <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
        {isMuted ? (
          <Foundation name="volume-strike" size={30} color="#fff" />
        ) : (
          <Feather name="volume-2" size={30} color="#fff" />
        )}
      </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

function Featured() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MenuButton />
        <Text style={styles.title}>Featured</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#1d1e1f" />
        </TouchableOpacity>
      </View>

      {/* Body scroll */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <VideoCard
          source={video1}
          title="80s Smash Hits"
          meta="1989 • 13 songs"
        />
        <VideoCard
          source={video1}
          title="Cinematic Ambient"
          meta="2012 • 13 songs"
        />
        {/* bisa tambah VideoCard lain */}
      </ScrollView>
    </View>
  );
}

export default Featured;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1d1e1f",
    textAlign:"center",
  },
  videoCard: {
  height: 340,   // dari 265 jadi 340
  width: 335,
  borderRadius: 14,
  overflow: "hidden",
  backgroundColor: "#000",
  alignSelf: "center",
  marginVertical: 15,
},

  videoContainer: {
    width: "100%",
    height: "100%",
  },
  video: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  profileSub: {
    color: "#ccc",
    fontSize: 12,
  },
centerInfo: {
  alignItems: "center",   // teks tengah
  marginTop: 0,           // jarak rapat setelah profile+play
  marginBottom: 172,        // kasih sedikit spasi sebelum ikon kontrol
},
videoTitle: {
  color: "#fff",
  fontSize: 25.49,
  fontWeight: "bold",
  marginBottom: 2,        // biar meta agak deket ke title
  textAlign: "center",
},
videoMeta: {
  color: "#fff",
  fontSize: 16,
  textAlign: "center",
},

  playButton: {
    backgroundColor: "#9e9b9bff",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  icon: { marginHorizontal: 5 },
    container1: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  bar: {
    width: 5,
    backgroundColor: "#fff",
    marginHorizontal: 2,
    borderRadius: 2,
  },
});
