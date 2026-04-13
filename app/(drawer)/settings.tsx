import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, Platform } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather, FontAwesome, Fontisto, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import PhoneInput from "react-native-phone-number-input";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "../../hooks/useAuth"; 
import { deleteUserApi, updateUserProfileApi } from "../../services/auth.api"; 
import UniversalAlert from "@/components/common/UniversalAlert";
import { useAppAlert } from "../../context/AlertContext";
// --- SVG IMPORTS (FIX ERROR: Cannot find name) ---
import UserIcon from "../../assets/images/Layer_1.svg";
import UserDivce from "../../assets/images/Layer_2.svg";

export default function SettingsPage() {
  const { user, syncUser, logout, removeAccountFromStorage } = useAuth(); 
  const { showAlert } = useAppAlert();
  const router = useRouter();
  const phoneInput = useRef<PhoneInput>(null);
  // --- FORM STATES ---
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  // --- UI STATES ---
  const [isModified, setIsModified] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // --- ALERT STATE (FIX ERROR: Type assignment) ---
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<any>({
    type: 'info',
    title: '',
    message: ''
  });

  const [notifPlaylist, setNotifPlaylist] = useState(false);
  const [notifArtist, setNotifArtist] = useState(false);
  const [notifRecommend, setNotifRecommend] = useState(false);
  const userInitial = nickname ? nickname.charAt(0).toUpperCase() : "U";
 const [textSize, setTextSize] = useState(1); // Default level 2
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [accessSheet, setAccessSheet] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.full_name || "");
      setPhone(user.phone ? user.phone.replace("+62", "") : "");
      setAvatar(user.image || user.picture || "https://i.pravatar.cc/300");
      setSelectedGender(user.gender || "");
      if (user.date_of_birth) setDate(new Date(user.date_of_birth));

     setNotifPlaylist(user.notif_playlist ?? false);
      setNotifArtist(user.notif_artist ?? false);
      setNotifRecommend(user.notif_recommend ?? false);

     setTextSize(user.text_size ?? 2);
    setHighContrast(user.high_contrast ?? false);
    setScreenReader(user.screen_reader ?? false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedData = {
        full_name: nickname, 
        phone: `+62${phone}`,
        gender: selectedGender,
        date_of_birth: date.toISOString().split("T")[0],
        image: avatar,
      };

      const result = await updateUserProfileApi(user.id, updatedData);

      if (result && result.user) {
        await syncUser(result.user, user.id); 
        setIsModified(false);
        setAlertConfig({
          type: 'success',
          title: 'Profil Diperbarui!',
          message: 'Perubahan profil kamu telah tersimpan.',
          onConfirm: () => setAlertVisible(false)
        });
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertConfig({ type: 'error', title: 'Gagal Simpan', message: 'Cek koneksi internet Anda.' });
      setAlertVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteUserApi(user.id);
      await removeAccountFromStorage(user.id);
      setAlertVisible(false);
      Toast.show({ type: 'success', text1: 'Akun telah dihapus.' });
      router.replace('/(auth)/login');
    } catch (error) {
      setAlertConfig({ type: 'error', title: 'Gagal Hapus', message: 'Terjadi kesalahan sistem.' });
      setAlertVisible(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGoBack = () => {
    if (isModified) {
      setAlertConfig({
        type: 'warning',
        title: 'Are you sure?',
        message: "It looks like you haven't saved your profile changes.",
        confirmText: 'Yes, Save',
        cancelText: 'Discard',
        onConfirm: handleSave,
        onCancel: () => { setAlertVisible(false); router.back(); }
      });
      setAlertVisible(true);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <MaskedView maskElement={<Text style={styles.vibeFlow}>Settings</Text>}>
          <LinearGradient colors={["#0B3129", "#219780"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={[styles.vibeFlow, { opacity: 0 }]}>Settings</Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <UserDivce width={101} height={127} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>Hello! Let’s get to the right mood! VibeFlow: Your Soundtrack.</Text>
          </View>
          <UserIcon width={122} height={129} />
        </View>

        <View style={styles.formPanel}>
          <Text style={styles.profileHeaderText}>Lengkapi Profilmu</Text>

          <View style={styles.avatarContainer}>
            {avatar && avatar !== "https://i.pravatar.cc/300" ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}><Text style={styles.avatarInitial}>{userInitial}</Text></View>
            )}
            <TouchableOpacity style={styles.cameraButton} onPress={async () => {
               let r = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
               if (!r.canceled) { setAvatar(r.assets[0].uri); setIsModified(true); }
            }}>
              <Feather name="camera" size={20} color="#000" />
            </TouchableOpacity>
          </View>

         {/* Nomor Aktif */}
                <Text style={styles.label}>Nomor Aktif *</Text>
                <PhoneInput
                  ref={phoneInput}
                  key={phone} 
                  defaultValue={phone}
                  defaultCode="ID"
                  layout="second"
                  withShadow={false}
                  onChangeText={(t) => { setPhone(t); setIsModified(true); }}
                  containerStyle={styles.phoneBox}
                  textContainerStyle={styles.phoneText}
                 textInputStyle={{ height: 56, paddingVertical: 0 }}
                 flagButtonStyle={{ height: 56, justifyContent: 'center' }} 
                  renderDropdownImage={<FontAwesome name="caret-down" size={18} color="black" />}
                />

                {/* Nama Panggilan */}
                <Text style={styles.label}>Nama Panggilan *</Text>
                <TextInput
                  style={styles.input}
                  value={nickname} // ← value sudah dari state yang diisi useEffect
                  onChangeText={(t) => { setNickname(t); setIsModified(true); }}
                  placeholder="Masukkan nama panggilan"
                />
          <Text style={styles.label}>Jenis Kelamin</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowGenderModal(true)}>
            <Text style={{flex:1}}>{selectedGender || "Male"}</Text><AntDesign name="down" size={18} />
          </TouchableOpacity>

          <Text style={styles.label}>Tanggal Lahir</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{flex:1}}>{date.toISOString().split("T")[0]}</Text><AntDesign name="down" size={18} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" onChange={(e, d) => { setShowDatePicker(false); if(d) { setDate(d); setIsModified(true); }}} />
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={() => {
             setAlertConfig({ type: 'delete', title: 'Delete user?', message: 'Hapus akun selamanya?', confirmText: 'Yes, Delete', onConfirm: handleDeleteAccount });
             setAlertVisible(true);
          }}>
            <Octicons name="trash" size={20} color="#E53935" /><Text style={styles.deleteText}>Hapus Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Simpan</Text>}
        </TouchableOpacity>
      </View>

      <UniversalAlert
        visible={alertVisible}
        {...alertConfig}
        onCancel={() => setAlertVisible(false)}
        loading={isSaving || isDeleting}
      />

      <Modal visible={showGenderModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalCard}>
            {['Male', 'Female'].map(g => (
              <TouchableOpacity key={g} style={styles.option} onPress={() => { setSelectedGender(g); setShowGenderModal(false); setIsModified(true); }}>
                <Text style={{fontSize:16}}>{g}</Text><Fontisto name={selectedGender === g ? "radio-btn-active" : "radio-btn-passive"} size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F5F5" },
  headerBar: { flexDirection: "row", alignItems: "center", padding: 16 },
  vibeFlow: { fontSize: 24, fontWeight: "bold", marginLeft: 12 },
  scrollArea: { flex: 1 },
  scrollContent: { backgroundColor: "#CCD0D3" },
  banner: { flexDirection: "row", padding: 16, alignItems: "center", justifyContent: "space-between" },
  bannerTextContainer: { maxWidth: "50%" },
  bannerText: { fontSize: 13, color: "#333" },
  formPanel: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 16, paddingBottom: 150, marginTop: -20 },
  profileHeaderText: { fontSize: 17, fontWeight: "bold", marginVertical: 10 },
  avatarContainer: {  alignItems: "flex-end", marginBottom: 25,marginRight: 10,  position: 'relative', alignSelf: 'flex-end',   },
  avatar: {  width: 100,   height: 100,   borderRadius: 50,  backgroundColor: '#eee', },
  avatarPlaceholder: {   width: 100,  height: 100,borderRadius: 50, backgroundColor: '#2CA58D',   justifyContent: 'center', alignItems: 'center',  borderWidth: 2,   borderColor: '#fff' },
  avatarInitial: {   color: '#fff',   fontSize: 40,  fontWeight: 'bold' },
  cameraButton: {  position: "absolute",   bottom: 0, right: 0,   backgroundColor: "#fff",   borderRadius: 20,    padding: 8,  elevation: 5,   shadowColor: "#000",  shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2,  },
  label: { fontSize: 14, marginBottom: 4, color: "#6C7072", fontWeight: 'bold' },
  input: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 16 },
phoneBox: { 
  width: '100%', 
  height: 56,     
  borderRadius: 10, 
  backgroundColor: '#fff', 
  borderWidth: 1, 
  borderColor: '#ddd', 
  marginBottom: 16,
  overflow: 'hidden',
  justifyContent: 'center', 
}, 
phoneText: { 
  backgroundColor: '#fff', 
  borderLeftWidth: 1, 
  borderLeftColor: '#aaa', 
  paddingLeft: 10,
  height: 56,   
  justifyContent: 'center', 
  paddingVertical: 0, 
},  saveContainer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor:'#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  saveButton: { backgroundColor: "#219780", padding: 15, borderRadius: 30, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30, borderWidth: 1, borderColor: "#E53935", padding: 12, borderRadius: 12 },
  deleteText: { marginLeft: 8, color: "#E53935", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
});