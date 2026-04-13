import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import CircularProgressButton from '../../components/common/CircularProgressButton';

const { width, height } = Dimensions.get('window');

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375; 
  return Math.round(size * scale);
};

const onboardingData = [
  {
    SlideComponent: OnboardingScreen1,
    title: 'Discover\nYour Music',
    subtitle: 'Stream your favorite songs, explore new genres, and enjoy endless music',
    memoji: require('../../assets/images/onbord_1.png'),
  },
  {
    SlideComponent: OnboardingScreen2,
    title: 'Music\nAnytime',
    subtitle: 'Listen to personalized playlists and explore trending songs effortlessly.',
    memoji: require('../../assets/images/onbord_2.png'),
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
      router.replace('/(onboarding)/welcome');
    }
  };

  const handleSkipToHome = () => {
    router.replace("/(drawer)/(tabs)/homepage");
  };

  const currentData = onboardingData[currentPage];
  const CurrentSlide = currentData.SlideComponent;
  const progress = (currentPage + 1) / totalPages;

  return (
    <View style={styles.container}>
      {/* Background & Gambar (Layer Belakang) */}
      <View style={StyleSheet.absoluteFillObject}>
        <CurrentSlide />
      </View>

      {/* Konten Text & Tombol (Layer Depan) */}
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/LogoVertical.png')} style={styles.logo} />
          <TouchableOpacity onPress={handleSkipToHome}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer fleksibel untuk mendorong Footer ke bawah */}
        <View style={styles.spacer} />

        {/* Footer Text */}
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {currentData.title}
          </Text>
          
          <Text style={styles.subtitle}>
            {currentData.subtitle}
          </Text>

          <View style={styles.bottomRow}>
            <Image source={currentData.memoji} style={styles.memoji} />
            <CircularProgressButton
              onPress={handleNext}
              progress={progress}
              totalPages={totalPages}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffc93c' },
  safeArea: { flex: 1, marginHorizontal: 24 }, // Margin global
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    height: 50, // Tinggi pasti header
  },
  logo: { width: 32, height: 32, resizeMode: 'contain' },
  skipText: { fontSize: 16, color: '#938D8D', fontWeight: '600' },
  //  Spacer ini mengisi ruang kosong antara Header dan Text
  spacer: {
    flex: 1, 
  },

  footer: {
    paddingBottom: 20, // Jarak dari bawah layar
    maxHeight: height * 0.45, 
    justifyContent: 'flex-end',
  },
  
  title: {
    // Font responsif, tidak statis 62
    fontSize: getResponsiveFontSize(52), 
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 10,
    lineHeight: getResponsiveFontSize(56),
  },
  
  subtitle: {
    fontSize: getResponsiveFontSize(18),
    color: '#555',
    lineHeight: getResponsiveFontSize(24),
    marginBottom: 20,
  },
  
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  
  memoji: {
    width: getResponsiveFontSize(80),
    height: getResponsiveFontSize(80),
    resizeMode: 'contain',
  },
});