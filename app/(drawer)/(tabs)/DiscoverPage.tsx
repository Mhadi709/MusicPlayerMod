import { Feather, AntDesign } from '@expo/vector-icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import { router, useNavigation, useRouter } from 'expo-router';
import { Route } from 'expo-router/build/Route';

// Interface untuk setiap item dalam daftar gabungan
interface SearchListItem {
  id: string; // ID unik untuk key
  text: string;
  type: 'history' | 'suggestion'; // Membedakan riwayat dan saran
  
}

// Interface untuk hasil pencarian musik
interface MusicReference {
  id: string;
  title: string;
  artist: string;
  image: any;
}

const DiscoverPage = () => {
   const router = useRouter();

  useEffect(() => {
    // Misalnya: kode khusus halaman ini
  }, []);

  
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleSearchPress =() => {
    router.push('/(drawer)/(tabs)/ExplorePage');
  };


   const allMusic: MusicReference[] = [
    { id: '1', title: 'Sardaar Ji', artist: 'Diljit Dosanjh', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '2', title: 'Radio', artist: 'Lana Del Rey', image: require('../../../assets/images/Afgan.webp') },
    { id: '3', title: 'I Guess', artist: 'KRSNA', image: require('../../../assets/images/Ed Sheeran.webp') },
    { id: '4', title: 'No Cap', artist: 'KRSNA', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '5', title: 'Blinding Lights', artist: 'The Weeknd', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '6', title: 'As It Was', artist: 'Harry Styles', image: require('../../../assets/images/Afgan.webp') },
    { id: '7', title: 'Levitating', artist: 'Dua Lipa', image: require('../../../assets/images/Ed Sheeran.webp') },
    { id: '8', title: 'Good 4 U', artist: 'Olivia Rodrigo', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '9', title: 'Stay', artist: 'The Kid LAROI', image: require('../../../assets/images/Afgan.webp') },
    { id: '10', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '11', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '12', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '13', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '14', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '15', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
    { id: '16', title: 'Peaches', artist: 'Justin Bieber', image: require('../../../assets/images/Justin Bieber.jpg') },
  ];

  const allSuggestions: SearchListItem[] = [
    { id: 's1', text: 'Trending Songs', type: 'suggestion' },
    { id: 's2', text: 'Popular Artists', type: 'suggestion' },
    { id: 's3', text: 'New Playlists', type: 'suggestion' },
    { id: 's4', text: 'Hindia', type: 'suggestion' },
    { id: 's5', text: 'Heartbreak Anniversary', type: 'suggestion' },
  ];

  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState('');
  const [musicResults, setMusicResults] = useState<MusicReference[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchListItem[]>([
    { id: 'h1', text: 'K-Pop Hits', type: 'history' }
  ]);
  const [displayList, setDisplayList] = useState<SearchListItem[]>([]);

  // --- LOGIKA UTAMA ---

  // Efek untuk memfilter daftar saran/riwayat saat mengetik
  useEffect(() => {
    if (searchQuery) {
      // Saat mengetik, cari musik secara langsung
      const filteredMusic = allMusic.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMusicResults(filteredMusic);

      // Dan juga siapkan daftar saran
      const filteredSuggestions = allSuggestions.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayList(filteredSuggestions);
    } else {
      // Jika input kosong, reset semuanya
      setMusicResults([]);
      setDisplayList(searchHistory); // Tampilkan riwayat
    }
  }, [searchQuery, searchHistory]);

  const handleSearchSubmit = (text: string) => {
    if (!text) return;
    setSearchQuery(text);
    Keyboard.dismiss();

    if (!searchHistory.some(h => h.text === text)) {
      const newHistoryItem: SearchListItem = { id: `h${Date.now()}`, text, type: 'history' };
      setSearchHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // --- RENDER FUNCTIONS ---

  const renderMusicCard = ({ item }: { item: MusicReference }) => (
    <View style={styles.musicCard}>
      <Image source={item.image} style={styles.musicImage} />
      <View style={styles.musicTextContainer}>
        <Text style={styles.musicTitle}>{item.title}</Text>
        <Text style={styles.musicArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={20} color="#555" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchItem = ({ item }: { item: SearchListItem }) => (
    <TouchableOpacity style={styles.searchItem} onPress={() => handleSearchSubmit(item.text)}>
      <Feather name={item.type === 'history' ? 'clock' : 'search'} size={22} color="#555" style={styles.leftIcon} />
      <Text style={styles.itemText}>{item.text}</Text>
      <Feather name="arrow-up-right" size={22} color="#555" />
    </TouchableOpacity>
  );

  const renderContent = () => {
    // Jika tidak ada query, tampilkan "Play What You Like"
    if (!searchQuery) {
      return (
        <View style={styles.playWhatYouLikeContainer}>
          <Text style={styles.playWhatYouLikeTitle}>Play What You Like</Text>
          <Text style={styles.playWhatYouLikeSubtitle}>Search for songs, artists, playlists...</Text>
        </View>
      );
    }

    // Jika ada query, tampilkan hasil
    return (
      <FlatList
        data={musicResults}
        renderItem={renderMusicCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
  <>
    {/* .map() sekarang mengembalikan elemen dengan key */}
    {displayList.map(item => (
      // renderSearchItem dipanggil di dalam elemen dengan key unik
      <View key={item.id}> 
        {renderSearchItem({ item })}
      </View>
    ))}
    {musicResults.length > 0 && <Text style={styles.sectionHeader}>Songs</Text>}
  </>
}
        ListEmptyComponent={
            <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
       <TouchableOpacity onPress={handleSearchPress}>
         <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs, artists..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={(event) => handleSearchSubmit(event.nativeEvent.text)}
          returnKeyType="search"
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {renderContent()}

    </SafeAreaView>
  );
};

// --- STYLESHEET (Termasuk style yang hilang) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    marginLeft: 20,
  },
  clearIcon: {
    padding: 5,
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  leftIcon: {
    marginRight: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  musicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  musicImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  musicTextContainer: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  musicArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  // Style untuk "Play What You Like" yang ditambahkan kembali
  playWhatYouLikeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playWhatYouLikeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  playWhatYouLikeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  }
});

export default DiscoverPage;