import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, ActivityIndicator,
  useWindowDimensions, LayoutChangeEvent, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Editorial, Font, Elevation, Radius, Space } from '../../constants/colors';
import { DestImage } from '../../components/ui/DestImage';
import { useAuth } from '../../context/AuthContext';
import { guestLogin } from '../../services/authService';

// Destination photo per slide — creates an immersive editorial feel
const SLIDE_DEST = ['파리', '도쿄', '싱가포르', '바르셀로나'];

const SLIDES = [
  {
    id: '1',
    tag: 'WELCOME',
    title: '혼자 떠나기\n두렵지 않아요',
    desc: '전 세계 23,000명의 여행자 중\nAI가 나와 딱 맞는 메이트를 찾아드려요.\n함께라면 더 특별한 여행이 시작돼요.',
    accent: Colors.pointYellow,
    stats: [
      { value: '23,400+', label: '여행 메이트' },
      { value: '89%', label: '매칭 만족도' },
      { value: '41개국', label: '여행지 커버' },
    ],
  },
  {
    id: '2',
    tag: 'AI MATCHING',
    title: 'AI가 찾아주는\n완벽한 매칭',
    desc: '여행지·날짜·여행 스타일을 분석해\n수만 명 중 나와 가장 잘 맞는 메이트를\n자동으로 골라드려요.',
    accent: 'rgba(152,200,202,0.95)',
    stats: [
      { value: '97%', label: '최고 매칭률' },
      { value: '4초', label: '평균 매칭 시간' },
      { value: '12가지', label: '여행 스타일' },
    ],
  },
  {
    id: '3',
    tag: 'SAFE TRAVEL',
    title: '믿을 수 있는\n안전한 동행',
    desc: 'SNS 인증 + 실명 확인으로\n신원이 검증된 여행자만 매칭돼요.\n안심하고 새로운 메이트를 만나세요.',
    accent: 'rgba(196,150,199,0.95)',
    stats: [
      { value: '100%', label: '인증 회원만' },
      { value: '0건', label: '심각 사고 건수' },
      { value: '4.9★', label: '안전 만족도' },
    ],
  },
  {
    id: '4',
    tag: 'COMMUNITY',
    title: '여행자들의\n살아있는 커뮤니티',
    desc: '동행 모집부터 여행 후기, 현지 꿀팁까지.\n같은 목적지를 꿈꾸는 여행자들과\n지금 바로 연결되세요.',
    accent: Colors.pointYellow,
    stats: [
      { value: '1,200+', label: '여행 후기' },
      { value: '3,400+', label: '동행 모집 글' },
      { value: '매일', label: '새 메이트 합류' },
    ],
    isLast: true,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowW } = useWindowDimensions();
  const [containerW, setContainerW] = useState(windowW);
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');
  const { signIn } = useAuth();

  const onSliderLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) setContainerW(width);
  };

  useEffect(() => {
    if (containerW > 0) {
      scrollRef.current?.scrollTo({ x: current * containerW, animated: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerW]);

  const goToSlide = (index: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      scrollRef.current?.scrollTo({ x: index * containerW, animated: false });
      setCurrent(index);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleScroll = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / containerW);
    if (page !== current) setCurrent(page);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goToSlide(current + 1);
  };

  const finish = async (path: '/(auth)/signup' | '/(auth)/login') => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace(path);
  };

  const skip = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(auth)/login');
  };

  const handleGuestLogin = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    setDemoError('');
    try {
      await AsyncStorage.setItem('onboarding_done', 'true');
      const user = await guestLogin();
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      setDemoError('입장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setDemoLoading(false);
    }
  };

  const slide = SLIDES[current];

  return (
    <View style={styles.root}>
      {/* Skip button */}
      {!SLIDES[current].isLast && (
        <TouchableOpacity
          style={[styles.skipBtn, { top: insets.top + 16 }]}
          onPress={skip}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slider}
        onLayout={onSliderLayout}
      >
        {SLIDES.map((s, idx) => (
          <View
            key={s.id}
            style={[styles.slide, { width: containerW }]}
          >
            {/* Real city photo fills the slide */}
            <DestImage
              dest={SLIDE_DEST[idx]}
              scrim="even"
              radius={0}
              style={StyleSheet.absoluteFill}
            />

            <Animated.View
              style={[
                styles.slideInner,
                { paddingTop: insets.top + 64 },
                { opacity: s.id === slide.id ? fadeAnim : 1 },
              ]}
            >
              {/* Eyebrow tag */}
              <View style={styles.tag}>
                <Text style={styles.tagText}>{s.tag}</Text>
              </View>

              {/* Serif headline */}
              <Text style={styles.title}>{s.title}</Text>

              {/* Body copy */}
              <Text style={styles.desc}>{s.desc}</Text>

              {/* Stats card — glass panel */}
              <View style={styles.statsCard}>
                {s.stats.map((st) => (
                  <View key={st.label} style={styles.statItem}>
                    <Text style={[styles.statValue, { color: s.accent as string }]}>{st.value}</Text>
                    <Text style={styles.statLabel}>{st.label}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom area */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
              <View style={[
                styles.dot,
                i === current && styles.dotActive,
                i === current && { backgroundColor: slide.accent as string },
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        {!SLIDES[current].isLast ? (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: slide.accent as string }]}
            onPress={next}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>다음  →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.finalBtns}>
            <TouchableOpacity
              style={styles.signupBtn}
              onPress={() => finish('/(auth)/signup')}
              activeOpacity={0.85}
            >
              <Text style={styles.signupBtnText}>무료로 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => finish('/(auth)/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>이미 계정이 있어요  →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoBtn, demoLoading && styles.demoBtnDisabled]}
              onPress={handleGuestLogin}
              disabled={demoLoading}
              activeOpacity={0.85}
            >
              {demoLoading ? (
                <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
              ) : (
                <Text style={styles.demoBtnText}>데모 버전으로 입장하기</Text>
              )}
            </TouchableOpacity>
            {demoLoading && (
              <Text style={styles.demoHint}>서버를 깨우는 중이에요. 처음엔 1분까지 걸릴 수 있어요.</Text>
            )}
            {demoError !== '' && (
              <Text style={styles.demoError}>{demoError}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.darkBg },

  skipBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: Space.md,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' as const },

  slider: { flex: 1 },
  slide: {
    flex: 1,
    overflow: 'hidden',
  },
  slideInner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Space.xxl + Space.sm,
    paddingBottom: Space.xxl,
  },

  // Eyebrow tag
  tag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md,
    paddingVertical: 5,
    marginBottom: Space.xxl,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tagText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700' as const,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },

  // Serif editorial headline
  title: {
    ...Editorial.hero,
    color: Colors.white,
    textAlign: 'center' as const,
    marginBottom: Space.lg,
    ...Platform.select({ web: { fontFamily: Font.serif } }),
  },

  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center' as const,
    lineHeight: 25,
    marginBottom: Space.xxl,
    maxWidth: 320,
  },

  // Glass stats panel
  statsCard: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    paddingVertical: Space.xl,
    paddingHorizontal: Space.md,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700' as const, marginBottom: Space.xs },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'center' as const },

  // Bottom controls
  bottom: {
    paddingHorizontal: Space.xxl,
    paddingTop: Space.lg,
    alignItems: 'center',
    gap: Space.lg,
    backgroundColor: Colors.darkBg,
  },
  dots: { flexDirection: 'row', gap: Space.sm + 2, alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: { width: 24, borderRadius: 4 },

  nextBtn: {
    width: '100%',
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.primary,
  },
  nextBtnText: { fontSize: 16, fontWeight: '700' as const, color: Colors.primary },

  finalBtns: { width: '100%', gap: Space.md },
  signupBtn: {
    width: '100%',
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.pointYellow,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.primary,
  },
  signupBtnText: { fontSize: 16, fontWeight: '800' as const, color: Colors.primary },
  loginBtn: {
    width: '100%',
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loginBtnText: { fontSize: 15, fontWeight: '600' as const, color: 'rgba(255,255,255,0.9)' },

  demoBtn: {
    width: '100%',
    height: 44,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  demoBtnDisabled: { opacity: 0.55 },
  demoBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '500' as const },
  demoHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  demoError: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center' as const,
    lineHeight: 18,
  },
});
