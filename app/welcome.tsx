import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require('../assets/images/Halaman_Welkome.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.logoTitleWrapper}>
          <ImageBackground
            source={require('../assets/images/LogoVertical.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.titlePart1}>Welcome to</Text>
          <Text style={styles.titlePart2}>Caroline!</Text>
        </View>
        <Text style={styles.subtitle}>Are you ready for the journey full of smiles?</Text>
      <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/login')} 
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Feather name="arrow-right" size={24} color="#FFFFFF" style={{ marginLeft: 10 }} />
      </View>
    </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
   alignItems: 'flex-start',
    padding: 20,
  },
 logoTitleWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10, 
  },
   logo: {
    width: 60,
    height: 60,
  },
  titlePart1: {
    fontSize: 43,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 46,
  },
  titlePart2: {
    fontSize: 43,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 30,
    marginTop: 20,
  },
button: {
    backgroundColor: '#4CAF50',
    width: 170,
    height: 60,
    borderRadius: 24,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 40,
    right: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'semibold',
  },
  buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
},

});