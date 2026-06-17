import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  useWindowDimensions, Alert, Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Editorial, Font, Elevation, Radius, Space } from '../constants/colors';
import { getProfileIcon } from '../constants/profileIcons';
import { DestImage } from '../components/ui/DestImage';
import { useAuth } from '../context/AuthContext';
import { login as loginRequest } from '../services/authService';

// Demo guest = alice@tripmate.app (seeded). Lets visitors poke the app
// without filling the login form. Real auth still works as normal.
async function enterAsGuest(signIn: (u: any) => Promise<void>, target: string) {
  try {
    const authUser = await loginRequest('alice@tripmate.app', 'password');
    await signIn(authUser);
  } catch (e) {
    console.warn('[guest] login failed, continuing without auth', e);
  }
  router.push(target as any);
}

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI 스마트 매칭',
    desc: '여행지·날짜·스타일을 분석해 23,000명 중 나와 딱 맞는 메이트를 추천해 드려요.',
    color: Colors.pointYellow,
  },
  {
    icon: '🔒',
    title: '안전 인증 시스템',
    desc: 'SNS 인증 + 본인 확인으로 신뢰할 수 있는 메이트만 매칭돼요. 안심하고 사용하세요.',
    color: Colors.pointBlueGray,
  },
  {
    icon: '💬',
    title: '실시간 채팅',
    desc: '매칭 후 바로 일정을 공유하고 채팅으로 세부 계획을 맞춰가세요.',
    color: '#E8D8E8',
  },
  {
    icon: '🌍',
    title: '여행 커뮤니티',
    desc: '여행 후기, 꿀팁, 동행 모집까지. 같은 목적지를 꿈꾸는 여행자들을 만나보세요.',
    color: Colors.pointTeal,
  },
];

const STEPS = [
  {
    num: '01',
    title: '여행 계획 입력',
    desc: '어디로, 언제, 어떤 스타일로 여행할지 간단히 입력하세요.',
    icon: '✏️',
  },
  {
    num: '02',
    title: 'AI 매칭 시작',
    desc: 'AI가 수만 명의 프로필을 분석해 가장 잘 맞는 메이트를 골라드려요.',
    icon: '⚡',
  },
  {
    num: '03',
    title: '동행 확정 & 출발',
    desc: '채팅으로 일정을 맞추고, 동행을 확정하면 여행 준비 끝!',
    icon: '✈️',
  },
];

const REVIEWS = [
  {
    name: '김지은',
    age: 26,
    location: '서울',
    trip: '오사카 5박 6일',
    rate: 5,
    text: '혼자 가려다 TripMate에서 만난 분과 함께 갔는데, 역대 최고의 여행이었어요! AI가 취향까지 맞춰줄 줄은 몰랐어요.',
    avatar: '김',
  },
  {
    name: '박민준',
    age: 29,
    location: '부산',
    trip: '도쿄 4박 5일',
    rate: 5,
    text: '처음엔 반신반의했는데 매칭률 93%라더니 진짜 저랑 여행 스타일이 똑같더라고요. 친구처럼 편하게 다녔어요.',
    avatar: '박',
  },
  {
    name: '이수아',
    age: 24,
    location: '대구',
    trip: '방콕 5박 7일',
    rate: 5,
    text: '인증 시스템이 있어서 믿고 사용했어요. 혼자 여행이 두렵던 제가 이제 매달 떠나고 있어요 ㅎㅎ',
    avatar: '이',
  },
];

const STATS = [
  { value: '23,400+', label: '여행 메이트' },
  { value: '89%', label: '매칭 만족도' },
  { value: '41개국', label: '여행지 커버' },
  { value: '1,200+', label: '동행 후기' },
];

const DESTINATIONS = [
  { name: '오사카', flag: '🇯🇵', mates: 342 },
  { name: '도쿄', flag: '🇯🇵', mates: 289 },
  { name: '방콕', flag: '🇹🇭', mates: 215 },
  { name: '파리', flag: '🇫🇷', mates: 178 },
  { name: '뉴욕', flag: '🇺🇸', mates: 134 },
  { name: '바르셀로나', flag: '🇪🇸', mates: 112 },
];

function Stars({ count }: { count: number }) {
  return (
    <Text style={{ fontSize: 13, letterSpacing: 1, color: Colors.pointYellow }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </Text>
  );
}

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isWide = width > 700;
  const scrollRef = useRef<ScrollView>(null);
  const [featuresY, setFeaturesY] = useState(0);
  const [reviewsY, setReviewsY] = useState(0);
  const { signIn } = useAuth();

  return (
    <ScrollView ref={scrollRef} style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── NAV ── */}
      <View style={styles.nav}>
        <View style={styles.navInner}>
          <Text style={styles.logo}>TripMate</Text>
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: featuresY, animated: true })}>
              <Text style={styles.navLink}>서비스 소개</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: reviewsY, animated: true })}>
              <Text style={styles.navLink}>이용 후기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navCta} onPress={() => enterAsGuest(signIn, '/(tabs)/')}>
              <Text style={styles.navCtaText}>앱 체험하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <DestImage dest="파리" scrim="even" radius={0} style={StyleSheet.absoluteFill} />
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>AI 기반 여행 메이트 매칭 서비스</Text>
          </View>
          <Text style={styles.heroTitle}>
            혼자 떠나기{'\n'}
            <Text style={styles.heroTitleAccent}>두렵다면,</Text>{'\n'}
            함께 떠나세요
          </Text>
          <Text style={styles.heroSub}>
            여행지·날짜·스타일을 입력하면{'\n'}
            AI가 23,000명 중 딱 맞는 메이트를 찾아드려요.
          </Text>
          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => enterAsGuest(signIn, '/(tabs)/')} activeOpacity={0.88}>
              <Text style={styles.heroBtnText}>지금 무료로 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnOutline} onPress={() => enterAsGuest(signIn, '/(tabs)/explore')} activeOpacity={0.88}>
              <Text style={styles.heroBtnOutlineText}>메이트 둘러보기</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroNote}>회원가입 무료 · 카드 등록 불필요</Text>

          <View style={styles.heroMockup}>
            <View style={styles.mockPhone}>
              <View style={styles.mockHeader}>
                <Text style={styles.mockHeaderText}>안녕하세요 👋</Text>
                <Text style={styles.mockHeaderSub}>오늘 맞춤 메이트</Text>
              </View>
              {[
                { name: '한소희', rate: 97, dest: '오사카' },
                { name: '조승연', rate: 94, dest: '오사카' },
                { name: '양세은', rate: 91, dest: '도쿄' },
              ].map((m) => (
                <View key={m.name} style={styles.mockCard}>
                  <View style={styles.mockAvatar}>
                    <Image source={getProfileIcon(m.name)} style={styles.mockAvatarImage} resizeMode="contain" />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.mockName}>{m.name}</Text>
                    <Text style={styles.mockDest}>{m.dest}</Text>
                  </View>
                  <View style={styles.mockBadge}>
                    <Text style={styles.mockBadgeText}>{m.rate}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ── STATS ── */}
      <View style={styles.statsBar}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── FEATURES ── */}
      <View style={styles.section} onLayout={(e) => setFeaturesY(e.nativeEvent.layout.y)}>
        <Text style={styles.sectionBadge}>왜 TripMate인가요?</Text>
        <Text style={styles.sectionTitle}>여행의 모든 걱정,{'\n'}TripMate가 해결해드려요</Text>
        <Text style={styles.sectionSub}>
          낯선 사람과의 동행이 걱정되셨나요?{'\n'}
          TripMate는 안전하고 즐거운 여행 메이트 경험을 만들어 드립니다.
        </Text>
        <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
          {FEATURES.map((f) => (
            <View key={f.title} style={[styles.featureCard, { backgroundColor: f.color }]}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── HOW IT WORKS ── */}
      <View style={[styles.section, styles.sectionDark]}>
        <Text style={[styles.sectionBadge, { color: Colors.pointYellow }]}>사용 방법</Text>
        <Text style={[styles.sectionTitle, { color: Colors.white }]}>
          단 3단계로{'\n'}완벽한 여행 메이트 찾기
        </Text>
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.num} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={styles.stepNumBox}>
                  <Text style={styles.stepNum}>{s.num}</Text>
                </View>
                {i < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepIcon}>{s.icon}</Text>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── POPULAR DESTINATIONS ── */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>인기 여행지</Text>
        <Text style={styles.sectionTitle}>지금 가장 많은{'\n'}메이트를 찾고 있어요</Text>
        <View style={styles.destGrid}>
          {DESTINATIONS.map((d) => (
            <TouchableOpacity
              key={d.name}
              style={styles.destCard}
              onPress={() => enterAsGuest(signIn, '/(tabs)/explore')}
              activeOpacity={0.88}
            >
              <DestImage dest={d.name} scrim="bottom" radius={Radius.lg} style={{ flex: 1 }}>
                <Text style={styles.destName}>{d.name}</Text>
                <Text style={styles.destMates}>메이트 {d.mates}명</Text>
              </DestImage>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── REVIEWS ── */}
      <View style={[styles.section, { backgroundColor: Colors.bg }]} onLayout={(e) => setReviewsY(e.nativeEvent.layout.y)}>
        <Text style={styles.sectionBadge}>실제 사용자 후기</Text>
        <Text style={styles.sectionTitle}>TripMate로 만난{'\n'}여행, 그 후기들</Text>
        <View style={styles.reviewList}>
          {REVIEWS.map((r) => (
            <View key={r.name} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Image source={getProfileIcon(r.name)} style={styles.reviewAvatarImage} resizeMode="contain" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.reviewName}>{r.name} · {r.age}세 · {r.location}</Text>
                  <Text style={styles.reviewTrip}>🗺 {r.trip}</Text>
                </View>
                <Stars count={r.rate} />
              </View>
              <Text style={styles.reviewText}>"{r.text}"</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── CTA BANNER ── */}
      <View style={styles.ctaBanner}>
        <DestImage dest="이스탄불" scrim="even" radius={0} style={StyleSheet.absoluteFill} />
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>지금 바로 나만의{'\n'}여행 메이트를 찾아보세요</Text>
          <Text style={styles.ctaSub}>
            가입하는 순간, AI가 당신에게 맞는{'\n'}여행 메이트를 찾기 시작해요.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(auth)/signup')} activeOpacity={0.88}>
            <Text style={styles.ctaBtnText}>무료로 시작하기 →</Text>
          </TouchableOpacity>
          <View style={styles.ctaStores}>
            <TouchableOpacity style={styles.storeBtn} onPress={() => Alert.alert('준비 중', 'App Store 버전이 곧 출시될 예정이에요!')} activeOpacity={0.75}>
              <Text style={styles.storeBtnText}>🍎 App Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeBtn} onPress={() => Alert.alert('준비 중', 'Google Play 버전이 곧 출시될 예정이에요!')} activeOpacity={0.75}>
              <Text style={styles.storeBtnText}>▶ Google Play</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.ctaNote}>iOS · Android · Web 모두 지원</Text>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>TripMate</Text>
        <Text style={styles.footerTagline}>
          혼자가 아닌, 함께하는 여행을 만들어드립니다.
        </Text>
        <View style={styles.footerLinks}>
          {['서비스 소개', '이용약관', '개인정보처리방침', '고객센터', '공지사항'].map((l) => (
            <Text key={l} style={styles.footerLink}>{l}</Text>
          ))}
        </View>
        <Text style={styles.footerCopy}>
          © 2025 TripMate Inc. All rights reserved.{'\n'}
          서울특별시 강남구 테헤란로 427 · contact@tripmate.kr
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  // ── NAV
  nav: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif, fontWeight: '400' } }),
  },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: Space.xxl },
  navLink: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  navCta: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm + 2,
    borderRadius: Radius.sm,
    ...Elevation.primary,
  },
  navCtaText: { fontSize: 14, color: Colors.white, fontWeight: '700' },

  // ── HERO
  hero: {
    overflow: 'hidden',
    minHeight: 520,
  },
  heroContent: {
    paddingTop: 88,
    paddingBottom: 96,
    paddingHorizontal: Space.xxl,
    alignItems: 'center',
  },
  heroBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: Radius.pill,
    paddingHorizontal: Space.lg,
    paddingVertical: 6,
    marginBottom: Space.xxl,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  heroTitle: {
    ...Editorial.hero,
    color: Colors.white,
    textAlign: 'center' as const,
  },
  heroTitleAccent: { color: Colors.pointYellow },
  heroSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center' as const,
    lineHeight: 26,
    marginTop: Space.lg,
    maxWidth: 380,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: Space.md,
    marginTop: Space.xxxl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroBtn: {
    backgroundColor: Colors.pointYellow,
    paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg,
    borderRadius: Radius.md,
    ...Elevation.primary,
  },
  heroBtnText: { fontSize: 15, fontWeight: '800' as const, color: Colors.primary },
  heroBtnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroBtnOutlineText: { fontSize: 15, fontWeight: '600' as const, color: Colors.white },
  heroNote: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: Space.md },
  heroMockup: { marginTop: Space.huge, alignItems: 'center', width: '100%' },
  mockPhone: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Space.lg,
    width: 280,
    ...Elevation.lg,
  },
  mockHeader: { marginBottom: Space.md },
  mockHeaderText: { fontSize: 13, color: Colors.textSecondary },
  mockHeaderSub: { fontSize: 16, fontWeight: '700' as const, color: Colors.textPrimary },
  mockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  mockAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  mockAvatarImage: { width: 28, height: 28 },
  mockName: { fontSize: 13, fontWeight: '600' as const, color: Colors.textPrimary },
  mockDest: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  mockBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.xs, flexShrink: 0,
  },
  mockBadgeText: { fontSize: 13, fontWeight: '800' as const, color: Colors.primary },

  // ── STATS
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Space.xxxl,
    paddingHorizontal: Space.lg,
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Space.lg,
  },
  statItem: { alignItems: 'center', minWidth: 80 },
  statValue: { fontSize: 28, fontWeight: '800' as const, color: Colors.pointYellow, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: Space.xs },

  // ── SECTIONS
  section: {
    paddingVertical: Space.huge + Space.xxl,
    paddingHorizontal: Space.xxl,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  sectionDark: { backgroundColor: Colors.cardDark },
  sectionBadge: {
    fontSize: 10, fontWeight: '700' as const, color: Colors.primary,
    letterSpacing: 2.5, marginBottom: Space.md, textTransform: 'uppercase' as const,
  },
  sectionTitle: {
    ...Editorial.title,
    color: Colors.textPrimary,
    textAlign: 'center' as const,
    marginBottom: Space.md,
  },
  sectionSub: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: 'center' as const, lineHeight: 24,
    marginBottom: Space.huge, maxWidth: 460,
  },

  // ── FEATURES
  featureGrid: { width: '100%', maxWidth: 800, gap: Space.lg },
  featureGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: {
    borderRadius: Radius.xl,
    padding: Space.xxl,
    marginBottom: Space.xs,
    flex: 1,
    minWidth: 260,
    ...Elevation.md,
  },
  featureIcon: { fontSize: 32, marginBottom: Space.md },
  featureTitle: { fontSize: 17, fontWeight: '700' as const, color: Colors.textPrimary, marginBottom: Space.sm },
  featureDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  // ── STEPS
  steps: { width: '100%', maxWidth: 480, marginTop: Space.sm },
  stepRow: { flexDirection: 'row', gap: Space.lg, marginBottom: 0 },
  stepLeft: { alignItems: 'center', width: 48 },
  stepNumBox: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.pointYellow,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    ...Elevation.md,
  },
  stepNum: { fontSize: 14, fontWeight: '800' as const, color: Colors.primary },
  stepLine: {
    width: 2, flex: 1, minHeight: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 6,
  },
  stepContent: { flex: 1, paddingBottom: Space.xxxl, paddingTop: 10 },
  stepIcon: { fontSize: 22, marginBottom: 6 },
  stepTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.white, marginBottom: 6 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 22 },

  // ── DESTINATIONS — real city photos
  destGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Space.md,
    justifyContent: 'center', marginTop: Space.md, maxWidth: 700, width: '100%',
  },
  destCard: {
    width: 160,
    height: 140,
    borderRadius: Radius.lg,
    ...Elevation.md,
  },
  destName: { fontSize: 14, fontWeight: '700' as const, color: Colors.white },
  destMates: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500' as const, marginTop: 2 },

  // ── REVIEWS
  reviewList: { width: '100%', maxWidth: 680, gap: Space.lg, marginTop: Space.sm },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Space.xxl,
    ...Elevation.md,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: Space.md, marginBottom: Space.lg },
  reviewAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  reviewAvatarImage: { width: 30, height: 30 },
  reviewName: { fontSize: 13, fontWeight: '700' as const, color: Colors.textPrimary },
  reviewTrip: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  reviewText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, fontStyle: 'italic' as const },

  // ── CTA BANNER — city photo behind
  ctaBanner: {
    overflow: 'hidden',
    minHeight: 400,
  },
  ctaContent: {
    paddingVertical: 88,
    paddingHorizontal: Space.xxl,
    alignItems: 'center',
  },
  ctaTitle: {
    ...Editorial.hero,
    color: Colors.white,
    textAlign: 'center' as const,
    marginBottom: Space.md,
  },
  ctaSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.78)',
    textAlign: 'center' as const, lineHeight: 24, marginBottom: Space.xxxl,
    maxWidth: 360,
  },
  ctaBtn: {
    backgroundColor: Colors.pointYellow,
    paddingHorizontal: Space.xxxl, paddingVertical: Space.lg + 2,
    borderRadius: Radius.md, marginBottom: Space.xl,
    ...Elevation.primary,
  },
  ctaBtnText: { fontSize: 17, fontWeight: '800' as const, color: Colors.primary },
  ctaStores: { flexDirection: 'row', gap: Space.md, marginBottom: Space.lg },
  storeBtn: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: Radius.sm, paddingHorizontal: Space.xl, paddingVertical: Space.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  storeBtnText: { fontSize: 14, color: Colors.white, fontWeight: '600' as const },
  ctaNote: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },

  // ── FOOTER
  footer: {
    backgroundColor: Colors.textPrimary, paddingVertical: Space.huge,
    paddingHorizontal: Space.xxl, alignItems: 'center', gap: Space.md,
  },
  footerLogo: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: Colors.white,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif, fontWeight: '300' } }),
  },
  footerTagline: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' as const },
  footerLinks: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Space.xl,
    justifyContent: 'center', marginTop: Space.md,
  },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  footerCopy: {
    fontSize: 12, color: 'rgba(255,255,255,0.3)',
    textAlign: 'center' as const, lineHeight: 20, marginTop: Space.sm,
  },
});
