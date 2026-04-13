import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '../../components/onboarding/NextButton';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const { width, height } = Dimensions.get('window');

export default function LoginSuccessScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        router.replace('/(drawer)/choose-artists');
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.yellowBackground} />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.contentContainer}>
          <View style={styles.topSection}>
            <Image
              source={require('../../assets/images/bag.png')}
              style={styles.bagIcon}
            />

            <View style={styles.textWrapper}>
              <Text style={styles.title}>
                Logged in{'\n'}successfully
              </Text>
              <Text style={styles.subtitle}>
                We have prepared information for your journey
              </Text>
            </View>
          </View>
          <View style={styles.bottomSection}>
            {isLoading ? (
              <LoadingIndicator size="large" />
            ) : (
              <NextButton
                title="Start new journey"
                onPress={handleContinue}
              />
            )}
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  yellowBackground: {
    position: 'absolute',
    backgroundColor: '#FFC107', 
    width: height * 1.2,      
    height: height * 1.2,
    borderRadius: (height * 1.2) / 2, 
    top: -height * 0.45,       
    left: -height * 0.35,       
   
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', 
    paddingHorizontal: 30, 
    paddingBottom: 40,    
    paddingTop: Platform.OS === 'android' ? 50 : 20, 
  },
  topSection: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'flex-start', 
  },

  bagIcon: {
    width: 220, 
    height: 220,
    resizeMode: 'contain',
    marginBottom: 1,
    marginLeft: -13,  
  },

  textWrapper: {
    width: '100%',
  },

  title: {
    fontSize: 32,
    fontWeight: '800', 
    color: '#1A1A1A', 
    marginBottom: 15,
    lineHeight: 40,   
    textAlign: 'left',
  },

  subtitle: {
    fontSize: 16,
    color: '#666666', 
    lineHeight: 24,
    textAlign: 'left',
    maxWidth: '80%',  
  },

  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
});