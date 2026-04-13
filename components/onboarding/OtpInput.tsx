import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0); // State untuk melacak fokus
  
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    // Hanya izinkan angka
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp]
    newOtp[index] = text.charAt(text.length - 1);
    setOtp(newOtp);
    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Cek jika semua sudah terisi
    const newOtpString = newOtp.join('');
    if (newOtpString.length === length) {
      onComplete(newOtpString);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Jika tekan Backspace dan kotak kosong, pindah ke kotak sebelumnya
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(input) => {
            inputsRef.current[index] = input;
          }}
          style={[
            styles.otpInput,
            focusedIndex === index && styles.otpInputActive,
            otp[index] !== '' && styles.otpInputFilled
          ]}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)} 
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0', 
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  otpInputActive: {
    borderBottomColor: '#FDB813', 
    borderBottomWidth: 3,
  },
  otpInputFilled: {
    borderBottomColor: '#2CA58D', 
  },
});

export default OtpInput;