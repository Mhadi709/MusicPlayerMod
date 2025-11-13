// app/(auth)/login-success.tsx (FULL SCREEN)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '../../components/ui/NextButton';

const { width, height } = Dimensions.get('window');


export default function LoginSuccessScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true); // mulai loading
      // Bisa tambahkan delay kecil biar terlihat smooth
      setTimeout(() => {
        router.replace('/(drawer)/(tabs)/homepage');
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Background Oval */}
        <View style={styles.oval} />

        {/* Gambar Tas */}
        <Image
          source={require('../../assets/images/bag.png')}
          style={styles.bagIcon}
        />

        {/* Konten Teks */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Logged in{'\n'}successfully
          </Text>
          <Text style={styles.subtitle}>
            We have prepared information for your journey
          </Text>
        </View>

        {/* Tombol Continue */}
        <View style={styles.buttonContainer}>
 <NextButton
  title={isLoading ? '' : 'Continue'}
  onPress={handleContinue}
  style={{
  ...styles.continueButton,
  ...(isLoading ? styles.loadingButton : {}),
}}

  disabled={isLoading}
/>

          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#2CA58D" // kuning
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  oval: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 193, 7, 1)',
    width: width * 1.7, // sedikit lebih besar
    height: height * 0.75, // diperbesar sedikit
    top: -height * 0.09, // diturunkan sedikit
    left: -width * 0.35,
    transform: [{ rotate: '-15deg' }],
    borderRadius: (width * 1.7) / 2,
  },
  bagIcon: {
    width: width * 0.7, // diperbesar dari 0.4 → 0.5
    height: width * 0.7,
    resizeMode: 'contain',
    position: 'absolute',
    top: height * 0.37, // sedikit turun agar proporsional
    left: -29, 
    zIndex: 2, // pastikan di atas oval
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: height * 0.45, // dikurangi dari 0.4 → lebih dekat ke icon
    marginBottom: 35,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#242424',
    textAlign: 'left',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 19,
    color: '#666',
    textAlign: 'left',
    lineHeight: 24,
    paddingRight: '15%',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 23,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#2CA58D',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
    loadingButton: {
    backgroundColor: '#FFD60A', // warna kuning saat loading
  },
    loadingIndicator: {
    position: 'absolute',
  },
});
