import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { RecommendedCard } from '../../../components/home/RecommendedCard';
import { useAuth } from '../../../context/AuthContext';
import { getRecommended } from '../../../services/matchService';

const FILTER_TABS = [
  { label: '전체', action: null },
  { label: '여행지별', action: () => router.push('/explore-destination') },
  { label: '날짜별', action: () => router.push('/explore-date') },
  { label: '스타일', action: () => router.push('/explore-style') },
  { label: '성별', action: () => router.push('/explore-gender') },
];

const QUICK_DESTINATIONS = [
  { name: '오사카', flag: '🇯🇵', count: 34 },
  { name: '도쿄', flag: '🇯🇵', count: 28 },
  { name: '방콕', flag: '🇹🇭', count: 21 },
  { name: '파리', flag: '🇫🇷', count: 17 },
  { name: '뉴욕', flag: '🇺🇸', count: 13 },
];

const TRAVEL_TIPS = [
  { icon: '🏨', title: '숙소 쉐어 꿀팁', desc: '에어비앤비 공유로 비용 반반', tag: 'TIP', category: 'tips' },
  { icon: '✈️', title: '항공권 최저가 찾기', desc: '스카이스캐너 vs 카약 비교', tag: 'TIP', category: 'tips' },
  { icon: '🍜', title: '오사카 맛집 TOP 10', desc: '현지인 추천 숨은 맛집 공개', tag: '후기', category: 'review' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    getRecommended().then(setMatches);
  }, []);

  const handleTabPress = (index: number) => {
    const tab = FILTER_TABS[index];
    if (tab.action) {
      tab.action();
    } else {
      setActiveTab(index);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>안녕하세요 👋</Text>
          <Text style={styles.subtitle}>{user?.nickname ?? '여행자'}님의 여행</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
          <Text style={styles.bell}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/explore')}
        activeOpacity={0.8}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>여행지, 날짜로 메이트 찾기</Text>
      </TouchableOpacity>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {FILTER_TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => handleTabPress(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 인기 여행지 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 지금 인기 여행지</Text>
            <Text style={styles.sectionSub}>메이트 모집 중</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destRow}
          >
            {QUICK_DESTINATIONS.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={styles.destChip}
                onPress={() => router.push({ pathname: '/mates', params: { destination: d.name } })}
                activeOpacity={0.85}
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
          <View style={styles.aiBannerLeft}>
            <Text style={styles.aiBannerTag}>AI MATCHING</Text>
            <Text style={styles.aiBannerTitle}>나에게 딱 맞는 메이트{'\n'}AI가 찾아드릴게요 🤖</Text>
            <Text style={styles.aiBannerSub}>여행지·날짜·스타일 분석 · 평균 4초</Text>
          </View>
          <Text style={styles.aiBannerArrow}>→</Text>
        </TouchableOpacity>

        {/* 추천 메이트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ 추천 메이트</Text>
            <TouchableOpacity onPress={() => router.push('/match/list')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
          >
            {matches.map((item) => (
              <RecommendedCard key={item.user.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* 메이트 모집 글 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🗓 메이트 모집 중</Text>
            <TouchableOpacity onPress={() => router.push('/mates')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          {matches.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.user.id}
              style={styles.mateRow}
              onPress={() => router.push(`/mate/${item.user.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.mateAvatar}>
                <Text style={styles.mateAvatarText}>{item.user.nickname[0]}</Text>
              </View>
              <View style={styles.mateInfo}>
                <Text style={styles.mateName}>{item.user.nickname}</Text>
                <Text style={styles.mateDest}>📍 오사카 · 6월 중순</Text>
                <View style={styles.mateTagsRow}>
                  {item.user.travelStyles.slice(0, 2).map((s) => (
                    <View key={s} style={styles.mateTag}>
                      <Text style={styles.mateTagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.mateMatch}>{item.score}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 여행 팁 & 후기 */}
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
              onPress={() => router.push({ pathname: '/(tabs)/community', params: { tab: tip.category } })}
              activeOpacity={0.85}
            >
              <View style={styles.tipIconBox}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
              </View>
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
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: { gap: 2 },
  greeting: { fontSize: 13, color: Colors.textSecondary },
  subtitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  bellBtn: { padding: 6 },
  bell: { fontSize: 24 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { fontSize: 14, color: Colors.textPlaceholder, flex: 1 },

  tabScroll: { marginTop: 14, maxHeight: 48 },
  tabContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center', flexDirection: 'row' },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.white, fontWeight: '600' },

  scroll: { flex: 1, marginTop: 16 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 48 },

  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  sectionSub: { fontSize: 12, color: Colors.textSecondary },
  moreBtn: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  destRow: { gap: 10, paddingBottom: 4 },
  destChip: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  destFlag: { fontSize: 24 },
  destName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  destBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  destBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },

  aiBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  aiBannerLeft: { gap: 4 },
  aiBannerTag: {
    fontSize: 10,
    color: Colors.pointYellow,
    fontWeight: '700',
    letterSpacing: 1,
  },
  aiBannerTitle: { fontSize: 16, fontWeight: '800', color: Colors.white, lineHeight: 24 },
  aiBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  aiBannerArrow: { fontSize: 24, color: Colors.pointYellow, fontWeight: '700' },

  hScrollContent: { gap: 12, paddingBottom: 4 },

  mateRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  mateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateAvatarText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  mateInfo: { flex: 1, gap: 4 },
  mateName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  mateDest: { fontSize: 12, color: Colors.textSecondary },
  mateTagsRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  mateTag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mateTagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  mateMatch: { fontSize: 18, fontWeight: '800', color: Colors.primary },

  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tipIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIcon: { fontSize: 24 },
  tipInfo: { flex: 1, gap: 3 },
  tipTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  tipDesc: { fontSize: 12, color: Colors.textSecondary },
  tipTag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  tipTagReview: { backgroundColor: 'rgba(152,200,202,0.3)' },
  tipTagText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },

  myTripBanner: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  myTripEmoji: { fontSize: 30 },
  myTripInfo: { flex: 1, gap: 3 },
  myTripTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  myTripSub: { fontSize: 12, color: Colors.textSecondary },
  myTripArrow: { fontSize: 20, color: Colors.primary, fontWeight: '700' },
});
