// app/components/TabBarIcon.tsx

import React from 'react';
import { Feather } from '@expo/vector-icons';

// Definisikan tipe untuk props agar kode lebih aman dan mudah dibaca
type TabBarIconProps = {
  name: React.ComponentProps<typeof Feather>['name']; 
  color: string; 
  size?: number; 
};

// Ini adalah komponen reusable Anda
export default function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return <Feather name={name} size={size} color={color} />;
}