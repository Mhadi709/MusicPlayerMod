import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

// Data artis berdasarkan gambar di folder assets
const ARTISTS_DATA = [
  { id: '1', name: 'Billie Eilish', image: require('../assets/images/foto_artis/Afgan.webp') },

  { id: '2', name: 'Kanye West', image: require('../assets/images/foto_artis/Ed Sheeran.webp') },

  { id: '3', name: 'Ariana Grande', image: require('../assets/images/foto_artis/Justin Bieber.jpg') },

  { id: '4', name: 'Lana Del Rey', image: require('../assets/images/foto_artis/Raisa.jpg') },

  { id: '5', name: 'BTS', image: require('../assets/images/foto_artis/Taylor Swift.jpg') },

  { id: '6', name: 'Drake', image: require('../assets/images/foto_artis/Justin Bieber.jpg') },

  { id: '7', name: 'Harry Styles', image: require('../assets/images/foto_artis/Raisa.jpg') },

  { id: '8', name: 'One Direction', image: require('../assets/images/foto_artis/Afgan.webp') },

  { id: '9', name: 'Rihanna', image: require('../assets/images/foto_artis/Ed Sheeran.webp') },

  { id: '10', name: 'Ed Sheeran', image: require('../assets/images/foto_artis/Ed Sheeran.webp') },

  { id: '11', name: 'The Weeknd', image: require('../assets/images/foto_artis/Raisa.jpg') },

  { id: '12', name: 'Dua Lipa', image: require('../assets/images/foto_artis/Justin Bieber.jpg') },
  { id: '13', name: 'Afgan', image: require('../assets/images/foto_artis/Afgan.webp') },
];

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - 32 - 16 * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

// Komponen untuk setiap item artis
const ArtistItem = ({ item, isSelected, onSelect }: any) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => onSelect(item.id)}>
    <Image source={item.image} style={styles.itemImage} />
    {isSelected && (
      <View style={styles.overlay}>
        <Feather name="check" size={24} color="#fff" />
      </View>
    )}
    <Text style={styles.itemName}>{item.name}</Text>
  </TouchableOpacity>
);

export default function ChooseArtistsScreen() {
  const router = useRouter();
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectArtist = (artistId: string) => {
    setSelectedArtists((prevSelected) => {
      if (prevSelected.includes(artistId)) {
        return prevSelected.filter((id) => id !== artistId); // Hapus pilihan
      } else if (prevSelected.length < 3 || prevSelected.includes(artistId)) {
        return [...prevSelected, artistId]; // Tambah pilihan
      }
      return prevSelected; // Batasi maksimal 3 jika sudah penuh
    });
  };

  const handleDone = () => {
    if (selectedArtists.length >= 3) {
      console.log('Selected Artists:', selectedArtists);
      router.replace('/(tabs)');
    } else {
      alert('Please select at least 3 artists.');
    }
  };

  // Filter artis berdasarkan pencarian
  const filteredArtists = ARTISTS_DATA.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
         <AntDesign name="leftcircleo" size={29} color="black" style={styles.icon} />
          <Text style={styles.title}>Choose 3 or more artists</Text>
        </View>
        <Text style={styles.subtitle}>
          This will help us recommend you the best music.
        </Text>

        {/* Kolom Pencarian */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={filteredArtists}
          renderItem={({ item }) => (
            <ArtistItem
              item={item}
              isSelected={selectedArtists.includes(item.id)}
              onSelect={handleSelectArtist}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContainer}
        />

        {selectedArtists.length > 0 && (
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight : 29,
    marginLeft: 6,
  },
  icon: {
    marginRight: 30, // Jarak antara ikon dan teks
    marginTop : 13,
    marginLeft : 9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContainer: {
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_SIZE,
    margin: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    marginBottom: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#2CA58D', // Warna hijau seperti Spotify
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 5, // Efek bayangan untuk Android
    shadowColor: '#000', // Efek bayangan untuk iOS
    shadowOffset: { width: 7, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});