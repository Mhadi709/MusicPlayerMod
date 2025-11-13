import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import NextButton from '../../components/ui/NextButton';
import OtpInput from '../../components/ui/OtpInput';

export default function VerifyPhoneOtpScreen() {
  const router = useRouter();

  const handleVerify = () => {
    console.log('Verify button pressed!');
    router.replace('/(auth)/Login_Success');
  };

  const handleResendCode = () => {
    console.log('Resend button pressed!');
    setTimeLeft(120); 
  };

  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 menit dalam detik

const isButtonDisabled = otpCode.length < 4 || timeLeft <= 0;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image source={require('../../assets/images/key.png')} style={styles.keyIcon} />
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.subtitle}>
            Enter the 4 numbers we sent to the phone number to verify
          </Text>

          <OtpInput 
            length={4} 
            onComplete={(otp) => {
              console.log('OTP Entered:', otp);
              setOtpCode(otp);
            }} 
          />

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>

         <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResendCode} disabled={timeLeft > 0}>
              <Text style={[styles.resendLink, timeLeft > 0 && styles.resendLinkDisabled]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <NextButton
            title="Verify"
            onPress={handleVerify}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {},
  content: {
    flex: 1,
    justifyContent: 'flex-start', // Tetap pusatkan secara vertikal
    alignItems: 'flex-start', // Ubah ini ke flex-start untuk sebelah kiri
    paddingTop: 20,
  },
  keyIcon: {
    width: 108,
    height: 108,
    marginBottom: 20,
  },
  otpWrapper: {
    marginTop: -50, // Dorong ke atas (sesuaikan nilai ini sesuai kebutuhan)
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FDB813',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 5,
    lineHeight: 22,
    alignItems :'flex-start',
  },
 resendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Ubah ke flex-start untuk menempelkan elemen
    alignItems: 'center', // Pastikan vertikal sejajar
    marginTop: 10, // Kurangi jarak dari atas jika perlu
  },
  timerContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    color: '#666',
  },
  resendText: {
    fontSize: 15,
    color: '#666',
    marginRight: 4, // Kurangi jarak di antara teks
  },
  resendLink: {
    fontSize: 15,
    color: '#FDB813',
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  resendLinkDisabled: {
    color: '#D3D3D3', // Warna abu-abu saat disabled
  },
});

// function setTimeLeft(arg0: number) {
//   throw new Error('Function not implemented.');
// }
