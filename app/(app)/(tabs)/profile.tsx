import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { router } from 'expo-router';
import { SettingsIcon, MessageIcon, BookmarkIcon, MapPinIcon, ArrowRightIcon } from '../../../components/ui/Icon';

const TABS = ['여행 기록', '리뷰', '저장'];

const MOCK_TRIPS = [
  { id: '1', dest: '오사카, 일본', date: '2025.06.15 – 06.19', companion: '조승연', rating: 5, status: 'done' },
  { id: '2', dest: '도쿄, 일본', date: '2025.07.05 – 07.10', companion: '예정', rating: 0, status: 'upcoming' },
  { id: '3', dest: '방콕, 태국', date: '2024.12.20 – 12.25', companion: '한소희', rating: 5, status: 'done' },
];

const TRAVEL_MOODS = ['카페 투어', '로컬 골목', '필름카메라', '느린 여행', '맛집 탐방'];

const VISITED_CITIES = [
  { city: '오사카', count: 3, flag: '🇯🇵' },
  { city: '방콕', count: 2, flag: '🇹🇭' },
  { city: '파리', count: 1, flag: '🇫🇷' },
  { city: '뉴욕', count: 1, flag: '🇺🇸' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('여행 기록');

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <SettingsIcon color={Colors.textMuted} size={20} />
        </TouchableOpacity>

        <Avatar nickname={user?.nickname ?? '나'} size={68} />

        <View style={styles.nameWrap}>
          <Text style={styles.nickname}>{user?.nickname ?? '여행자'}</Text>
          <View style={styles.verifiedRow}>
            <View style={styles.verifiedDot} />
            <Text style={styles.verifiedText}>인증된 여행자</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <MapPinIcon color={Colors.textMuted} size={11} />
          <Text style={styles.metaText}>서울, 한국</Text>
          <Text style={styles.metaSep}>·</Text>
          <Text style={styles.metaText}>최근 1시간 내 활동</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile-setup')}>
          <Text style={styles.editBtnText}>프로필 편집</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>여행</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>평점</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>92%</Text>
            <Text style={styles.statLabel}>재동행률</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>함께한 분</Text>
          </View>
        </View>
      </View>

      {/* Travel moods */}
      <View style={styles.moodRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodContent}>
          {TRAVEL_MOODS.map((mood) => (
            <View key={mood} style={styles.moodTag}>
              <Text style={styles.moodTagText}>{mood}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming trip banner */}
      <TouchableOpacity style={styles.upcomingBanner} activeOpacity={0.85}>
        <View style={styles.upcomingLeft}>
          <Text style={styles.upcomingLabel}>NEXT JOURNEY</Text>
          <Text style={styles.upcomingDest}>도쿄, 일본</Text>
          <Text style={styles.upcomingDate}>2025.07.05 – 07.10</Text>
        </View>
        <ArrowRightIcon color={Colors.primary} size={16} />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {activeTab === '여행 기록' && (
          <>
            {/* Visited cities */}
            <View style={styles.visitedWrap}>
              <Text style={styles.visitedTitle}>방문한 도시</Text>
              <View style={styles.visitedCities}>
                {VISITED_CITIES.map((c) => (
                  <View key={c.city} style={styles.visitedCity}>
                    <Text style={styles.visitedFlag}>{c.flag}</Text>
                    <Text style={styles.visitedCityName}>{c.city}</Text>
                    <Text style={styles.visitedCityCount}>{c.count}회</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Travel personality */}
            <View style={styles.personalityCard}>
              <Text style={styles.personalityTitle}>여행 성향</Text>
              <View style={styles.personalityRow}>
                <View style={styles.personalityItem}>
                  <Text style={styles.personalityEmoji}>🚶</Text>
                  <Text style={styles.personalityLabel}>느긋한</Text>
                  <Text style={styles.personalityKey}>여행 속도</Text>
                </View>
                <View style={styles.personalityItem}>
                  <Text style={styles.personalityEmoji}>🌙</Text>
                  <Text style={styles.personalityLabel}>저녁형</Text>
                  <Text style={styles.personalityKey}>활동 시간</Text>
                </View>
                <View style={styles.personalityItem}>
                  <Text style={styles.personalityEmoji}>👥</Text>
                  <Text style={styles.personalityLabel}>함께</Text>
                  <Text style={styles.personalityKey}>여행 스타일</Text>
                </View>
                <View style={styles.personalityItem}>
                  <Text style={styles.personalityEmoji}>📷</Text>
                  <Text style={styles.personalityLabel}>감성형</Text>
                  <Text style={styles.personalityKey}>여행 무드</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionLabel}>여행 기록 · {MOCK_TRIPS.length}</Text>
            {MOCK_TRIPS.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripLeft}>
                  <View style={[
                    styles.statusBadge,
                    trip.status === 'upcoming' ? styles.statusUpcoming : styles.statusDone,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      trip.status === 'upcoming' ? styles.statusTextUpcoming : styles.statusTextDone,
                    ]}>
                      {trip.status === 'upcoming' ? '예정' : '완료'}
                    </Text>
                  </View>
                  <Text style={styles.tripDest}>{trip.dest}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripCompanion}>함께한 분 · {trip.companion}</Text>
                </View>
                {trip.rating > 0 && (
                  <Text style={styles.rating}>{'★'.repeat(trip.rating)}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {activeTab === '리뷰' && (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <MessageIcon color={Colors.textMuted} size={26} />
            </View>
            <Text style={styles.emptyTitle}>아직 후기가 없어요</Text>
            <Text style={styles.emptyDesc}>여행 후 동행 후기를 남겨보세요</Text>
          </View>
        )}

        {activeTab === '저장' && (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <BookmarkIcon color={Colors.textMuted} size={26} />
            </View>
            <Text style={styles.emptyTitle}>저장한 여행자가 없어요</Text>
            <Text style={styles.emptyDesc}>마음에 드는 여행자를 저장해보세요</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    backgroundColor: Colors.card,
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingsBtn: { position: 'absolute', top: 20, right: 20, padding: 6 },

  nameWrap: { alignItems: 'center', gap: 5 },
  nickname: { fontSize: 20, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.olive },
  verifiedText: { fontSize: 11, color: Colors.olive, fontWeight: '600', letterSpacing: 0.2 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: Colors.textMuted },
  metaSep: { fontSize: 11, color: Colors.textMuted },

  editBtn: {
    backgroundColor: Colors.bg,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 2,
  },
  editBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, width: '100%' },
  stat: { flex: 1, alignItems: 'center', gap: 3, minWidth: 0 },
  statValue: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, height: 24, backgroundColor: Colors.cardBorder, flexShrink: 0 },

  moodRow: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  moodContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 8, flexDirection: 'row' },
  moodTag: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  moodTagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },

  upcomingBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  upcomingLeft: { flex: 1, gap: 3 },
  upcomingLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  upcomingDest: { fontSize: 15, fontWeight: '600', color: Colors.primary, letterSpacing: -0.2 },
  upcomingDate: { fontSize: 11, color: Colors.dustBlue },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 1.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.textPrimary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '400' },
  tabTextActive: { color: Colors.textPrimary, fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },

  visitedWrap: { marginBottom: 20 },
  visitedTitle: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 12,
  },
  visitedCities: { flexDirection: 'row', gap: 10 },
  visitedCity: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  visitedFlag: { fontSize: 20 },
  visitedCityName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  visitedCityCount: { fontSize: 10, color: Colors.textMuted },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 12,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  tripCard: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: 10,
  },
  tripLeft: { flex: 1, gap: 5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 5 },
  statusUpcoming: { backgroundColor: Colors.primaryLight },
  statusDone: { backgroundColor: Colors.bgDeep },
  statusText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  statusTextUpcoming: { color: Colors.primary },
  statusTextDone: { color: Colors.textSecondary },
  tripDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  tripDate: { fontSize: 12, color: Colors.textMuted },
  tripCompanion: { fontSize: 12, color: Colors.dustBlue, fontWeight: '500' },
  rating: { fontSize: 12, color: '#C4A052', flexShrink: 0 },

  personalityCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
  },
  personalityTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  personalityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  personalityItem: { flex: 1, alignItems: 'center', gap: 4 },
  personalityEmoji: { fontSize: 18 },
  personalityLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  personalityKey: { fontSize: 10, color: Colors.textMuted },

  empty: { paddingTop: 56, alignItems: 'center', gap: 10 },
  emptyIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginTop: 4 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted },
});
