import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { RecommendedCard } from '../../../components/home/RecommendedCard';
import { ScheduleCard } from '../../../components/home/ScheduleCard';
import { useAuth } from '../../../context/AuthContext';
import { getRecommended } from '../../../services/matchService';

const FILTER_TABS = ['전체', '여행지별', '날짜별', '스타일', '성별'];

const QUICK_DESTINATIONS = [
  { name: '오사카', flag: '🇯🇵', count: 34 },
  { name: '도쿄', flag: '🇯🇵', count: 28 },
  { name: '방콕', flag: '🇹🇭', count: 21 },
  { name: '파리', flag: '🇫🇷', count: 17 },
  { name: '뉴욕', flag: '🇺🇸', count: 13 },
];

const TRAVEL_TIPS = [
  { icon: '🏨', title: '숙소 쉐어 꿀팁', desc: '에어비앤비 공유로 비용 반반', tag: 'TIP' },
  { icon: '✈️', title: '항공권 최저가 찾기', desc: '스카이스캐너 vs 카약 비교', tag: 'TIP' },
  { icon: '🍜', title: '오사카 맛집 TOP 10', desc: '현지인 추천 숨은 맛집 공개', tag: '후기' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('전체');
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    getRecommended().then(setMatches);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요 👋</Text>
          <Text style={styles.subtitle}>{user?.nickname ?? '여행자'}님의 여행</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Text style={styles.bell}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/explore')} activeOpacity={0.8}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>여행지, 날짜로 메이트 찾기</Text>
      </TouchableOpacity>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 인기 여행지 빠른 탐색 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 지금 인기 여행지</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destRow}>
            {QUICK_DESTINATIONS.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={styles.destChip}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text style={styles.destFlag}>{d.flag}</Text>
                <Text style={styles.destName}>{d.name}</Text>
                <View style={styles.destBadge}>
                  <Text style={styles.destBadgeText}>{d.count}명</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI 매칭 배너 */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => router.push('/match/loading')}
          activeOpacity={0.88}
        >
          <View>
            <Text style={styles.aiBannerTag}>AI MATCHING</Text>
            <Text style={styles.aiBannerTitle}>나에게 딱 맞는 메이트{'\n'}AI가 찾아드릴게요 🤖</Text>
            <Text style={styles.aiBannerSub}>여행지·날짜·스타일 분석 · 평균 4초</Text>
          </View>
          <Text style={styles.aiBannerArrow}>→</Text>
        </TouchableOpacity>

        {/* 추천 메이트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 메이트</Text>
            <TouchableOpacity onPress={() => router.push('/match/list')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent}>
            {matches.map((item) => <RecommendedCard key={item.user.id} item={item} />)}
          </ScrollView>
        </View>

        {/* 일정 맞는 메이트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>일정 맞는 메이트</Text>
            <TouchableOpacity onPress={() => router.push('/match/list')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          {matches.map((item) => (
            <ScheduleCard key={item.user.id} item={item} />
          ))}
        </View>

        {/* 여행 팁 & 커뮤니티 미리보기 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✍️ 여행 팁 & 후기</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          {TRAVEL_TIPS.map((tip) => (
            <TouchableOpacity
              key={tip.title}
              style={styles.tipCard}
              onPress={() => router.push('/(tabs)/community')}
              activeOpacity={0.85}
            >
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
              <View style={[styles.tipTag, tip.tag === '후기' && styles.tipTagReview]}>
                <Text style={styles.tipTagText}>{tip.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 내 여행 현황 배너 */}
        <TouchableOpacity
          style={styles.myTripBanner}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.88}
        >
          <Text style={styles.myTripEmoji}>🗓</Text>
          <View style={styles.myTripInfo}>
            <Text style={styles.myTripTitle}>내 여행 일정 관리</Text>
            <Text style={styles.myTripSub}>다가오는 여행 · 지난 여행 · 동행 기록</Text>
          </View>
          <Text style={styles.myTripArrow}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  greeting: { fontSize: 13, color: Colors.textSecondary },
  subtitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  bell: { fontSize: 22 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { fontSize: 14, color: Colors.textPlaceholder, flex: 1 },
  tabScroll: { marginTop: 12, maxHeight: 44 },
  tabContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center', flexDirection: 'row' },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignSelf: 'center',
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.white, fontWeight: '600' },
  scroll: { flex: 1, marginTop: 14 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, flexGrow: 1 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  moreBtn: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  // 인기 여행지
  destRow: { gap: 10, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' },
  destChip: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  destFlag: { fontSize: 22 },
  destName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  destBadge: { backgroundColor: Colors.primaryBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  destBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },

  // AI 배너
  aiBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  aiBannerTag: { fontSize: 10, color: Colors.pointYellow, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  aiBannerTitle: { fontSize: 16, fontWeight: '800', color: Colors.white, lineHeight: 24 },
  aiBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  aiBannerArrow: { fontSize: 22, color: Colors.pointYellow, fontWeight: '700' },

  // 추천 메이트 가로 스크롤
  hScrollContent: { gap: 12, paddingVertical: 2, flexDirection: 'row', alignItems: 'flex-start' },

  // 팁 카드
  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tipIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  tipInfo: { flex: 1, minWidth: 0 },
  tipTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  tipDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  tipTag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  tipTagReview: { backgroundColor: 'rgba(152,200,202,0.3)' },
  tipTagText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },

  // 내 여행 배너
  myTripBanner: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  myTripEmoji: { fontSize: 28 },
  myTripInfo: { flex: 1, minWidth: 0 },
  myTripTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  myTripSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  myTripArrow: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
});
