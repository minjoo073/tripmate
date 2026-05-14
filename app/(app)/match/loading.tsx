import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { findMates } from '../../../services/matchService';
import { FindMateFilter } from '../../../types';

const STEPS = [
  { label: '여행지 & 일정 확인 중', sub: 'destination & schedule' },
  { label: '여행 스타일 비교 중', sub: 'travel style matching' },
  { label: '신뢰도 & 인증 확인', sub: 'trust & verification' },
  { label: '비슷한 여행자 연결 중', sub: 'finding your companion' },
];

export default function MatchLoadingScreen() {
  const insets = useSafeAreaInsets();
  const { filter: filterParam } = useLocalSearchParams<{ filter: string }>();
  const [completedSteps, setCompletedSteps] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const dotAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ]),
    ).start();

    dotAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]),
      ).start();
    });
  }, []);

  useEffect(() => {
    const filter: FindMateFilter = filterParam ? JSON.parse(filterParam) : {};

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        Animated.timing(stepAnims[i], { toValue: 1, duration: 500, useNativeDriver: true }).start();
        setCompletedSteps((prev) => prev + 1);
      }, i * 700 + 400);
    });

    findMates(filter).then((results) => {
      setTimeout(() => {
        router.replace({ pathname: '/match/list', params: { results: JSON.stringify(results) } });
      }, STEPS.length * 700 + 900);
    });
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }, { opacity: fadeAnim }]}>

      {/* Compass icon */}
      <Animated.View style={[styles.compassWrap, { transform: [{ translateY }] }]}>
        <Text style={styles.compassIcon}>✦</Text>
        <View style={styles.compassRing} />
      </Animated.View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>비슷한 여행자를{'\n'}찾고 있어요</Text>
        <View style={styles.dotsRow}>
          {dotAnims.map((anim, i) => (
            <Animated.View key={i} style={[styles.dot, { opacity: anim }]} />
          ))}
        </View>
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {STEPS.map((step, i) => {
          const done = i < completedSteps;
          return (
            <Animated.View
              key={step.label}
              style={[styles.step, { opacity: stepAnims[i] }]}
            >
              <View style={[styles.stepCheck, done && styles.stepCheckDone]}>
                {done && <Text style={styles.stepCheckMark}>✓</Text>}
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.label}</Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Progress line */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${(completedSteps / STEPS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {completedSteps < STEPS.length ? `${STEPS[completedSteps]?.label ?? '완료'}...` : '같은 속도의 여행자를 연결하는 중이에요'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 36,
  },

  compassWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassIcon: {
    fontSize: 28,
    color: Colors.primary,
    position: 'absolute',
  },
  compassRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: 'absolute',
  },

  textWrap: { alignItems: 'center', gap: 14 },
  title: {
    fontSize: 22,
    fontWeight: '300',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  steps: { width: '100%', gap: 10 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stepCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepCheckDone: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  stepCheckMark: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  stepText: { flex: 1, gap: 2 },
  stepLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  stepLabelDone: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  stepSub: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  progressWrap: { width: '100%', gap: 10 },
  progressTrack: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: 1,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
