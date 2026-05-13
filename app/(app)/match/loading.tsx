import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { findMates } from '../../../services/matchService';
import { FindMateFilter } from '../../../types';

const STEPS = [
  '일정 & 목적지 분석',
  '여행 스타일 파악',
  '프로필 & 신뢰도 검증',
  '최적의 메이트 순위 산출',
];

export default function MatchLoadingScreen() {
  const insets = useSafeAreaInsets();
  const { filter: filterParam } = useLocalSearchParams<{ filter: string }>();
  const [completedSteps, setCompletedSteps] = useState(0);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const filter: FindMateFilter = filterParam ? JSON.parse(filterParam) : {};

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        Animated.timing(stepAnims[i], { toValue: 1, duration: 400, useNativeDriver: true }).start();
        setCompletedSteps((prev) => prev + 1);
      }, i * 600 + 300);
    });

    findMates(filter).then((results) => {
      setTimeout(() => {
        router.replace({ pathname: '/match/list', params: { results: JSON.stringify(results) } });
      }, STEPS.length * 600 + 800);
    });
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.iconWrap, { transform: [{ translateY }, { scale: pulseAnim }] }]}>
        <Text style={styles.icon}>🤖</Text>
      </Animated.View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>AI 매칭 중</Text>
        <Text style={styles.subtitle}>여행 스타일과 일정을{'\n'}분석하고 있어요</Text>
      </View>

      <View style={styles.steps}>
        {STEPS.map((step, i) => {
          const done = i < completedSteps;
          return (
            <Animated.View
              key={step}
              style={[styles.step, done && styles.stepDone, { opacity: stepAnims[i] }]}
            >
              <View style={[styles.stepDot, done && styles.stepDotDone]}>
                <Text style={[styles.stepDotText, done && styles.stepDotTextDone]}>
                  {done ? '✓' : (i + 1).toString()}
                </Text>
              </View>
              <Text style={[styles.stepText, done && styles.stepTextDone]}>{step}</Text>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(completedSteps / STEPS.length) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{completedSteps} / {STEPS.length} 완료</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 24,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 4,
  },
  icon: { fontSize: 44 },
  textWrap: { alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  steps: { width: '100%', gap: 10 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  stepDone: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  stepDotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepDotText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' },
  stepDotTextDone: { color: Colors.white },
  stepText: { fontSize: 14, color: Colors.textSecondary },
  stepTextDone: { color: Colors.primary, fontWeight: '600' },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.cardBorder,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  progressText: { fontSize: 12, color: Colors.textSecondary },
});
