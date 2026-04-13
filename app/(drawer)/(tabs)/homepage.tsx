import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { VideoView, useVideoPlayer } from 'expo-video'; 
import React, { useEffect, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Layout from "../../../components/layout/hederLayout"; 
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import MiniNavbar from "../../../components/layout/MiniNavbar";
import { router, useRouter } from "expo-router";
import {  getArtistsWithImage, getMusicList } from "@/services/music.api";
import { searchPexelsVideos } from "@/services/pexels.api";
import ShimmerVideoCard from "@/components/loading/ShimmerVideoCard";
import { ShimmerHorizontalCard } from "@/components/loading/ShimmerHorizontalCard";
import { navigateToNowPlaying } from "@/utils/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { Artist } from "@/components/common/LastPlayedList";
import UniversalAlert, { UniversalAlertProps } from "@/components/common/UniversalAlert";


export interface Track {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image: string;
  album_image?: string;
  duration?: number;
  genre?: string[];
}

type VideoCardProps = {
  track: Track; 
  pexelsVideo?: any; 
  customStyle?: any;
  onPress: () => void;
};

const VideoCard = React.memo(({
  track,
  pexelsVideo,
  customStyle,
  onPress,
}: VideoCardProps) => {

  // 1. Logika Pilih Video Pexels (Tetap sama)
  const videoSource = React.useMemo(() => {
    if (pexelsVideo?.video_files?.length) {
      return pexelsVideo.video_files
        .filter((v: any) =>
          v.file_type === "video/mp4" && v.width <= 1280
        )
        .sort((a: any, b: any) => b.width - a.width)[0]?.link;
    }
    return null;
  }, [pexelsVideo]);

  // 2. Setup Player
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  if (!videoSource) return null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      {/* --- VIDEO SECTION --- */}
      <View style={[styles.videoCard, customStyle]}>
        <View style={styles.videoContainer}>
          <VideoView
            key={videoSource}
            player={player}
            style={styles.video}
            nativeControls={false}
            contentFit="cover"
          />
        </View>

        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            {/* Song Title from API */}
            <Text style={styles.videoTitle} numberOfLines={1}>
              {track.name}
            </Text>      
          </View>

          <View style={styles.bottomOverlay}>
             <MaterialIcons name="multitrack-audio" size={26} color="#fff" />
            <Text style={styles.videoMeta}>Trending Now</Text>
          </View>

          {/* Genre of API */}
          {track.genre && track.genre.length > 0 && (
            <Text style={styles.genreTag}>{track.genre[0]}</Text>
          )}
        </View>
      </View>

      {/* --- EXTRA CARD SECTION --- */}
      <View style={styles.extraCard}>
        <View style={styles.textIconContainer}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <MaskedView
              maskElement={
                <Text style={[styles.extraTitle, { backgroundColor: "transparent" }]} numberOfLines={1}>
                  {track.artist_name}
                </Text>
              }
            >
              <LinearGradient
                colors={["#0B3129", "#219780"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.extraTitle, { opacity: 0 }]} numberOfLines={1}>
                  {track.artist_name}
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <Feather name="heart" size={20} color="#1C274C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareIcon}>
              <Feather name="share" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description below */}
        <Text
          style={styles.extraDescription}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Single • {track.duration ? Math.floor(track.duration / 60) + " mins" : "Unknown duration"}
        </Text>
      </View>
    </TouchableOpacity>
  );

}, (prevProps, nextProps) => {
  return (
    prevProps.track.id === nextProps.track.id && 
    prevProps.pexelsVideo === nextProps.pexelsVideo
  );
});

export default function ExploreScreen() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [pexelsVideos, setPexelsVideos] = useState<any[]>([]);

  const { setTrack } = usePlayer();  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});

const handlePlay = (item: any) => {
  if (!item.audio || item.audio.trim() === "") {
    setAlertConfig({
      type: 'reminder',
      title: 'Audio Tidak Tersedia',
      message: 'Audio tidak tersedia untuk lagu ini.',
      confirmText: 'OK',
    });
    setAlertVisible(true);
    return;
  }
  navigateToNowPlaying(router, item);
};

  const handlePress = (item: Track) => {
  setTrack({
    title: item.name,
    artist: item.artist_name,
    image: item.image,
    audio: item.audio, 
  });

  router.push({
    pathname: "/(drawer)/NowPlayingScreen",
    params: {
      id: item.id,
      title: item.name,
      artist: item.artist_name,
      image: encodeURIComponent(item.image),
      audio: encodeURIComponent(item.audio),
    }
  });
};
  useEffect(() => {
  const loadVideos = async () => {
   const videos = await searchPexelsVideos("city night", 5);
    setPexelsVideos(videos);
  };

  loadVideos();
}, []);


  useEffect(() => {
    loadData();
  }, []);

async function loadData() {
    try {
      if (tracks.length === 0) setLoading(true);
      const [artistData, trackData] = await Promise.all([
        getArtistsWithImage(5),
        getMusicList(10),       
      ]);

      setArtists(artistData);
      setTracks(trackData);
    } catch (e) {
      console.log("ERR LOAD DATA:", e);
    } finally {
      setLoading(false); 
    }
  }

  

 if (loading) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      
      {/* Shimmer Video */}
      <ShimmerVideoCard />

      {/* Shimmer Horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[...Array(5)].map((_, i) => (
          <ShimmerHorizontalCard key={i} />
        ))}
      </ScrollView>

      {/* Shimmer Video kedua */}
      <ShimmerVideoCard />
    </View>
  );
}


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
        <UniversalAlert
              {...(alertConfig as UniversalAlertProps)}
              visible={alertVisible}
              onConfirm={() => setAlertVisible(false)}
              onCancel={() => setAlertVisible(false)}
            />
          {/* Recently Played */}
            <View style={styles.historyPlayContainer}>
          <View style={{ width: "100%" }}>
            <Text style={[styles.historyPlayText1, { textAlign: "left", alignSelf: "flex-start" }]}>
            Refrens for you
            </Text>
          </View>
            </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
        <View style={styles.newContentWrapper}>
          {tracks.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newCardContainer}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
            >
        <Image
          style={styles.newCard}
          source={{ uri: item.image }}
        />
      <Text style={styles.newCardTitle} numberOfLines={1}>
        {item.artist_name} - {item.name}
      </Text>
    </TouchableOpacity>
  ))}
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
 {tracks.length > 0 && pexelsVideos.length > 0 && (
  <VideoCard
    track={tracks[0]} 
    pexelsVideo={pexelsVideos[0]}
    onPress={() => handlePress(tracks[0])} 
  />
)}
    </View>
     <View style={styles.newSection}>
     <View style={{ alignItems: "flex-start" }}>
  <Text style={styles.historyPlayText}>Recently played</Text>
</View>

  <ScrollView 
  horizontal={true} 
  showsHorizontalScrollIndicator={false} 
  style={styles.scrollView}
>
<View style={styles.newContentWrapper}>
  {tracks.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.newCardContainer}
      activeOpacity={0.8}
      onPress={() => handlePlay(item)}
    >
      <Image
        style={styles.newCard}
        source={{
          uri:
            item.image && item.image.trim() !== ""
              ? item.image
              : "https://via.placeholder.com/300",
        }}
      />
      <Text style={styles.newCardTitle} numberOfLines={1}>
        {item.artist_name} - {item.name}
      </Text>
    </TouchableOpacity>
  ))}
</View>
</ScrollView>
</View>
<View style={styles.container}>
 {artists.length > 0 && (
  <TouchableOpacity
    style={styles.card1}
    onPress={() =>
      router.push({
        pathname: "/ArtistProfile",
        params: { artistId: artists[0].id }
      })
    }
  >
    <Image
      style={styles.image}
      source={{
        uri: artists[0].image || "https://via.placeholder.com/300",
      }}
    />

    <View style={{ marginLeft: 10 }}>
       <Text style={styles.name}>{artists[0].name}</Text>
      <Text style={styles.fanText}>Untuk Penggemar</Text>
    </View>
  </TouchableOpacity>
)}

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginTop: 10 }}
>
    <View style={styles.newContentWrapper}>
      {tracks.map((track: any) => (
        <View style={styles.newCardContainer} key={track.id}>
          <TouchableOpacity
            key={track.id}
            style={styles.newCardContainer}
            activeOpacity={0.8}
           onPress={() => handlePlay(track)}
          >
            <Image
              style={styles.newCard}
              source={{
                uri:
                  track.image && track.image.trim() !== ""
                    ? track.image
                    : "https://via.placeholder.com/300",
              }}
            />
            <Text style={styles.newCardTitle} numberOfLines={1}>
              {track.name}
            </Text>
          </TouchableOpacity>
          {/*song name*/}
        </View>
      ))}
    </View>
  </ScrollView>
</View>


   <View style={styles.container}>
  {/* Card artis */}
  {artists.length > 0 && (
    <TouchableOpacity
      style={styles.card1}
      onPress={() =>
        router.push({
          pathname: "/ArtistProfile",
          params: { artistId: artists[0].id },
        })
      }
    >
       <Image
      style={styles.image}
      source={{
        uri: artists[0].image || "https://via.placeholder.com/300",
      }}
    />
      <View style={{ marginLeft: 10 }}>
         <Text style={styles.name}>{artists[1].name}</Text>
        <Text style={styles.fanText}>Untuk Penggemar</Text>
      </View>
    </TouchableOpacity>
  )}
   {/*ScrollView new content*/}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scrollView}
  >
    <View style={styles.newContentWrapper}>
      {tracks.map((track) => (
        <View style={styles.newCardContainer} key={track.id}>
          <TouchableOpacity
            key={track.id}
            style={styles.newCardContainer}
            activeOpacity={0.8}
            onPress={() => handlePlay(track)}
          >
            <Image
              style={styles.newCard}
              source={{
                uri:
                  track.image && track.image !== ""
                    ? track.image
                    : "https://via.placeholder.com/300",
              }}
            />
            <Text style={styles.newCardTitle} numberOfLines={2}>
              {track.artist_name}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
 video: {
  width: '100%',
  aspectRatio: 16 / 9,
  borderRadius: 16,
},

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
    color: "#000", 
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
    textAlign: "left",   
    alignSelf: "flex-start", 
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
    marginRight: 12, 
  },
scrollView:{

},

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
    textAlign: 'left',   
    alignSelf: 'flex-start', 
  },

  newContentWrapper: {
    flexDirection: 'row',
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
  container: {
    flexDirection: "column",   
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,         
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

