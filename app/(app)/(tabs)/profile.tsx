import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { usePersonality } from '../../../context/PersonalityContext';
import { useProfile } from '../../../context/ProfileContext';
import { useTrips, SavedTrip } from '../../../context/TripsContext';
import { mockPosts } from '../../../mock/data';
import { router, useFocusEffect } from 'expo-router';
import { SettingsIcon, MessageIcon, MapPinIcon, ArrowRightIcon, EditIcon, HeartIcon, PlaneTakeoffIcon } from '../../../components/ui/Icon';

const TABS = ['여행 기록', '리뷰', '저장'];

const AIRPORT_CODES: Record<string, string> = {
  '오사카': 'KIX', '도쿄': 'NRT', '방콕': 'BKK', '파리': 'CDG',
  '뉴욕': 'JFK', '발리': 'DPS', '싱가포르': 'SIN', '바르셀로나': 'BCN',
};

function cityName(dest: string) {
  return dest.split(',')[0].trim();
}

function airportCode(dest: string) {
  return AIRPORT_CODES[cityName(dest)] ?? 'INT';
}

function formatDateRange(startISO: string, endISO: string) {
  if (!startISO || !endISO) return '';
  const fmt = (s: string) => s.replace(/-/g, '.');
  const start = fmt(startISO);
  const endTail = endISO.length >= 10 ? endISO.slice(5).replace('-', '.') : '';
  return `${start} – ${endTail}`;
}

function tripToTicket(trip: SavedTrip, idx: number) {
  const isDone = !!trip.completedAt;
  return {
    id: `${idx}-${trip.startDate}`,
    dest: trip.destination,
    date: formatDateRange(trip.startDate, trip.endDate),
    companion: trip.companions || (isDone ? '동행 없음' : '예정'),
    rating: isDone ? 5 : 0,
    status: isDone ? ('done' as const) : ('upcoming' as const),
  };
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { personality } = usePersonality();
  const { profile } = useProfile();
  const { upcoming, recent, reload } = useTrips();
  const [activeTab, setActiveTab] = useState('여행 기록');

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const tickets = recent.map((t, i) => tripToTicket(t, i));
  const tripCount = tickets.length;
  const moodLabels = profile.styles;

  const CATEGORY_LABEL: Record<string, string> = { mate: '동행 찾기', tips: '여행 기록', review: '로컬 추천' };
  const savedPosts = profile.savedPostIds
    .map((pid) => mockPosts.find((p) => p.id === pid))
    .filter(Boolean) as typeof mockPosts;

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
            <Avatar nickname={user?.nickname ?? '나'} size={72} avatarIndex={profile.avatarIndex} />
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

        {/* Personality — all 7 fields */}
        <TouchableOpacity style={styles.personalityMini} onPress={() => router.push('/travel-personality')} activeOpacity={0.7}>
          <Text style={styles.personalityMiniText} numberOfLines={2}>
            {[
              personality.pace,
              personality.time,
              personality.companion,
              personality.planning,
              personality.accommodation,
              personality.dining,
              personality.budget,
            ].filter(Boolean).join(' · ')}
          </Text>
          <EditIcon color={Colors.textMuted} size={11} />
        </TouchableOpacity>

        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{tripCount}</Text>
              <Text style={styles.statLabel}>여행</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>–</Text>
              <Text style={styles.statLabel}>평점</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>–</Text>
              <Text style={styles.statLabel}>재동행률</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>–</Text>
              <Text style={styles.statLabel}>함께한 분</Text>
            </View>
          </View>
        </View>

        {/* Travel moods — hashtag style */}
        {moodLabels.length > 0 ? (
          <Text style={styles.moodText}>
            {moodLabels.map((label) => `#${label.replace(/\s+/g, '')}`).join(' · ')}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => router.push('/profile-setup')} activeOpacity={0.7}>
            <Text style={styles.moodEmpty}>여행 스타일을 설정해보세요 →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Journey section — unified card */}
      <View style={styles.journeySection}>
        <View style={styles.journeyCard}>
          {upcoming ? (
            <TouchableOpacity style={styles.nextTripRow} activeOpacity={0.85} onPress={() => router.push('/trip-detail')}>
              <View style={styles.nextTripLeft}>
                <Text style={styles.nextTripEyebrow}>NEXT JOURNEY</Text>
                <Text style={styles.nextTripDest}>{upcoming.destination}</Text>
                <Text style={styles.nextTripDate}>{formatDateRange(upcoming.startDate, upcoming.endDate)}</Text>
              </View>
              <ArrowRightIcon color={Colors.primary} size={16} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextTripRow} activeOpacity={0.85} onPress={() => router.push('/trip-plan')}>
              <View style={styles.nextTripLeft}>
                <Text style={styles.nextTripEyebrow}>NEXT JOURNEY</Text>
                <Text style={styles.nextTripDest}>아직 계획이 없어요</Text>
                <Text style={styles.nextTripDate}>여행 계획을 등록해보세요</Text>
              </View>
              <ArrowRightIcon color={Colors.primary} size={16} />
            </TouchableOpacity>
          )}

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

            <Text style={styles.sectionLabel}>BOARDING PASS · {tickets.length}</Text>
            {tickets.length === 0 && (
              <View style={styles.ticketEmpty}>
                <Text style={styles.ticketEmptyTitle}>아직 보드패스가 없어요</Text>
                <Text style={styles.ticketEmptyDesc}>여행 계획을 등록하면 여기에 카드가 쌓여요</Text>
                <TouchableOpacity style={styles.ticketEmptyBtn} onPress={() => router.push('/trip-plan')} activeOpacity={0.8}>
                  <Text style={styles.ticketEmptyBtnText}>+ 여행 계획 등록</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.ticketList}>
              {tickets.map((trip) => {
                const isUpcoming = trip.status === 'upcoming';
                const accent = isUpcoming ? Colors.primary : Colors.olive;
                return (
                  <TouchableOpacity
                    key={trip.id}
                    style={styles.ticket}
                    activeOpacity={0.9}
                    onPress={() => router.push('/trip-detail')}
                  >
                    <View style={styles.ticketMain}>
                      <View style={styles.ticketRouteRow}>
                        <Text style={styles.ticketCode}>ICN</Text>
                        <View style={styles.ticketPath}>
                          <View style={styles.ticketPathLine} />
                          <PlaneTakeoffIcon color={Colors.textMuted} size={13} />
                          <View style={styles.ticketPathLine} />
                        </View>
                        <Text style={styles.ticketCode}>{airportCode(trip.dest)}</Text>
                      </View>
                      <Text style={styles.ticketDest}>{trip.dest}</Text>
                      <Text style={styles.ticketDate}>{trip.date}</Text>
                      <Text style={styles.ticketCompanion}>함께한 분 · {trip.companion}</Text>
                    </View>

                    <View style={styles.ticketPerf}>
                      <View style={styles.notchTop} />
                      <View style={styles.perfDash} />
                      <View style={styles.notchBottom} />
                    </View>

                    <View style={styles.ticketStub}>
                      <View style={[styles.stubStatus, { backgroundColor: accent + '18' }]}>
                        <Text style={[styles.stubStatusText, { color: accent }]}>
                          {isUpcoming ? '예정' : '완료'}
                        </Text>
                      </View>
                      {trip.rating > 0 && (
                        <Text style={styles.ticketRating}>{'★'.repeat(trip.rating)}</Text>
                      )}
                      <Text style={styles.stubLabel}>SEAT {trip.id}A</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
            <Text style={styles.sectionLabel}>저장한 글 · {savedPosts.length}</Text>
            {savedPosts.length === 0 ? (
              <View style={styles.empty}>
                <View style={styles.emptyIconBox}>
                  <MessageIcon color={Colors.textMuted} size={26} />
                </View>
                <Text style={styles.emptyTitle}>저장한 글이 없어요</Text>
                <Text style={styles.emptyDesc}>커뮤니티에서 마음에 드는 글을 북마크 해보세요</Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => router.push('/(tabs)/community')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyBtnText}>커뮤니티 둘러보기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              savedPosts.map((item) => (
                <TouchableOpacity key={item.id} style={styles.savedRow} activeOpacity={0.7} onPress={() => router.push(`/post/${item.id}`)}>
                  <View style={[styles.savedCatBadge, { backgroundColor: Colors.accentLight }]}>
                    <Text style={[styles.savedCatText, { color: Colors.accent }]}>{CATEGORY_LABEL[item.category] ?? item.category}</Text>
                  </View>
                  <Text style={styles.savedTitle} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))
            )}
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
  moodEmpty: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  ticketEmpty: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  ticketEmptyTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  ticketEmptyDesc: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  ticketEmptyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  ticketEmptyBtnText: { fontSize: 12, fontWeight: '600', color: Colors.white },

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
  // Boarding-pass ticket cards
  ticketList: { gap: 12 },
  ticket: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  ticketMain: { flex: 1, padding: 16, gap: 5 },
  ticketRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  ticketCode: { fontSize: 20, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5 },
  ticketPath: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  ticketPathLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  ticketDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  ticketDate: { fontSize: 12, color: Colors.textMuted },
  ticketCompanion: { fontSize: 12, color: Colors.dustBlue, fontWeight: '500' },

  ticketPerf: { width: 1, alignItems: 'center', justifyContent: 'center' },
  perfDash: {
    flex: 1, width: 1,
    borderLeftWidth: 1, borderStyle: 'dashed', borderColor: Colors.cardBorder,
  },
  notchTop: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.bg, marginTop: -7,
  },
  notchBottom: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.bg, marginBottom: -7,
  },

  ticketStub: {
    width: 92,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stubStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  stubStatusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  ticketRating: { fontSize: 11, color: '#C4A052' },
  stubLabel: { fontSize: 9, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1 },

  // Passport stamps
  stampGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 6 },
  stamp: {
    width: '23%', aspectRatio: 1, borderRadius: 999,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', gap: 1,
    backgroundColor: Colors.accentLight + '80',
  },
  stampFlag: { fontSize: 16 },
  stampCity: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  stampCount: { fontSize: 9, fontWeight: '600', color: Colors.accent, letterSpacing: 0.5 },

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
