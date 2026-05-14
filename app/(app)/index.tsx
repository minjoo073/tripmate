import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import Svg, { Circle, Line, Path } from 'react-native-svg';

function CompassIcon() {
  return (
    <Svg width={52} height={52} viewBox="0 0 52 52">
      <Circle cx={26} cy={26} r={22} stroke="rgba(255,255,255,0.22)" strokeWidth={1} fill="none" />
      <Line x1={26} y1={4} x2={26} y2={9} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <Line x1={26} y1={43} x2={26} y2={48} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      <Line x1={4} y1={26} x2={9} y2={26} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      <Line x1={43} y1={26} x2={48} y2={26} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      {/* North needle */}
      <Path d="M26 10 L29 23 L26 21 L23 23 Z" fill="rgba(255,255,255,0.85)" />
      {/* South needle */}
      <Path d="M26 42 L29 29 L26 31 L23 29 Z" fill="rgba(255,255,255,0.22)" />
      {/* Center dot */}
      <Circle cx={26} cy={26} r={2} fill="rgba(255,255,255,0.5)" />
    </Svg>
  );
}

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const subAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconAnim, { toValue: 1, duration: 900, delay: 0,    useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 700, delay: 700,  useNativeDriver: true }),
      Animated.timing(subAnim,  { toValue: 1, duration: 600, delay: 1200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 1600, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      router.replace(user ? '/(tabs)/' : '/(auth)/login');
    }, 2600);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>

        {/* Small top label */}
        <Animated.Text style={[styles.topLabel, { opacity: iconAnim }]}>
          TRAVEL MATE
        </Animated.Text>

        {/* Compass icon */}
        <Animated.View style={[styles.iconWrap, { opacity: iconAnim }]}>
          <CompassIcon />
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textAnim }]}>
          TripMate
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: subAnim }]}>
          취향이 맞는 여행 메이트를{'\n'}만나보세요
        </Animated.Text>

        {/* Dots */}
        <Animated.View style={[styles.dots, { opacity: fadeAnim }]}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotMid]} />
          <View style={styles.dot} />
        </Animated.View>

      </View>

      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
        v1.0.0
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 16,
  },
  topLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 4,
    marginBottom: 8,
  },
  iconWrap: {
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: 2,
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotMid: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  version: {
    position: 'absolute',
    bottom: 36,
    fontSize: 11,
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: 0.5,
  },
});
