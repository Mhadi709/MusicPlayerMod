import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

type Props = {
  isShareVisible: boolean;
  setShareVisible: (val: boolean) => void;
};

export default function ShareModal({ isShareVisible, setShareVisible }: Props) {
  return (
    <Modal visible={isShareVisible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={() => setShareVisible(false)} 
      >

        {/* Content */}
        <View style={styles.container}>
          {/* Album cover & info */}
          <View style={styles.songCard}>
            <Image
              source={require("../../assets/images/Rectangle 464.png")}
              style={styles.albumCover}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.songTitle}>Let Me Love You</Text>
              <Text style={styles.songArtist}>DJ Snake</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Share options */}
          <Text style={styles.shareText}>Share Via Following :</Text>
          <View style={styles.iconRow}>
            {/* Copy Link */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Toast.show({
                  type: "copyToast",
                  text1: "Link copied",
                  position: "bottom",
                });
                setShareVisible(false);   // ✅ otomatis tutup setelah aksi
                
              }}
            >
              <Feather name="link" size={28} color="white" />
              <Text style={styles.iconLabel}>Copy Link</Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="whatsapp" size={28} color="white" />
              <Text style={styles.iconLabel}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="instagram" size={28} color="white" />
              <Text style={styles.iconLabel}>Instagram</Text>
            </TouchableOpacity>

            {/* Other */}
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={28}
                color="white"
              />
              <Text style={styles.iconLabel}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "#064E3B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#047857",
    borderRadius: 12,
    padding: 10,
  },
  albumCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  songTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  songArtist: {
    color: "white",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#16A34A",
    marginVertical: 15,
  },
  shareText: {
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
});
