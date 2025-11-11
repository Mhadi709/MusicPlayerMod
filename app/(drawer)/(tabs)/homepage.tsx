import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { VideoView, useVideoPlayer } from 'expo-video'; // Pastikan expo-video sudah diinstal dan dikonfigurasi
import React, { useEffect, useState } from "react";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import video1 from '../../../assets/videos/Video1.mp4';
import Layout from "../../../components/hederLayout"; // Sesuaikan path jika berbeda
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import MiniNavbar from "../../../components/MiniNavbar";
import { router } from "expo-router";


type VideoCardProps = {
  source: any;
  title: string;
  meta: string;
  genre?: string;
  customStyle?: any;
};
  const handlePress = () => {
    router.push("/NowPlayingScreen"); // arahkan ke halaman NowPlayingScreen.tsx
  };
  const handlePresss = () => {
    router.push("/MusicDetailScreen"); 
  };
const VideoCard: React.FC<VideoCardProps> = ({ source, title, meta, genre, customStyle }) => {
  const player = useVideoPlayer(source);

  useEffect(() => {
    if (player) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  }, [player]);
const [shareVisible, setShareVisible] = useState(false);
  return (
    
    <View>
      <View style={[styles.videoCard, customStyle]}>
        <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false}
          fullscreenOptions={{ enable: true }}
          contentFit="cover"
        />
        </View>
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <Text style={styles.videoTitle} numberOfLines={1}>{title}</Text>
            <TouchableOpacity style={styles.playButton}>
              <FontAwesome6 name="play" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomOverlay}>
            <MaterialIcons name="multitrack-audio" size={26} color="#fff" />
            <Text style={styles.videoMeta}>{meta}</Text>
          </View>
          {genre && <Text style={styles.genreTag}>{genre}</Text>}
        </View>
      </View>
      <View style={styles.extraCard}>
        <View style={styles.textIconContainer}>
     <View style={{ flexDirection: "row" }}>
        <MaskedView
          maskElement={
            <Text style={[styles.extraTitle, { backgroundColor: "transparent" }]}>
              Top Hits by Diljit
            </Text>
          }
        >
      <LinearGradient
        colors={["#0B3129", "#219780"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.extraTitle, { opacity: 0 }]}>
          Top Hits by Diljit
        </Text>
      </LinearGradient>
      </MaskedView>
      </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <Feather name="heart" size={20} color="#1C274C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareIcon} >
              <Feather name="share" size={20} color="#" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.extraDescription} numberOfLines={1} ellipsizeMode="tail">10 tracks · 3:45 mins each · Pop</Text>
      </View>
    </View>
  );
};

export default function ExploreScreen() {
  return (
<View style={{ flex: 1 }}>
    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Layout children={undefined} />
      {/* VIBE SECTION */}
      <View style={styles.content1}>
        <View style={styles.vibeSectionTitle}>
          <Text style={styles.sectionTitlePart11}>What's your</Text>
          <Text style={styles.sectionTitlePart2}>Mood today?</Text>
        </View>
</View>


  {/* Recently Played */}
  <View style={styles.historyPlayContainer}>
<View style={{ width: "100%" }}>
  <Text style={[styles.historyPlayText1, { textAlign: "left", alignSelf: "flex-start" }]}>
   Refrens for you
  </Text>
</View>
  </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
    <View style={styles.cardHistory}>
        <TouchableOpacity onPress={handlePress}>
        <Image
          style={styles.card}
          source={require("../../../assets/images/download.jpg")}
        />
      </TouchableOpacity>
              <TouchableOpacity onPress={handlePresss}>
      <Image style={styles.card} source={require('../../../assets/images/gambar1.png')} />
      </TouchableOpacity>
      <Image style={styles.card} source={require('../../../assets/images/gambar 2.png')} />
      <Image style={styles.card} source={require('../../../assets/images/gambar 3.png')} />
    </View>
  </ScrollView>
<View style={styles.content2}>
  {/* Trending Section */}
  <View style={styles.trendingSectionTitle}>
    <Text style={styles.sectionTitlePart1}>Trending Now</Text>
    <TouchableOpacity onPress={() => router.push("/(drawer)/Featured")}>
  <Text style={styles.seeAllText}>See all</Text>
</TouchableOpacity>
  </View>

  {/* Video Card */}
  <VideoCard
    source={video1}
    title="Diljit Dosanjh • EP"
    meta="2023 • 13 songs"
    customStyle={{
      width: 335,
      height: 265,
      alignSelf: 'center',
      marginTop: 15,
    }}
  />
    </View>
       <View style={styles.newSection}>
     <View style={{ alignItems: "flex-start" }}>
  <Text style={styles.historyPlayText}>Recently played</Text>
</View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.newContentWrapper}>
      <View style={styles.newCardContainer}>
    <Image 
      style={styles.newCard} 
      source={require('../../../assets/images/gamabrpic.png')} 
    />
    <Text style={styles.newCardTitle}>
      Ed Sheeran Big seen, Juice WRD, Post Malone
    </Text>
  </View>
      <View style={styles.newCardContainer}>
    <Image 
      style={styles.newCard} 
      source={require('../../../assets/images/gamabrpic1.png')} 
    />
    <Text style={styles.newCardTitle}>
     Mitski, Tame Impala, Glass Animals, Charli XCX
    </Text>
  </View>
      <View style={styles.newCardContainer}>
    <Image 
      style={styles.newCard} 
      source={require('../../../assets/images/gamabrpic2.png')} 
    />
    <Text style={styles.newCardTitle}>
      Ed Sheeran Big seen, Juice WRD, Post Malone
    </Text>
  </View>
      </View>
      </ScrollView>

 {/* untuk penggemar */}

    </View>
   <View style={styles.container}>
  {/* Card artis */}
   <TouchableOpacity style={styles.card1} onPress={() => router.push("/ArtistProfile")}>
    <Image
      source={require("../../../assets/images/Justin Bieber.jpg")}
      style={styles.image}
    />
    <View style={{ alignItems: "center", marginLeft: 10 }}>
      <Text style={styles.fanText}>Untuk Penggemar</Text>
      <Text style={styles.name}>Hans Zimmer</Text>
    </View>
  </TouchableOpacity>

  {/* ScrollView konten baru */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scrollView}
  >
    <View style={styles.newContentWrapper}>
      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic.png")}
        />
        <Text style={styles.newCardTitle}>
          Ed Sheeran Big seen, Juice WRD, Post Malone
        </Text>
      </View>

      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic1.png")}
        />
        <Text style={styles.newCardTitle}>
          Mitski, Tame Impala, Glass Animals, Charli XCX
        </Text>
      </View>

      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic2.png")}
        />
        <Text style={styles.newCardTitle}>
          Ed Sheeran Big seen, Juice WRD, Post Malone
        </Text>
      </View>
    </View>
  </ScrollView>
</View>
   <View style={styles.container}>
  {/* Card artis */}
  <TouchableOpacity style={styles.card1} onPress={() => router.push("/ArtistProfile")}>
    <Image
      source={require("../../../assets/images/Afgan.webp")}
      style={styles.image}
    />
    <View style={{ alignItems: "center", marginLeft: 10 }}>
      <Text style={styles.fanText}>Untuk Penggemar</Text>
      <Text style={styles.name}>Hans Zimmer</Text>
    </View>
  </TouchableOpacity>

  {/* ScrollView konten baru */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scrollView}
  >
    <View style={styles.newContentWrapper}>
      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic.png")}
        />
        <Text style={styles.newCardTitle}>
          Ed Sheeran Big seen, Juice WRD, Post Malone
        </Text>
      </View>

      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic1.png")}
        />
        <Text style={styles.newCardTitle}>
          Mitski, Tame Impala, Glass Animals, Charli XCX
        </Text>
      </View>

      <View style={styles.newCardContainer}>
        <Image
          style={styles.newCard}
          source={require("../../../assets/images/gamabrpic2.png")}
        />
        <Text style={styles.newCardTitle}>
          Ed Sheeran Big seen, Juice WRD, Post Malone
        </Text>
      </View>
    </View>
    
  </ScrollView>
</View>
    </ScrollView>
      {/* <MiniPlayer /> */}
     <MiniNavbar />
    </View>
  );
}


const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F5F5',
     paddingTop: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
content1: {
  flex: 1,
  alignItems: 'center',
  paddingTop: 10,
},
content2: {
  flex: 1,
 marginTop: 9,
  alignItems: 'center',

},
vibeSectionTitle: {
  flexDirection: 'column', 
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '88%',
  marginBottom: 10,
},
trendingSectionTitle: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '88%',
  marginBottom: 6,
},
sectionTitlePart1: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000',
},
sectionTitlePart11: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#000',
},
sectionTitlePart2: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#000',
},
seeAllText: {
  fontSize: 16,
  color: '#445FA7',
},
  videoCard: {
    height: 200,
    width: 335,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
    marginBottom: 0,
    marginTop: 5,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  video: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 6,
    padding: 12,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  topOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  genreTag: { 
    color: '#fff', 
    backgroundColor: 'rgba(45, 156, 219, 0.7)',
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 10, 
    fontSize: 12,
    marginLeft: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: 'absolute',
    bottom: 10,
    left: 12,
    zIndex: 1,
  },
  videoMeta: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'right',
  },
  playButton: {
    backgroundColor: '#9e9b9bff',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraCard: {
    width: 335,
    height: 70,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: -10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
extraTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000", // fallback
  },
  extraDescription: {
    fontSize: 13,
    color: '#757575',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  shareIcon: {
    marginLeft: 10,
  },
historyPlayContainer: {
  marginTop: 19,
  marginBottom: 5,
  paddingHorizontal: 20,
},
historyPlayText: {
  fontSize: 23,
  color: '#000',
  fontWeight: 'bold',
  marginBottom:8,
},
historyPlayText1: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#000",
  marginBottom: 10,
  textAlign: "left",   // ini penting
  alignSelf: "flex-start", // jaga-jaga kalau parent flex row
},

cardHistory: {
  marginTop: 6,
  flexDirection: 'row',
  paddingHorizontal: 30
},
card: {
  width: 108,
  height: 108,
  borderRadius: 10,
  backgroundColor: '#333',
  marginRight: 12, // kasih jarak antar card
},
scrollView:{

},

//untuk editor pic
newSection: {
  marginTop: 20,
  paddingHorizontal: 20,
},
newSectionTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000',
  marginBottom: 10,
  marginRight: 2,
  textAlign: 'left',   // pastikan teks rata kiri
  alignSelf: 'flex-start', // biar ga ikut center parent
},

newContentWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap', // biar bisa ke bawah kalau banyak
  gap: 12,
  alignItems:'flex-start',
  marginRight:12,
},
newCard: {
  width: 150,
  height: 150,
  borderRadius: 12,
  backgroundColor: '#ccc',
  marginBottom: 6,
},

newCardTitle: {
  fontSize: 11.5,
  color: '#000',
  textAlign: 'center',   
  flexWrap: 'nowrap',    
  width: 150,     
   marginBottom: 3,      
},

newCardContainer: {
  alignItems: 'center', 
  width: 150,
},

//code untuk untuk pengggemar 

  container: {
    flexDirection: "column",   
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,          // jarak ke ScrollView
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 100,
  },
  fanText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    marginLeft:10,
    marginBottom:2,
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

});

