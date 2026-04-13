import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import NextButton from '../../components/onboarding/NextButton';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { registerEmail } from '@/services/auth.api';
import UniversalAlert, { UniversalAlertProps } from '@/components/common/UniversalAlert';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter(); 
  const { syncUser } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  const [date, setDate] = useState<Date>(new Date());

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
function formatDateForAPI(date: Date) {
  return date.toISOString().split('T')[0];
}

 const onDateChange = (_: any, selectedDate?: Date) => {
  if (selectedDate) {
    setDate(selectedDate);
  }
  setShowDatePicker(false);
};

 const handleRegister = async () => {
  if (!fullName || !email || !password || !date) {
    setAlertConfig({
      type: 'warning',
      title: 'Form Tidak Lengkap!',
      message: 'Harap isi semua field sebelum melanjutkan.',
      confirmText: 'OK',
    });
    setAlertVisible(true);
    return;
  }

  try {
    setIsLoading(true);
   const dateOfBirth = formatDateForAPI(date);
    const res = await registerEmail(email, password, fullName, dateOfBirth)
    if (res.userId && res.user) {
      await syncUser(res.user, res.userId);
      console.log(" User berhasil disimpan ke SecureStore HP");
    }
    console.log('Register success:', res);
    router.push('/(auth)/verify-phone');
  } catch (err: any) {
    console.error(err);
    setAlertConfig({
      type: 'error',
      title: 'Registrasi Gagal!',
      message: err?.response?.data?.message || 'Registration failed',
      confirmText: 'Coba Lagi',
    });
    setAlertVisible(true);
  } finally {
    setIsLoading(false);
  }
};

  const handleDatePress = () => {
    console.log('Date field pressed');
    setShowDatePicker(true);
  };
 return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={{ padding: 16, paddingBottom: 0 }}
      >
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F5F5F5" }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/images/iconLove.png')}
          style={styles.image}
        />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Just one more small step, let’s start with your email
        </Text>
        <View style={styles.formContainer}>
          {/* FULL NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="john@mail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* DATE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.dateTouchable}
                onPress={handleDatePress}
              >
                <Text style={styles.dateText}>
                  {date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
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

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
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

      <UniversalAlert
      {...(alertConfig as UniversalAlertProps)}
      visible={alertVisible}
      onConfirm={() => setAlertVisible(false)}
      onCancel={() => setAlertVisible(false)}
    />
    
        {/* BUTTON */}
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <LoadingIndicator size="large" />
          ) : (
            <NextButton title="Create new Account" onPress={handleRegister} />
          )}
        </View>
      </View>
    </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </>
);

}

const styles = StyleSheet.create({
  container: {
  flexGrow: 1,
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