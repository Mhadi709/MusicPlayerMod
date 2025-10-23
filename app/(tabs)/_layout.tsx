// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Jelajahi',
          tabBarIcon: ({ color, size }) => <Feather name="search" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}