// SortMenu.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

interface SortMenuProps {
  onSortChange: (option: string) => void; 
}

const SortMenu: React.FC<SortMenuProps> = ({ onSortChange }) => {
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("Baru Diputar");

  const sortOptions = ["Baru Diputar", "Baru Disimpan", "Nama (Z-A)"];

  const handleSelectSort = (option: string) => {
    setSelectedSort(option);
    setSortVisible(false);
    onSortChange(option); 
  };

  return (
    <View style={{ margin: 12 }}>
      {/* Tombol Urutan */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => setSortVisible(true)}
      >
        <MaterialIcons name="swap-vert" size={22} color="#000" />
        <Text style={{ marginLeft: 4, fontSize: 14, color: "#000" }}>
          Urutan
        </Text>
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal
        transparent
        visible={sortVisible}
        animationType="fade"
        onRequestClose={() => setSortVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
               <Pressable onPress={() => setSortVisible(false)}>
                <View style={styles.divider} />
                </Pressable>
                <Text style={styles.header}>Urutkan Berdasarkan</Text>
                

                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionRow}
                    onPress={() => handleSelectSort(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {selectedSort === option && (
                      <AntDesign name="check" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SortMenu;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#0B3129",
    marginHorizontal: 0,
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    padding: 17,
    paddingBottom: 25,
  },
  header: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 2, 
    marginHorizontal: 134,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
});