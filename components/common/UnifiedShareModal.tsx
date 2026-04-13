import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

type ShareSource = "menu" | "icon" | "lyrics" | null;

type Props = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  source: ShareSource;
  title?: string;
  artist?: string;
  image?: string;
  lyrics?: string[];
};

export default function UnifiedShareModal({
  visible,
  setVisible,
  source,
  title,
  artist,
  image,
  lyrics,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={() => setVisible(false)}
      >
        <View style={styles.container}>

          {/* ===== HEADER SONG CARD ===== */}
          <View style={styles.songCard}>
            <Image
              source={{
                uri:
                  image ??
                  "https://via.placeholder.com/80x80.png?text=Cover",
              }}
              style={styles.albumCover}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {title ?? "Unknown Title"}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {artist ?? "Unknown Artist"}
              </Text>
            </View>
          </View>

          {/* ===== LYRICS PREVIEW (KHUSUS LYRICS) ===== */}
          {source === "lyrics" && (
            <View style={styles.lyricsBox}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {(lyrics && lyrics.length > 0
                  ? lyrics.slice(0, 6)
                  : ["Lyrics not available"]
                ).map((line, index) => (
                  <Text key={index} style={styles.lyricText}>
                    {line}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ===== SHARE OPTIONS ===== */}
          <Text style={styles.shareText}>Share Via</Text>

          <View style={styles.iconRow}>
            <ShareButton
              icon="link"
              label="Copy Link"
              onPress={() => {
                Toast.show({
                  type: "success",
                  text1: "Link copied",
                  position: "bottom",
                });
                setVisible(false);
              }}
            />

            <ShareButton icon="whatsapp" label="WhatsApp" />
            <ShareButton icon="instagram" label="Instagram" />
            <ShareButton icon="dots-horizontal" label="Other" />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}



type ShareButtonProps = {
  icon: "link" | "whatsapp" | "instagram" | "dots-horizontal";
  label: string;
  onPress?: () => void;
};

function ShareButton({ icon, label, onPress }: ShareButtonProps) {
  const renderIcon = () => {
    switch (icon) {
      case "link":
        return <Feather name="link" size={26} color="white" />;
      case "whatsapp":
        return <FontAwesome5 name="whatsapp" size={26} color="white" />;
      case "instagram":
        return <Feather name="instagram" size={26} color="white" />;
      case "dots-horizontal":
        return (
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={26}
            color="white"
          />
        );
    }
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      {renderIcon()}
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#228f75",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  songCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  albumCover: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#333",
  },

  songTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  songArtist: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },

  lyricsBox: {
    backgroundColor: "#00D1A1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    maxHeight: 120,
  },

  lyricText: {
    color: "#e0e0e0",
    fontSize: 14,
    lineHeight: 20,
  },

  shareText: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 12,
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconButton: {
    alignItems: "center",
    width: 70,
  },

  iconLabel: {
    color: "white",
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
});
