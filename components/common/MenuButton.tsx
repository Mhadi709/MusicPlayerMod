import React from "react";
import { StyleSheet,TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAuth } from "@/hooks/useAuth";

export default function MenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { isProfileIncomplete } = useAuth(); 

  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ position: 'relative' }}>
      <Entypo name="menu" size={24} color="black" />
      
      {/* RED SIGN*/}
      {isProfileIncomplete && (
        <View style={styles.redDotMenu} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  redDotMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4D4D',
    borderWidth: 1.5,
    borderColor: '#fff',
  }
});
