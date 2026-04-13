import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AccountPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account Page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
