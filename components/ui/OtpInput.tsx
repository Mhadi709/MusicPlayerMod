// components/ui/OtpInput.tsx (KODE FINAL YANG PASTI BERHASIL)
import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  
  // =================================================================
  // PERBAIKAN UTAMA: Gunakan array biasa untuk menampung instance TextInput
  // =================================================================
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.charAt(text.length - 1);
    setOtp(newOtp);

    // Fokus ke input berikutnya jika teks dimasukkan
    if (text && index < length - 1) {
      // Panggil focus pada instance TextInput berikutnya
      inputsRef.current[index + 1]?.focus();
    }

    const newOtpString = newOtp.join('');
    if (newOtpString.length === length) {
      onComplete(newOtpString);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Pindah fokus ke input sebelumnya
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          // =================================================================
          // Gunakan "ref callback" untuk menyimpan instance ke dalam array
          // =================================================================
          ref={(input) => {
            inputsRef.current[index] = input;
          }}
          style={styles.otpInput}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          autoFocus={index === 0} // Otomatis fokus ke input pertama
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
    maxWidth: 250,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  otpInputActive: {
    borderBottomColor: '#FF0000', // Garis merah untuk fokus
  },
});

export default OtpInput;