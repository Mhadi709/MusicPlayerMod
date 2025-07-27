// components/onboarding/OnboardingScreen2.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const OnboardingScreen2 = () => {
  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <View style={styles.mainContent}>
        <Image source={require('../../assets/images/Splash_Screen_1.png')} style={styles.illustration} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  illustration: { width: width * 0.7, height: width * 0.7, resizeMode: 'contain' },
});