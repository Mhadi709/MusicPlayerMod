import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import DiagonalBackground from '../../components/layout/DiagonalBackground';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen1() {
  return (
    <View style={styles.container}>
      <DiagonalBackground />
      <View style={styles.imageArea}>
        <Image
          source={require('../../assets/images/Music2.png')}
          style={styles.headphone}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffc93c', 
    overflow: 'hidden' 
  },
  imageArea: {
    height: height * 0.55, 
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end', 
    paddingBottom: 20,
  },
  headphone: { 
    width: width * 0.8, 
    height: width * 0.8, 
    maxHeight: height * 0.4, 
    resizeMode: 'contain' 
  },
});