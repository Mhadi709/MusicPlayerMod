import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import NextButton from '../../components/onboarding/NextButton';
import OtpInput from '../../components/onboarding/OtpInput';
import { confirmationStore } from './verify-phone';
import { loginWithPhoneApi } from '@/services/auth.api';
import { useAuth } from '@/hooks/useAuth';
import UniversalAlert, { UniversalAlertProps } from '@/components/common/UniversalAlert';
import { getIdToken } from '@react-native-firebase/auth';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';

export default function VerifyPhoneOtpScreen() {
  const router = useRouter();
  const auth = getAuth();
  const { phone } = useLocalSearchParams(); 
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const { syncUser } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});

   const handleSendOtp = async () => {
    try {
      const auth = getAuth();
      const phoneStr = Array.isArray(phone) ? phone[0] : phone;
     confirmationStore.result = await signInWithPhoneNumber(auth, phoneStr);
      router.push({
        pathname: '/(auth)/verify-phone-otp',
        params: { phone: phoneStr }
      });
    } catch (e) {
      console.log("Error send OTP:", e);
    }
  };

const handleVerify = async (otpParam?: string) => { 
  const codeToVerify = otpParam || otpCode;
  
  if (!confirmationStore.result) {
    setAlertConfig({
      type: 'warning',
      title: 'Sesi Berakhir!',
      message: 'Sesi berakhir, silakan kirim ulang kode.',
      confirmText: 'OK',
    });
    setAlertVisible(true);
    return;
  }

  try {
    setIsLoading(true);
    // Pakai codeToVerify bukan otpCode
const userCredential = await confirmationStore.result.confirm(codeToVerify);
    const idToken = await getIdToken(userCredential.user); 
    const backendRes = await loginWithPhoneApi(idToken);
    
    if (backendRes.userId) {
      syncUser(backendRes.user, backendRes.userId);
      router.replace('/(auth)/Login_Success');
    } else {
      throw new Error("Backend did not return user ID");
    }
  } catch (error: any) {
    console.error(error);
    setAlertConfig({
      type: 'error',
      title: 'Verifikasi Gagal!',
      message: 'Kode OTP salah atau sudah kadaluarsa.',
      confirmText: 'Coba Lagi',
    });
    setAlertVisible(true);
  } finally {
    setIsLoading(false);
  }
};



const isButtonDisabled = otpCode.length < 6 || timeLeft <= 0;
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); 
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
          Enter the 6 numbers we sent to the phone number to verify
        </Text>

        <OtpInput
          length={6}
          onComplete={(otp) => {
            setOtpCode(otp);
            handleVerify(otp);
          }}
        />

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Text>
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <UniversalAlert
        {...(alertConfig as UniversalAlertProps)}
        visible={alertVisible}
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
      />

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
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    paddingTop: 20,
  },
  keyIcon: {
    width: 108,
    height: 108,
    marginBottom: 20,
  },
  otpWrapper: {
    marginTop: -50,
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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 16,
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
  fontSize: 14,
  color: "#666",
},
  resendLink: {
  fontSize: 14,
  color: "#FDB813",
  fontWeight: "bold",
},
  buttonContainer: {
    paddingBottom: 20,
  },
  resendLinkDisabled: {
    color: '#D3D3D3', 
  },
  verifyButton: {
  backgroundColor: '#FDB813',
  borderRadius: 16,
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 52,
},
verifyButtonDisabled: {
  backgroundColor: '#E0E0E0',
},
verifyButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});


