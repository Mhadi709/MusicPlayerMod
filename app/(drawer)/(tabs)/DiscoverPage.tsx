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
import {  useNavigation, useRouter } from 'expo-router';
import { searchMusicJamendo } from "../../../services/music.api";
import { useSearchHistory } from "@/hooks/useSearchHistory";

// Interface untuk hasil pencarian musik
interface MusicReference {
  id: string;
  title: string;
  artist: string;
  image: any;
  audioUrl: string;
}

const DiscoverPage = () => {
  const router = useRouter();
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleSearchPress = () => {
    router.push('/ExplorePage');
  };

  const navigateToNowPlaying = (item: MusicReference) => {
    router.push({
      pathname: '/NowPlayingScreen',
      params: {
        id: item.id,
        title: item.title,
        artist: item.artist,
        image: item.image ?? '',
        audioUrl: item.audioUrl ?? '',
        lyrics: item.audioUrl ?? '',
      },
    });
  };

  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState('');
  const [musicResults, setMusicResults] = useState<MusicReference[]>([]);

  // Suggestions = history yang cocok dengan query saat ini
  const suggestions = searchQuery
    ? history.filter(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Efek search dengan debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchQuery) {
        setMusicResults([]);
        return;
      }
      try {
        const results = await searchMusicJamendo(searchQuery, 15);
        setMusicResults(results);
      } catch (e) {
        console.log("ERR SEARCH JAMENDO:", e);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearchSubmit = (text: string) => {
    if (!text.trim()) return;
    setSearchQuery(text);
    addHistory(text); 
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // --- RENDER FUNCTIONS ---
  const renderMusicCard = ({ item }: { item: MusicReference }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.musicCard}
      activeOpacity={0.8}
      onPress={() => navigateToNowPlaying(item)}
    >
      <Image source={item.image} style={styles.musicImage} />
      <View style={styles.musicTextContainer}>
        <Text style={styles.musicTitle}>{item.title}</Text>
        <Text style={styles.musicArtist}>{item.artist}</Text>
      </View>
      <Feather name="more-horizontal" size={20} color="#555" />
    </TouchableOpacity>
  );

  // Render item history atau suggestion
  const renderSearchItem = (text: string, type: 'history' | 'suggestion') => (
    <TouchableOpacity
      key={text}
      style={styles.searchItem}
      onPress={() => handleSearchSubmit(text)}
    >
      <Feather
        name={type === 'history' ? 'clock' : 'search'}
        size={22}
        color="#555"
        style={styles.leftIcon}
      />
      <Text style={[styles.itemText, { flex: 1 }]}>{text}</Text>
      {type === 'history' ? (
        // Tombol hapus per item history
        <TouchableOpacity
          onPress={() => removeHistory(text)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Feather name="x" size={18} color="#aaa" />
        </TouchableOpacity>
      ) : (
        <Feather name="arrow-up-right" size={22} color="#555" />
      )}
    </TouchableOpacity>
  );

  const renderContent = () => {
    // Saat tidak ada query — tampilkan history
    if (!searchQuery) {
      if (history.length === 0) {
        return (
          <View style={styles.playWhatYouLikeContainer}>
            <Text style={styles.playWhatYouLikeTitle}>Play What You Like</Text>
            <Text style={styles.playWhatYouLikeSubtitle}>
              Search for songs, artists, playlists...
            </Text>
          </View>
        );
      }
      return (
        <View>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Riwayat Pencarian</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearAllText}>Hapus Semua</Text>
            </TouchableOpacity>
          </View>
          {history.map(h => renderSearchItem(h, 'history'))}
        </View>
      );
    }

    // Saat ada query — tampilkan suggestions + hasil musik
    return (
      <FlatList
        data={musicResults}
        renderItem={renderMusicCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* Suggestions dari history yang cocok */}
            {suggestions.length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
                  Saran
                </Text>
                {suggestions.map(s => renderSearchItem(s, 'suggestion'))}
              </View>
            )}
            {musicResults.length > 0 && (
              <Text style={styles.sectionHeader}>Lagu</Text>
            )}
          </>
        }
        ListEmptyComponent={
          suggestions.length === 0 ? (
            <Text style={styles.noResultsText}>
              No results found for "{searchQuery}"
            </Text>
          ) : null
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
    sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  clearAllText: {
    color: "#2CA58D",
    fontSize: 13,
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