import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult, Post } from '../../../types';
import { getRecommended } from '../../../services/matchService';
import { mockPosts } from '../../../mock/data';
import { BellIcon, SearchIcon, ArrowRightIcon, ArrowLeftIcon } from '../../../components/ui/Icon';

const OPEN_TRIPS = mockPosts.filter((p) => p.category === 'mate').slice(0, 6);

const DEST_COLORS: Record<string, { bg: string; text: string }> = {
  '오사카': { bg: '#EDE3D8', text: '#7A5C3E' },
  '도쿄':   { bg: '#D8E2EE', text: '#3A5878' },
  '방콕':   { bg: '#D8EAE0', text: '#3A6B55' },
  '파리':   { bg: '#EAD8EA', text: '#6B3A6B' },
  '다낭':   { bg: '#D8EAE8', text: '#2E6860' },
};
const DEFAULT_DEST = { bg: '#E8E2DA', text: '#5C5248' };

const AVATAR_BG = ['#D8E2EE', '#EDE3D8', '#D8EAE0', '#EAD8EA', '#D8EAE8'];
const AVATAR_TEXT = ['#3A5878', '#7A5C3E', '#3A6B55', '#6B3A6B', '#2E6860'];

function tripDateLabel(start?: string, end?: string) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const sm = `${s.getMonth() + 1}월 ${s.getDate()}일`;
  const em = e ? `${e.getMonth() + 1}월 ${e.getDate()}일` : '';
  return e ? `${sm} – ${em}` : sm;
}

function tripNights(start?: string, end?: string) {
  if (!start || !end) return null;
  const n = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  return n > 0 ? `${n}박 ${n + 1}일` : null;
}

// ── No-trip-plan prompt ───────────────────────────────────────────────────────
function NoTripPlan() {
  return (
    <View style={noplan.wrap}>
      <Text style={noplan.emoji}>🗺</Text>
      <Text style={noplan.title}>어디로 떠날 예정인가요?</Text>
      <Text style={noplan.desc}>
        여행 계획을 등록하면{'\n'}AI가 딱 맞는 동행을 찾아드려요
      </Text>
      <TouchableOpacity
        style={noplan.btn}
        onPress={() => router.push('/trip-plan')}
        activeOpacity={0.85}
      >
        <Text style={noplan.btnText}>여행 계획 등록하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const noplan = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32, gap: 12 },
  emoji: { fontSize: 36, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.white, letterSpacing: -0.3 },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22 },
  btn: {
    marginTop: 8,
    backgroundColor: Colors.pointYellow,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  btnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});

// ── Featured mate ─────────────────────────────────────────────────────────────
function FeaturedMate({ matches }: { matches: MatchResult[] }) {
  const [idx, setIdx] = useState(0);
  const item = matches[idx];
  if (!item) return null;

  const matchRate = 75 + (idx * 7) % 20;
  const avatarBg = AVATAR_BG[idx % AVATAR_BG.length];
  const avatarText = AVATAR_TEXT[idx % AVATAR_TEXT.length];
  const style = item.user.travelStyles[0] ?? '자유여행';

  return (
    <View style={feat.wrap}>
      <View style={[feat.avatarCircle, { backgroundColor: avatarBg + '33' }]}>
        <Text style={[feat.avatarText, { color: avatarBg }]}>{item.user.nickname[0]}</Text>
      </View>
      <View style={feat.info}>
        <View style={feat.nameRow}>
          <Text style={feat.name}>{item.user.nickname}</Text>
          {item.user.isVerified && (
            <View style={feat.verifiedBadge}>
              <Text style={feat.verifiedText}>인증</Text>
            </View>
          )}
        </View>
        <Text style={feat.dest}>✈ {item.trip.destination}</Text>
        <View style={feat.tags}>
          <View style={feat.tag}><Text style={feat.tagText}>{style}</Text></View>
          <View style={[feat.tag, feat.matchTag]}>
            <Text style={feat.matchText}>{matchRate}% 매칭</Text>
          </View>
        </View>
      </View>
      <View style={feat.nav}>
        <TouchableOpacity
          style={[feat.navBtn, idx === 0 && feat.navBtnDisabled]}
          onPress={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
        >
          <ArrowLeftIcon color={idx === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'} size={14} />
        </TouchableOpacity>
        <View style={feat.dots}>
          {matches.slice(0, 5).map((_, i) => (
            <View key={i} style={[feat.dot, i === idx && feat.dotActive]} />
          ))}
        </View>
        <TouchableOpacity
          style={[feat.navBtn, idx >= matches.length - 1 && feat.navBtnDisabled]}
          onPress={() => setIdx((i) => Math.min(matches.length - 1, i + 1))}
          disabled={idx >= matches.length - 1}
        >
          <ArrowRightIcon color={idx >= matches.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'} size={14} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={feat.cta}
        onPress={() => router.push(`/mate/${item.user.id}`)}
        activeOpacity={0.85}
      >
        <Text style={feat.ctaText}>프로필 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const feat = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 36, paddingBottom: 32, paddingHorizontal: 32, gap: 16 },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
  },
  avatarText: { fontSize: 34, fontWeight: '700' },
  info: { alignItems: 'center', gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 24, fontWeight: '700', color: Colors.white, letterSpacing: -0.4 },
  verifiedBadge: { backgroundColor: Colors.olive, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  verifiedText: { fontSize: 9, color: Colors.white, fontWeight: '700', letterSpacing: 0.5 },
  dest: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  tags: { flexDirection: 'row', gap: 8, marginTop: 2 },
  tag: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  matchTag: { backgroundColor: Colors.pointYellow + '33' },
  tagText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  matchText: { fontSize: 12, color: Colors.pointYellow, fontWeight: '700' },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  navBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled: { opacity: 0.3 },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 16, backgroundColor: 'rgba(255,255,255,0.8)' },
  cta: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12, marginTop: 4,
  },
  ctaText: { fontSize: 14, fontWeight: '600', color: Colors.white, letterSpacing: 0.2 },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [navyHeight, setNavyHeight] = useState(400);
  const [hasTripPlan, setHasTripPlan] = useState(false);
  const expandAnim = useRef(new Animated.Value(-20)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;
  const detailOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getRecommended().then(setMatches);
    AsyncStorage.getItem('trip_plan').then((stored) => {
      if (stored) setHasTripPlan(true);
    }).catch(() => {});
  }, []);

  // Trigger detail/list fade AFTER React commits re-render
  useEffect(() => {
    if (selectedPost) {
      detailOpacity.setValue(0);
      Animated.timing(detailOpacity, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    } else {
      Animated.timing(listOpacity, { toValue: 1, duration: 260, useNativeDriver: false }).start();
    }
  }, [selectedPost]);

  // Slide beige up to show recruit list
  const openList = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setIsListExpanded(true);
    Animated.timing(expandAnim, {
      toValue: -(navyHeight - 44),
      duration: 420,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: false,
    }).start();
  };

  // Collapse beige back down
  const closeList = () => {
    Animated.timing(expandAnim, {
      toValue: -20,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIsListExpanded(false));
  };

  // Open a post detail — expand beige if needed, then show detail
  const openPost = (post: Post) => {
    setIsListExpanded(true);
    Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: false }).start(() => {
      Animated.timing(expandAnim, {
        toValue: -(navyHeight - 44),
        duration: 420,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: false,
      }).start();
      setSelectedPost(post);
    });
  };

  // Go back to expanded list from detail
  const closePost = () => {
    Animated.timing(detailOpacity, { toValue: 0, duration: 150, useNativeDriver: false }).start(() => {
      setSelectedPost(null);
      // expandAnim stays up — list fades back in via useEffect
    });
  };

  const post = selectedPost;
  const dest = post?.trip?.destination ?? '';
  const accent = post ? (DEST_COLORS[dest] ?? DEFAULT_DEST) : DEFAULT_DEST;
  const dateLabel = post ? tripDateLabel(post.trip?.startDate, post.trip?.endDate) : '';
  const nights = post ? tripNights(post.trip?.startDate, post.trip?.endDate) : null;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.root}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Band 1: ivory ── */}
      <View style={[styles.band, styles.bandIvory, { paddingTop: insets.top + 28 }]}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appLabel}>TRIPMATE</Text>
            <Text style={styles.tagline}>동행 매칭</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
            <BellIcon color={Colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            지금 <Text style={styles.liveNum}>{OPEN_TRIPS.length}개</Text> 동행 모집 중
          </Text>
        </View>
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
      </View>

      {/* ── Band 2: navy — tap header to slide beige list up ── */}
      <View
        style={[styles.band, styles.bandNavy]}
        onLayout={(e) => setNavyHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity
          style={styles.bandHeader}
          onPress={isListExpanded ? closeList : openList}
          activeOpacity={0.85}
        >
          <Text style={styles.bandLabelLight}>AI 동행 매칭</Text>
          <Text style={styles.bandTitleLight}>
            {hasTripPlan ? '나와 잘 맞는 여행자' : '동행 찾기'}
          </Text>
        </TouchableOpacity>
        {hasTripPlan ? <FeaturedMate matches={matches} /> : <NoTripPlan />}
      </View>

      {/* ── Band 3: beige — slides up over navy on recruit tap ── */}
      <Animated.View style={[styles.band, styles.bandBeige, { marginTop: expandAnim }]}>
        {/* Drag handle */}
        <TouchableOpacity
          style={styles.dragHandleArea}
          onPress={!selectedPost ? (isListExpanded ? closeList : openList) : undefined}
          activeOpacity={0.6}
        >
          <View style={styles.dragHandle} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.bandHeaderRow}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={!selectedPost ? (isListExpanded ? closeList : openList) : undefined}
            activeOpacity={!selectedPost ? 0.7 : 1}
          >
            <Text style={styles.bandLabel}>동행 모집</Text>
            <Text style={styles.bandTitle}>
              {selectedPost ? dest : '지금 멤버 찾는 중'}
            </Text>
          </TouchableOpacity>
          {selectedPost ? (
            <TouchableOpacity style={styles.moreBtn} onPress={closePost}>
              <ArrowLeftIcon color={Colors.textMuted} size={12} />
              <Text style={styles.moreBtnText}>목록으로</Text>
            </TouchableOpacity>
          ) : isListExpanded ? (
            <TouchableOpacity style={styles.moreBtn} onPress={closeList}>
              <ArrowLeftIcon color={Colors.textMuted} size={12} />
              <Text style={styles.moreBtnText}>닫기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.moreBtn} onPress={() => router.push('/(tabs)/community')}>
              <Text style={styles.moreBtnText}>전체 보기</Text>
              <ArrowRightIcon color={Colors.textMuted} size={12} />
            </TouchableOpacity>
          )}
        </View>

        {/* List — fades out when a post is selected */}
        <Animated.View style={{ opacity: listOpacity }}>
          {!selectedPost && (
            <View style={styles.recruitList}>
              {OPEN_TRIPS.map((p, idx) => {
                const d = p.trip?.destination ?? '';
                const ac = DEST_COLORS[d] ?? DEFAULT_DEST;
                const ni = tripNights(p.trip?.startDate, p.trip?.endDate);
                const dl = tripDateLabel(p.trip?.startDate, p.trip?.endDate);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.recruitRow, idx < OPEN_TRIPS.length - 1 && styles.recruitDivider]}
                    onPress={() => openPost(p)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.accentBar, { backgroundColor: ac.text }]} />
                    <View style={styles.recruitBody}>
                      <View style={styles.recruitTopRow}>
                        <Text style={styles.recruitDest}>{d}</Text>
                        {ni && <Text style={styles.recruitNights}>{ni}</Text>}
                      </View>
                      <Text style={styles.recruitMeta}>
                        {p.author.nickname} · {p.author.age}세 · {dl}
                      </Text>
                    </View>
                    <View style={[styles.recruitBadge, { backgroundColor: ac.bg }]}>
                      <Text style={[styles.recruitBadgeText, { color: ac.text }]}>1명 모집</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>

        {/* Detail — fades in when a post is selected */}
        {post && (
          <Animated.View style={[styles.detailWrap, { opacity: detailOpacity }]}>
            <View style={styles.detailAuthorRow}>
              <View style={[styles.detailAvatar, { backgroundColor: accent.bg }]}>
                <Text style={[styles.detailAvatarText, { color: accent.text }]}>
                  {post.author.nickname[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailAuthorName}>{post.author.nickname}</Text>
                <Text style={styles.detailAuthorMeta}>{post.author.age}세 · {post.author.location}</Text>
              </View>
              {post.author.isVerified && (
                <View style={styles.detailVerified}>
                  <Text style={styles.detailVerifiedText}>인증</Text>
                </View>
              )}
            </View>
            <View style={[styles.detailDateRow, { backgroundColor: accent.bg }]}>
              <Text style={[styles.detailDateText, { color: accent.text }]}>
                {dateLabel}{nights ? `  ·  ${nights}` : ''}
              </Text>
            </View>
            <View style={styles.detailStyleRow}>
              {post.travelStyles.map((s) => (
                <View key={s} style={styles.detailStyleTag}>
                  <Text style={styles.detailStyleText}>{s}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.detailContent} numberOfLines={4}>{post.content}</Text>
            <TouchableOpacity
              style={[styles.detailCta, { backgroundColor: accent.text }]}
              activeOpacity={0.85}
              onPress={() => router.push(`/post/${post.id}`)}
            >
              <Text style={styles.detailCtaText}>동행 신청하기</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  band: { width: '100%' },
  bandIvory: { backgroundColor: Colors.bg, paddingHorizontal: 24, paddingBottom: 64 },
  bandNavy: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  bandBeige: {
    backgroundColor: Colors.bgDeep,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    zIndex: 3,
  },
  dragHandleArea: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    opacity: 0.4,
  },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 14,
  },
  appLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5, marginBottom: 6 },
  tagline: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  bellBtn: { padding: 4 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50' },
  liveText: { fontSize: 13, color: Colors.textSecondary },
  liveNum: { fontWeight: '700', color: Colors.textPrimary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.cardBorder, gap: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 1,
  },
  searchText: { flex: 1, fontSize: 14, color: Colors.textMuted },
  searchCta: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  searchCtaText: { fontSize: 12, color: Colors.white, fontWeight: '600' },

  bandHeader: { paddingHorizontal: 28, paddingTop: 28, gap: 4 },
  bandLabelLight: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 2.5 },
  bandTitleLight: { fontSize: 22, fontWeight: '700', color: Colors.white, letterSpacing: -0.4 },

  bandHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 20,
  },
  bandLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5, marginBottom: 4 },
  bandTitle: { fontSize: 20, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3 },
  moreBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  moreBtnText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  recruitList: {
    backgroundColor: Colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden',
  },
  recruitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingRight: 16, gap: 14 },
  recruitDivider: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  accentBar: { width: 3, height: 36, borderRadius: 2, marginLeft: 16, flexShrink: 0 },
  recruitBody: { flex: 1, gap: 4 },
  recruitTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recruitDest: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.2 },
  recruitNights: { fontSize: 11, color: Colors.textMuted },
  recruitMeta: { fontSize: 12, color: Colors.textSecondary },
  recruitBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexShrink: 0 },
  recruitBadgeText: { fontSize: 11, fontWeight: '700' },

  // Detail view (expanded state)
  detailWrap: { gap: 14 },
  detailAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  detailAvatarText: { fontSize: 17, fontWeight: '700' },
  detailAuthorName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  detailAuthorMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  detailVerified: { backgroundColor: Colors.olive, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  detailVerifiedText: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  detailDateRow: {
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start',
  },
  detailDateText: { fontSize: 13, fontWeight: '600' },
  detailStyleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detailStyleTag: {
    backgroundColor: Colors.card, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  detailStyleText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  detailContent: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  detailCta: {
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  detailCtaText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
