import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import MenuButton from "@/components/MenuButton";
import { Feather, Ionicons, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsandPrivacy() {
  const menuItems = [
    { id: 1, title: "Account", icon: <Feather name="user" size={24} color="#6C7072" /> },
    { id: 2, title: "Notifications", icon: <Ionicons name="notifications-outline" size={24} color="#6C7072" /> },
    { id: 3, title: "Privacy and social media", icon: <SimpleLineIcons name="lock" size={24} color="#6C7072" /> },
    { id: 4, title: "Help and Support", icon: <AntDesign name="questioncircleo" size={24} color="#6C7072" /> },
    { id: 5, title: "General", icon: <Feather name="info" size={24} color="#6C7072" /> },
    { id: 6, title: "Accessibility", icon: <Ionicons name="accessibility-outline" size={24} color="#6C7072" /> },
  ];
 
  return (
     <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff",  paddingTop:1  }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <MenuButton />
          <Text style={styles.title}>settings and privacy</Text>
        </View>
        <Feather name="search" size={24} color="#1d1e1f" />
      </View>

      {/* Menu List */}
      <ScrollView>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              {item.icon}
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d1e1f",
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#1d1e1f",
  },
});
