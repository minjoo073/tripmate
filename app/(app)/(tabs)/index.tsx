import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { RecommendedCard } from '../../../components/home/RecommendedCard';
import { useAuth } from '../../../context/AuthContext';
import { getRecommended } from '../../../services/matchService';
import {
  BellIcon, SearchIcon, FireIcon, SparkleIcon, CalendarIcon,
  MapPinIcon, ArrowRightIcon, WaveIcon,
} from '../../../components/ui/Icon';

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
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>안녕하세요</Text>
            <WaveIcon color={Colors.warm} size={20} />
          </View>
          <Text style={styles.subtitle}>{user?.nickname ?? '여행자'}님의 여행</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
          <BellIcon color={Colors.textPrimary} size={22} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/explore')}
        activeOpacity={0.8}
      >
        <SearchIcon color={Colors.textPlaceholder} size={16} />
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
            <View style={styles.sectionTitleRow}><FireIcon color={Colors.textPrimary} size={18} /><Text style={styles.sectionTitle}> 지금 인기 여행지</Text></View>
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
                activeOpacity={0.82}
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
            <View style={styles.aiBannerTagWrap}>
              <Text style={styles.aiBannerTag}>AI MATCHING</Text>
            </View>
            <Text style={styles.aiBannerTitle}>나에게 딱 맞는 메이트{'\n'}AI가 찾아드릴게요</Text>
            <Text style={styles.aiBannerSub}>여행지 · 날짜 · 스타일 분석 · 평균 4초</Text>
          </View>
          <View style={styles.aiBannerRight}>
            <Text style={styles.aiBannerEmoji}>🤖</Text>
            <ArrowRightIcon color={Colors.warm} size={20} />
          </View>
        </TouchableOpacity>

        {/* 추천 메이트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}><SparkleIcon color={Colors.textPrimary} size={18} /><Text style={styles.sectionTitle}> 추천 메이트</Text></View>
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
            <View style={styles.sectionTitleRow}><CalendarIcon color={Colors.textPrimary} size={18} /><Text style={styles.sectionTitle}> 메이트 모집 중</Text></View>
            <TouchableOpacity onPress={() => router.push('/mates')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          {matches.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.user.id}
              style={styles.mateRow}
              onPress={() => router.push(`/mate/${item.user.id}`)}
              activeOpacity={0.82}
            >
              <View style={styles.mateAvatar}>
                <Text style={styles.mateAvatarText}>{item.user.nickname[0]}</Text>
              </View>
              <View style={styles.mateInfo}>
                <Text style={styles.mateName}>{item.user.nickname}</Text>
                <View style={styles.mateDestRow2}>
                  <MapPinIcon color={Colors.textSecondary} size={13} />
                  <Text style={styles.mateDest}>{item.trip.destination} · {item.trip.startDate.slice(5, 7)}월</Text>
                </View>
                <View style={styles.mateTagsRow}>
                  {item.user.travelStyles.slice(0, 2).map((s) => (
                    <View key={s} style={styles.mateTag}>
                      <Text style={styles.mateTagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.mateMatchWrap}>
                <Text style={styles.mateMatch}>{item.matchRate}%</Text>
                <Text style={styles.mateMatchLabel}>매칭률</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 여행 팁 & 후기 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}><SparkleIcon color={Colors.textPrimary} size={18} /><Text style={styles.sectionTitle}> 여행 팁 & 후기</Text></View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
              <Text style={styles.moreBtn}>더보기</Text>
            </TouchableOpacity>
          </View>
          {TRAVEL_TIPS.map((tip) => (
            <TouchableOpacity
              key={tip.title}
              style={styles.tipCard}
              onPress={() => router.push({ pathname: '/(tabs)/community', params: { tab: tip.category } })}
              activeOpacity={0.82}
            >
              <View style={styles.tipIconBox}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
              </View>
              <View style={styles.tipInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
              <View style={[styles.tipTag, tip.tag === '후기' && styles.tipTagReview]}>
                <Text style={[styles.tipTagText, tip.tag === '후기' && styles.tipTagTextReview]}>{tip.tag}</Text>
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
          <View style={styles.myTripIconBox}>
            <CalendarIcon color={Colors.primary} size={22} />
          </View>
          <View style={styles.myTripInfo}>
            <Text style={styles.myTripTitle}>내 여행 일정 관리</Text>
            <Text style={styles.myTripSub}>다가오는 여행 · 지난 여행 · 동행 기록</Text>
          </View>
          <ArrowRightIcon color={Colors.primary} size={18} />
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
    paddingBottom: 14,
  },
  headerLeft: { gap: 2 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greeting: { fontSize: 13, color: Colors.textSecondary },
  subtitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  bellBtn: { padding: 6 },
  mateDestRow2: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  myTripIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primaryBg, alignItems: 'center', justifyContent: 'center' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchIcon: { fontSize: 15 },
  searchPlaceholder: { fontSize: 14, color: Colors.textPlaceholder, flex: 1 },

  tabScroll: { marginTop: 14, maxHeight: 46 },
  tabContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center', flexDirection: 'row' },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
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
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  sectionSub: { fontSize: 12, color: Colors.textSecondary },
  moreBtn: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  destRow: { gap: 10, paddingBottom: 4 },
  destChip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  destFlag: { fontSize: 24 },
  destName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  destBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 999,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  aiBannerLeft: { gap: 8, flex: 1 },
  aiBannerTagWrap: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  aiBannerTag: {
    fontSize: 10,
    color: Colors.warm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  aiBannerTitle: { fontSize: 17, fontWeight: '700', color: Colors.white, lineHeight: 25 },
  aiBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  aiBannerRight: { alignItems: 'center', gap: 8, paddingLeft: 16 },
  aiBannerEmoji: { fontSize: 32 },
  aiBannerArrow: { fontSize: 16, color: Colors.warm, fontWeight: '700' },

  hScrollContent: { gap: 12, paddingBottom: 4 },

  mateRow: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  mateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateAvatarText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  mateInfo: { flex: 1, gap: 4 },
  mateName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  mateDest: { fontSize: 12, color: Colors.textSecondary },
  mateTagsRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  mateTag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  mateTagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  mateMatchWrap: { alignItems: 'center', gap: 2 },
  mateMatch: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  mateMatchLabel: { fontSize: 10, color: Colors.textSecondary },

  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  tipIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIcon: { fontSize: 22 },
  tipInfo: { flex: 1, gap: 3 },
  tipTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  tipDesc: { fontSize: 12, color: Colors.textSecondary },
  tipTag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  tipTagReview: { backgroundColor: Colors.success },
  tipTagText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  tipTagTextReview: { color: Colors.textPrimary },

  myTripBanner: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  myTripEmoji: { fontSize: 28 },
  myTripInfo: { flex: 1, gap: 3 },
  myTripTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  myTripSub: { fontSize: 12, color: Colors.textSecondary },
  myTripArrow: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
});
