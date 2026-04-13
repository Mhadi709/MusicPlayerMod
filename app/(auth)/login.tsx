import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import NextButton from '../../components/onboarding/NextButton';
import { useAuth } from '@/hooks/useAuth';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const router = useRouter();
  const { syncUser } = useAuth(); 
  const [dbUsers, setDbUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null); 
  const [isLoggingIn, setIsLoggingIn] = useState(false);
 useFocusEffect(
    React.useCallback(() => {
     fetchAccounts();
    }, [])
  );

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const saved = await SecureStore.getItemAsync("user_accounts_list");
      
      if (saved) {
        const parsedAccounts = JSON.parse(saved);
        setDbUsers(parsedAccounts);
      } else {
        setDbUsers([]); 
      }
    } catch (error) {
      console.error("Gagal membaca akun lokal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
  if (selectedUser) {
    try {
      setIsLoggingIn(true); 
      
      await syncUser(selectedUser, selectedUser.id);
      setTimeout(() => {
        setIsLoggingIn(false);
        router.replace('/(drawer)/(tabs)/homepage');
      }, 500);
      
    } catch (error) {
      setIsLoggingIn(false);
      alert("Gagal masuk, coba lagi.");
    }
  } else {
    alert("Please select an account to continue.");
  }
};

  return (
    <View style={styles.container}>
        <Image source={require('../../assets/images/plane.png')} style={styles.plane} />
      
        <Text style={styles.title}>Hello there!</Text>
        <Text style={styles.subtitle}>Choose your account to start the journey</Text>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#FDB813" style={{ marginTop: 20 }} />
        ) : (
          <>
            {dbUsers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.userItem, 
                  selectedUser?.id === item.id && styles.userItemSelected
                ]}
                onPress={() => setSelectedUser(item)}
              >
                <Image 
                  source={{ 
                    uri: item.image || item.picture || "https://via.placeholder.com/150" 
                  }} 
                  style={styles.avatar} 
                />
                <Text style={styles.userName}>{item.full_name || item.name}</Text>
                
                {selectedUser?.id === item.id && (
                  <AntDesign name="checkcircle" size={20} color="#FDB813" style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
            {dbUsers.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 20 }}>
                No accounts found. Please register.
              </Text>
            )}
          </>
        )}
        <TouchableOpacity 
          style={styles.userItem} 
          onPress={() => router.push('/(auth)/change-account')}
        >
          <View style={styles.addIcon}>
            <AntDesign name="plus" size={20} color="#000" />
          </View>
          <Text style={styles.userName}>Use other account</Text>
        </TouchableOpacity>
      </ScrollView>
   <View style={styles.bottomContainer}>
    <NextButton 
        title="Next" 
        onPress={handleNext}
        loading={isLoggingIn} 
        disabled={!selectedUser || isLoggingIn}
        style={(!selectedUser || isLoggingIn) ? { backgroundColor: '#E0E0E0' } : undefined} 
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  plane: { width: 60, height: 60, resizeMode: 'contain', marginTop: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FDB813', marginTop: 24 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 8, marginBottom: 24 },
  userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12,backgroundColor: '#fff',marginBottom: 12, borderWidth: 1,borderColor: '#F0F0F0', elevation: 2,},
  userItemSelected: { borderColor: '#FDB813', borderWidth: 2, backgroundColor: '#FFFBE6' },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 14, backgroundColor: '#EEE' },
  userName: { fontSize: 16, color: '#000', fontWeight: '500' },
  addIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F6F6F6', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  bottomContainer: { marginTop: 10, marginBottom: 10 },
});