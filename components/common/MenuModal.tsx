import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

// Definisikan tipe untuk setiap item menu
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress?: (event?: GestureResponderEvent) => void;
}

//  Definisikan tipe untuk props komponen
interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose, items }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          {items.map((item: MenuItem, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                item.onPress?.(); 
                onClose(); 
              }}
            >
              {item.icon}
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(61, 131, 47, 0.2)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },
});

export default MenuModal;
