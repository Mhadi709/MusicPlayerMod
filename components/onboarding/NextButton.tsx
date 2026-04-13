import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native'; // Tambah StyleProp
import { Feather } from '@expo/vector-icons';
import LoadingIndicator from '../common/LoadingIndicator'; 
type NextButtonProps = {
  onPress: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>; 
  disabled?: boolean; 
  loading?: boolean;
};

const NextButton: React.FC<NextButtonProps> = ({ onPress, title = 'Next', style, disabled = false ,loading}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.nextButton, disabled && styles.disabledButton, style]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
           {loading ? (
        <LoadingIndicator /> 
      ) : (
        <Text style={styles.nextButtonText}>{title}</Text>
         )}
        <View style={styles.iconContainer}>
          <Feather name="arrow-right" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  width: '100%',       
    alignItems: 'center', 
    zIndex: 10,
    marginVertical: 10, 
  },
  nextButton: {
    backgroundColor: '#2CA58D', // Warna aktif
    width: 316,         
    height: 70,          
    borderRadius: 35,
    justifyContent: 'center', 
    alignItems: 'center',     
    flexDirection: 'row',     
    position: 'relative',     
  },
  disabledButton: {
    backgroundColor: '#ccc', // Warna abu-abu saat disabled
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
   paddingHorizontal: 20,
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'absolute', 
    right: 25,            
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default NextButton;