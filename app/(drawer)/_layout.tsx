import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ChartUp from "../../assets/images/chart_up.svg";
import { LinearGradient } from "expo-linear-gradient";
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import MenuButton from "../../components/MenuButton";
import { useState } from "react";
type DrawerItemProps = {
  icon: React.ReactNode;
  label: string;  
  isActive: boolean;
  onPress?: () => void;
};


const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, isActive, onPress }) => {
  if (isActive) {
    return (
      <LinearGradient
        colors={["#113F36", "#FCFCFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.navItem}
      >
        {icon}
        <Text style={[styles.navLabel, { color: "#fff" }]}>{label}</Text>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      {icon}
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
};


export default function DrawerLayout() {
  function go(arg0: string): (() => void) | undefined {
    throw new Error("Function not implemented.");
  }
   const [activeIndex] = useState<number>(0); 

  return (
 <GestureHandlerRootView style={{ flex: 1 }}>
 <Drawer
  screenOptions={{ headerShown: false, 
    drawerStyle:{ width: 260,},
      headerLeft: () => <MenuButton />,
    }}
  drawerContent={(drawerProps: DrawerContentComponentProps) => {
    const activeIndex = drawerProps.state.index;
    const go = (name: string) => () => {
      drawerProps.navigation.navigate(name as never);
      drawerProps.navigation.closeDrawer();
    };

    return (
      <View style={styles.container}>
        {/* --- Header & Profile --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => drawerProps.navigation.closeDrawer()}
            style={styles.closeButton}
          >
            <View style={styles.closeCircle}>
              <Octicons name="x" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/Prifile.jpg")}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Sophia Rose</Text>
            <Text style={styles.profileTitle}>UX/UI Designer</Text>
          </View>
        </View>

        {/* --- Divider --- */}
        <View style={styles.divider} />

        {/* --- Navigation Items --- */}
        <View style={styles.navItems}>
      <DrawerItem
      icon={<Octicons name="home" size={24} color="#949494" />}
      label="Home"
      isActive={activeIndex === 0}
      onPress={go("(tabs)")}
    />
    <DrawerItem
    icon={<ChartUp width={29} height={29} fill="#949494" />}
    label="Featured"
    isActive={activeIndex === 1}
    onPress={go("Featured")}
  />

    <DrawerItem
      icon={<MaterialIcons name="album" size={24} color="#949494" />}
      label="album playlist"
      isActive={activeIndex === 2}
      onPress={go("albumplaylist")}
    />

    <DrawerItem
      icon={<Ionicons name="notifications-outline" size={24} color="#949494" />}
      label="Notifications"
      isActive={activeIndex === 3}
      onPress={go("Notifications")}
    />

    <DrawerItem
      icon={<Feather name="bookmark" size={24} color="#949494" />}
      label="Bookmarks"
      isActive={activeIndex === 4}
      onPress={go("Bookmarks")}
    />
    <DrawerItem
      icon={<Feather name="user" size={24} color="#949494" />}
      label="profil"
      isActive={activeIndex === 5}
      onPress={go("profil")}
    />

    <DrawerItem
      icon={<Ionicons name="settings-outline" size={24} color="#949494" />}
      label="settings and privacy"
      isActive={activeIndex === 6}
      onPress={go("settingsandprivacy")}
    />
        </View>

        {/* --- Logout di bawah --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Entypo
              name="login"
              size={24}
              color="black"
              style={{ transform: [{ rotateY: "180deg" }] }}
            />
            <Text style={styles.logoutLabel}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }}
>
  <Drawer.Screen
    name="(tabs)"
    options={{ drawerLabel: "Home", title: "" }}
  />
  {/* <Drawer.Screen name="Featured" options={{ drawerLabel: "Featured" }} />

  <Drawer.Screen
    name="albumplaylist"
    options={{ drawerLabel: "Pesan" }}
  />
  <Drawer.Screen
    name="Notifications"
    options={{ drawerLabel: "Notifikasi" }}
  />
  <Drawer.Screen
    name="Bookmarks"
    options={{ drawerLabel: "Tersimpan" }}
  />
  <Drawer.Screen
    name="profil"
    options={{ drawerLabel: "profil" }}
  />
  <Drawer.Screen
    name="settingsandprivacy"
    options={{ drawerLabel: "settings and privacy" }}
  /> */}
</Drawer>
</GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: 7,
  },
  closeCircle: {
    width: 33,
    height: 33,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ddd",
    marginTop:2,
    marginBottom:5,
  },
  divider: {
  height: 1,
  backgroundColor: "#ddd",
  marginLeft: 6,   // kasih jarak kiri
  marginTop: 10,
  width: "80%",     // panjang garis cuma setengah
},
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 35,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  navItems: {
    paddingTop: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 3,   // beri jarak antar item
  paddingTop: 20,
  },
  navLabel: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight:'medium',
    color: "#161010ff",
  },
footer: {
  padding: 16,
  marginTop: "auto",
},
logoutButton: {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderRadius: 10,
  overflow: "hidden",
},
logoutLabel: {
  fontSize: 16,
  marginLeft: 10,
  color: "#000",
},

});
