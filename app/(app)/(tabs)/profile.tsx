import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { usePersonality } from '../../../context/PersonalityContext';
import { router } from 'expo-router';
import { SettingsIcon, MessageIcon, BookmarkIcon, MapPinIcon, ArrowRightIcon, WaveIcon, MoonIcon, UsersIcon, CalendarIcon, EditIcon, HeartIcon } from '../../../components/ui/Icon';

const TABS = ['여행 기록', '리뷰', '저장'];

const MOCK_TRIPS = [
  { id: '2', dest: '도쿄, 일본', date: '2025.07.05 – 07.10', companion: '예정', rating: 0, status: 'upcoming' },
  { id: '1', dest: '오사카, 일본', date: '2025.06.15 – 06.19', companion: '조승연', rating: 5, status: 'done' },
  { id: '3', dest: '방콕, 태국', date: '2024.12.20 – 12.25', companion: '한소희', rating: 5, status: 'done' },
];

const TRAVEL_MOODS = [
  { label: '카페 투어',   bg: 'rgba(192,135,70,0.14)',  text: '#9A6830' },
  { label: '로컬 골목',   bg: 'rgba(100,140,100,0.14)', text: '#3E7248' },
  { label: '필름카메라',  bg: 'rgba(90,130,175,0.14)',  text: '#3A6A9A' },
  { label: '느린 여행',   bg: 'rgba(155,140,115,0.16)', text: '#7A6848' },
  { label: '맛집 탐방',   bg: 'rgba(192,75,75,0.12)',   text: '#A03A3A' },
];

const VISITED_CITIES = [
  { city: '오사카', count: 3, flag: '🇯🇵' },
  { city: '방콕', count: 2, flag: '🇹🇭' },
  { city: '파리', count: 1, flag: '🇫🇷' },
  { city: '뉴욕', count: 1, flag: '🇺🇸' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { personality } = usePersonality();
  const [activeTab, setActiveTab] = useState('여행 기록');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.outerScroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Personality mini — compact below edit button */}
        <TouchableOpacity style={styles.personalityMini} onPress={() => router.push('/travel-personality')} activeOpacity={0.7}>
          <Text style={styles.personalityMiniText}>
            {personality.pace} · {personality.time} · {personality.companion} · {personality.planning}
          </Text>
          <EditIcon color={Colors.textMuted} size={11} />
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
            <View key={mood.label} style={[styles.moodTag, { backgroundColor: mood.bg }]}>
              <Text style={[styles.moodTagText, { color: mood.text }]}>{mood.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 찜한 동행자 shortcut — compact inline link */}
      <TouchableOpacity style={styles.likedRow} onPress={() => router.push('/liked-mates')} activeOpacity={0.75}>
        <HeartIcon color={Colors.accent} size={11} filled />
        <Text style={styles.likedLabel}>찜한 동행자 <Text style={styles.likedCount}>3명</Text></Text>
        <ArrowRightIcon color={Colors.textMuted} size={11} />
      </TouchableOpacity>

      {/* Upcoming trip banner + new plan button */}
      <View style={styles.upcomingWrap}>
        <TouchableOpacity style={styles.upcomingBanner} activeOpacity={0.85} onPress={() => router.push('/trip-detail')}>
          <View style={styles.upcomingLeft}>
            <Text style={styles.upcomingLabel}>NEXT JOURNEY</Text>
            <Text style={styles.upcomingDest}>도쿄, 일본</Text>
            <Text style={styles.upcomingDate}>2025.07.05 – 07.10</Text>
          </View>
          <ArrowRightIcon color={Colors.primary} size={16} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.newTripBtn} onPress={() => router.push('/trip-plan')} activeOpacity={0.8}>
          <Text style={styles.newTripBtnText}>+ 새 여행 계획</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs — pill segmented control */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabsTrack}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.scrollContent}>

        {activeTab === '여행 기록' && (
          <>
            {/* Route Archive card */}
            <TouchableOpacity
              style={styles.routeCard}
              onPress={() => router.push('/route-archive')}
              activeOpacity={0.85}
            >
              <View style={styles.routeCardLeft}>
                <Text style={styles.routeCardLabel}>ROUTE ARCHIVE</Text>
                <Text style={styles.routeCardTitle}>내 여행 기록</Text>
                <Text style={styles.routeCardSub}>지도 위에 새겨진 나의 발자국</Text>
              </View>
              <ArrowRightIcon color={Colors.accent} size={16} />
            </TouchableOpacity>

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
          <>
            <Text style={styles.sectionLabel}>버킷리스트 · 5</Text>
            {[
              { dest: '산토리니, 그리스', flag: '🇬🇷', note: '에게해 일몰을 꼭 보고 싶어요' },
              { dest: '교토, 일본', flag: '🇯🇵', note: '벚꽃 시즌에 기모노 입고 걷기' },
              { dest: '리스본, 포르투갈', flag: '🇵🇹', note: '파두 음악이 흐르는 골목' },
              { dest: '나폴리, 이탈리아', flag: '🇮🇹', note: '진짜 나폴리 피자 먹기' },
              { dest: '하바나, 쿠바', flag: '🇨🇺', note: '올드카와 살사 댄스' },
            ].map((item) => (
              <View key={item.dest} style={styles.wishCard}>
                <Text style={styles.wishFlag}>{item.flag}</Text>
                <View style={styles.wishInfo}>
                  <Text style={styles.wishDest}>{item.dest}</Text>
                  <Text style={styles.wishNote}>{item.note}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
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

  personalityMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  personalityMiniText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },

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
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  moodTagText: { fontSize: 12, fontWeight: '500' },

  likedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.accentLight,
    borderRadius: 999,
  },
  likedLabel: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  likedCount: { fontSize: 11, fontWeight: '700', color: Colors.accent },

  upcomingWrap: {
    marginHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  upcomingBanner: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  newTripBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  newTripBtnText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
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

  tabsWrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.bg,
  },
  tabsTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.bgDeep,
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.card,
    shadowColor: 'rgba(42,33,24,0.10)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '400' },
  tabTextActive: { color: Colors.textPrimary, fontWeight: '600' },

  outerScroll: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

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
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  personalityTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  personalityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  personalityItem: { flex: 1, alignItems: 'center', gap: 5 },
  personalityLabel: { fontSize: 13, fontWeight: '400', color: Colors.textPrimary },
  personalityKey: { fontSize: 10, color: Colors.textMuted },

  routeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.accent,
    marginBottom: 20,
  },
  routeCardLeft: { gap: 3 },
  routeCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 2.5,
  },
  routeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  routeCardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  wishCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 10,
  },
  wishFlag: { fontSize: 28 },
  wishInfo: { flex: 1, gap: 3 },
  wishDest: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  wishNote: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  wishDate: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  empty: { paddingTop: 56, alignItems: 'center', gap: 10 },
  emptyIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginTop: 4 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted },
});
