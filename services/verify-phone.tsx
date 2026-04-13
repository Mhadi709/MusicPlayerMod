import auth from '@react-native-firebase/auth';
import { loginWithPhoneApi } from './auth.api'; // Kita buat nanti
import { useState } from 'react';

export function PhoneSignIn() {
   const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  // 1. Kirim SMS
  async function signInWithPhoneNumber(phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  // 2. Verifikasi Kode OTP
  async function confirmCode() {
    try {
      const result = await confirm.confirm(code);
      // Dapatkan Token Verifikasi untuk dikirim ke Go
      const idToken = await result.user.getIdToken();
      
      // KIRIM KE BACKEND GO
      const backendRes = await loginWithPhoneApi(idToken);
      console.log("User Verified in DB:", backendRes);
    } catch (error) {
      console.log('Invalid code.');
    }
  }
}