import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type NextButtonProps = {
  onPress: () => void;
  title?: string; // bisa dikustomisasi
  style?: ViewStyle;
  disabled?: boolean; // Tambahkan properti disabled
};

const NextButton: React.FC<NextButtonProps> = ({ onPress, title = 'Next', style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.nextButton, disabled && styles.disabledButton, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={styles.nextButtonText}>{title}</Text>
      <Feather name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  );
}

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
 disabledButton: {
    backgroundColor: '#ccc', // Warna abu-abu saat disabled
    opacity: 0.7, // Opsional: mengurangi opacity untuk efek visual
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
