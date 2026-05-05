import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

const W = Dimensions.get('window').width;

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
    color: Colors.pointPurple,
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
    <Text style={{ fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </Text>
  );
}

export default function LandingPage() {
  const isWide = W > 700;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── NAV ── */}
      <View style={styles.nav}>
        <View style={styles.navInner}>
          <Text style={styles.logo}>✈️ TripMate</Text>
          <View style={styles.navLinks}>
            <Text style={styles.navLink}>서비스 소개</Text>
            <Text style={styles.navLink}>이용 후기</Text>
            <TouchableOpacity style={styles.navCta} onPress={() => router.push('/(tabs)/')}>
              <Text style={styles.navCtaText}>앱 체험하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>✨ AI 기반 여행 메이트 매칭 서비스</Text>
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
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/')}>
            <Text style={styles.heroBtnText}>🚀 지금 무료로 시작하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtnOutline} onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.heroBtnOutlineText}>🔍 메이트 둘러보기</Text>
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
                  <Text style={styles.mockAvatarText}>{m.name[0]}</Text>
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
      <View style={styles.section}>
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
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.destFlag}>{d.flag}</Text>
              <Text style={styles.destName}>{d.name}</Text>
              <Text style={styles.destMates}>메이트 {d.mates}명</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── REVIEWS ── */}
      <View style={[styles.section, { backgroundColor: Colors.bg }]}>
        <Text style={styles.sectionBadge}>실제 사용자 후기</Text>
        <Text style={styles.sectionTitle}>TripMate로 만난{'\n'}여행, 그 후기들</Text>
        <View style={styles.reviewList}>
          {REVIEWS.map((r) => (
            <View key={r.name} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.avatar}</Text>
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
        <Text style={styles.ctaTitle}>지금 바로 나만의{'\n'}여행 메이트를 찾아보세요 🗺</Text>
        <Text style={styles.ctaSub}>
          가입하는 순간, AI가 당신에게 맞는{'\n'}여행 메이트를 찾기 시작해요.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.ctaBtnText}>무료로 시작하기 →</Text>
        </TouchableOpacity>
        <View style={styles.ctaStores}>
          <View style={styles.storeBtn}>
            <Text style={styles.storeBtnText}>🍎 App Store</Text>
          </View>
          <View style={styles.storeBtn}>
            <Text style={styles.storeBtnText}>▶ Google Play</Text>
          </View>
        </View>
        <Text style={styles.ctaNote}>iOS · Android · Web 모두 지원</Text>
      </View>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>✈️ TripMate</Text>
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
  nav: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logo: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  navLink: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  navCta: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navCtaText: { fontSize: 14, color: Colors.white, fontWeight: '700' },
  hero: {
    backgroundColor: Colors.primary,
    paddingTop: 72,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,249,215,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  heroBadgeText: { fontSize: 13, color: Colors.pointYellow, fontWeight: '600' },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 52,
  },
  heroTitleAccent: { color: Colors.pointYellow },
  heroSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 16,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroBtn: {
    backgroundColor: Colors.pointYellow,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
  },
  heroBtnText: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  heroBtnOutline: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
  },
  heroBtnOutlineText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  heroNote: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 12 },
  heroMockup: { marginTop: 48, alignItems: 'center', width: '100%' },
  mockPhone: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    width: 280,
  },
  mockHeader: { marginBottom: 12 },
  mockHeaderText: { fontSize: 13, color: Colors.textSecondary },
  mockHeaderSub: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
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
  mockAvatarText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  mockName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  mockDest: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  mockBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, flexShrink: 0,
  },
  mockBadgeText: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.textPrimary,
    paddingVertical: 28,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: { alignItems: 'center', minWidth: 80 },
  statValue: { fontSize: 26, fontWeight: '800', color: Colors.pointYellow },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  section: {
    paddingVertical: 72,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  sectionDark: { backgroundColor: Colors.cardDark },
  sectionBadge: {
    fontSize: 12, fontWeight: '700', color: Colors.primary,
    letterSpacing: 1.5, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 30, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 40, marginBottom: 12,
  },
  sectionSub: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: 40, maxWidth: 460,
  },
  featureGrid: { width: '100%', maxWidth: 800, gap: 16 },
  featureGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: {
    borderRadius: 20, padding: 24, marginBottom: 4, flex: 1, minWidth: 260,
  },
  featureIcon: { fontSize: 32, marginBottom: 12 },
  featureTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  steps: { width: '100%', maxWidth: 480, marginTop: 8 },
  stepRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  stepLeft: { alignItems: 'center', width: 48 },
  stepNumBox: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.pointYellow,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNum: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  stepLine: {
    width: 2, flex: 1, minHeight: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 6,
  },
  stepContent: { flex: 1, paddingBottom: 32, paddingTop: 10 },
  stepIcon: { fontSize: 22, marginBottom: 6 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 6 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 22 },
  destGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    justifyContent: 'center', marginTop: 8, maxWidth: 700, width: '100%',
  },
  destCard: {
    backgroundColor: Colors.bg, borderRadius: 16, padding: 20,
    alignItems: 'center', width: 160,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  destFlag: { fontSize: 32, marginBottom: 8 },
  destName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  destMates: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  reviewList: { width: '100%', maxWidth: 680, gap: 16, marginTop: 8 },
  reviewCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  reviewAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  reviewAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  reviewName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  reviewTrip: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  reviewText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, fontStyle: 'italic' },
  ctaBanner: {
    backgroundColor: Colors.primary, paddingVertical: 80,
    paddingHorizontal: 24, alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32, fontWeight: '800', color: Colors.white,
    textAlign: 'center', lineHeight: 44, marginBottom: 12,
  },
  ctaSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  ctaBtn: {
    backgroundColor: Colors.pointYellow,
    paddingHorizontal: 32, paddingVertical: 18, borderRadius: 14, marginBottom: 20,
  },
  ctaBtnText: { fontSize: 17, fontWeight: '800', color: Colors.primary },
  ctaStores: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  storeBtn: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12,
  },
  storeBtnText: { fontSize: 14, color: Colors.white, fontWeight: '600' },
  ctaNote: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  footer: {
    backgroundColor: Colors.textPrimary, paddingVertical: 48,
    paddingHorizontal: 24, alignItems: 'center', gap: 12,
  },
  footerLogo: { fontSize: 22, fontWeight: '800', color: Colors.white },
  footerTagline: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  footerLinks: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 20,
    justifyContent: 'center', marginTop: 12,
  },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  footerCopy: {
    fontSize: 12, color: 'rgba(255,255,255,0.3)',
    textAlign: 'center', lineHeight: 20, marginTop: 8,
  },
});
