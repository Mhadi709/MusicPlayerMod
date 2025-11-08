// app/(drawer)/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Entypo, Feather, FontAwesome, Fontisto, MaterialIcons, Octicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

// SVG
import UserIcon from "../../../assets/images/Layer_1.svg";
import UserDivce from "../../../assets/images/Layer_2.svg";
import { router, useRouter } from "expo-router";

type ErrorFields = {
  phone?: string;
  nickname?: string;
  gender?: string;
  date?: string;
};
export default function SettingsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");
const [phone, setPhone] = useState("");
const [nickname, setNickname] = useState("");
const [errors, setErrors] = useState<ErrorFields>({}); // simpan error per field


const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  if (selectedDate) {
    setDate(selectedDate);
  }
  setShow(false);
};
const pickImage = async () => {
    // Minta izin akses galeri
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Izin akses galeri diperlukan!");
      return;
    }

    // Buka galeri
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // biar kotak
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
 const handleSave = () => {
    let newErrors: { [key: string]: string } = {};

    if (!phone.trim()) newErrors.phone = "Nomor wajib diisi";
    if (!nickname.trim()) newErrors.nickname = "Nama wajib diisi";
    if (!selectedGender) newErrors.gender = "Jenis kelamin wajib diisi";
    if (!date) newErrors.date = "Tanggal wajib diisi";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Data disimpan:", { phone, nickname, selectedGender, date });
    }
  };

 

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER (tetap) */}
      <View style={styles.headerBar}>
       <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Tombol Back */}
      <TouchableOpacity onPress={() => setShowConfirm(true)}>
       <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal Konfirmasi */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard1}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>There's a change!</Text>
              <TouchableOpacity onPress={() => setShowConfirm(false)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Isi */}
            <Text style={styles.modalText}>
              It looks like you haven't saved your profile changes. Would you
              like to save them before exiting?
            </Text>

            {/* Tombol Aksi */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  console.log("Save dulu");
                  setShowConfirm(false);
                }}
              >
                <Text style={styles.actionText}>Save Changes</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setShowConfirm(false);
                  router.back(); // keluar tanpa simpan
                }}
              >
                <Text style={styles.actionText}>Exit Without Saving</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
        {/* VibeFlow gradient di samping panah */}
        <MaskedView
          maskElement={
            <Text style={[styles.vibeFlow, { backgroundColor: "transparent" }]}>
              VibeFlow
            </Text>
          }
        >
          <LinearGradient
            colors={["#0B3129", "#219780"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.vibeFlow, { opacity: 0 }]}>VibeFlow</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      {/* KONTEN SCROLL (banner + form) */}
      
     <ScrollView
        style={styles.scrollArea} 
       contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        >
        {/* Banner ikut scroll */}
        <View style={styles.banner}>
      <UserDivce width={101} height={127} />

      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerText}>
          Hello! Let’s get to the right mood! VibeFlow: Your Soundtrack, Your Surroundings.
        </Text>
      </View>
      <UserIcon width={122} height={129} />
    </View>
        {/* Panel Form (rounded top) */}
        <View style={styles.formPanel}>
          {/* Judul gradien */}
          <View style={styles.profileHeader}>
            <MaskedView
              maskElement={
                <Text
                  style={[
                    styles.profileHeaderText,
                    { backgroundColor: "transparent" },
                  ]}
                >
                  Lengkapi Profilmu
                </Text>
              }
            >
              <LinearGradient
                colors={["#0B3129", "#219780"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.profileHeaderText, { opacity: 0 }]}>
                  Lengkapi Profilmu
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
        <Feather name="camera" size={20} color="#000" />
      </TouchableOpacity>
    </View>


          {/* Form Input */}
          {/* Nomor HP */}
      <Text style={styles.label}>
        Masukan Nomor Anda yang Aktif <Text style={styles.required}>*</Text>
      </Text>
      <View
        style={[
          styles.input,
          errors.phone && { borderColor: "red", borderWidth: 1 },
        ]}
      >
        {/* Kode Negara + Icon */}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}
          onPress={() => console.log("Pilih kode negara")}
        >
          <Text style={{ fontSize: 16, color: "black" }}>+62</Text>
          <FontAwesome name="caret-down" size={24} color="black" style={{ marginLeft: 4 }}/>
        </TouchableOpacity>

        {/* Garis Pemisah */}
        <View
          style={{
            width: 1,
            height: "100%",
            backgroundColor: "#aaa",
            marginHorizontal: 8,
          }}
        />

        {/* Input Nomor */}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: "black",
            textAlignVertical: "center",
            paddingVertical: 0,
          }}
          placeholder="823834863739"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Nama Panggilan */}
      <Text style={styles.label}>
        Nama Panggilan Anda <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          errors.nickname && { borderColor: "red", borderWidth: 1 },
        ]}
        placeholder="akbar azidikin"
        value={nickname}
        onChangeText={setNickname}
      />

      {/* Gender */}
      <Text style={styles.label}>Jenis Kelamin?</Text>
      <View
        style={[
          styles.input,
          errors.gender && { borderColor: "red", borderWidth: 1 },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          activeOpacity={0.8}
          onPress={() => setShowOptions(true)}
        >
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="Male"
            value={selectedGender}
            editable={false}
            pointerEvents="none"
          />
          <AntDesign name="down" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal Gender */}
      <Modal visible={showOptions} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSelectedGender("Male");
                setShowOptions(false);
              }}
            >
              <Text style={styles.optionText}>Male</Text>
              {selectedGender === "Male" ? (
                <Fontisto name="radio-btn-active" size={24} color="black" />
              ) : (
                <Fontisto name="radio-btn-passive" size={24} color="black" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSelectedGender("Female");
                setShowOptions(false);
              }}
            >
              <Text style={styles.optionText}>Female</Text>
              {selectedGender === "Female" ? (
                <Fontisto name="radio-btn-active" size={24} color="black" />
              ) : (
                <Fontisto name="radio-btn-passive" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date */}
      <Text style={styles.label}>Kapan hari spesialmu?</Text>
      <View
        style={[
          styles.input,
          errors.date && { borderColor: "red", borderWidth: 1 },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          activeOpacity={0.8}
          onPress={() => setShow(true)}
        >
          <TextInput
            placeholder="2002-06-14"
            value={date.toISOString().split("T")[0]}
            editable={false}
            style={[styles.textInput, { flex: 1 }]}
            pointerEvents="none"
          />
          <AntDesign
            name="down"
            size={20}
            color="black"
            style={styles.iconButton}
          />
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}


          {/* Hapus Akun (di bawah konten scroll) */}
      <View style={{ flex: 1, padding: 20 }}>
      {/* Tombol hapus akun */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShowDeleteModal(true)}
      >
        <Octicons name="trash" size={20} color="#E53935" />
        <Text style={styles.deleteText}>Hapus Akun</Text>
      </TouchableOpacity>

      {/* Modal Konfirmasi */}
      <Modal
        transparent
        animationType="fade"
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay1}>
          <View style={styles.modalCard2}>
            <Text style={styles.modalTitle1}>Are you sure you want to delete?</Text>
            <Text style={styles.modalMessage}>
              All your data will not be saved and will be lost
            </Text>

            {/* Tombol Delete */}
            <TouchableOpacity
              style={styles.deleteConfirmButton}
              onPress={() => {
                setShowDeleteModal(false);
                // TODO: aksi hapus akun
              }}
            >
              <Text style={styles.deleteConfirmText}>Delete account</Text>
            </TouchableOpacity>

            {/* Tombol Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.cancelText}>cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
        </View>
      </ScrollView>
   {/* SIMPAN (fixed di bawah) */}
<View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F5F5" },

  // HEADER (fixed)
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F5F5",
  },
  vibeFlow: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12, 
    textAlign:"center",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#CCD0D3",   
    marginTop: 1,
    padding: 0,
  },
  // AREA SCROLL
  scrollArea: { flex: 1 },

  // Banner (ikut scroll)
banner: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 12,
},

bannerTextContainer: {
  marginHorizontal: 8,
   maxWidth: "50%",
},

bannerText: {
  fontSize: 13,
  color: "#333",
  textAlign: "left",   
},
  // Panel Form (rounded top)
formPanel: {
  flex: 1,                   
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  borderBottomLeftRadius: -0,  
  borderBottomRightRadius: -4,
  marginRight:-0,
  padding: 16,
  paddingBottom: 160,         
  marginTop: -20,             
},


  profileHeader: {
    marginTop: 7,
    marginBottom: 16,
    marginLeft: 8,
  },
  profileHeaderText: { fontSize: 17, fontWeight: "bold", marginTop:8,},

  avatarContainer: {
    alignItems: "flex-end",
    marginTop: 1,
    marginBottom:19,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },

label: {
  fontSize: 14,
  marginBottom: 4,
  color: "#6C7072",
},
input: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  height: 44,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginBottom: 16,
},
textInput: {
  flex: 1, 
  fontSize: 16,
  paddingVertical: 0,
  color: "#8d8484ff",
  textAlignVertical: "center",
   paddingTop: 6,
   paddingBottom:3, 
},
iconButton: {
  marginLeft: 8,
},
 modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: 0, 
},
modalCard: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  borderBottomLeftRadius: 0, 
  borderBottomRightRadius: 0,
  padding: 20,
},

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },

required: {
  color: "red",
},
  // Tombol Simpan (fixed)
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#219780",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    elevation: 0,
  },
saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  saveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Hapus Akun (di akhir konten scroll)
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#E53935",
    padding: 12,
    borderRadius: 12,
  },
  deleteText: { marginLeft: 8, color: "#E53935", fontWeight: "bold" },
  //untuk pesan hapus akun 
   modalOverlay1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard2: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  deleteConfirmButton: {
    backgroundColor: "#2e9d85",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteConfirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#2e9d85",
    borderRadius: 30,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    color: "#2e9d85",
    fontSize: 16,
    fontWeight: "bold",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard1: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle1: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    borderColor: "#ccc",
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
  },
});