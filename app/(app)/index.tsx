import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const dotAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(dotAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(tabs)/');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      {/* 배경 원형 장식 */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.center}>
        {/* 로고 */}
        <Animated.View style={[styles.logoWrap, {
          opacity: logoAnim,
          transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
        }]}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>✈️</Text>
          </View>
        </Animated.View>

        {/* 앱 이름 + 태그라인 */}
        <Animated.View style={{ opacity: textAnim, alignItems: 'center', gap: 8 }}>
          <Text style={styles.appName}>TripMate</Text>
          <Text style={styles.tagline}>여행 일정과 스타일로{'\n'}딱 맞는 동행을 찾아보세요</Text>
        </Animated.View>

        {/* 로딩 점 */}
        <Animated.View style={[styles.dots, { opacity: dotAnim }]}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotMid]} />
          <View style={styles.dot} />
        </Animated.View>
      </View>

      {/* 하단 버전 */}
      <Animated.Text style={[styles.version, { opacity: dotAnim }]}>
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
  bgCircle1: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 40,
    left: -60,
  },
  center: {
    alignItems: 'center',
    gap: 20,
  },
  logoWrap: {
    marginBottom: 4,
  },
  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoIcon: { fontSize: 56 },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 23,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotMid: {
    backgroundColor: Colors.pointYellow,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
});
