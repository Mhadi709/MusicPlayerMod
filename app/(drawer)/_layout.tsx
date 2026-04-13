import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ChartUp from "../../assets/images/chart_up.svg";
import { LinearGradient } from "expo-linear-gradient";
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import MenuButton from "../../components/common/MenuButton";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import UniversalAlert, { UniversalAlertProps } from "@/components/common/UniversalAlert";
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
        <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          {icon}
          <Text style={[styles.navLabel, { color: "#fff" }]}>{label}</Text>
        </TouchableOpacity>
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
  const router = useRouter();
  const { isProfileIncomplete } = useAuth();
  // 2. AMBIL DATA USER DAN FUNGSI LOGOUT
  const { user, logout } = useAuth(); 
  const segments = useSegments();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  const handleLogout = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setAlertVisible(false);
        await logout();
        router.replace('/(onboarding)/welcome');
      },
    });
    setAlertVisible(true);
  };
 const userInitial = user?.full_name 
    ? user.full_name.charAt(0).toUpperCase() 
    : "U";
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{ 
          headerShown: false, 
          drawerStyle: { width: 260 },
          headerLeft: () => <MenuButton />,
        }}
        drawerContent={(drawerProps: DrawerContentComponentProps) => {
          const activeIndex = drawerProps.state.index;
          const currentRouteName = drawerProps.state.routes[activeIndex].name;

          const go = (name: string) => () => {
            drawerProps.navigation.navigate(name as never);
            drawerProps.navigation.closeDrawer();
          };

          return (
            <View style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => drawerProps.navigation.closeDrawer()}
                  style={styles.closeButton}
                >
                  <View style={styles.closeCircle}>
                    <Octicons name="x" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

              <UniversalAlert
            {...(alertConfig as UniversalAlertProps)}
            visible={alertVisible}
            onConfirm={async () => {
              if ((alertConfig as any).onConfirm) {
                await (alertConfig as any).onConfirm();
              } else {
                setAlertVisible(false);
              }
            }}
            onCancel={() => setAlertVisible(false)}
          />

              {/* --- Bagian yang bisa di-Scroll (Profile + Nav) --- */}
              <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
              >
             <View style={styles.profileSection}>
              {user?.image || user?.picture ? (
                // Tampilkan Foto jika ada
                <Image
                  source={{ uri: user.image || user.picture }}
                  style={styles.profileImage}
                />
              ) : (
                // Tampilkan Inisial Huruf jika foto kosong
                <View style={[styles.profileImage, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
              )}
              
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.full_name || "Guest User"}
                </Text>
                <Text style={styles.profileTitle}>
                  {user?.email || "User Account"}
                </Text>
              </View>
            </View>

                <View style={styles.divider} />

                <View style={styles.navItems}>
                  <DrawerItem
                    icon={<Octicons name="home" size={24} color={currentRouteName === "(tabs)" ? "#fff" : "#949494"} />}
                    label="Home"
                    isActive={currentRouteName === "(tabs)"}
                    onPress={go("(tabs)")}
                  />
                  <DrawerItem
                    icon={<ChartUp size={24} fill={currentRouteName === "Featured" ? "#fff" : "#949494"} />}
                    label="Featured"
                    isActive={currentRouteName === "Featured"}
                    onPress={go("Featured")}
                  />
                  <DrawerItem
                    icon={<MaterialIcons name="album" size={24} color={currentRouteName === "albumplaylist" ? "#fff" : "#949494"} />}
                    label="Album Playlist"
                    isActive={currentRouteName === "albumplaylist"}
                    onPress={go("albumplaylist")}
                  />
                  <DrawerItem
                    icon={
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color={currentRouteName === "Notifications" ? "#fff" : "#949494"}
                    />
                    }
                    label="Notifications"
                    isActive={currentRouteName === "Notifications"}
                   onPress={go("Notifications")}
                  />
                  <DrawerItem
                    icon={<Feather name="bookmark" size={24} color={currentRouteName === "Bookmarks" ? "#fff" : "#949494"} />}
                    label="Bookmarks"
                    isActive={currentRouteName === "Bookmarks"}
                    onPress={go("Bookmarks")}
                  />
                 <DrawerItem
                  icon={
                    <View>
                      <Feather
                        name="user"
                        size={24}
                        color={currentRouteName === "profil" ? "#fff" : "#949494"}
                      />
                      {isProfileIncomplete && (
                        <View style={styles.redDotDrawer} />
                      )}
                    </View>
                  }
                  label="Profile"
                  isActive={currentRouteName === "profil"}
                 onPress={() => {
                      router.push("/(drawer)/(tabs)/profil");
                    }}
                />
                  <DrawerItem
                    icon={<Ionicons name="settings-outline" size={24} color={currentRouteName === "settingsandprivacy" ? "#fff" : "#949494"} />}
                    label="Settings"
                    isActive={currentRouteName === "settingsandprivacy"}
                    onPress={go("settingsandprivacy")}
                  />
                </View>
              </ScrollView>
              {/* --- Footer Logout (Tetap di bawah) --- */}
              <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
        <Drawer.Screen name="ExploreThemeScreen"  options={{ drawerItemStyle: { display: 'none' }, title: "Explore",}}/>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 16,
    marginTop: 10,
    width: "70%",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#eee'
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#000'
  },
  profileTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  navItems: {
    paddingTop: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  navLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    color: "#333",
  },

    avatarPlaceholder: {
    backgroundColor: "#2CA58D", // Gunakan warna hijau brand Anda
    justifyContent: "center",
    alignItems: "center",
  },
  redDotDrawer: {
  position: 'absolute',
  top: -2,
  right: -2,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#FF4D4D',
},
  // Style untuk Hurufnya
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logoutLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
    fontWeight: '600'
  },
});