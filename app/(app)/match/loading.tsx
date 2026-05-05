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
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const filter: FindMateFilter = filterParam ? JSON.parse(filterParam) : {};

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        Animated.timing(stepAnims[i], { toValue: 1, duration: 400, useNativeDriver: true }).start();
        setCompletedSteps((prev) => prev + 1);
      }, i * 500 + 200);
    });

    findMates(filter).then((results) => {
      setTimeout(() => {
        router.replace({ pathname: '/match/list', params: { results: JSON.stringify(results) } });
      }, STEPS.length * 500 + 600);
    });
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.iconWrap, { transform: [{ translateY }] }]}>
        <Text style={styles.icon}>🤖</Text>
      </Animated.View>

      <Text style={styles.title}>AI 매칭 중</Text>
      <Text style={styles.subtitle}>여행 스타일과 일정을{'\n'}분석하고 있어요</Text>

      <View style={styles.steps}>
        {STEPS.map((step, i) => {
          const done = i < completedSteps;
          return (
            <Animated.View
              key={step}
              style={[styles.step, done && styles.stepDone, { opacity: stepAnims[i] }]}
            >
              <Text style={[styles.stepIcon, done && styles.stepIconDone]}>{done ? '✓' : '○'}</Text>
              <Text style={[styles.stepText, done && styles.stepTextDone]}>{step}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pointYellow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  icon: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  steps: { width: '100%', gap: 10, marginTop: 8 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.cardBorder,
  },
  stepDone: { borderLeftColor: Colors.primary },
  stepIcon: { fontSize: 16, color: Colors.textSecondary },
  stepIconDone: { color: Colors.primary },
  stepText: { fontSize: 14, color: Colors.textSecondary },
  stepTextDone: { color: Colors.textPrimary, fontWeight: '600' },
});
