import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal, TextInput, ActivityIndicator, Alert} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { createPlaylistApi, addTrackToPlaylistApi, getUserPlaylistsApi } from "@/services/auth.api";
import { Image as ExpoImage } from 'expo-image';
import UniversalAlert, { UniversalAlertProps } from "@/components/common/UniversalAlert";
import { getMusicList } from "@/services/music.api";
import { usePlaylist } from "@/context/PlaylistContext";

export default function AddPlaylist() {
  const router = useRouter();
  const { user } = useAuth();
  const { trackId, type } = useLocalSearchParams(); 
  // State UI
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const contentType = (type as string) || "music";
  // State Data
  const [playlistNameInput, setPlaylistNameInput] = useState("");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // state Alert popup
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  const { refreshPlaylists,  playlistCovers } = usePlaylist();

  // 1. Load Daftar Playlist saat halaman dibuka
useEffect(() => {
  if (user?.id) refreshPlaylists(user.id);
}, [user]);

  // 2. Fungsi Membuat Playlist Baru
  const handleCreateNewPlaylist = async () => {
  if (!playlistNameInput.trim()) return;

  try {
    setLoading(true);
   await createPlaylistApi(user.id, playlistNameInput, contentType);
  await refreshPlaylists(user.id); 
    setPlaylistNameInput("");
    setIsModalVisible(false);
    setAlertConfig({
      type: 'success',
      title: 'Playlist Dibuat!',
      message: 'Playlist berhasil dibuat.',
      confirmText: 'OK',
    });
    setAlertVisible(true);
  } catch (e) {
    setAlertConfig({
      type: 'error',
      title: 'Gagal!',
      message: 'Gagal membuat playlist, silakan coba lagi.',
      confirmText: 'Coba Lagi',
    });
    setAlertVisible(true);
  } finally {
    setLoading(false);
  }
};

const handleFinished = async () => {
  if (!selectedPlaylistId) {
    setAlertConfig({
      type: 'reminder',
      title: 'Pilih Playlist',
      message: 'Silakan pilih playlist terlebih dahulu.',
      confirmText: 'OK',
    });
    setAlertVisible(true);
    return;
  }

  try {
    setLoading(true);
   await addTrackToPlaylistApi(selectedPlaylistId, trackId as string);
    await refreshPlaylists(user.id); 
    
    // ← Log untuk debug
    console.log("Track ditambahkan:", trackId, "ke playlist:", selectedPlaylistId);

    setAlertConfig({
      type: 'success',
      title: 'Berhasil!',
      message: 'Lagu berhasil ditambahkan ke playlist.',
      confirmText: 'OK',
    });
    setAlertVisible(true);

  } catch (e) {
    console.log("Error addTrack:", e); // ← lihat error aslinya
    setAlertConfig({
      type: 'error',
      title: 'Gagal!',
      message: 'Gagal menambahkan lagu atau lagu sudah ada di playlist.',
      confirmText: 'Coba Lagi',
    });
    setAlertVisible(true);
  } finally {
    setLoading(false);
  }
};

 // Ganti komponen PlaylistCover
function PlaylistCover({ item }: { item: any }) {
  const { playlistCovers } = usePlaylist();
  const covers = playlistCovers[item.id] || [];
  
  if (covers.length >= 4) {
    return (
      <View style={coverStyles.grid}>
        {covers.map((uri, i) => (
          <ExpoImage key={i} source={{ uri }} style={coverStyles.gridItem} contentFit="cover" cachePolicy="memory-disk" />
        ))}
      </View>
    );
  }
  if (covers.length > 0) {
    return <ExpoImage source={{ uri: covers[0] }} style={coverStyles.single} contentFit="cover" cachePolicy="memory-disk" />;
  }
  return (
    <View style={coverStyles.placeholder}>
      <Text style={coverStyles.placeholderText}>{item.name?.substring(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const coverStyles = StyleSheet.create({
  grid: {
    width: 60, height: 60,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 4,
    overflow: "hidden",
  },
  gridItem: {
    width: 30, height: 30,
  },
  single: {
    width: 60, height: 60,
    borderRadius: 4,
  },
  placeholder: {
    width: 60, height: 60,
    borderRadius: 4,
    backgroundColor: "#2CA58D",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
});

 return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add To Playlist</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tombol Buka Modal */}
        <View style={styles.container1}>
          <TouchableOpacity 
            style={styles.createPlaylistButton} 
            onPress={() => setIsModalVisible(true)} 
          >
            <Text style={styles.createPlaylistButtonText}>Create A Playlist</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Name Your Playlist</Text>

              {/* Input Field Design */}
              <TextInput
                style={styles.input}
                placeholder="Enter Playlist Name"
                placeholderTextColor="#999"
                value={playlistNameInput}
                onChangeText={setPlaylistNameInput}
                autoFocus
              />

              {/* Button Container - Stacked Vertical */}
              <View style={styles.modalButtonContainer}>
                {/* Create Button */}
                <TouchableOpacity 
                  style={styles.modalCreateButton} 
                  onPress={handleCreateNewPlaylist}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.modalCreateButtonText}>Create</Text>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        {/* Daftar Playlist dari Database */}
              {playlists.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.playlistItem}
                onPress={() => setSelectedPlaylistId(item.id)}
              >
                {/* Ganti imageContainer lama dengan ini */}
                <PlaylistCover item={item} />

                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName}>{item.name}</Text>
                  <Text style={styles.songCount}>{item.track_ids?.length || 0} Song</Text>
                </View>

                <View style={[styles.radioCircle, selectedPlaylistId === item.id && styles.radioActive]}>
                  {selectedPlaylistId === item.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
      </ScrollView>

 <UniversalAlert
  {...(alertConfig as UniversalAlertProps)}
  visible={alertVisible}
  onConfirm={() => {
    setAlertVisible(false);
    if (alertConfig?.type === 'success') {
      router.back(); // ← navigate setelah sukses
    }
  }}
  onCancel={() => setAlertVisible(false)}
/>
      {/* Finished Button (Warna Gelap di Bawah) */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.finishedButton}
          onPress={handleFinished}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.finishedButtonText}>Finished</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 }, // Background utama putih/abu terang
  
  // Header Styles
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600", textAlign: 'center', flex: 1, marginRight: 28, color: '#333' },
  
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  container1: { alignItems: 'center', marginBottom: 30 },

  // Tombol Create A Playlist (Background Gelap di halaman utama)
  createPlaylistButton: {
    backgroundColor: "#208C76",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
  },
  createPlaylistButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
  },
  modalContent: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '85%', 
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    color: "#000",
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#D9D9D9', // Abu-abu lebih gelap sedikit untuk input
    borderWidth: 1,
    borderColor: '#000', 
    borderRadius: 25, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  modalButtonContainer: {
    width: '100%',
    gap: 10, 
  },
  // Tombol Create di Modal (Hijau Solid)
  modalCreateButton: {
    backgroundColor: '#3AA888',
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10, // Fallback untuk gap
  },
  modalCreateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Tombol Cancel di Modal (Outline Hijau / Background Abu)
  modalCancelButton: {
    backgroundColor: '#D9D9D9', // Background abu transparan
    borderWidth: 2,
    borderColor: '#3AA888', // Border Hijau
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#3AA888', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Playlist Item Styles
  playlistItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  imageContainer: { position: 'relative', width: 60, height: 60, marginRight: 15 },
  playlistImage: { width: '100%', height: '100%', borderRadius: 4 },
  imageOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 4 
  },
  imageTextOverlay: { color: '#AEFF00', fontSize: 30, fontWeight: 'bold', opacity: 0.5 }, 

  playlistInfo: { flex: 1 },
  playlistName: { fontSize: 16, fontWeight: "bold", color: '#000' },
  songCount: { fontSize: 14, color: "gray", marginTop: 4 },

  // Radio Button Styles
  radioCircle: {
    height: 24, width: 24, borderRadius: 12, borderWidth: 2, borderColor: "#000",
    alignItems: "center", justifyContent: "center",
  },
  radioActive: {
    borderColor: '#000', 
  },
  radioDot: { height: 14, width: 14, borderRadius: 7, backgroundColor: "#000" }, 

  // Footer / Finished Button
  footerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  finishedButton: {
    backgroundColor: "#208C76", 
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  finishedButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});