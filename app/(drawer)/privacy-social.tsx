// app/(settings)/privacy-social.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// INTEGRASI SISTEM ANDA
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { updateUserProfileApi } from "../../services/auth.api";

function ToggleRow({ label, sublabel, value, onToggle, disabled }: any) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {sublabel && <Text style={styles.toggleSublabel}>{sublabel}</Text>}
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle} 
        disabled={disabled}
        trackColor={{ false: "#E0E0E0", true: "#2CA58D" }} 
        thumbColor="#fff" 
      />
    </View>
  );
}

export default function PrivacySocial() {
  const router = useRouter();
  const { user, syncUser } = useAuth();
  const { showAlert } = useAppAlert();

  // --- STATE DATA ---
  const [listeningActivity, setListeningActivity] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showInSearch, setShowInSearch] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. SINKRONISASI AWAL DARI DATABASE
  useEffect(() => {
    if (user) {
      setListeningActivity(user.listening_activity ?? true);
      setPrivateProfile(user.private_profile ?? false);
      setShowInSearch(user.show_in_search ?? true);
      setBlockedUsers(user.blocked_users || []); // Asumsi field di database
    }
  }, [user]);

  // 2. FUNGSI UPDATE SETTING OTOMATIS (Sat-Set)
  const updatePrivacy = async (key: string, value: any, setter: Function) => {
    const previousValue = !value; // Simpan nilai lama untuk rollback jika gagal
    setter(value);

    try {
      // Update ke Railway
      await updateUserProfileApi(user.id, { [key]: value });
      // Update Global State
      syncUser({ ...user, [key]: value }, user.id);
      console.log(`✅ Privacy updated: ${key} = ${value}`);
    } catch (error) {
      setter(previousValue); // Kembalikan posisi toggle jika gagal kirim ke server
      showAlert({ type: 'error', title: 'Connection Error', message: 'Failed to sync with server.' });
    }
  };

  // 3. FUNGSI UNBLOCK USER
  const handleUnblock = (userId: string, userName: string) => {
    showAlert({
      type: 'warning',
      title: 'Unblock User?',
      message: `Are you sure you want to unblock ${userName}?`,
      confirmText: 'Unblock',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const newList = blockedUsers.filter(u => u.id !== userId);
          await updateUserProfileApi(user.id, { blocked_users: newList });
          syncUser({ ...user, blocked_users: newList }, user.id);
          setBlockedUsers(newList);
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
          <Text style={styles.headerTitle} numberOfLines={1}>Privacy & Social</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── LISTENING ACTIVITY ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Listening Activity</Text>
            <View style={styles.card}>
              <ToggleRow
                label="Share Listening Activity"
                sublabel="Let friends see what you're playing"
                value={listeningActivity}
                onToggle={() => updatePrivacy('listening_activity', !listeningActivity, setListeningActivity)}
              />
              <View style={styles.divider} />
              
              <View style={[styles.activityPreview, !listeningActivity && { backgroundColor: "#FFF0F3" }]}>
                {listeningActivity ? (
                   <>
                    <View style={styles.nowPlayingDot} />
                    <Text style={styles.activityPreviewText}>Friends can see: "Now Playing..."</Text>
                   </>
                ) : (
                   <>
                    <Feather name="eye-off" size={14} color="#F43F5E" />
                    <Text style={[styles.activityPreviewText, { color: "#F43F5E" }]}>Activity is hidden from everyone</Text>
                   </>
                )}
              </View>
            </View>
          </View>

          {/* ── PROFILE PRIVACY ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Profile Privacy</Text>
            <View style={styles.card}>
              <ToggleRow
                label="Private Profile"
                sublabel="Only approved followers can see your playlists"
                value={privateProfile}
                onToggle={() => updatePrivacy('private_profile', !privateProfile, setPrivateProfile)}
              />
              <View style={styles.divider} />
              <ToggleRow
                label="Appear in Search"
                sublabel="Let others find you by username"
                value={showInSearch}
                onToggle={() => updatePrivacy('show_in_search', !showInSearch, setShowInSearch)}
              />
            </View>
          </View>

          {/* ── BLOCKED USERS ── */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>Blocked Users</Text>
              <Text style={styles.sectionCount}>{blockedUsers.length}</Text>
            </View>
            <View style={styles.card}>
              {blockedUsers.length > 0 ? blockedUsers.map((item, i) => (
                <View key={item.id}>
                  <View style={styles.blockedRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.blockedName}>{item.name}</Text>
                    <TouchableOpacity style={styles.unblockBtn} onPress={() => handleUnblock(item.id, item.name)}>
                      <Text style={styles.unblockText}>Unblock</Text>
                    </TouchableOpacity>
                  </View>
                  {i < blockedUsers.length - 1 && <View style={styles.divider} />}
                </View>
              )) : (
                <Text style={{padding: 20, textAlign: 'center', color: '#999'}}>No users blocked</Text>
              )}
              
              <View style={styles.divider} />
              <TouchableOpacity style={styles.addBlockRow} onPress={() => showAlert({ type: 'info', title: 'Feature Coming Soon', message: 'Search for users to block them.' })}>
                <Feather name="user-x" size={16} color="#F43F5E" />
                <Text style={styles.addBlockText}>Block a User</Text>
                <AntDesign name="right" size={14} color="#C4C4C4" style={{ marginLeft: "auto" }} />
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
  sectionLabel: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionCount: { backgroundColor: "#2CA58D", color: "#fff", fontSize: 11, fontWeight: "700", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1 },

  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  divider: { height: 1, backgroundColor: "#F5F5F5" },

  toggleRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#1d1e1f" },
  toggleSublabel: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  activityPreview: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, margin: 12, backgroundColor: "#F0FDF9", borderRadius: 10 },
  nowPlayingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2CA58D" },
  activityPreviewText: { fontSize: 13, color: "#2CA58D", fontWeight: "500" },

  blockedRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
  blockedName: { flex: 1, fontSize: 15, fontWeight: "500", color: "#1d1e1f" },
  unblockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: "#E0E0E0" },
  unblockText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  addBlockRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  addBlockText: { fontSize: 15, fontWeight: "600", color: "#F43F5E" },
});