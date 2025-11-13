// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: '', // Judul kosong
          headerShadowVisible: false, // Opsional: menghilangkan garis bayangan di bawah header
          headerStyle: { backgroundColor: '#fff' }, // Opsional: memastikan warna header putih
        }} 
      />
      <Stack.Screen name="change-account" options={{ 
          title: '', // Judul kosong
          headerShadowVisible: false, // Opsional: menghilangkan garis bayangan di bawah header
          headerStyle: { backgroundColor: '#fff' }, // Opsional: memastikan warna header putih
        }}  />
          <Stack.Screen 
        name="verify-phone" 
        options={{ 
          title: 'Phone Verification',
          headerShadowVisible: false,
        }} 
      />
        <Stack.Screen 
        name="Login_Success" 
        options={{ headerShown: false }} // Ini akan menyembunyikan header & tombol kembali
      />
      <Stack.Screen name="verify-phone-otp" options={{ headerShown: false }} />
    </Stack>
  );
}