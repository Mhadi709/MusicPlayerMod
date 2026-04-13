// components/ModalBottomSheet.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import UnifiedShareModal from "./UnifiedShareModal";

interface ModalBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(false);
 const [shareVisible, setShareVisible] = useState(false);
 const [isMenuVisible, setMenuVisible] = useState(false); 
 
const [shareSource, setShareSource] = useState<
  "menu" | "icon" | "lyrics" | null
>(null);


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay1}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          {/* Like */}
              <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            if (!isLiked) {
                              setIsLiked(true);
                              Toast.show({
                                type: "myunit",
                                text1: "You like this song",
                                position: "bottom",
                              });
                            } else {
                              setIsLiked(false);
                              Toast.show({
                                type: "myunit",
                                text1: "No Longer Liked.",
                                position: "bottom",
                              });
                            }
                            onClose();
                          }}
                        >

            {isLiked ? (
              <AntDesign name="heart" size={24} color="black" />
            ) : (
              <FontAwesome5 name="heart" size={24} color="black" />
            )}
            <Text style={styles.menuText}>{isLiked ? "Liked" : "Like"}</Text>
          </TouchableOpacity>

          {/* Add to Playlist */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (!inPlaylist) {
                router.push("/Addplaylist");
                setInPlaylist(true);
              } else {
                setInPlaylist(false);
                Toast.show({
                  type: "info",
                  text1: "Removed from Playlist",
                });
              }
              onClose();
            }}
          >
            <MaterialIcons
              name={
                inPlaylist ? "remove-circle-outline" : "add-circle-outline"
              }
              size={24}
              color="black"
            />
            <Text style={styles.menuText}>
              {inPlaylist ? "Remove from playlist" : "Add to playlist"}
            </Text>
          </TouchableOpacity>

          {/* Share */}
         <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShareSource("menu"); 
              onClose();              
              setTimeout(() => {
                setShareVisible(true);
              }, 400);
            }}
          >
            <Octicons name="share" size={24} color="black" />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>

          {/* View Artist */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/ArtistProfile");
              onClose();
            }}
          >
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuText}>View Artist</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
       <UnifiedShareModal
  visible={shareVisible}
  setVisible={setShareVisible}
  source={shareSource}   // ← "menu"
  title="Song Title"
  artist="Artist Name"
  image="https://example.com/cover.jpg"
/>

    </Modal>
    
  );
};

const styles = StyleSheet.create({
  overlay1: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ModalBottomSheet;
