import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { RecommendedCard } from '../../../components/home/RecommendedCard';
import { useAuth } from '../../../context/AuthContext';
import { getRecommended } from '../../../services/matchService';
import { mockPosts } from '../../../mock/data';
import {
  BellIcon, SearchIcon, MapPinIcon, ArrowRightIcon, CalendarIcon,
} from '../../../components/ui/Icon';
import { StyleTag } from '../../../components/ui/StyleTag';
import { getStyleColor } from '../../../constants/styleColors';

const DESTINATIONS = [
  { name: '오사카', sub: 'Osaka, Japan', count: 34, color: '#E8DDD0' },
  { name: '도쿄', sub: 'Tokyo, Japan', count: 28, color: '#D8E0E8' },
  { name: '방콕', sub: 'Bangkok, Thailand', count: 21, color: '#DDE8DC' },
  { name: '파리', sub: 'Paris, France', count: 17, color: '#E8DDE8' },
  { name: '뉴욕', sub: 'New York, USA', count: 13, color: '#E0DDD8' },
];

const DEST_COLORS: Record<string, { bg: string; text: string }> = {
  '오사카': { bg: '#EDE3D8', text: '#7A5C3E' },
  '도쿄':   { bg: '#D8E2EE', text: '#3A5878' },
  '방콕':   { bg: '#D8EAE0', text: '#3A6B55' },
  '파리':   { bg: '#EAD8EA', text: '#6B3A6B' },
  '다낭':   { bg: '#D8EAE8', text: '#2E6860' },
  '베트남': { bg: '#D8EAE8', text: '#2E6860' },
};
const DEFAULT_DEST = { bg: '#E8E2DA', text: '#5C5248' };

const OPEN_TRIPS = mockPosts.filter((p) => p.category === 'mate').slice(0, 3);

function tripNights(start?: string, end?: string) {
  if (!start || !end) return null;
  const n = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  return n > 0 ? `${n}박 ${n + 1}일` : null;
}

function tripDateLabel(start?: string, end?: string) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const sm = `${s.getMonth() + 1}/${s.getDate()}`;
  const em = e ? `${e.getMonth() + 1}/${e.getDate()}` : '';
  return e ? `${sm} – ${em}` : sm;
}

const TRAVEL_STORIES = [
  {
    tag: '여행 기록',
    tagBg: 'rgba(107,140,173,0.15)',
    tagColor: '#4A7498',
    title: '오사카 골목의 오래된 카페들',
    desc: '현지인만 아는 도톤보리 뒷골목 카페 순례',
    city: 'Osaka',
  },
  {
    tag: '동행 후기',
    tagBg: 'rgba(180,217,204,0.30)',
    tagColor: '#3D7A65',
    title: '방콕에서 만난 특별한 인연',
    desc: '혼자였던 여행이 둘이 되던 순간',
    city: 'Bangkok',
  },
  {
    tag: '로컬 추천',
    tagBg: 'rgba(232,200,130,0.28)',
    tagColor: '#8A6820',
    title: '도쿄의 숨겨진 서점 거리',
    desc: '진보초에서 발견한 필름카메라와 빈티지 지도들',
    city: 'Tokyo',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [destIdx, setDestIdx] = useState(0);
  const [selectedMood, setSelectedMood] = useState('카페 투어');

  useEffect(() => {
    getRecommended().then(setMatches);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Minimal top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appLabel}>TRIPMATE</Text>
          <Text style={styles.tagline}>어디로 떠날까요</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
          <BellIcon color={Colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Live stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statsBarDot} />
        <Text style={styles.statsBarText}>지금 <Text style={styles.statsBarHighlight}>127명</Text>이 여행 메이트를 찾고 있어요</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.85}
        >
          <SearchIcon color={Colors.textMuted} size={15} />
          <Text style={styles.searchText}>도시, 날짜로 동행 찾기</Text>
          <View style={styles.searchCta}>
            <Text style={styles.searchCtaText}>검색</Text>
          </View>
        </TouchableOpacity>

        {/* Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>POPULAR NOW</Text>
            <Text style={styles.sectionTitle}>지금 떠나는 도시들</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destRow}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / 140);
              setDestIdx(Math.min(idx, DESTINATIONS.length - 1));
            }}
            scrollEventThrottle={16}
          >
            {DESTINATIONS.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={[styles.destCard, { backgroundColor: d.color }]}
                onPress={() => router.push({ pathname: '/mates', params: { destination: d.name } })}
                activeOpacity={0.82}
              >
                <Text style={styles.destName}>{d.name}</Text>
                <Text style={styles.destSub}>{d.sub}</Text>
                <View style={styles.destCount}>
                  <Text style={styles.destCountText}>{d.count}명 모집 중</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Scroll indicator dots */}
          <View style={styles.destDots}>
            {DESTINATIONS.map((_, i) => (
              <View
                key={i}
                style={[styles.destDot, i === destIdx && styles.destDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Today's mood */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>TODAY'S MOOD</Text>
            <Text style={styles.sectionTitle}>오늘 인기 여행 스타일</Text>
          </View>
          <View style={styles.moodRow}>
            {['카페 투어', '로컬 골목', '야경 산책', '현지 맛집', '필름카메라'].map((mood) => {
              const active = mood === selectedMood;
              const c = getStyleColor(mood);
              return (
                <TouchableOpacity
                  key={mood}
                  activeOpacity={0.75}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodTag,
                    active && { backgroundColor: c.bg, borderColor: 'transparent' },
                  ]}
                >
                  <Text style={[styles.moodTagText, active && { color: c.text, fontWeight: '600' }]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AI Connection - atmospheric */}
        <TouchableOpacity
          style={styles.connectionBanner}
          onPress={() => router.push('/match/loading')}
          activeOpacity={0.88}
        >
          <View style={styles.connectionInner}>
            <View style={styles.connectionTop}>
              <Text style={styles.connectionLabel}>YOUR TRAVEL VIBE</Text>
              <ArrowRightIcon color="#FFF9D7" size={16} />
            </View>
            <Text style={styles.connectionTitle}>
              같은 속도로 여행할{'\n'}메이트를 찾아드려요
            </Text>
            <Text style={styles.connectionSub}>
              여행지 · 일정 · 취향 · 신뢰도 분석
            </Text>
            <View style={styles.connectionDots}>
              {['오사카', '도쿄', '파리', '방콕'].map((city, i) => (
                <View key={city} style={[styles.dot, i === 1 && styles.dotActive]}>
                  <Text style={[styles.dotText, i === 1 && styles.dotTextActive]}>{city}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>

        {/* Companion suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>TRAVEL COMPANIONS</Text>
            <Text style={styles.sectionTitle}>함께할 여행자</Text>
          </View>
          <TouchableOpacity
            style={styles.moreLinkRow}
            onPress={() => router.push('/match/list')}
          >
            <Text style={styles.moreLink}>모두 보기</Text>
            <ArrowRightIcon color={Colors.textMuted} size={13} />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
            snapToInterval={152}
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {matches.map((item) => (
              <RecommendedCard key={item.user.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Open trips */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>OPEN TRIPS</Text>
            <Text style={styles.sectionTitle}>동행 모집 중</Text>
          </View>
          <TouchableOpacity style={styles.moreLinkRow} onPress={() => router.push('/(tabs)/community')}>
            <Text style={styles.moreLink}>전체 보기</Text>
            <ArrowRightIcon color={Colors.textMuted} size={13} />
          </TouchableOpacity>
          {OPEN_TRIPS.map((post) => {
            const dest = post.trip?.destination ?? '';
            const accent = DEST_COLORS[dest] ?? DEFAULT_DEST;
            const nights = tripNights(post.trip?.startDate, post.trip?.endDate);
            const dateLabel = tripDateLabel(post.trip?.startDate, post.trip?.endDate);
            return (
              <TouchableOpacity
                key={post.id}
                style={styles.tripCard}
                onPress={() => router.push('/(tabs)/community')}
                activeOpacity={0.82}
              >
                {/* Destination header */}
                <View style={[styles.tripCardHeader, { backgroundColor: accent.bg }]}>
                  <Text style={[styles.tripDest, { color: accent.text }]}>{dest}</Text>
                  <View style={styles.tripDateRow}>
                    <CalendarIcon color={accent.text} size={11} />
                    <Text style={[styles.tripDate, { color: accent.text }]}>{dateLabel}</Text>
                    {nights && <Text style={[styles.tripNights, { color: accent.text }]}>{nights}</Text>}
                  </View>
                </View>
                {/* Body */}
                <View style={styles.tripCardBody}>
                  <View style={styles.tripStylesRow}>
                    {post.travelStyles.slice(0, 3).map((s) => (
                      <StyleTag key={s} label={s} />
                    ))}
                  </View>
                  <View style={styles.tripFooter}>
                    <View style={styles.tripAuthorRow}>
                      <View style={styles.tripAvatar}>
                        <Text style={styles.tripAvatarText}>{post.author.nickname[0]}</Text>
                      </View>
                      <Text style={styles.tripAuthorName}>{post.author.nickname}</Text>
                      <Text style={styles.tripAuthorAge}>{post.author.age}세</Text>
                    </View>
                    <View style={styles.tripRecruitBadge}>
                      <Text style={styles.tripRecruitText}>1명 모집 중</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Travel stories feed */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>TRAVEL STORIES</Text>
            <Text style={styles.sectionTitle}>여행자들의 이야기</Text>
          </View>
          <TouchableOpacity
            style={styles.moreLinkRow}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Text style={styles.moreLink}>피드 보기</Text>
            <ArrowRightIcon color={Colors.textMuted} size={13} />
          </TouchableOpacity>
          {TRAVEL_STORIES.map((story) => (
            <TouchableOpacity
              key={story.title}
              style={styles.storyCard}
              onPress={() => router.push('/(tabs)/community')}
              activeOpacity={0.82}
            >
              <View style={styles.storyLeft}>
                <View style={[styles.storyTagWrap, { backgroundColor: story.tagBg }]}>
                  <Text style={[styles.storyTag, { color: story.tagColor }]}>{story.tag}</Text>
                </View>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyDesc}>{story.desc}</Text>
              </View>
              <View style={styles.storyCityBox}>
                <Text style={styles.storyCityText}>{story.city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* My trip prompt */}
        <TouchableOpacity
          style={styles.myTripPrompt}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.88}
        >
          <Text style={styles.myTripPromptTitle}>내 여행 기록</Text>
          <Text style={styles.myTripPromptSub}>방문한 도시 · 동행 후기 · 예정 여행</Text>
          <ArrowRightIcon color={Colors.textMuted} size={15} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 18,
  },
  appLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  bellBtn: { padding: 4 },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginHorizontal: 28,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  searchCta: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchCtaText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },

  section: { marginBottom: 36, paddingHorizontal: 28 },
  sectionHead: { marginBottom: 4 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  moreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -12,
    marginBottom: 16,
  },
  moreLink: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  destRow: { gap: 10, paddingBottom: 4, paddingRight: 24 },
  destDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  destDot: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.cardBorder,
  },
  destDotActive: {
    width: 24,
    backgroundColor: Colors.textMuted,
  },
  destCard: {
    width: 130,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  destName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  destSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '400',
    marginBottom: 8,
  },
  destCount: {
    backgroundColor: 'rgba(42, 33, 24, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  destCountText: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  connectionBanner: {
    marginHorizontal: 28,
    marginBottom: 36,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  connectionInner: { padding: 18 },
  connectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  connectionTitle: {
    fontSize: 17,
    fontWeight: '300',
    color: Colors.white,
    lineHeight: 24,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  connectionSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 14,
  },
  connectionDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: '#FFF9D7',
    borderColor: '#FFF9D7',
  },
  dotText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  dotTextActive: {
    color: '#2A2118',
    fontWeight: '600',
  },

  hScrollContent: { gap: 12, paddingBottom: 4, paddingRight: 24 },

  tripCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  tripCardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDest: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tripDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tripDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripNights: {
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.7,
  },
  tripCardBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tripStylesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tripStyleTag: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tripStyleText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  tripAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tripAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripAvatarText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tripAuthorName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  tripAuthorAge: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tripRecruitBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tripRecruitText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },

  storyCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  storyLeft: { flex: 1, gap: 5 },
  storyTagWrap: {
    backgroundColor: Colors.accentLight,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  storyTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  storyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  storyCityBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  storyCityText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  myTripPrompt: {
    marginHorizontal: 28,
    marginBottom: 8,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  myTripPromptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  myTripPromptSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 12,
  },

  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
  },
  statsBarDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.olive,
  },
  statsBarText: { fontSize: 12, color: Colors.dustBlue, fontWeight: '400' },
  statsBarHighlight: { fontWeight: '700', color: Colors.primary },

  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  moodTagActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  moodTagText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  moodTagTextActive: { color: Colors.white, fontWeight: '600' },
});
