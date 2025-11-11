import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import video1 from '../../../assets/videos/Video1.mp4';
import video2 from '../../../assets/videos/Video2.mp4';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation, useRouter } from 'expo-router';
import MiniNavbar from "../../../components/MiniNavbar";
// Komponen terpisah untuk kartu video
type VideoCardProps = {
  source: any;
  title: string;
  meta: string;
  genre?: string;
  customStyle?: any;
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

  return (
    <View style={[styles.videoCard, customStyle]}>
    <VideoView
  player={player}
  style={styles.video}
  nativeControls={false}
  fullscreenOptions={{ enable: true }}
  contentFit="cover"
/>

      <View style={styles.overlay}>
        <Text style={styles.videoTitle}>{title}</Text>
        {genre && <Text style={styles.genreTag}>{genre}</Text>}
        <View style={styles.videoInfo}>
          <Text style={styles.videoMeta}>{meta}</Text>
          <TouchableOpacity style={styles.playButton}>
            <Feather name="play" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Komponen untuk kartu Jelajahi
const ExploreCard: React.FC<{ title: string; image: any; color: string }> = ({ title, image, color }) => (
  <TouchableOpacity style={[styles.exploreCard, { backgroundColor: color }]}>
    <Image source={image} style={styles.exploreCardImage} />
    <Text style={styles.exploreCardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const userName = "Wilma";
const router = useRouter();

const handleSearchPresss = () => {
  router.push("/(drawer)/(tabs)/DiscoverPage");
};


  function handleSearchPress(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recommended for you today</Text>
        </View>
       <TouchableOpacity 
          style={styles.searchContainer} 
          onPress={handleSearchPresss} 
          activeOpacity={0.8}
        >
          {/* Ikon dan teks placeholder untuk membuatnya terlihat seperti search bar */}
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.placeholderText}>Search for songs, artists, playlists...</Text>
        </TouchableOpacity>

        {/* --- Mulai Jelajahi Section --- */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Start exploring</Text>
          <View style={styles.exploreGrid}>
            <ExploreCard
              title="Musik"
              image={require('../../../assets/images/mendengarkan musik.jpg')} // Ganti dengan path gambar yang sesuai
              color="#E53888"
            />
            <ExploreCard
              title="Podcast"
              image={require('../../../assets/images/merekampodcast.jpg')} // Ganti dengan path gambar yang sesuai
              color="#508D4E"
            />
            <ExploreCard
              title="Acara Langsung"
              image={require('../../../assets/images/penontonkonser.jpg')} // Ganti dengan path gambar yang sesuai
              color="#9854B2"
            />
            <ExploreCard
              title="K-Pop ON! (온) Hub"
              image={require('../../../assets/images/ikonk-pop.jpg')} // Ganti dengan path gambar yang sesuai
              color="#4535C1"
            />
          </View>
        </View>

        
       <View style={styles.section}>
          <Text style={styles.sectionTitle}>I'm bored with the other players</Text>
          <VideoCard
            source={video1}
            title="Ed Sheeran • EP"
            meta="2023 • 13 songs"
            genre="Pop"
          />
        </View>

        {/* --- Video Section Lainnya --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <VideoCard
            source={video2}
            title="Sara Kang • EP"
            meta="2023 • 13 songs"
            customStyle={{ width: 335, height: 290, marginHorizontal: '6%', alignSelf: 'center' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    <MiniNavbar />
</View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 15, 
  },
  headerTitle: { fontSize: 36, fontWeight: 'bold' },
  section: { marginTop: 19, paddingBottom: 16 }, 
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20, 
    marginBottom: 12,
  },
  seeAll: { color: '#1DB954', fontSize: 14 },
  videoCard: {
    height: 200,
    width: '88%',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: '6%',
    backgroundColor: '#000',
    alignSelf: 'center',
    marginBottom: 15, 
  },
  video: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12, 
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  videoTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1 },
  genreTag: { 
    color: '#fff', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 10, 
    fontSize: 12, 
    marginLeft: 10 
  },
  videoInfo: { alignItems: 'flex-end' },
  videoMeta: { color: '#fff', fontSize: 14 },
  playButton: { marginLeft: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F3F3',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20, 
    marginTop: 20,
    paddingHorizontal: 15, 
    width: 379,
    height: 62,
  },
 
  searchIcon: {
    marginRight: 10,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  contentText: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
  },
 exploreSection: {
    padding: 16,
    backgroundColor: '#fff',
    position: 'relative',
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', 
    marginBottom: 16,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
exploreCard: {
  width: '48%',
  height: 110,
  borderRadius: 10,
  marginBottom: 16,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  position: 'relative', 
  overflow: 'hidden',
},
  exploreCardImage: {
    width: 69,
    height: 69,
    resizeMode: 'contain',
    transform: [{ rotate: '14deg' }],
    position: 'absolute',
    bottom: 9,
    right: -3,
  },
  exploreCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: 12,
    left: 10,
    zIndex: 1,
    padding: 6,
    maxWidth: '90%',
    textAlign: 'left',
  },
});