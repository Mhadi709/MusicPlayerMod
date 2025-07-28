import React from 'react';
import { View, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OVERLAY_COLOR = 'rgba(242, 209, 220, 0.82)'; // Opacity dinaikkan dari 0.4 ke 0.7

export const OnboardingScreen2 = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/bacgron_2.png')}
      style={styles.backgroundImageContainer}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[OVERLAY_COLOR, OVERLAY_COLOR]} // Warna semi-transparan #F2D1DC yang lebih kuat
        style={styles.gradientOverlay}
      >
        <View style={styles.mainContent}>
          <Image
            source={require('../../assets/images/Logo_onbord.png')}
            style={styles.illustration}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'contain',
    marginBottom: 100,
  },

});