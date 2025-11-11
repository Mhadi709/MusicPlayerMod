import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import MenuButton from "@/components/MenuButton";
import NotificationIcon from "../../assets/images/no_notification_icon.svg";
import MusicIcon from "../../assets/images/Music_Icon.svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  // Dummy notifikasi (bisa ambil dari API nantinya)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "headset",
      title: "Hear More, Feel More!",
      message:
        "Music is not only heard, but can also touch feelings, create atmosphere, and become part of the user's life moments!",
    },
    {
      id: "2",
      type: "music",
      title: "Enjoy Non-Stop Music, Anytime, Anywhere!",
      message: "Flexible and always accessible according to user needs.",
    },
    {
      id: "3",
      type: "promo",
      title: "Special Promo Just for You!",
      message: "Get exclusive discounts and offers tailored to your music experience.",
    },
  ]);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "headset":
        return <MaterialIcons name="headset" size={28} color="#2CA58D" />;
      case "music":
        return <MusicIcon width={28} height={28} />;
      case "promo":
        return <MaterialIcons name="discount" size={28} color="#2CA58D" />;
      default:
        return null;
    }
  };

  return (
     <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
        <MenuButton />
        <Text style={styles.title}>Notification</Text>
        </View>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#1d1e1f" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {notifications.length === 0 ? (
        <View style={styles.content}>
          <NotificationIcon width={375} height={375} />
          <Text style={styles.noNotificationText}>No notification</Text>
          <Text style={styles.subText}>
            There are no notifications at this time. Stay tuned for the latest
            info on playlists, artists, and exciting promotions.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.icon}>{renderIcon(item.type)}</View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMessage}>{item.message}</Text>
              </View>
              <TouchableOpacity onPress={() => handleClose(item.id)} style={{
                position: "absolute",
                top: 10,   
                right: 10,  
                zIndex: 9,
              }}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1d1e1f",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  noNotificationText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 14,
    color: "#666",
  },
});
