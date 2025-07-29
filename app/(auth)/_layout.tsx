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
    </Stack>
  );
}