// app/(auth)/login-success.tsx (FULL SCREEN)
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '../../components/ui/NextButton';

const { width, height } = Dimensions.get('window');

export default function LoginSuccessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    console.log('Continue button pressed!');
    router.push('/(tabs)');
  };

 return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Background Oval */}
        <View style={styles.oval} />

        {/* Gambar Tas */}
        <Image source={require('../../assets/images/bag.png')} style={styles.bagIcon} />

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
            title="Continue"
            onPress={() => router.replace('/(tabs)')}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pastikan warna hex benar
  },
  container: {
    flex: 1,
    // Hapus 'padding: 24' dari sini
    justifyContent: 'flex-end', // Dorong semua konten ke bawah
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Mencegah oval "bocor" keluar container
  },
  oval: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 193, 7, 1)',
    width: width * 1.5,
    height: height * 0.7, 
    top: -height * 0.15,
    left: -width * 0.25,
    transform: [{ rotate: '-15deg' }],
    borderRadius: (width * 1.5) / 2,
  },
  bagIcon: {
    width: width * 0.8, 
    height: width * 0.8,
    resizeMode: 'contain',
    position: 'absolute',
    top: height * 0.1,
    alignSelf: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20, 
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
});