import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Switch, PanResponder } from "react-native";
import React, { useRef, useState } from "react";
import MenuButton from "@/components/common/MenuButton";
import { Feather, Ionicons, AntDesign, SimpleLineIcons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { updateUserProfileApi } from "@/services/auth.api";
import { useAuth } from "@/hooks/useAuth";
import Slider from '@react-native-community/slider';
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
function BottomSheet({ visible, onClose, title, children }: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
        {/* Handle */}
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {children}
      </Animated.View>
    </Modal>
  );
}

// ─── TOGGLE ROW ───────────────────────────────────────────────────────────────
function ToggleRow({ label, sublabel, value, onToggle }: {
  label: string;
  sublabel?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {sublabel && <Text style={styles.toggleSublabel}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E0E0E0", true: "#2CA58D" }}
        thumbColor={value ? "#fff" : "#fff"}
      />
    </View>
  );
}

function TextSizeSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.labelRow}>
        <Text style={sliderStyles.label}>Text Size</Text>
        <Text style={sliderStyles.sublabel}>Drag to adjust font size</Text>
      </View>
      <View style={sliderStyles.sliderRow}>
        <Text style={sliderStyles.smallA}>A</Text>
        <Slider
          style={{ flex: 1, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor="#9CA3AF"
          maximumTrackTintColor="#9CA3AF"
          thumbTintColor="#fff"
        />
        <Text style={sliderStyles.bigA}>A</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  labelRow: { marginBottom: 8 },
  label: { fontSize: 15, fontWeight: "600", color: "#1d1e1f" },
  sublabel: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallA: { fontSize: 13, color: "#9CA3AF", fontWeight: "600", width: 16 },
  bigA: { fontSize: 22, color: "#9CA3AF", fontWeight: "600", width: 24 },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function SettingsandPrivacy() {
  const router = useRouter();
 const {syncUser, user} = useAuth(); 
  // Bottom Sheet states
  const [notifSheet, setNotifSheet] = useState(false);
  const [helpSheet, setHelpSheet] = useState(false);
  const [accessSheet, setAccessSheet] = useState(false);

  // Notification toggles
  const [notifPlaylist, setNotifPlaylist] = useState(true);
  const [notifArtist, setNotifArtist] = useState(true);
  const [notifRecommend, setNotifRecommend] = useState(false);

  // Accessibility toggles
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [textSize, setTextSize] = useState(1); 
  const menuGroups = [
    {
      label: "Account & Identity",
      items: [
        {
          id: 1,
          title: "Account",
          subtitle: "Profile, password, linked accounts",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#EEF6FF" }]}><Feather name="user" size={20} color="#3B82F6" /></View>,
          onPress: () => router.push("/(tabs)/profil" as any),
          type: "navigate",
        },
        {
          id: 3,
          title: "Privacy & Social",
          subtitle: "Listening activity, block users",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#FFF3EE" }]}><SimpleLineIcons name="lock" size={20} color="#F97316" /></View>,
          onPress: () => router.push("/privacy-social" as any),
          type: "navigate",
        },
      ],
    },
    {
      label: "Preferences",
      items: [
        {
          id: 2,
          title: "Notifications",
          subtitle: "Playlists, artists, daily picks",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#FDF4FF" }]}><Ionicons name="notifications-outline" size={20} color="#A855F7" /></View>,
          onPress: () => setNotifSheet(true),
          type: "sheet",
        },
        {
          id: 5,
          title: "General",
          subtitle: "Audio quality, equalizer, storage",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#F0FDF4" }]}><Feather name="sliders" size={20} color="#2CA58D" /></View>,
          onPress: () => router.push("/general" as any),
          type: "navigate",
          highlight: true,
        },
        {
          id: 6,
          title: "Accessibility",
          subtitle: "Text size, contrast, screen reader",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#FFFBEB" }]}><Ionicons name="accessibility-outline" size={20} color="#F59E0B" /></View>,
          onPress: () => setAccessSheet(true),
          type: "sheet",
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          id: 4,
          title: "Help & Support",
          subtitle: "FAQ, feedback, app version",
          icon: <View style={[styles.iconWrap, { backgroundColor: "#FFF0F3" }]}><AntDesign name="questioncircleo" size={20} color="#F43F5E" /></View>,
          onPress: () => setHelpSheet(true),
          type: "sheet",
        },
      ],
    },
  ];


  // Fungsi pembantu untuk update satu per satu
const toggleSetting = async (key: string, currentValue: boolean, setter: Function) => {
  const newValue = !currentValue;
  setter(newValue); // Update tampilan dulu (instan)

  try {
    // Update ke Railway Database
    await updateUserProfileApi(user.id, { [key]: newValue });
    
    // Update Global State agar data tetap sinkron
    syncUser({ ...user, [key]: newValue }, user.id);
    
    console.log(`${key} updated to ${newValue}`);
  } catch (error) {
    console.error("Gagal update notifikasi:", error);
    setter(currentValue); 
  }
};

const updateAccessibility = async (key: string, value: any, setter: Function) => {
  setter(value); 

  try {
    // Update ke Backend Railway
    await updateUserProfileApi(user.id, { [key]: value });
    
    // Sinkronkan Global State
    syncUser({ ...user, [key]: value }, user.id);
    
    console.log(`${key} updated to ${value}`);
  } catch (error) {
    console.error("Gagal update aksesibilitas:", error);
  }
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <View style={styles.container}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <MenuButton />
                <Text style={styles.title}>
                  Settings <Text style={styles.titleSub}>& Privacy</Text>
                </Text>
              </View>
            <TouchableOpacity style={styles.searchBtn}>
              <Feather name="search" size={20} color="#1d1e1f" />
            </TouchableOpacity>
          </View>

          {/* ── Menu List ── */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            {menuGroups.map((group) => (
              <View key={group.label} style={styles.group}>
                <Text style={styles.groupLabel}>{group.label}</Text>
                <View style={styles.card}>
                  {group.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <TouchableOpacity
                        style={[styles.menuItem, item.highlight && styles.menuItemHighlight]}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                      >
                        {item.highlight && (
                          <View style={styles.highlightBadge}>
                            <Text style={styles.highlightBadgeText}>Audio</Text>
                          </View>
                        )}
                        <View style={styles.menuLeft}>
                          {item.icon}
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Text style={styles.menuSubtext}>{item.subtitle}</Text>
                          </View>
                        </View>
                        {item.type === "navigate" ? (
                          <AntDesign name="right" size={16} color="#C4C4C4" />
                        ) : (
                          <View style={styles.sheetBadge}>
                            <Feather name="chevrons-up" size={14} color="#2CA58D" />
                          </View>
                        )}
                      </TouchableOpacity>
                      {index < group.items.length - 1 && <View style={styles.divider} />}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── NOTIFICATIONS BOTTOM SHEET ── */}
       <BottomSheet  visible={notifSheet}  onClose={() => setNotifSheet(false)} title="Notifications">
        <Text style={styles.sheetSectionLabel}>Music Updates</Text>
        <ToggleRow
          label="New Playlist"
          sublabel="Get notified when new playlists drop"
          value={notifPlaylist}
          onToggle={() => toggleSetting('notif_playlist', notifPlaylist, setNotifPlaylist)}
        />

        <ToggleRow
          label="Favorite Artist Updates"
          sublabel="New album or single releases"
          value={notifArtist}
          onToggle={() => toggleSetting('notif_artist', notifArtist, setNotifArtist)}
        />
        <ToggleRow
          label="Daily Recommendations"
          sublabel="Personalized picks every morning"
          value={notifRecommend}
          onToggle={() => toggleSetting('notif_recommend', notifRecommend, setNotifRecommend)}
        />
      </BottomSheet>

        {/* ── HELP & SUPPORT BOTTOM SHEET ── */}
        <BottomSheet visible={helpSheet} onClose={() => setHelpSheet(false)} title="Help & Support">
          {[
            { icon: "book-open", label: "Help Center", sub: "Browse FAQs and guides", color: "#3B82F6" },
            { icon: "message-square", label: "Send Feedback", sub: "Tell us what you think", color: "#2CA58D" },
            { icon: "info", label: "App Version", sub: "Caroline v1.0.0", color: "#6B7280" },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.helpRow} activeOpacity={0.7}>
              <View style={[styles.iconWrap, { backgroundColor: "#F3F4F6" }]}>
                <Feather name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={styles.menuText}>{item.label}</Text>
                <Text style={styles.menuSubtext}>{item.sub}</Text>
              </View>
              {item.icon !== "info" && <AntDesign name="right" size={16} color="#C4C4C4" />}
            </TouchableOpacity>
          ))}
        </BottomSheet>

        {/* ── ACCESSIBILITY BOTTOM SHEET ── */}
       <BottomSheet 
        visible={accessSheet} 
        onClose={() => setAccessSheet(false)} 
        title="Accessibility"
      >
        <Text style={styles.sheetSectionLabel}>Display</Text>
        {/* SLIDER UKURAN TEKS */}
        <TextSizeSlider  value={textSize}  onChange={(val) => updateAccessibility('text_size', val, setTextSize)} />
        {/* TOGGLE HIGH CONTRAST */}
        <ToggleRow
          label="High Contrast Mode"
          sublabel="Improve visibility for low vision"
          value={highContrast}
          onToggle={() => updateAccessibility('high_contrast', !highContrast, setHighContrast)}
        />
        <Text style={[styles.sheetSectionLabel, { marginTop: 16 }]}>Interaction</Text>
        {/* TOGGLE SCREEN READER */}
        <ToggleRow
          label="Screen Reader Support"
          sublabel="Optimized for TalkBack / VoiceOver"
          value={screenReader}
          onToggle={() => updateAccessibility('screen_reader', !screenReader, setScreenReader)}
        />
      </BottomSheet>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1,  },
    title: { 
      fontSize: 18, 
      fontWeight: "700", 
      color: "#1d1e1f",
      flex: 1,
    },
    titleSub: { 
      fontSize: 20, 
      fontWeight: "700", 
      color: "#2CA58D"  
    },
  searchBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center",
  },

  // Groups
  group: { marginTop: 24, paddingHorizontal: 16 },
  groupLabel: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 1.2, marginBottom: 8, textTransform: "uppercase" },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },

  // Menu Item
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  menuItemHighlight: { backgroundColor: "#F0FDF9" },
  highlightBadge: { position: "absolute", top: 10, right: 40, backgroundColor: "#2CA58D", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  highlightBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700", letterSpacing: 0.5 },
  menuLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  menuText: { fontSize: 15, fontWeight: "600", color: "#1d1e1f" },
  menuSubtext: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F5F5F5", marginHorizontal: 16 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  sheetBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#F0FDF9", justifyContent: "center", alignItems: "center" },

  // Bottom Sheet
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", alignSelf: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#1d1e1f", marginBottom: 20 },
  sheetSectionLabel: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 1.2, marginBottom: 12, textTransform: "uppercase" },

  // Toggle Row
  toggleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#1d1e1f" },
  toggleSublabel: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  // Help Row
  helpRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
});