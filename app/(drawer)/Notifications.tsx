import React, { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, PanResponder, Modal, Dimensions, StatusBar
} from "react-native";
import { Feather, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import MenuButton from "@/components/common/MenuButton";
import NotificationIcon from "../../assets/images/no_notification_icon.svg";
import MusicIcon from "../../assets/images/Music_Icon.svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

// ─── TYPE CONFIG ─────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  info: {
    accent: "#2CA58D",
    bg: "#F0FDF9",
    badge: "Info",
    badgeBg: "#DCFCE7",
    badgeColor: "#166534",
    ctaLabel: "Learn More",
    pills: ["System Update", "New Feature", "Audio Engine"],
  },
  promo: {
    accent: "#A855F7",
    bg: "#FDF4FF",
    badge: "Promo",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    ctaLabel: "Claim Offer",
    pills: ["Limited Time", "50% Off", "Premium"],
  },
  update: {
    accent: "#F97316",
    bg: "#FFF7ED",
    badge: "New Release",
    badgeBg: "#FFEDD5",
    badgeColor: "#9A3412",
    ctaLabel: "Play Now",
    pills: ["New Album", "Just Released", "Artist Update"],
  },
};

// ─── NOTIFICATION DATA ───────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    type: "info" as const,
    title: "Hear More, Feel More!",
    message: "Music is not only heard, but can also touch feelings, create atmosphere, and become part of your life moments.",
    time: "2 jam lalu",
  },
  {
    id: "2",
    type: "update" as const,
    title: "Artis Favoritmu Baru Rilis Album!",
    message: "Album terbaru sudah tersedia. Dengarkan sekarang dan rasakan sensasi musik yang tak terlupakan.",
    time: "5 jam lalu",
  },
  {
    id: "3",
    type: "promo" as const,
    title: "Diskon Premium 50% Khusus Kamu!",
    message: "Dapatkan akses tak terbatas ke jutaan lagu, kualitas audio lossless, dan fitur eksklusif lainnya.",
    time: "Kemarin",
  },
];

// ─── ICON RENDERER ───────────────────────────────────────────────────────────
function NotifIcon({ type, size = 28 }: { type: string; size?: number }) {
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
  switch (type) {
    case "info":
      return <MaterialIcons name="headset" size={size} color={config.accent} />;
    case "update":
      return <MusicIcon width={size} height={size} />;
    case "promo":
      return <MaterialIcons name="discount" size={size} color={config.accent} />;
    default:
      return <Ionicons name="notifications" size={size} color="#9CA3AF" />;
  }
}

// ─── EXPANDED MODAL ──────────────────────────────────────────────────────────
function ExpandedCard({ item, onClose }: { item: typeof INITIAL_NOTIFICATIONS[0] | null; onClose: () => void }) {
  const config = item ? TYPE_CONFIG[item.type] : TYPE_CONFIG.info;
  const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          closeModal();
        } else {
          Animated.spring(slideY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (item) {
      slideY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 130 }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [item]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  if (!item) return null;

  return (
    <Modal transparent visible={!!item} animationType="none" onRequestClose={closeModal}>
      <StatusBar barStyle="light-content" />
      {/* Overlay */}
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeModal} />
      </Animated.View>

      {/* Card */}
      <Animated.View style={[styles.expandedCard, { transform: [{ translateY: slideY }] }]} {...panResponder.panHandlers}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        {/* Hero Art */}
        <View style={[styles.heroArt, { backgroundColor: config.bg }]}>
          <View style={[styles.heroIconRing2, { borderColor: config.accent + "30" }]}>
            <View style={[styles.heroIconRing1, { borderColor: config.accent + "60" }]}>
              <View style={[styles.heroIconCircle, { backgroundColor: config.accent + "20" }]}>
                <NotifIcon type={item.type} size={52} />
              </View>
            </View>
          </View>
          {/* Glow */}
          <View style={[styles.heroGlow, { backgroundColor: config.accent + "25" }]} />
        </View>

        {/* Content */}
        <View style={styles.expandedContent}>
          {/* Badge + Time */}
          <View style={styles.expandedMeta}>
            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
              <Text style={[styles.badgeText, { color: config.badgeColor }]}>{config.badge}</Text>
                </View>
              <Text style={styles.expandedTime}>{item.time}</Text>
            </View>

          <Text style={styles.expandedTitle}>{item.title}</Text>
          <Text style={styles.expandedDesc}>{item.message}</Text>

          {/* Pills */}
          <View style={styles.pillsRow}>
            {config.pills.map((p, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: config.accent }]}
            onPress={closeModal}
            activeOpacity={0.85}
          >
           <Text style={styles.ctaBtnText}>{config.ctaLabel}  </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={closeModal}>
              <Feather name="bookmark" size={18} color="#6B7280" />
              <Text style={styles.secondaryBtnText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={closeModal}>
              <Feather name="share-2" size={18} color="#6B7280" />
              <Text style={styles.secondaryBtnText}>Bagikan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── NOTIFICATION CARD ───────────────────────────────────────────────────────
function NotificationCard({
  item,
  onDismiss,
  onPress,
}: {
  item: typeof INITIAL_NOTIFICATIONS[0];
  onDismiss: () => void;
  onPress: () => void;
}) {
  const config = TYPE_CONFIG[item.type];
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 20,
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: g.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, duration: 220, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
          ]).start(onDismiss);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ translateX }], opacity }]} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        {/* Accent bar */}
        <View style={[styles.accentBar, { backgroundColor: config.accent }]} />

        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <NotifIcon type={item.type} size={26} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
              <Text style={[styles.badgeText, { color: config.badgeColor }]}>{config.badge}</Text>
            </View>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        </View>

        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <AntDesign name="close" size={16} color="#C4C4C4" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedItem, setSelectedItem] = useState<typeof INITIAL_NOTIFICATIONS[0] | null>(null);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
            <TouchableOpacity style={styles.searchBtn}>
              <Feather name="search" size={22} color="#1d1e1f" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {notifications.length === 0 ? (
            <View style={styles.emptyContent}>
              <NotificationIcon width={300} height={300} />
              <Text style={styles.noNotificationText}>No notification</Text>
              <Text style={styles.subText}>
                Belum ada notifikasi saat ini. Pantau terus untuk info terbaru tentang playlist, artis, dan promo menarik.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.swipeHint}>
                <Feather name="more-horizontal" size={12} color="#C4C4C4" /> Geser kartu untuk menghapus
              </Text>
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onDismiss={() => handleDismiss(item.id)}
                    onPress={() => setSelectedItem(item)}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* Expanded Modal */}
        <ExpandedCard item={selectedItem} onClose={() => setSelectedItem(null)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#F5F5F5",
  },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#1d1e1f" },
  searchBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },

  swipeHint: { fontSize: 11, color: "#C4C4C4", textAlign: "center", paddingVertical: 8 },

  emptyContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  noNotificationText: { fontSize: 18, fontWeight: "700", marginTop: 16, color: "#1d1e1f" },
  subText: { fontSize: 14, color: "#9CA3AF", textAlign: "center", marginTop: 8, lineHeight: 20 },

  scrollContent: { padding: 16, gap: 12 },

  // Card
  cardWrapper: { borderRadius: 16 },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 3, overflow: "hidden",
  },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12, marginLeft: 6 },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1d1e1f", marginBottom: 3 },
  cardMessage: { fontSize: 13, color: "#9CA3AF", lineHeight: 18 },
  cardTime: { fontSize: 11, color: "#C4C4C4", marginLeft: "auto" },
  closeBtn: { padding: 4, marginLeft: 8 },

  // Badge
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "700" },

  // Modal
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  expandedCard: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 40, overflow: "visible",
    shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 30, elevation: 30,
  },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", alignSelf: "center", marginTop: 12, marginBottom: 0 },

  heroArt: { height: 200, justifyContent: "center", alignItems: "center" },
  heroIconRing2: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  heroIconRing1: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  heroIconCircle: { width: 82, height: 82, borderRadius: 41, justifyContent: "center", alignItems: "center" },
  heroGlow: { position: "absolute", width: 160, height: 160, borderRadius: 80, opacity: 0.4 },

  expandedContent: { paddingHorizontal: 19, paddingTop: 20 },
  expandedMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12,justifyContent: "space-between", },
  expandedTime: { fontSize: 12, color: "#9CA3AF"},
  expandedTitle: { fontSize: 22, fontWeight: "800", color: "#1d1e1f", marginBottom: 10, lineHeight: 28 },
  expandedDesc: { fontSize: 15, color: "#6B7280", lineHeight: 22, marginBottom: 18 },

  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  pill: { backgroundColor: "#F3F4F6", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },

    ctaBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 8, 
    borderRadius: 16, 
    minHeight: 52, 
    paddingVertical: 12,
    paddingHorizontal: 24, 
    marginBottom: 12,
    width: "100%",
    overflow: 'visible', 
  },

  ctaBtnText: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#fff", 
    lineHeight: 22, 
    textAlignVertical: "center",
    includeFontPadding: true, 
    flexShrink: 0,
  },

  secondaryActions: { flexDirection: "row", gap: 12 },
  secondaryBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, paddingVertical: 12, backgroundColor: "#F3F4F6" },
  secondaryBtnText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
});