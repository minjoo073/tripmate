import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Elevation, Radius, Space } from '../../constants/colors';
import { ArrowLeftIcon, HeartIcon, MapPinIcon } from '../../components/ui/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { CalendarIcon } from '../../components/ui/Icon';
import { DestImage } from '../../components/ui/DestImage';
import { mockMatchResults, mockMyTrip } from '../../mock/data';
import { JoinSheet } from '../../components/mate/JoinSheet';
import { MatchResult } from '../../types';

// Mock: 찜한 동행자 목록 (첫 3명)
const LIKED = mockMatchResults.slice(0, 3);

function getOverlap(mateStart: string, mateEnd: string) {
  const s = mockMyTrip.startDate > mateStart ? mockMyTrip.startDate : mateStart;
  const e = mockMyTrip.endDate < mateEnd ? mockMyTrip.endDate : mateEnd;
  if (s > e) return null;
  const days = Math.round((new Date(e).getTime() - new Date(s).getTime()) / 86400000) + 1;
  const myTotal = Math.round((new Date(mockMyTrip.endDate).getTime() - new Date(mockMyTrip.startDate).getTime()) / 86400000) + 1;
  const fmt = (d: string) => d.slice(5).replace('-', '.');
  return { label: `${fmt(s)} – ${fmt(e)}`, days, isFull: days >= myTotal };
}

export default function LikedMatesScreen() {
  const insets = useSafeAreaInsets();
  const [joinTarget, setJoinTarget] = useState<MatchResult | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>LIKED</Text>
          <Text style={styles.title}>찜한 동행자</Text>
        </View>
        <View style={styles.countBadge}>
          <HeartIcon color={Colors.accent} size={13} filled />
          <Text style={styles.countText}>{LIKED.length}</Text>
        </View>
      </View>

      {LIKED.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <HeartIcon color={Colors.textMuted} size={28} />
          </View>
          <Text style={styles.emptyTitle}>아직 찜한 동행자가 없어요</Text>
          <Text style={styles.emptyDesc}>마음에 드는 동행자를 찜해보세요</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/match/list')} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>동행자 찾기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {LIKED.map((item) => {
            const reRate = 80 + (item.user.travelCount % 15);
            const filledDots = Math.round(item.matchRate / 20);
            const overlap = getOverlap(item.trip.startDate, item.trip.endDate);
            return (
              <TouchableOpacity
                key={item.user.id}
                style={[styles.card, Elevation.md]}
                activeOpacity={0.88}
                onPress={() => router.push(`/mate/${item.user.id}`)}
              >
                {/* Destination hero photo */}
                <DestImage
                  dest={item.trip.destination}
                  style={styles.cardHero}
                  scrim="bottom"
                  radius={0}
                >
                  <View style={styles.cardHeroContent}>
                    <View style={styles.avatarWrap}>
                      <Avatar nickname={item.user.nickname} size={48} />
                      {item.user.isVerified && <View style={styles.verifiedDot} />}
                    </View>
                    <View style={styles.heroInfo}>
                      <Text style={styles.nameOnPhoto}>{item.user.nickname}</Text>
                      <View style={styles.destRow}>
                        <MapPinIcon color="rgba(255,255,255,0.75)" size={10} />
                        <Text style={styles.destOnPhoto}>{item.trip.destination}</Text>
                      </View>
                    </View>
                    {/* Match rate badge */}
                    <View style={styles.matchBadgeOnPhoto}>
                      <Text style={styles.matchPctOnPhoto}>{item.matchRate}%</Text>
                      <Text style={styles.matchLabelOnPhoto}>매칭</Text>
                    </View>
                  </View>
                </DestImage>

                {/* Card body */}
                <View style={styles.cardBody}>
                  {/* Overlap row */}
                  <View style={styles.overlapRow}>
                    <CalendarIcon color={overlap ? Colors.accent : Colors.textMuted} size={10} />
                    <Text style={[styles.overlapText, !overlap && styles.overlapTextNone]}>
                      {overlap ? `${overlap.label} · ${overlap.days}일 겹침` : '일정 겹침 없음'}
                    </Text>
                  </View>

                  {/* Tags */}
                  <Text style={styles.stylesText}>
                    {item.user.travelStyles.slice(0, 3).join(' · ')}
                  </Text>

                  {/* Trust row */}
                  <View style={styles.trustRow}>
                    {item.user.isVerified && (
                      <Text style={styles.trustVerified}>● 인증</Text>
                    )}
                    <Text style={styles.trustMeta}>재동행 {reRate}%</Text>
                    <Text style={styles.trustMeta}>응답 빠름</Text>
                  </View>

                  {/* Compat dots */}
                  <View style={styles.compatRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <View
                        key={i}
                        style={[styles.compatDot, i <= filledDots && styles.compatDotFilled]}
                      />
                    ))}
                    <Text style={styles.compatLabel}>여행 스타일 매칭</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={(e) => { e.stopPropagation?.(); setJoinTarget(item); }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.joinBtnText}>동행 신청</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <JoinSheet
        visible={!!joinTarget}
        onClose={() => setJoinTarget(null)}
        userId={joinTarget?.user.id ?? ''}
        nickname={joinTarget?.user.nickname ?? ''}
        destination={joinTarget?.trip.destination}
        dates={`${joinTarget?.trip.startDate} – ${joinTarget?.trip.endDate}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
    paddingHorizontal: Space.xl,
    paddingTop: Space.xl,
    paddingBottom: Space.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 16 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5 },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    marginTop: 18,
  },
  countText: { fontSize: 12, fontWeight: '600', color: Colors.accent },

  scroll: { flex: 1 },
  content: { padding: Space.xl, gap: Space.md },

  // Card — column layout with destination photo header
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHero: { height: 140 },
  cardHeroContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Space.md,
    width: '100%',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  verifiedDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5, borderColor: Colors.white,
  },
  heroInfo: { flex: 1, gap: 3 },
  nameOnPhoto: { fontSize: 16, fontWeight: '600', color: Colors.white, letterSpacing: -0.2 },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  destOnPhoto: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  matchBadgeOnPhoto: {
    alignItems: 'center',
    backgroundColor: 'rgba(59,81,120,0.65)',
    borderRadius: Radius.sm,
    paddingHorizontal: Space.sm,
    paddingVertical: 4,
    flexShrink: 0,
  },
  matchPctOnPhoto: { fontSize: 14, fontWeight: '700', color: Colors.white, letterSpacing: -0.3 },
  matchLabelOnPhoto: { fontSize: 9, color: 'rgba(255,255,255,0.75)', fontWeight: '500', letterSpacing: 0.5 },

  // Card body
  cardBody: { padding: Space.lg, gap: Space.md },
  overlapRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  overlapText: { fontSize: 11, color: Colors.accent, fontWeight: '500' },
  overlapTextNone: { color: Colors.textMuted, fontWeight: '400' },

  stylesText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },

  trustRow: {
    flexDirection: 'row', gap: 10,
    paddingTop: Space.md,
    borderTopWidth: 1, borderTopColor: Colors.cardBorder,
  },
  trustVerified: { fontSize: 11, color: Colors.olive, fontWeight: '500' },
  trustMeta: { fontSize: 11, color: Colors.textMuted, fontWeight: '400' },

  compatRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compatDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.bgDeep },
  compatDotFilled: { backgroundColor: Colors.dustBlue },
  compatLabel: { fontSize: 10, color: Colors.textMuted, marginLeft: 4 },

  joinBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    paddingVertical: 11, alignItems: 'center',
  },
  joinBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 40 },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: Radius.sm,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
