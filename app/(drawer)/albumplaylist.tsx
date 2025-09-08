import * as React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import MenuButton from "@/components/MenuButton";
import { Feather } from '@expo/vector-icons';

type Song = {
  id: string;
  artworkUrl: string;
};
const dummySongs = [
  { id: '1', artworkUrl: 'https://picsum.photos/seed/song1/200' },
  { id: '2', artworkUrl: 'https://picsum.photos/seed/song2/200' },
  { id: '3', artworkUrl: 'https://picsum.photos/seed/song3/200' },
  { id: '4', artworkUrl: 'https://picsum.photos/seed/song4/200' },
  { id: '5', artworkUrl: 'https://picsum.photos/seed/song5/200' },
  { id: '6', artworkUrl: 'https://picsum.photos/seed/song5/200' },
  { id: '7', artworkUrl: 'https://picsum.photos/seed/song4/200' },
  { id: '8', artworkUrl: 'https://picsum.photos/seed/song3/200' },
  { id: '9', artworkUrl: 'https://picsum.photos/seed/song2/200' },
  { id: '10', artworkUrl: 'https://picsum.photos/seed/song1/200' },
  { id: '11', artworkUrl: 'https://picsum.photos/seed/song4/200' },
  { id: '12', artworkUrl: 'https://picsum.photos/seed/song5/200' },
  { id: '13', artworkUrl: 'https://picsum.photos/seed/song1/200' },
  { id: '14', artworkUrl: 'https://picsum.photos/seed/song4/200' },
  { id: '15', artworkUrl: 'https://picsum.photos/seed/song5/200' },
];

function AlbumPlaylistPage() {
   const renderItem = ({ item }: any) => (
    <Image
      source={{ uri: item.artworkUrl }}
      style={styles.card}
    />
  );
  return (
     <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <MenuButton />
          <Text style={styles.title}>Album playlist</Text>
        </View>
        <Feather name="search" size={24} color="#1d1e1f" />
      </View>

      {/* Grid Album */}
      <FlatList
        data={dummySongs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false} // kalau mau hide scrollbar
      />
    </View>
  );
}

export default AlbumPlaylistPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // kiri & kanan
    paddingHorizontal: 16,
    paddingVertical: 12,
    
  },
   leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // jarak kecil antara MenuButton dan Title (React Native 0.71+)
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1d1e1f',
    marginLeft:8,
    
  },
   grid: {
    padding: 35,
    gap: 19, // jarak antar baris (React Native 0.71+)
  },
  card: {
    width: 96,
    height: 125,
    borderRadius: 5,
    marginBottom: 20, // jarak antar baris kalau `gap` belum support
  },
});
