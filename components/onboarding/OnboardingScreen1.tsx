// components/onboarding/OnboardingScreen1.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import DiagonalBackground from './DiagonalBackground';

const { width } = Dimensions.get('window');

export const OnboardingScreen1 = () => {
  return (
    <View style={styles.container}>
      <DiagonalBackground />
       <View style={styles.headphoneWrapper}>
        <Image source={require('../../assets/images/Heanset.png')} style={styles.headphone} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffc93c', overflow: 'hidden' },
  headphoneWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  headphone: { width: width * 0.7, height: width * 0.7, resizeMode: 'contain' },
});