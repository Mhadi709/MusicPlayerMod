import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import NextButton from '../../components/onboarding/NextButton';
import { useAuth } from '../../hooks/useAuth';
import UniversalAlert, { UniversalAlertProps } from '@/components/common/UniversalAlert';
import { loginWithGoogleApi } from '@/services/auth.api';

export default function ChangeAccountScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'google' | 'email' | null>(null); 
  const { user, loading, loginWithGoogle, logout, syncUser } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  
  
 const handleSignIn = async () => {
  setSelectedMethod('google');
  try {
   const result = await loginWithGoogle();
    console.log("Login sukses, mengalihkan ke verifikasi telepon...");
    router.push('/(auth)/verify-phone');
  } catch (error) {
    console.error("Gagal login:", error);
    setAlertConfig({
      type: 'error',
      title: 'Login Gagal!',
      message: 'Login gagal, silakan coba lagi.',
      confirmText: 'Coba Lagi',
    });
    setAlertVisible(true);
  }
};

return (
  <View style={styles.container}>
    <Image source={require('../../assets/images/Location.png')} style={styles.icon} />

    <Text style={styles.title}>Add Account</Text>
    <Text style={styles.subtitle}>Store the best of your journey with us{"\n"}and share it with your friends</Text>

    {/* Google */}
    <TouchableOpacity
      style={[
        styles.accountItem,
        selectedMethod === 'google' && styles.accountItemSelected
      ]}
      onPress={() => setSelectedMethod('google')} 
      disabled={loading}
    >
      <View style={[styles.iconCircle, { backgroundColor: '#fff', borderColor: '#EAEAEA', borderWidth: 1 }]}>
        <Image
          source={require('../../assets/images/Google icon Login.png')}
          style={{ width: 24, height: 24, resizeMode: 'contain' }}
        />
      </View>

      <Text style={styles.accountName}>
        {loading ? "Processing..." : "Continue with Google"}
      </Text>

      {selectedMethod === 'google' && (
        <Feather name="check" size={20} color="#FDB813" />
      )}
    </TouchableOpacity>

    {/* Email */}
    <TouchableOpacity
      style={[
        styles.accountItem,
        selectedMethod === 'email' && styles.accountItemSelected
      ]}
      onPress={() => setSelectedMethod('email')} 
    >
      <View style={[styles.iconCircle, { backgroundColor: '#fff', borderColor: '#EAEAEA', borderWidth: 1 }]}>
        <Feather name="mail" size={18} color="#FF4D4D" />
      </View>

      <Text style={styles.accountName}>Sign in with Email</Text>

      {selectedMethod === 'email' && (
        <Feather name="check" size={20} color="#FDB813" />
      )}
    </TouchableOpacity>

    <UniversalAlert
      {...(alertConfig as UniversalAlertProps)}
      visible={alertVisible}
      onConfirm={() => setAlertVisible(false)}
      onCancel={() => setAlertVisible(false)}
    />

    <View style={{ marginTop: 24 }}>
      <NextButton
        title="Continue"
        disabled={!selectedMethod || loading}
        onPress={() => {
          if (selectedMethod === 'google') {
            handleSignIn(); 
          } else if (selectedMethod === 'email') {
            router.push('/(auth)/Register');
          }
        }}
      />
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
