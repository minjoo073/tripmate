import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Elevation, Font, Radius } from '../../../constants/colors';
import { PlaneThinIcon } from '../../../components/ui/Icon';
import { findMates } from '../../../services/matchService';
import { FindMateFilter } from '../../../types';

const STEPS = [
  { label: '여행지 & 일정 확인 중', sub: 'destination & schedule' },
  { label: '여행 스타일 비교 중', sub: 'travel style matching' },
  { label: '신뢰도 & 인증 확인', sub: 'trust & verification' },
  { label: '비슷한 여행자 연결 중', sub: 'finding your companion' },
];

// Prolate cycloid (b > a) → a single self-crossing "pigtail" loop along the
// travel direction. Sampled into screen points + tangent angles so the plane
// can be tweened along the exact same curve drawn as the dashed trail.
function buildFlightPath(w: number, h: number) {
  if (!w || !h) return null;
  const N = 64;
  const a = 1;
  const b = 1.7;
  const phi = (52 * Math.PI) / 180; // travel heading: up-right
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);

  const px: number[] = [], py: number[] = [], tpx: number[] = [], tpy: number[] = [];
  for (let i = 0; i < N; i++) {
    const th = (i / (N - 1)) * 2 * Math.PI;
    const u = a * th - b * Math.sin(th);
    const v = a - b * Math.cos(th);
    px.push(u * cos - v * sin);
    py.push(u * sin + v * cos);
    const du = a - b * Math.cos(th);
    const dv = b * Math.sin(th);
    tpx.push(du * cos - dv * sin);
    tpy.push(du * sin + dv * cos);
  }

  const pxmin = Math.min(...px), pxmax = Math.max(...px);
  const pymin = Math.min(...py), pymax = Math.max(...py);
  const marginX = w * 0.18, marginTop = h * 0.1, marginBot = h * 0.14;
  const availW = w - 2 * marginX, availH = h - marginTop - marginBot;
  const S = Math.min(availW / (pxmax - pxmin), availH / (pymax - pymin));
  const offX = marginX + (availW - (pxmax - pxmin) * S) / 2;

  const xs: number[] = [], ys: number[] = [], angles: number[] = [], input: number[] = [];
  for (let i = 0; i < N; i++) {
    xs.push(offX + (px[i] - pxmin) * S);
    ys.push(h - marginBot - (py[i] - pymin) * S);
    angles.push((Math.atan2(-tpy[i], tpx[i]) * 180) / Math.PI + 45);
    input.push(i / (N - 1));
  }
  // Unwrap angles so rotation interpolation never spins the long way round.
  for (let i = 1; i < N; i++) {
    let d = angles[i] - angles[i - 1];
    while (d > 180) { angles[i] -= 360; d = angles[i] - angles[i - 1]; }
    while (d < -180) { angles[i] += 360; d = angles[i] - angles[i - 1]; }
  }

  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
  return { xs, ys, angles, input, d, start: { x: xs[0], y: ys[0] } };
}

export default function MatchLoadingScreen() {
  const insets = useSafeAreaInsets();
  const { filter: filterParam } = useLocalSearchParams<{ filter: string }>();
  const [completedSteps, setCompletedSteps] = useState(0);

  const [bgSize, setBgSize] = useState({ w: 0, h: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
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

    Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 5200, easing: Easing.linear, useNativeDriver: true }),
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

  const PLANE = 30;
  const pathData = useMemo(() => buildFlightPath(bgSize.w, bgSize.h), [bgSize.w, bgSize.h]);

  const planeX = pathData
    ? progress.interpolate({ inputRange: pathData.input, outputRange: pathData.xs.map((x) => x - PLANE / 2) })
    : 0;
  const planeY = pathData
    ? progress.interpolate({ inputRange: pathData.input, outputRange: pathData.ys.map((y) => y - PLANE / 2) })
    : 0;
  const planeRotate = pathData
    ? progress.interpolate({ inputRange: pathData.input, outputRange: pathData.angles.map((a) => `${a}deg`) })
    : '0deg';

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }, { opacity: fadeAnim }]}>

      {/* Background flight path: looping trail + plane moving along it */}
      <View
        pointerEvents="none"
        style={styles.bg}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBgSize((s) => (s.w !== width || s.h !== height ? { w: width, h: height } : s));
        }}
      >
        {pathData && (
          <>
            <Svg width={bgSize.w} height={bgSize.h} style={StyleSheet.absoluteFill}>
              <Path
                d={pathData.d}
                stroke={Colors.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="2 12"
                fill="none"
                opacity={0.45}
              />
              <Circle cx={pathData.start.x} cy={pathData.start.y} r={4.5} fill={Colors.accent} opacity={0.55} />
              <Circle cx={pathData.start.x} cy={pathData.start.y} r={10} stroke={Colors.accent} strokeWidth={1} fill="none" opacity={0.3} />
            </Svg>
            <Animated.View
              style={[
                styles.plane,
                { width: PLANE, height: PLANE, transform: [{ translateX: planeX }, { translateY: planeY }, { rotate: planeRotate }] },
              ]}
            >
              <PlaneThinIcon color={Colors.accent} size={PLANE} />
            </Animated.View>
          </>
        )}
      </View>

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

  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  plane: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    ...Platform.select({ web: { fontFamily: Font.serif }, default: {} }),
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
    borderRadius: Radius.sm,
    ...Elevation.sm,
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
    height: 2,
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
