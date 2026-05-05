import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '✈️',
    tag: 'WELCOME',
    title: '혼자 떠나기\n두렵지 않아요',
    desc: '전 세계 23,000명의 여행자 중\nAI가 나와 딱 맞는 메이트를 찾아드려요.\n함께라면 더 특별한 여행이 시작돼요.',
    bg: Colors.primary,
    cardBg: 'rgba(255,255,255,0.12)',
    accent: Colors.pointYellow,
    stats: [
      { value: '23,400+', label: '여행 메이트' },
      { value: '89%', label: '매칭 만족도' },
      { value: '41개국', label: '여행지 커버' },
    ],
  },
  {
    id: '2',
    emoji: '🤖',
    tag: 'AI MATCHING',
    title: 'AI가 찾아주는\n완벽한 매칭',
    desc: '여행지·날짜·여행 스타일을 분석해\n수만 명 중 나와 가장 잘 맞는 메이트를\n자동으로 골라드려요.',
    bg: '#2A3F6F',
    cardBg: 'rgba(255,255,255,0.10)',
    accent: 'rgba(152,200,202,0.9)',
    stats: [
      { value: '97%', label: '최고 매칭률' },
      { value: '4초', label: '평균 매칭 시간' },
      { value: '12가지', label: '여행 스타일' },
    ],
  },
  {
    id: '3',
    emoji: '🔒',
    tag: 'SAFE TRAVEL',
    title: '믿을 수 있는\n안전한 동행',
    desc: 'SNS 인증 + 실명 확인으로\n신원이 검증된 여행자만 매칭돼요.\n안심하고 새로운 메이트를 만나세요.',
    bg: Colors.cardDark,
    cardBg: 'rgba(255,255,255,0.08)',
    accent: 'rgba(196,150,199,0.9)',
    stats: [
      { value: '100%', label: '인증 회원만' },
      { value: '0건', label: '심각 사고 건수' },
      { value: '4.9★', label: '안전 만족도' },
    ],
  },
  {
    id: '4',
    emoji: '🗺️',
    tag: 'COMMUNITY',
    title: '여행자들의\n살아있는 커뮤니티',
    desc: '동행 모집부터 여행 후기, 현지 꿀팁까지.\n같은 목적지를 꿈꾸는 여행자들과\n지금 바로 연결되세요.',
    bg: '#354C7B',
    cardBg: 'rgba(255,255,255,0.10)',
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
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToSlide = (index: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      scrollRef.current?.scrollTo({ x: index * W, animated: false });
      setCurrent(index);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleScroll = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / W);
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

  const slide = SLIDES[current];

  return (
    <View style={[styles.root, { backgroundColor: slide.bg }]}>
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
      >
        {SLIDES.map((s) => (
          <View key={s.id} style={[styles.slide, { width: W, backgroundColor: s.bg, paddingTop: insets.top + 56 }]}>
            <Animated.View style={[styles.slideInner, { opacity: s.id === slide.id ? fadeAnim : 1 }]}>
              {/* Tag */}
              <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Text style={styles.tagText}>{s.tag}</Text>
              </View>

              {/* Emoji */}
              <View style={[styles.emojiWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Text style={styles.emoji}>{s.emoji}</Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>{s.title}</Text>

              {/* Desc */}
              <Text style={styles.desc}>{s.desc}</Text>

              {/* Stats card */}
              <View style={[styles.statsCard, { backgroundColor: s.cardBg }]}>
                {s.stats.map((st) => (
                  <View key={st.label} style={styles.statItem}>
                    <Text style={[styles.statValue, { color: s.accent }]}>{st.value}</Text>
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
              <Text style={styles.signupBtnText}>🚀  무료로 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => finish('/(auth)/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>이미 계정이 있어요  →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skipBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  slider: { flex: 1 },
  slide: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  slideInner: { alignItems: 'center', width: '100%' },

  tag: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 24,
  },
  tagText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: 1.5 },

  emojiWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  emoji: { fontSize: 50 },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 16,
  },
  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },

  statsCard: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },

  bottom: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
    gap: 16,
  },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: { width: 24, borderRadius: 4 },

  nextBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: Colors.primary },

  finalBtns: { width: '100%', gap: 12 },
  signupBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.pointYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtnText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  loginBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
});
