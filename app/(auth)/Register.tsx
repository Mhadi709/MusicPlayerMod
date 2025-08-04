import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import NextButton from '../../components/ui/NextButton';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function Register() {
  const router = useRouter(); 
   const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Tetap tampilkan di iOS, sembunyikan di Android setelah pilih
    setDate(currentDate);
  };

  const handleRegister = async () => {
    // 3. Set isLoading menjadi true saat proses dimulai
    setIsLoading(true);

    // Simulasi proses registrasi (misalnya, panggilan ke API)
    console.log('Registering...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Tunggu 2 detik

    // 4. Setelah selesai, set isLoading kembali ke false
    setIsLoading(false);
    console.log('Registration complete!');
   
     router.push('/(auth)/verify-phone'); 
  };

  const handleDatePress = () => {
    console.log('Date field pressed'); // Debugging
    setShowDatePicker(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/iconLove.png')} style={styles.image} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Just one more small step, let’s start with your email</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="John Doe" 
                placeholderTextColor="#aaa" 
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="john@mail.com"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.dateTouchable}
                onPress={handleDatePress}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>
                  {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <Feather
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* 5. Gunakan render kondisional di sini */}
          {isLoading ? (
            // Jika sedang loading, tampilkan LoadingIndicator
            <LoadingIndicator size="large" />
          ) : (
            // Jika tidak loading, tampilkan NextButton
            <NextButton
              title="Create new Account"
              onPress={handleRegister} // Panggil fungsi handleRegister
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  image: {
    width: 106,
    height: 106,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FDBB1C',
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e8e',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    marginTop: 10,
    color: '#8e8e8e',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  dateTouchable: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 40,
  },
  eyeIcon: {
    padding: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
     minHeight: 50, 
    justifyContent: 'center',
  },
 
});