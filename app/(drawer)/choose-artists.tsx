import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from "@/hooks/useAuth";
import { getArtistsWithImage } from "@/services/music.api"; 
import { saveUserArtistsApi } from '@/services/auth.api';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - 32 - 16 * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

// Type untuk Artist
interface Artist {
  id: string;
  name: string;
  image?: string;
}

// Komponen untuk setiap item artis
const ArtistItem = ({ item, isSelected, onSelect }: { item: Artist; isSelected: boolean; onSelect: (id: string) => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => onSelect(item.id)} activeOpacity={0.7}>
    <Image 
      source={{ 
        uri: item.image && item.image !== "" 
          ? item.image 
          : "https://via.placeholder.com/150" 
      }} 
      style={styles.itemImage} 
    />
    
    {isSelected && (
      <View style={styles.overlay}>
        <Feather name="check" size={24} color="#fff" />
      </View>
    )}
    
    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
  </TouchableOpacity>
);

export default function ChooseArtistsScreen() {
  const router = useRouter();
   const { user } = useAuth();
  // State Data
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
  // State Interaksi
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Data dari API saat screen dibuka
  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      // Ambil 60 artis agar list terlihat banyak
      const data = await getArtistsWithImage(60); 
      setArtists(data);
    } catch (error) {
      console.log("Error loading artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArtist = (artistId: string) => {
    setSelectedArtists((prevSelected) => {
      if (prevSelected.includes(artistId)) {
        return prevSelected.filter((id) => id !== artistId); 
      } else {
        return [...prevSelected, artistId];
      }
    });
  };
    const handleDone = async () => {
      if (selectedArtists.length < 3) {
        Toast.show({
          type: 'snackWarning',
          text1: 'Please select at least 3 artists to continue.',
          position: 'bottom',
          bottomOffset: 80,
          visibilityTime: 3000,
        });
        return;
      }

      if (!user || !user.id) {
        Toast.show({
          type: 'snackError',
          text1: 'User session not found. Please login again.',
          position: 'bottom',
          bottomOffset: 80,
          visibilityTime: 3000,
        });
        return;
      }

      try {
        setIsSaving(true);
        await saveUserArtistsApi(user.id, selectedArtists);
        router.push("/(drawer)/(tabs)/homepage");
      } catch (error: any) {
        Toast.show({
          type: 'snackError',
          text1: 'Failed to save your choices. Please try again.',
          position: 'bottom',
          bottomOffset: 80,
          visibilityTime: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    };
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // Filter artis berdasarkan pencarian
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.headerRow}>
         <TouchableOpacity onPress={handleBack}>
           <AntDesign name="leftcircleo" size={29} color="black" />
         </TouchableOpacity>
        </View>

        <Text style={styles.title}>Choose 3 or more artists</Text>
        <Text style={styles.subtitle}>
          This will help us recommend you the best music.
        </Text>

        {/* Kolom Pencarian */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search artists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        {/* List Artis */}
        {loading ? (
          <ActivityIndicator size="large" color="#2CA58D" style={{ marginTop: 50 }} />
        ) : (
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
            showsVerticalScrollIndicator={false}
            // Optimasi performa untuk list panjang
            initialNumToRender={12}
            maxToRenderPerBatch={6}
            windowSize={5}
          />
        )}

        {/* Floating Done Button */}
        {selectedArtists.length > 0 && (
          <View style={styles.floatingButtonContainer}>
             <TouchableOpacity 
              style={[
                styles.doneButton, 
                (selectedArtists.length < 3 || isSaving) && styles.disabledButton 
              ]} 
              onPress={handleDone}
              disabled={isSaving} 
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.doneButtonText}>
                  {selectedArtists.length < 3 ? `${selectedArtists.length}/3 Selected` : "Done"}
                </Text>
              )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1d1e1f',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  listContainer: {
    alignItems: 'center',
    paddingBottom: 100, // Ruang untuk tombol done
  },
  itemContainer: {
    width: ITEM_SIZE,
    margin: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2, // Lingkaran
    marginBottom: 8,
    backgroundColor: '#eee', // Placeholder color saat loading image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: 'rgba(44, 165, 141, 0.7)', // Overlay warna hijau
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#2CA58D', 
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#b0bec5', // Warna abu jika belum cukup 3
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});