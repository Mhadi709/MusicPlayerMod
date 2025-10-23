import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

type Props = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  title?: string;
  artist?: string;
  lyrics?: string[];
};

export default function LirikModal({ visible, setVisible }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => setVisible(false)}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Lirik Box */}
          <View style={styles.lyricBox}>
            <Text style={styles.lyricText}>Don’t remind me</Text>
            <Text style={styles.lyricText}>I’m minding my own damn business</Text>
            <Text style={styles.lyricText}>Don’t try to find me</Text>
            <Text style={styles.lyricText}>I’m better left alone than in this</Text>
            <Text style={[styles.lyricText, { opacity: 0.6 }]}>
              It doesn’t surprise me
            </Text>
            <Text style={[styles.lyricText, { opacity: 0.6 }]}>
              Do you really think that I could care
            </Text>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.songTitle}>Let Me Love You</Text>
              <Text style={styles.songArtist}>DJ Snake</Text>
            </View>

            <TouchableOpacity style={styles.shareButton}>
              <Feather name="share-2" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Share Options */}
          <Text style={styles.shareText}>Share Via Following :</Text>
          <View style={styles.iconRow}>
            {/* Copy Link */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Toast.show({
                  type: "success",
                  text1: "Link copied",
                  position: "bottom",
                });
                setVisible(false);
              }}
            >
              <Feather name="link" size={26} color="white" />
              <Text style={styles.iconLabel}>Copy Link</Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="whatsapp" size={26} color="white" />
              <Text style={styles.iconLabel}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="instagram" size={26} color="white" />
              <Text style={styles.iconLabel}>Instagram</Text>
            </TouchableOpacity>

            {/* Other */}
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="dots-horizontal" size={26} color="white" />
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
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    backgroundColor: "#064E3B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  lyricBox: {
    backgroundColor: "#047857",
    borderRadius: 16,
    padding: 20,
    position: "relative",
  },
  lyricText: {
    color: "white",
    fontSize: 14,
    lineHeight: 22,
  },
  songTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  songArtist: {
    color: "white",
    opacity: 0.8,
  },
  shareButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 50,
  },
  divider: {
    height: 1,
    backgroundColor: "#16A34A",
    marginVertical: 15,
  },
  shareText: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
});
