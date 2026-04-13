// components/ui/LoadingIndicator.tsx (KODE BARU & BENAR)
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Definisikan props yang bisa diterima
interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string; 
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large', 
  color = '#FDB813',
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