
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, AntDesign } from '@expo/vector-icons';


export default function LoginScreen() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>('Wilma');

  const users = [
    { id: 'Wilma', name: 'Wilma West', avatar: require('../../assets/images/user1.jpg')  },
    { id: 'Bennett', name: 'Bennett Botsford',  avatar: require('../../assets/images/user2.jpg') },
  ];

  const handleNext = () => {
    if (selectedUser) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Icon pesawat */}
        <Image source={require('../../assets/images/plane.png')} style={styles.plane} />

        {/* Teks sapaan */}
        <Text style={styles.title}>Hello there!</Text>
        <Text style={styles.subtitle}>A small step for a great journey experience</Text>

        {/* Daftar akun */}
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userItem, selectedUser === user.id && styles.userItemSelected]}
            onPress={() => setSelectedUser(user.id)}
          >
            <Image source={user.avatar} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
            {selectedUser === user.id && (
              <AntDesign name="check" size={20} color="#FDB813" style={{ marginLeft: 'auto' }} />
            )}
          </TouchableOpacity>
        ))}

        {/* Tombol akun lain */}
        <TouchableOpacity style={styles.userItem}>
        <View style={styles.addIcon}>
            <AntDesign name="plus" size={20} color="#000" />
        </View>
        <Text style={styles.userName}>User other account</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Tombol NEXT */}
  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
  <View style={styles.innerButton}>
    <Text style={styles.nextButtonText}>Next</Text>
    <Feather name="arrow-right" size={20} color="#fff" style={styles.icon} />
  </View>
</TouchableOpacity>


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  plane: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FDB813',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    marginBottom: 24,
    maxWidth: '90%',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  userItemSelected: {
    borderWidth: 1.5,
    borderColor: '#FDB813',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 14,
  },
  userName: {
    fontSize: 16,
    color: '#000',
  },
  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
nextButton: {
  backgroundColor: '#2CA58D',
  width: 370,
  height: 60,
  borderRadius: 35,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom :20 ,
},

innerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  paddingHorizontal: 30,
  position: 'relative',
},

nextButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  flex: 1, // agar tetap di tengah walaupun ada ikon
},

icon: {
  position: 'absolute',
  right: 30,
},


});
