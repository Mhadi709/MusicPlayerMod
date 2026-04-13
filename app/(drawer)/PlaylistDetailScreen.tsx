import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, TextInput, Modal } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { getUserPlaylistsApi, updatePlaylistNameApi } from "@/services/auth.api";
import { getMusicList } from "@/services/music.api"; 
import { navigateToNowPlaying } from "@/utils/navigation";
import UniversalAlert, { UniversalAlertProps } from "@/components/common/UniversalAlert";


export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { playlistId, initialName, playlistImage, trackIds } = useLocalSearchParams<{ 
    playlistId: string; 
    initialName: string; 
    playlistImage: string;
    trackIds: string;  
  }>();
  const parsedTrackIds: string[] = trackIds ? JSON.parse(trackIds) : [];
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverUri, setCoverUri] = useState<string | null>(null);
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

  useEffect(() => {
    loadPlaylistTracks();
  }, [playlistId]);

const loadPlaylistTracks = async () => {
  try {
    setLoading(true);
    const allPlaylists = await getUserPlaylistsApi(user.id);
    const currentPlaylist = allPlaylists.find((p: any) => p.id === playlistId);

    if (currentPlaylist?.track_ids?.length > 0) {
      const allTracks = await getMusicList(50);
      const playlistTracks = allTracks.filter((track: any) =>
        currentPlaylist.track_ids.includes(String(track.id))
      );
      console.log("Track pertama:", JSON.stringify(playlistTracks[0])); // ← cek field
      setSongs(playlistTracks);

      if (playlistTracks.length > 0) {
        const firstCover = playlistTracks[0].image && playlistTracks[0].image.trim() !== ""
          ? playlistTracks[0].image
          : "https://via.placeholder.com/300";
        setCoverUri(firstCover);
      }
    } else {
      setSongs([]);
    }
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

  // FUNGSI EDIT NAMA PLAYLIST
 const [playlistName, setPlaylistName] = useState(initialName);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(initialName);

  // FUNGSI EDIT NAMA (Solusi TypeScript & Android)
  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    try {
      setLoading(true);
      await updatePlaylistNameApi(playlistId, tempName);
      setPlaylistName(tempName);
      setEditModalVisible(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Cover Playlist */}
      <View style={styles.albumContainer}>
      <Image
  source={
    coverUri
      ? { uri: coverUri }
      : require("../../assets/images/Rectangle 464.png")
  }
  style={styles.albumCover}
/>
      </View>

     <UniversalAlert
      {...(alertConfig as UniversalAlertProps)}
      visible={alertVisible}
      onConfirm={() => setAlertVisible(false)}
      onCancel={() => setAlertVisible(false)}
    />
      {/* Info Playlist */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
           <View style={styles.titleRow}>
        <Text style={styles.albumTitle}>{playlistName}</Text>
        <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editIcon}>
          <Feather name="edit-2" size={18} color="#2CA58D" />
        </TouchableOpacity>
      </View>
      
       <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Playlist</Text>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateName} style={styles.saveBtn}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

          <View style={styles.artistRow}>
            <Image
              source={{ uri: user?.image || user?.picture || "https://via.placeholder.com/50" }}
              style={styles.artistImage}
            />
            <Text style={styles.artist}>{user?.full_name || "You"}</Text>
          </View>
          
         <Text style={styles.albumYear}>
        {(songs?.length ?? 0)} Tracks • Created by you
        </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity><Ionicons name="share-social-outline" size={22} color="black" /></TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton}><Feather name="arrow-down" size={22} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)}><Feather name="more-horizontal" size={22} color="black" /></TouchableOpacity>
          </View>
        </View>

        {/* Play Button */}
        <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Daftar Lagu di Playlist */}
      {loading ? (
        <ActivityIndicator size="large" color="#2CA58D" />
      ) : (
        <FlatList
         data={songs || []}
          keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.songRow}
          onPress={() => handlePlay(item)}
        >
          {/* Thumbnail lagu */}
          <Image
            source={{ uri: item.image && item.image.trim() !== "" ? item.image : "https://via.placeholder.com/300" }}
            style={styles.songThumbnail}
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            {/* Coba semua kemungkinan field nama */}
            <Text style={styles.songTitle}>{item.name || item.title || "Unknown Title"}</Text>
            <Text style={styles.songArtist}>{item.artist_name || item.artist || "Unknown Artist"}</Text>
          </View>

          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Feather name="more-horizontal" size={22} color="gray" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
          ListEmptyComponent={<Text style={styles.emptyText}>No songs in this playlist yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 20 },
  backButton: { marginTop: 50, marginBottom: 10 },
  albumContainer: { alignItems: "center" },
  albumCover: { width: 220, height: 220, borderRadius: 15 },
  infoContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 25 },
  textContainer: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  albumTitle: { fontSize: 26, fontWeight: "bold", color: '#000' },
  editIcon: { marginLeft: 10, padding: 5 },
  artistRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  artistImage: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  artist: { fontSize: 16, color: "#333", fontWeight: '500' },
  albumYear: { fontSize: 13, color: "gray", marginTop: 6 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 20 },
  downloadButton: { backgroundColor: "#2CA58D", width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  playButton: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: "#2CA58D", justifyContent: "center", alignItems: "center", elevation: 5 },
  songTitle: { fontSize: 16, fontWeight: "500", color: '#000' },
  songArtist: { fontSize: 13, color: "gray", marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
   modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', alignItems: 'center' 
  },
  songThumbnail: {
  width: 48,
  height: 48,
  borderRadius: 8,
  backgroundColor: "#F0F0F0",
},
songRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  borderBottomWidth: 0.5,
  borderBottomColor: "#F0F0F0",
},
  modalContent: {
    width: '80%', backgroundColor: 'white', 
    padding: 20, borderRadius: 15, alignItems: 'center'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: {
    width: '100%', borderBottomWidth: 1, borderBottomColor: '#2CA58D',
    fontSize: 16, paddingVertical: 5, marginBottom: 20, textAlign: 'center'
  },
  modalButtons: { flexDirection: 'row', gap: 20 },
  cancelBtn: { padding: 10, width: 80, alignItems: 'center' },
  saveBtn: { 
    backgroundColor: '#2CA58D', padding: 10, 
    borderRadius: 20, width: 80, alignItems: 'center' 
  },

});