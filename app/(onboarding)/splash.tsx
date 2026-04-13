import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useFonts, TitanOne_400Regular } from '@expo-google-fonts/titan-one';

export default function SplashScreen() {
  const [fontsLoaded] = useFonts({ TitanOne_400Regular });

  const letters = ['C', 'a', 'r', 'o', 'l', 'i', 'n', 'e'];
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;
  const dotY = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded) return; 

    const letterAnimations = letters.map((_, i) =>
      Animated.timing(letterAnims[i], {
        toValue: 1,
        duration: 80,
        delay: i * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    const dotAppear = Animated.timing(dotScale, {
      toValue: 1,
      duration: 200,
      delay: letters.length * 80 + 100,
      easing: Easing.back(2),
      useNativeDriver: true,
    });

    const dotBounce = Animated.loop(
      Animated.sequence([
        Animated.timing(dotY, {
          toValue: -14,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotY, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ])
    );

    Animated.sequence([
      Animated.stagger(80, letterAnimations),
      dotAppear,
    ]).start(() => {
      dotBounce.start();
    });
  }, [fontsLoaded]); // ← dependency fontsLoaded

  // ← return null di bawah semua hooks
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {letters.map((letter, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.title,
              {
                opacity: letterAnims[i],
                transform: [
                  {
                    translateY: letterAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
        ))}
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [{ translateY: dotY }, { scale: dotScale }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2CA58D',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 36,
    fontFamily: 'TitanOne_400Regular',
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FDB813',
    marginLeft: 3,
    marginBottom: 8,
  },
});