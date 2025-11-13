// components/ui/LoadingIndicator.tsx (KODE BARU & BENAR)
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Definisikan props yang bisa diterima
interface LoadingIndicatorProps {
  size?: 'small' | 'large'; // Ukuran bisa 'small' atau 'large'
  color?: string; // Warna bisa string hex, rgb, dll.
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large', // Nilai default adalah 'large'
  color = '#FDB813', // Nilai default adalah warna kuning tema Anda
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Style ini memastikan loader berada di tengah jika containernya besar
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;