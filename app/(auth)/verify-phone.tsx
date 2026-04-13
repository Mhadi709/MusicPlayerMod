import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Image, Platform, 
  KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import PhoneInput from "react-native-phone-number-input";
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import NextButton from '../../components/onboarding/NextButton';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import UniversalAlert, { UniversalAlertProps } from '@/components/common/UniversalAlert';

export const confirmationStore = {
  result: null as any
};

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<Partial<UniversalAlertProps>>({});
  const isButtonDisabled = value.length < 8;

  const phoneInput = useRef<PhoneInput>(null);

  const handleSendCode = async () => {
  const checkValid = phoneInput.current?.isValidNumber(value);
      if (!checkValid) {
        setAlertConfig({
          type: 'warning',
          title: 'Nomor Tidak Valid!',
          message: 'Masukkan nomor telepon yang valid sebelum melanjutkan.',
          confirmText: 'OK',
        });
        setAlertVisible(true);
        return;
      }

      try {
        setIsLoading(true);
       const authInstance = getAuth();
      const confirmation = await signInWithPhoneNumber(authInstance, formattedValue);
      confirmationStore.result = confirmation; 
      router.push({
        pathname: '/(auth)/verify-phone-otp',
        params: { phone: formattedValue }
      });
      } catch (error: any) {
        setAlertConfig({
          type: 'error',
          title: 'Gagal Mengirim SMS!',
          message: 'Gagal mengirim SMS: ' + error.message,
          confirmText: 'Coba Lagi',
        });
        setAlertVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

   return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}> 
            
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View style={styles.innerContainer}>
                <Image 
                  source={require('../../assets/images/telephone.png')} 
                  style={styles.phoneIcon} 
                />
                <Text style={styles.title}>Verify Account</Text>
                <Text style={styles.subtitle}>
                  We will send a message to your phone number for verification
                </Text>

                <View style={styles.inputContainer}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode="US"
                layout="second" 
                autoFocus
                onChangeText={setValue}
                onChangeFormattedText={setFormattedValue}
                containerStyle={styles.phoneContainer}
                flagButtonStyle={styles.flagButton}
                textContainerStyle={styles.textInputContainer}
                textInputStyle={styles.phoneTextInput}
                codeTextStyle={styles.codeText}
                withShadow={false}
                renderDropdownImage={<View style={styles.dropdownIcon} />}
              />
           </View>
              </View>
            </ScrollView>

            <UniversalAlert
            {...(alertConfig as UniversalAlertProps)}
            visible={alertVisible}
            onConfirm={() => setAlertVisible(false)}
            onCancel={() => setAlertVisible(false)}
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <NextButton
                  title="Create new Account"
                  onPress={handleSendCode}
                  disabled={isButtonDisabled}
                />
              )}
            </View>

          </View> 
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 24,
  },
  phoneIcon: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FDB813',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 40,
  },
   inputContainer: {
    marginTop: 20,
    width: '100%',
  },
   floatingLabel: {
    position: 'absolute',
    left: 105, 
    top: -5,
    fontSize: 12,
    color: '#8e8e8e',
    zIndex: 1,
  },
  phoneContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
  },
  flagButton: {
    width: 80, 
    height: 45,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 15,
    justifyContent: 'center',
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    height: 45,
    marginTop: 15,
    marginLeft: 25, 
    borderBottomWidth: 2,
    borderBottomColor: '#4A6572', 
    paddingHorizontal: 0,
  },
  codeText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold', 
    marginRight: 5,
  },
  phoneTextInput: {
    fontSize: 16,
    color: '#000',
    height: 45,
    paddingLeft: 0,
  },
  dropdownIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8e8e8e',
    marginLeft: 10,
  },

  buttonContainer: {
   paddingBottom: Platform.OS === 'ios' ? 20 : 30, 
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
});