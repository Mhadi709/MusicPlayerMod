import React from 'react';
import { View, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const OVERLAY_COLOR = 'rgba(242, 209, 220, 0.82)';
export default function OnboardingScreen2() {
  return (
    <ImageBackground
      source={require('../../assets/images/bacgron_2.png')}
      style={styles.backgroundImageContainer}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[OVERLAY_COLOR, OVERLAY_COLOR]}
        style={styles.gradientOverlay}
      >
        <View style={styles.imageArea}>
          <Image
            source={require('../../assets/images/Logo_onbord.png')}
            style={styles.illustration}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImageContainer: { flex: 1 },
  gradientOverlay: { flex: 1 },
  imageArea: {
    height: height * 0.55,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  illustration: {
    width: width * 0.9,
    height: width * 0.9,
    maxHeight: height * 0.4,
    resizeMode: 'contain',
  },
});