import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,KeyboardAvoidingView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '../../components/ui/NextButton';
import CountryFlag from 'react-native-country-flag';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    // Logika verifikasi
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    setIsButtonDisabled(text.trim().length === 0);
  };
   const handleRegister = async () => {
    setIsLoading(true);

    // Simulasi proses registrasi (misalnya, menyimpan data ke server)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

    // =======================================================
    // NAVIGASI KE HALAMAN VERIFIKASI OTP DI SINI
    // =======================================================
    // Gunakan 'push' agar pengguna bisa kembali jika perlu
    router.push('/(auth)/verify-phone-otp');
  };

return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/telephone.png')} style={styles.phoneIcon} />
        <Text style={styles.title}>Verify Account</Text>
        <Text style={styles.subtitle}>
          We will send a message to your phone number for verification
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.phoneInputWrapper}>
            <CountryFlag isoCode="US" size={16} style={styles.flagIcon} />
            <Text style={styles.countryCode}>+1</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Your phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            />
          </View>
        </View>

         <View style={styles.buttonContainer}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            // Hubungkan tombol ke fungsi handleRegister
            <NextButton
              title="Create new Account"
              onPress={handleRegister}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 0,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  phoneIcon: {
    width: 105,
    height: 105,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FDB813',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#8e8e8e',
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  flagIcon: {
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 70,
  },
});