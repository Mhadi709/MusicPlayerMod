import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useState } from "react";
import { router, useRouter } from "expo-router";

export default function AddPlaylist() {
  const [isModalVisible, setIsModalVisible] = useState(false);
 const router = useRouter();
  const showPlaylistModal = () => setIsModalVisible(true);
  const hidePlaylistModal = () => setIsModalVisible(false);

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
        {/* Create a Playlist Button */}
        <View style={styles.container1}>
          <TouchableOpacity style={styles.createPlaylistButton} onPress={showPlaylistModal}>
            <Text style={styles.createPlaylistButtonText}>Create A Playlist</Text>
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={hidePlaylistModal}
          >
            
            <View style={styles.modalContainer}>
              <LinearGradient colors={["#00A383", "#003D31"]} style={styles.modalContent}>
                {/* Title */}
                <Text style={styles.modalTitle}>Name Your Playlist</Text>

                {/* Input */}
                <TextInput
                  style={styles.input}
                  placeholderTextColor="black"
                />
                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={hidePlaylistModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </Modal>
        </View>

        {/* Existing Playlist Item */}
        <View style={styles.playlistItem}>
          <Image
            source={require("../assets/images/Rectangle 464.png")}
            style={styles.playlistImage}
          />
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>Songs That I Like</Text>
            <Text style={styles.songCount}>32 Song</Text>
          </View>
          <TouchableOpacity style={styles.radioCircle}>
            <View style={styles.radioDot} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Finished Button */}
      <TouchableOpacity
      style={styles.finishedButton}
      onPress={() => {
        router.push("/NowPlayingScreen?toast=save"); // ✅ kirim query param
      }}
    >
      <Text style={styles.finishedButtonText}>Finished</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 90 },
  content: { paddingHorizontal: 20, paddingVertical: 30 },
  container1: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  createPlaylistButton: {
    backgroundColor: "#37975f",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
    width: "60%",
    marginBottom: 20,
  },
  createPlaylistButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },

  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
 modalContent: {
  padding: 20,          // padding jangan terlalu besar biar konten muat
  borderRadius: 15,
  width: 344,           
  height: 288,         
  alignItems: 'center',
  justifyContent: 'center', 
},

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
   borderBottomColor: '#fff',  // ✅ garis putih
  color: '#fff',   
    width: '100%',
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap:15
  },

  cancelButton: {
    borderWidth: 2,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginRight: 10,
    marginHorizontal: 8,
  },
  cancelButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },

  createButton: {
    backgroundColor: '#034B3D',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  createButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },

  playlistItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  playlistImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15 },
  playlistInfo: { flex: 1 },
  playlistName: { fontSize: 16, fontWeight: "bold" },
  songCount: { fontSize: 14, color: "gray" },
  radioCircle: {
    height: 24, width: 24, borderRadius: 12, borderWidth: 2, borderColor: "#ccc",
    alignItems: "center", justifyContent: "center",
  },
  radioDot: { height: 12, width: 12, borderRadius: 6, backgroundColor: "#4e8f69", opacity: 0 },

  finishedButton: {
    backgroundColor: "#37975f",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginBottom: 50,
  },
  finishedButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
});
