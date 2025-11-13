import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import NextButton from '../../components/ui/NextButton';

export default function ChangeAccountScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('google');

  return (
    <View style={styles.container}>
     
      <Image source={require('../../assets/images/Location.png')} style={styles.icon} />

      <Text style={styles.title}>Add Account</Text>
      <Text style={styles.subtitle}>Store the best of your journey with us{"\n"}and share it with your friends</Text>

      <TouchableOpacity
        style={[
          styles.accountItem,
          selectedMethod === 'google' && styles.accountItemSelected
        ]}
        onPress={() => setSelectedMethod('google')}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>G</Text>
        </View>
        <Text style={styles.accountName}>Continue with Google</Text>
        {selectedMethod === 'google' && <Feather name="check" size={20} color="#FDB813" />}
      </TouchableOpacity>

      
      <TouchableOpacity
        style={[
          styles.accountItem,
          selectedMethod === 'email' && styles.accountItemSelected
        ]}
        onPress={() => setSelectedMethod('email')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#fff', borderColor: '#EAEAEA', borderWidth: 1 }]}>
          <Feather name="user" size={18} color="#FF4D4D" />
        </View>
        <TouchableOpacity style={styles.accountName} onPress={()=> router.push('/(auth)/Register')}>
        <Text style={styles.accountName}>Start with Email</Text>
        {selectedMethod === 'email' && <Feather name="check" size={20} color="#FDB813" />}
        </TouchableOpacity>
      </TouchableOpacity>

      
       <View style={{ flex: 1, justifyContent: 'center' }}>
      
        <NextButton title="Change Account" onPress={() => console.log('Change account pressed')} />
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  icon: {
    width: 106,
    height: 106,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FDB813',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 32,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 16,
  },
  accountItemSelected: {
    backgroundColor: '#FFEFC7',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  accountName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
