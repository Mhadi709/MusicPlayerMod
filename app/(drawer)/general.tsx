// app/(settings)/general.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated, ActivityIndicator } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// INTEGRASI SISTEM ANDA
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { updateUserProfileApi } from "../../services/auth.api";

const QUALITIES = ["Low (64kbps)", "Normal (128kbps)", "High (256kbps)", "Lossless"];
const DOWNLOAD_QUALITIES = ["Normal (128kbps)", "High (256kbps)", "Lossless"];

// --- Mini Equalizer bars animation (Tetap Sama) ---
function MiniEqualizer() {
  const bars = [useRef(new Animated.Value(0.4)).current, useRef(new Animated.Value(0.7)).current, useRef(new Animated.Value(0.5)).current, useRef(new Animated.Value(0.9)).current, useRef(new Animated.Value(0.3)).current];
  useEffect(() => {
    const animate = (bar: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: Math.random() * 0.6 + 0.3, duration: 400 + delay, useNativeDriver: true }),
          Animated.timing(bar, { toValue: Math.random() * 0.4 + 0.1, duration: 400 + delay, useNativeDriver: true }),
        ])
      ).start();
    };
    bars.forEach((bar, i) => animate(bar, i * 80));
  }, []);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 28, gap: 3 }}>
      {bars.map((bar, i) => (
        <Animated.View key={i} style={{ width: 5, backgroundColor: "#2CA58D", borderRadius: 3, transform: [{ scaleY: bar }], height: 28 }} />
      ))}
    </View>
  );
}

// --- Storage bar (Tetap Sama) ---
function StorageBar({ used, total }: { used: number; total: number }) {
  const percent = used / total;
  return (
    <View>
      <View style={styles.storageBarBg}>
        <View style={[styles.storageBarFill, { width: `${(percent * 100).toFixed(0)}%` as any }]} />
      </View>
      <View style={styles.storageLabels}>
        <Text style={styles.storageLabelLeft}>{used} GB used</Text>
        <Text style={styles.storageLabelRight}>{total} GB total</Text>
      </View>
    </View>
  );
}

export default function GeneralSettings() {
  const router = useRouter();
  const { user, syncUser } = useAuth();
  const { showAlert } = useAppAlert();

  // State yang akan disinkronkan ke Database
  const [streamQuality, setStreamQuality] = useState(1);
  const [downloadQuality, setDownloadQuality] = useState(1);
  const [cacheSize, setCacheSize] = useState(1.4);
  const [totalStorage] = useState(16);

  // 1. Ambil data dari database saat halaman dibuka
  useEffect(() => {
    if (user) {
      setStreamQuality(user.stream_quality ?? 1);
      setDownloadQuality(user.download_quality ?? 1);
      setCacheSize(user.cache_size ?? 1.4);
    }
  }, [user]);

  // 2. Fungsi untuk Update Setting secara instan (Sat-set)
  const updateSetting = async (key: string, value: any, setter: Function) => {
    setter(value); // Update UI dulu agar cepat
    try {
      await updateUserProfileApi(user.id, { [key]: value });
      syncUser({ ...user, [key]: value }, user.id);
      console.log(`Setting ${key} saved: ${value}`);
    } catch (e) {
      console.error(e);
      showAlert({ type: 'error', title: 'Error', message: 'Gagal menyimpan pengaturan.' });
    }
  };

  // 3. Fungsi Clear Cache
  const handleClearCache = () => {
    showAlert({
      type: 'warning',
      title: 'Clear Cache?',
      message: 'Ini akan menghapus semua file musik yang didownload sementara.',
      confirmText: 'Clear',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          await updateUserProfileApi(user.id, { cache_size: 0 });
          syncUser({ ...user, cache_size: 0 }, user.id);
          setCacheSize(0);
          showAlert({ type: 'success', title: 'Success', message: 'Cache cleaned!' });
        } catch (e) { console.log(e); }
      }
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/settingsandprivacy")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#1d1e1f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>General</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── STREAMING QUALITY ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: "#F0FDF9" }]}>
                <Ionicons name="musical-notes" size={18} color="#2CA58D" />
              </View>
              <Text style={styles.sectionTitle}>Streaming Quality</Text>
            </View>
            <View style={styles.card}>
              {QUALITIES.map((q, i) => (
                <TouchableOpacity key={i} style={styles.radioRow} onPress={() => updateSetting('stream_quality', i, setStreamQuality)} activeOpacity={0.7}>
                  <View style={styles.radioInfo}>
                    <Text style={[styles.radioLabel, streamQuality === i && { color: "#2CA58D", fontWeight: 'bold' }]}>{q}</Text>
                    {i === 3 && <View style={styles.premiumBadge}><Text style={styles.premiumText}>Premium</Text></View>}
                  </View>
                  <View style={[styles.radioOuter, streamQuality === i && styles.radioOuterActive]}>
                    {streamQuality === i && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── DOWNLOAD QUALITY ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: "#EEF6FF" }]}>
                <Feather name="download" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Download Quality</Text>
            </View>
            <View style={styles.card}>
              {DOWNLOAD_QUALITIES.map((q, i) => (
                <TouchableOpacity key={i} style={styles.radioRow} onPress={() => updateSetting('download_quality', i, setDownloadQuality)} activeOpacity={0.7}>
                  <Text style={[styles.radioLabel, downloadQuality === i && { color: "#2CA58D", fontWeight: 'bold' }]}>{q}</Text>
                  <View style={[styles.radioOuter, downloadQuality === i && styles.radioOuterActive]}>
                    {downloadQuality === i && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── EQUALIZER PREVIEW ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: "#FDF4FF" }]}>
                <MaterialCommunityIcons name="equalizer" size={18} color="#A855F7" />
              </View>
              <Text style={styles.sectionTitle}>Equalizer</Text>
            </View>
            <TouchableOpacity style={styles.eqCard} activeOpacity={0.85} onPress={() => router.push("/equalizer" as any)}>
              <View>
                <Text style={styles.eqLabel}>Currently: <Text style={{ color: "#2CA58D" }}>Custom</Text></Text>
                <Text style={styles.eqSub}>Tap to open equalizer settings</Text>
              </View>
              <MiniEqualizer />
            </TouchableOpacity>
          </View>

          {/* ── STORAGE ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: "#FFF3EE" }]}>
                <Feather name="hard-drive" size={18} color="#F97316" />
              </View>
              <Text style={styles.sectionTitle}>Storage</Text>
            </View>
            <View style={styles.card}>
              <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
                <Text style={styles.cacheLabel}>Downloaded Songs Cache</Text>
                <Text style={styles.cacheSize}>{cacheSize} GB</Text>
                <StorageBar used={cacheSize} total={totalStorage} />
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.clearCacheBtn} activeOpacity={0.7} onPress={handleClearCache}>
                <Feather name="trash-2" size={16} color="#F43F5E" />
                <Text style={styles.clearCacheText}>Clear Cache</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1d1e1f", flex: 1,textAlign: "center", },

  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase" },

  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },

  radioRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  radioInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  radioLabel: { fontSize: 15, fontWeight: "500", color: "#1d1e1f" },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#D1D5DB", justifyContent: "center", alignItems: "center" },
  radioOuterActive: { borderColor: "#2CA58D" },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: "#2CA58D" },
  premiumBadge: { backgroundColor: "#FDF4FF", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  premiumText: { fontSize: 10, color: "#A855F7", fontWeight: "700" },

  eqCard: {
    backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    borderWidth: 1.5, borderColor: "#E8F8F4",
  },
  eqLabel: { fontSize: 15, fontWeight: "600", color: "#1d1e1f" },
  eqSub: { fontSize: 12, color: "#9CA3AF", marginTop: 3 },

  storageBarBg: { height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, marginVertical: 10, overflow: "hidden" },
  storageBarFill: { height: 8, backgroundColor: "#F97316", borderRadius: 4 },
  storageLabels: { flexDirection: "row", justifyContent: "space-between" },
  storageLabelLeft: { fontSize: 12, color: "#F97316", fontWeight: "600" },
  storageLabelRight: { fontSize: 12, color: "#9CA3AF" },
  cacheLabel: { fontSize: 13, color: "#6B7280", fontWeight: "600", marginBottom: 4 },
  cacheSize: { fontSize: 26, fontWeight: "800", color: "#1d1e1f", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "#F5F5F5" },
  clearCacheBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  clearCacheText: { fontSize: 15, fontWeight: "600", color: "#F43F5E" },
});