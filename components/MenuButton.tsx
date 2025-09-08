import React from "react";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export default function MenuButton() {
const navigation = useNavigation<DrawerNavigationProp<any>>();
// console.log("Parent navigators:", navigation.getParent()?.getState());

  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
  <Entypo name="menu" size={24} color="black" />
</TouchableOpacity>

  );
}
