// components/onboarding/DiagonalBackground.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DiagonalBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.diagonalWhite} />
    </View>
  );
};

const styles = StyleSheet.create({
  diagonalWhite: {
    position: 'absolute',
    width: width * 1.7,
    height: height * 1.5,
    backgroundColor: '#fff',
    transform: [
      { rotate: '45deg' },
      { translateX: width * 0.6 },
      { translateY: -height * 0.1 },
    ],
    borderBottomRightRadius: 60,
  },
});

export default DiagonalBackground;