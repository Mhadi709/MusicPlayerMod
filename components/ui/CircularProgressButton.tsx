// components/ui/CircularProgressButton.tsx 
import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 80;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  onPress: () => void;
  progress: number;
  totalPages: number; // Terima prop baru
}

const CircularProgressButton: React.FC<Props> = ({ onPress, progress, totalPages }) => {
  const segmentSpacing = 20; // Jarak antar segmen bisa diatur di sini
  const totalSpacing = totalPages * segmentSpacing;
  const segmentLength = (CIRCUMFERENCE - totalSpacing) / totalPages;
  const dashArray = `${segmentLength} ${segmentSpacing}`;
  const totalSegmentLength = segmentLength * totalPages;

  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

 const animatedProps = useAnimatedProps(() => {
  const offset = CIRCUMFERENCE * (1 - progressValue.value);
  return { strokeDashoffset: offset };
});


  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
        <Svg
        width={SIZE}
        height={SIZE}
        style={StyleSheet.absoluteFill}
        transform={[{ rotate: '-90deg' }]}
      >
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#EAEAEA"
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#FDB813"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          fill="transparent"
        />
      </Svg>
      <View style={styles.innerCircle}>
        <Feather name="chevron-right" size={32} color="#2D3748" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: SIZE - STROKE_WIDTH * 2.5,
    height: SIZE - STROKE_WIDTH * 2.5,
    borderRadius: (SIZE - STROKE_WIDTH * 2.5) / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CircularProgressButton;