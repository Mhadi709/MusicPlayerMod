import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  onPress?: () => void;
  label?: string;
  style?: ViewStyle;
};

const NextButton = ({ onPress, label = 'Next', style }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.nextButton} onPress={onPress}>
        <Text style={styles.nextButtonText}>{label}</Text>
        <Feather name="arrow-right" size={20} color="#fff" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30, // naik sedikit dari bawah
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#2CA58D',
    width: 370,
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    marginLeft: -20, // tetap di kanan tapi tidak mendorong teks
  },
});

export default NextButton;
