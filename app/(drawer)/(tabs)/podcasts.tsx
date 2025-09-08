import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Layout from "../../../components/hederLayout"; // Sesuaikan path jika berbeda
import { LinearGradient } from 'expo-linear-gradient'; // Pastikan expo-linear-gradient sudah diinstal
import { MaterialIcons } from '@expo/vector-icons';


// 1. Definisikan struktur data untuk setiap episode podcast
type PodcastEpisode = {
  description: ReactNode;
  category: ReactNode;
  year: ReactNode;
  id: string;
  title: string;
  showName: string;
  publisher: string;
  duration: string;
  thumbnailUrl: string;
  
};

// 2. Buat data dummy untuk ditampilkan
const dummyPodcasts: PodcastEpisode[] = [
  {
   id: '1',
  title: 'The Future of AI with Sam Altman',
  showName: 'Tech Forward',
  publisher: 'The Verge',
  duration: '45 min',
  thumbnailUrl: 'https://picsum.photos/seed/podcast1/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'Technology',
  year: '2023',
  },
  {
    id: '2',
    title: 'A Deep Dive into Stoicism',
    showName: 'The Daily Stoic',
    publisher: 'Ryan Holiday',
    duration: '28 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast2/200',
   description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
    category: 'health',
    year: '2024',
  },
  {
    id: '3',
    title: 'How to Build Good Habits',
    showName: 'The Knowledge Project',
    publisher: 'Farnam Street',
    duration: '1 hr 12 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast3/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
  {
    id: '4',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
  {
    id: '5',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
  {
    id: '6',
    title: 'The Science of Sleep',
    showName: 'Huberman Lab',
    publisher: 'Andrew Huberman',
    duration: '2 hr 5 min',
    thumbnailUrl: 'https://picsum.photos/seed/podcast4/200',
  description: 'Exploring how AI is shaping our future with insights from OpenAI CEO Sam Altman.',
  category: 'lifestyle',
  year: '2023',
  },
];

// 3. Komponen untuk merender satu item podcast
const PodcastItem: React.FC<{ item: PodcastEpisode }> = ({ item }) => (
  <TouchableOpacity style={styles.podcastItemContainer}>
    <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
   <LinearGradient
  colors={[
    'rgba(12, 45, 39, 0.3)', // lebih transparan
    'rgba(12, 45, 39, 0.9)'  // lebih pekat
  ]}
  style={StyleSheet.absoluteFillObject}
/>

    <View style={styles.podcastInfoOverlay}>
      <Text style={styles.podcastTitle}>{item.title}</Text>
      <Text style={styles.podcastShowName}>{item.category}</Text>
    </View>
  </TouchableOpacity>
);

const RecommendedPodcastCard: React.FC<{ item: PodcastEpisode }> = ({ item }) => (
  <LinearGradient
    colors={['#0B3129', '#219780']}
    start={{ x: 0.3, y: 0.3 }}
    end={{ x: 1, y: 1 }}
    style={styles.recommendedCard}
  >
     <View>
  </View>
    {/* Thumbnail */}
    <Image source={{ uri: item.thumbnailUrl }} style={styles.recommendedThumbnail} />

    {/* Info */}
    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{item.title}</Text>
      <Text style={styles.recommendedMeta}>{item.category} • {item.year}</Text>
      <Text style={styles.recommendedDesc}>{item.description}</Text>
    </View>

    {/* Tombol Play */}
    <TouchableOpacity style={styles.playButton}>
      <MaterialIcons name="play-circle-filled" size={30} color="#12F0C4" />
    </TouchableOpacity>
  </LinearGradient>
);



// 4. Komponen utama untuk halaman Podcasts

const PodcastsScreen: React.FC = () => {
  return (
    <Layout>
      <FlatList
        data={dummyPodcasts}
        renderItem={({ item }) => <PodcastItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
       <Text style={styles.TopHeder}>
        Recommended <Text style={styles.SubTopHeder}>podcasts</Text>
      </Text>
     <FlatList
      data={dummyPodcasts}
      renderItem={({ item }) => <RecommendedPodcastCard item={item} />}
      keyExtractor={(item) => item.id}  
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingBottom: 0,
        paddingTop:6,
      }}
    />
    </Layout>
  );
};

// 5. StyleSheet untuk semua style
const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 14,
    paddingTop:7,
    paddingBottom:69,
  },
  podcastItemContainer: {
    width: 111,
    height: 139,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
  },
    thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  podcastInfoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2CA58D',
    marginBottom: 5,
  },
  podcastShowName: {
    fontSize: 10,
    color: '#6C7072',
    opacity: 0.9,
  },
TopHeder: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000',
  paddingHorizontal: 15,
  marginTop: 5,   
  marginBottom: 3,
},
SubTopHeder: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#26A69A',   
},
recommendedCard: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 20,
  padding: 10,
  marginHorizontal: 15,
  marginBottom: 19,
  marginTop: 3, 
  height: 120,     
  flex: 1,       
},
recommendedThumbnail: {
  width: 70,
  height: 70,
  borderRadius: 15,
  marginRight: 15,
},
recommendedInfo: {
  flex: 1,
},
recommendedTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 0,
},
recommendedMeta: {
  fontSize: 12,
  color: '#FFFFFF',
  marginBottom: 4,
  marginTop:3,
},
recommendedDesc: {
  fontSize: 12,
  color: '#A7A7A7',
},
playButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
},

});


export default PodcastsScreen;