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
      <View style={[styles.header, { paddingTop: insets.top + 28 }]}>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <SettingsIcon color={Colors.textMuted} size={20} />
        </TouchableOpacity>

        {/* Top row: avatar left, info right */}
        <View style={styles.profileRow}>
          <View style={styles.avatarRing}>
            <Avatar nickname={user?.nickname ?? '나'} size={72} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>{user?.nickname ?? '여행자'}</Text>
            <TouchableOpacity style={styles.verifiedRow} onPress={() => router.push('/verification')} activeOpacity={0.7}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>인증된 여행자</Text>
              <Text style={styles.verifiedArrow}>{'>'}</Text>
            </TouchableOpacity>
            <View style={styles.editBtnRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile-setup')}>
                <Text style={styles.editBtnText}>프로필 편집</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.trustBtn} onPress={() => router.push('/verification')}>
                <Text style={styles.trustBtnText}>신뢰 인증</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personality */}
        <TouchableOpacity style={styles.personalityMini} onPress={() => router.push('/travel-personality')} activeOpacity={0.7}>
          <Text style={styles.personalityMiniText}>
            {personality.pace} · {personality.time} · {personality.companion} · {personality.planning}
          </Text>
          <EditIcon color={Colors.textMuted} size={11} />
        </TouchableOpacity>

        <View style={styles.statsCard}>
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

        {/* Travel moods — hashtag style */}
        <Text style={styles.moodText}>
          {TRAVEL_MOODS.map((m) => `#${m.label.replace(' ', '')}`).join(' · ')}
        </Text>
      </View>

      {/* Journey section — unified card */}
      <View style={styles.journeySection}>
        <View style={styles.journeyCard}>
          <TouchableOpacity style={styles.nextTripRow} activeOpacity={0.85} onPress={() => router.push('/trip-detail')}>
            <View style={styles.nextTripLeft}>
              <Text style={styles.nextTripEyebrow}>NEXT JOURNEY</Text>
              <Text style={styles.nextTripDest}>도쿄, 일본</Text>
              <Text style={styles.nextTripDate}>2025.07.05 – 07.10</Text>
            </View>
            <ArrowRightIcon color={Colors.primary} size={16} />
          </TouchableOpacity>

          <View style={styles.journeyDivider} />

          <View style={styles.journeyActions}>
            <TouchableOpacity style={styles.likedBtn} onPress={() => router.push('/liked-mates')} activeOpacity={0.75}>
              <HeartIcon color={Colors.accent} size={12} filled />
              <Text style={styles.likedLabel}>찜한 동행자 <Text style={styles.likedCount}>3명</Text></Text>
              <ArrowRightIcon color={Colors.textMuted} size={10} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.newTripBtn} onPress={() => router.push('/trip-plan')} activeOpacity={0.8}>
              <Text style={styles.newTripBtnText}>+ 새 여행 계획</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 나의 기록 section header */}
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>나의 기록</Text>
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
            <View style={styles.tripList}>
              {MOCK_TRIPS.map((trip, idx) => (
                <View
                  key={trip.id}
                  style={[
                    styles.tripRow,
                    idx < MOCK_TRIPS.length - 1 && styles.tripRowBorder,
                  ]}
                >
                  <View style={[
                    styles.tripStatusBar,
                    { backgroundColor: trip.status === 'upcoming' ? Colors.primary : Colors.olive },
                  ]} />
                  <View style={styles.tripRowBody}>
                    <Text style={styles.tripDest}>{trip.dest}</Text>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                    <Text style={styles.tripCompanion}>함께한 분 · {trip.companion}</Text>
                  </View>
                  <View style={styles.tripRowRight}>
                    {trip.rating > 0 && (
                      <Text style={styles.rating}>{'★'.repeat(trip.rating)}</Text>
                    )}
                    <View style={[
                      styles.statusPill,
                      trip.status === 'upcoming' ? styles.statusPillUpcoming : styles.statusPillDone,
                    ]}>
                      <Text style={[
                        styles.statusPillText,
                        trip.status === 'upcoming' ? styles.statusPillTextUpcoming : styles.statusPillTextDone,
                      ]}>
                        {trip.status === 'upcoming' ? '예정' : '완료'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === '리뷰' && (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <MessageIcon color={Colors.textMuted} size={26} />
            </View>
            <Text style={styles.emptyTitle}>아직 후기가 없어요</Text>
            <Text style={styles.emptyDesc}>여행 후 동행 후기를 남겨보세요</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/community')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>커뮤니티 둘러보기</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === '저장' && (
          <>
            <Text style={styles.sectionLabel}>저장한 글 · 4</Text>
            {[
              { id: 'p5', category: '동행 찾기', title: '오사카 6월 말 같이 걸을 분 구해요', categoryColor: Colors.accent, categoryBg: Colors.accentLight },
              { id: 'p6', category: '여행 기록', title: '도톤보리 뒷골목의 오래된 카페들', categoryColor: Colors.accent, categoryBg: Colors.accentLight },
              { id: 'p8', category: '여행 기록', title: '도쿄 야시장과 이자카야, 밤이 더 아름다운 도시', categoryColor: Colors.accent, categoryBg: Colors.accentLight },
              { id: 'p2', category: '동행 찾기', title: '방콕 5박 6일 + 동행 1명 모집', categoryColor: Colors.accent, categoryBg: Colors.accentLight },
            ].map((item) => (
              <TouchableOpacity key={item.id} style={styles.savedRow} activeOpacity={0.7} onPress={() => router.push(`/post/${item.id}`)}>
                <View style={[styles.savedCatBadge, { backgroundColor: item.categoryBg }]}>
                  <Text style={[styles.savedCatText, { color: item.categoryColor }]}>{item.category}</Text>
                </View>
                <Text style={styles.savedTitle} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingsBtn: { position: 'absolute', top: 20, right: 20, padding: 6 },

  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  profileInfo: { flex: 1, gap: 6 },
  avatarRing: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 999,
    padding: 3,
  },
  nameWrap: { gap: 5 },
  nickname: { fontSize: 20, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.olive },
  verifiedText: { fontSize: 11, color: Colors.olive, fontWeight: '600', letterSpacing: 0.2 },
  verifiedArrow: { fontSize: 10, color: Colors.olive, marginLeft: 2 },
  editBtnRow: { flexDirection: 'row', gap: 8 },
  trustBtn: {
    backgroundColor: Colors.olive + '14',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.olive + '30',
  },
  trustBtnText: { fontSize: 12, color: Colors.olive, fontWeight: '600' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: Colors.textMuted },
  metaSep: { fontSize: 11, color: Colors.textMuted },

  personalityMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  personalityMiniText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },

  editBtn: {
    backgroundColor: Colors.bg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignSelf: 'flex-start',
  },
  editBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  statsCard: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    width: '100%',
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stat: { flex: 1, alignItems: 'center', gap: 3, minWidth: 0 },
  statValue: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, height: 24, backgroundColor: Colors.cardBorder, flexShrink: 0 },

  moodText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '400',
    letterSpacing: 0.1,
  },

  journeySection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  journeyCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
    overflow: 'hidden',
  },
  nextTripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  nextTripLeft: { flex: 1, gap: 3 },
  nextTripEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  nextTripDest: { fontSize: 15, fontWeight: '600', color: Colors.primary, letterSpacing: -0.2 },
  nextTripDate: { fontSize: 11, color: Colors.dustBlue },
  journeyDivider: {
    height: 1,
    backgroundColor: 'rgba(59,81,120,0.10)',
    marginHorizontal: 16,
  },
  journeyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  likedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likedLabel: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  likedCount: { fontSize: 11, fontWeight: '700', color: Colors.accent },
  newTripBtn: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  newTripBtnText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },

  recordHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  recordTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },

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
  tripList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingRight: 16,
    gap: 14,
  },
  tripRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tripStatusBar: {
    width: 3,
    height: 40,
    borderRadius: 2,
    marginLeft: 16,
    flexShrink: 0,
  },
  tripRowBody: { flex: 1, gap: 4 },
  tripDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  tripDate: { fontSize: 12, color: Colors.textMuted },
  tripCompanion: { fontSize: 12, color: Colors.dustBlue, fontWeight: '500' },
  tripRowRight: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  rating: { fontSize: 11, color: '#C4A052' },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillUpcoming: { backgroundColor: Colors.primaryLight },
  statusPillDone: { backgroundColor: Colors.bgDeep },
  statusPillText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
  statusPillTextUpcoming: { color: Colors.primary },
  statusPillTextDone: { color: Colors.textSecondary },

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

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  savedCatBadge: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexShrink: 0,
  },
  savedCatText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  savedTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },

  empty: { paddingTop: 56, alignItems: 'center', gap: 10 },
  emptyIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginTop: 4 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
