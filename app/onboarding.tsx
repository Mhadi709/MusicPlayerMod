// app/onboarding.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { OnboardingScreen1 } from '../components/onboarding/OnboardingScreen1';
import { OnboardingScreen2 } from '../components/onboarding/OnboardingScreen2';
import CircularProgressButton from '../components/ui/CircularProgressButton';

const onboardingData = [
  {
    SlideComponent: OnboardingScreen1, 
    title: 'Discover\nYour Music',
    subtitle: 'Stream your favorite songs, explore new genres, and enjoy endless music',
    memoji: require('../assets/images/onbord_1.png'), // Pastikan nama file ini benar
  },
  {
    SlideComponent: OnboardingScreen2, 
    title: 'Music\nAnytime',
    subtitle: 'Listen to personalized playlists and explore trending songs effortlessly.',
    memoji: require('../assets/images/onbord_2.png'), // Pastikan nama file ini benar
  },
];

const totalPages = onboardingData.length;

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/welcome');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentData = onboardingData[currentPage];
  const CurrentSlide = currentData.SlideComponent;
  const progress = (currentPage + 1) / totalPages;

  return (
    <SafeAreaView style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <CurrentSlide />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.header}>
          <Image source={require('../assets/images/LogoVertical.png')} style={styles.logo} />
          <TouchableOpacity onPress={handleSkip}>
             <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1 }} />

        <View style={styles.footer}>
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          
          <View style={styles.bottomRow}>
            <Image source={currentData.memoji} style={styles.memoji} />
            <CircularProgressButton onPress={handleNext} progress={progress} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffc93c' },
  controlsContainer: { flex: 1, paddingHorizontal: 25, paddingBottom: 40, zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, marginTop: 30 },
  logo: { width: 39, height: 39, resizeMode: 'contain' },
  skipText: { fontSize: 16, color: '#333', fontWeight: '500' },
  footer: {},
  title: { fontSize: 42, fontWeight: 'bold', color: '#141414ff', marginBottom: 16, lineHeight: 50 },
  subtitle: { fontSize: 16, color: '#555', lineHeight: 24 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40 },
  memoji: { width: 90, height: 60, resizeMode: 'contain' }, // saya tambahkan resizeMode
});