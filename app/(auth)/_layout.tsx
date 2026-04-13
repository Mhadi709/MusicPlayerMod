// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: '', 
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' }, 
        }} 
      />
      <Stack.Screen name="change-account" options={{ 
          title: '', 
          headerShadowVisible: false, 
          headerStyle: { backgroundColor: '#fff' }, 
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
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="verify-phone-otp" options={{ headerShown: false }} />
    </Stack>
  );
}