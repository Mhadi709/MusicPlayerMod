import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Layout from "../../../components/hederLayout"; // Sesuaikan path jika berbeda
import { LinearGradient } from 'expo-linear-gradient'; // Pastikan expo-linear-gradient sudah diinstal

// Struktur data
type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  subtitle: string;
  artworkUrl: string;
  Tipemusic?: string;
};

// Data dummy
const dummySongs: Song[] = [
{ id: '1', title: 'Glimpse of Us', artist: 'Joji', album: 'SMITHEREENS', Tipemusic:'Daily mix 1', subtitle: 'Six60, Mitch James, Tiki Taane And More', duration: '3:53', artworkUrl: 'https://picsum.photos/seed/song1/200', }, 
{ id: '2', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", Tipemusic:'Daily mix 2', duration: '2:47', subtitle: 'Six60, Mitch James, Tiki Taane And More', artworkUrl: 'https://picsum.photos/seed/song2/200', }, 
{ id: '3', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', Tipemusic:'Daily mix 3', duration: '3:20', subtitle: 'Six60, Mitch James, Tiki Taane And More', artworkUrl: 'https://picsum.photos/seed/song3/200', },
{ id: '4', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', Tipemusic:'daily mix 4', subtitle: 'Six60, Mitch James, Tiki Taane And More', artworkUrl: 'https://picsum.photos/seed/song4/200', }, 
{ id: '5', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', Tipemusic:'Daily mix 5', subtitle: 'Six60, Mitch James, Tiki Taane And More', artworkUrl: 'https://picsum.photos/seed/song5/200', },
];

// 2. Komponen untuk item lagu
const SongsScreen: React.FC = () => {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recently Played (Tidak ada perubahan di sini) */}
        <Text style={styles.header1}>Recently Played</Text>
        <FlatList
          data={dummySongs}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={{ marginRight: 10 }}>
              <LinearGradient
                colors={["#0B3129", "#22977E"]}
                style={styles.recentContainer}
              >
                <Image source={{ uri: item.artworkUrl }} style={styles.artwork} />
                <Text style={styles.recentText}>{item.title}</Text>
              </LinearGradient>
            </View>
          )}
        />

        {/* To Get You Started */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>To Get You Started</Text>
          <FlatList
            data={dummySongs}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cardWrapper}>
                <LinearGradient
                  colors={["#0B3129", "#22977E"]}
                  style={styles.cardContainer}
                >
                  <Image source={{ uri: item.artworkUrl }} style={styles.mixArtwork} />
                  <View style={styles.infoContainer}>
                      <Text style={styles.mixTitle} numberOfLines={1}>{item.Tipemusic}</Text>
                      <Text style={styles.mixSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.subHeader}>Try Something Else</Text>
          <FlatList
            data={dummySongs}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cardWrapper}>
                <LinearGradient
                  colors={["#0B3129", "#22977E"]}
                  style={styles.cardContainer}
                >
                  <Image source={{ uri: item.artworkUrl }} style={styles.mixArtwork} />
                  <View style={styles.infoContainer}>
                      <Text style={styles.mixSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </Layout>
  );
};
// }


// 4. Styles
const styles = StyleSheet.create({
section: {
   marginTop: 25 
  }, 
   header1: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#1b1a1aff", 
    paddingHorizontal: 10 
  },
  subHeader: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#111010ff", 
    paddingHorizontal: 10 
  },
  recentContainer: { 
    width: 107, 
    height: 130, 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center" },
  recentText: { fontSize: 12, 
    color: "#fff", 
    marginTop: 5, 
    textAlign: "center"
   },
  artwork: { 
    width: 64, 
    height: 85, 
    borderRadius: 13, 
    backgroundColor: "#1DB954" 
  },
  
   cardWrapper: {
    marginRight: 15, 
  },
  cardContainer: {
    width: 150,       
    borderRadius: 8,   
     overflow: 'hidden',    
  },
  mixArtwork: {
     width: '100%',
    height: 140,    
    borderRadius: 11, 
    backgroundColor: '#e0e0e0'
  },
infoContainer: {
    paddingTop: 8,         
    paddingHorizontal: 10,  
    paddingBottom: 10,      
  },
  mixTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F5EEDD", 
  },
  mixSubtitle: {
    fontSize: 12,
    color: "#E0E0E0", 
    marginTop: 4, 
  },
});
export default SongsScreen;
