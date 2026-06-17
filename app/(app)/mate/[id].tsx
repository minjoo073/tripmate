import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { HeartIcon, ArrowLeftIcon, MapPinIcon, CalendarIcon } from '../../../components/ui/Icon';
import { StyleTag } from '../../../components/ui/StyleTag';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Elevation, Radius, Space } from '../../../constants/colors';
import { User } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { DestImage } from '../../../components/ui/DestImage';
import { Button } from '../../../components/ui/Button';
import { getMateProfile } from '../../../services/matchService';
import { startChat } from '../../../services/chatService';
import { mockMatchResults } from '../../../mock/data';

const TRAVEL_VIBES = [
  '여행 스타일이 잘 맞아요',
  '같이 다니면 잘 맞을 것 같아요',
  '이번 여행, 혼자보다 좋을지도',
  '로컬 여행 취향이 닮아있어요',
];

export default function MateProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const matchResult = mockMatchResults.find((m) => m.user.id === id);

  useEffect(() => {
    if (id) getMateProfile(id).then(setUser);
  }, [id]);

  const handleChat = async () => {
    if (!id) return;
    setChatLoading(true);
    try {
      const room = await startChat(id);
      router.push(`/chat/${room.id}`);
    } catch {
      Alert.alert('오류', '채팅을 시작할 수 없어요.');
    } finally {
      setChatLoading(false);
    }
  };

  if (!user) return null;

  const vibe = TRAVEL_VIBES[user.travelCount % TRAVEL_VIBES.length];
  const recompanionRate = 80 + (user.travelCount % 15);
  const responseRate = 94 + (user.travelCount % 5);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Floating nav — positioned above hero */}
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.navBtn}
        >
          <ArrowLeftIcon color={Colors.white} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLiked((l) => !l)} style={styles.navBtn}>
          <HeartIcon color={liked ? Colors.accent : Colors.white} size={20} filled={liked} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero — full-bleed destination photo */}
        <DestImage
          dest={matchResult?.trip.destination}
          style={styles.heroImage}
          scrim="bottom"
          radius={0}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroAvatarWrap}>
              <Avatar nickname={user.nickname} size={72} />
              {user.isVerified && <View style={styles.verifiedDotOnPhoto} />}
            </View>
            <View style={styles.heroText}>
              <View style={styles.nameRow}>
                <Text style={styles.heroName}>{user.nickname}</Text>
                {user.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.heroMeta}>{user.age}세{user.mbti ? ` · ${user.mbti}` : ''}</Text>
              <View style={styles.locationRow}>
                <MapPinIcon color="rgba(255,255,255,0.7)" size={11} />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            </View>
          </View>
        </DestImage>

        {/* Trust badges */}
        <View style={styles.badgesSection}>
          {user.isVerified && (
            <View style={[styles.heroBadge, styles.heroBadgeVerified]}>
              <Text style={[styles.heroBadgeText, styles.heroBadgeTextVerified]}>✓ 신원 인증</Text>
            </View>
          )}
          <View style={[styles.heroBadge, styles.heroBadgeClean]}>
            <Text style={[styles.heroBadgeText, styles.heroBadgeTextClean]}>클린 이력</Text>
          </View>
          <View style={[styles.heroBadge, styles.heroBadgeActive]}>
            <Text style={[styles.heroBadgeText, styles.heroBadgeTextActive]}>최근 24h 활동</Text>
          </View>
          {user.travelCount >= 10 && (
            <View style={[styles.heroBadge, styles.heroBadgeVet]}>
              <Text style={[styles.heroBadgeText, styles.heroBadgeTextVet]}>베테랑</Text>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View style={[styles.statsStrip, Elevation.sm]}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{user.travelCount}회</Text>
            <Text style={styles.statsLabel}>동행 여행</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{recompanionRate}%</Text>
            <Text style={styles.statsLabel}>재동행률</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{responseRate}%</Text>
            <Text style={styles.statsLabel}>응답률</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{user.rating}</Text>
            <Text style={styles.statsLabel}>평점</Text>
          </View>
        </View>

        {/* Travel schedule */}
        {matchResult && (
          <View style={[styles.tripCard, Elevation.sm]}>
            <View style={styles.tripCardHead}>
              <Text style={styles.tripCardLabel}>함께할 여행</Text>
              <View style={styles.overlapBadge}>
                <Text style={styles.overlapText}>일정 겹침</Text>
              </View>
            </View>
            <View style={styles.tripRow}>
              <MapPinIcon color={Colors.primary} size={13} />
              <Text style={styles.tripDest}>
                {matchResult.trip.destination}, {matchResult.trip.country}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <CalendarIcon color={Colors.primary} size={13} />
              <Text style={styles.tripDate}>
                {matchResult.trip.startDate} – {matchResult.trip.endDate}
              </Text>
            </View>
          </View>
        )}

        {/* Bio */}
        {user.bio && (
          <View style={[styles.section, Elevation.sm]}>
            <Text style={styles.sectionLabel}>소개</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Travel style */}
        <View style={[styles.section, Elevation.sm]}>
          <Text style={styles.sectionLabel}>여행 취향</Text>
          <View style={styles.tagRow}>
            {user.travelStyles.map((style) => (
              <StyleTag key={style} label={style} size="lg" />
            ))}
          </View>
        </View>

        {/* Travel personality */}
        <View style={[styles.section, Elevation.sm]}>
          <Text style={styles.sectionLabel}>여행 성향</Text>
          <View style={styles.personalityRow}>
            {[
              { key: '여행 속도', value: '느긋한' },
              { key: '활동 시간', value: '저녁형' },
              { key: '스타일',   value: '함께' },
            ].map(({ key, value }) => (
              <View key={key} style={styles.personalityChip}>
                <Text style={styles.personalityChipKey}>{key}</Text>
                <Text style={styles.personalityChipValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        {user.reviews && user.reviews.length > 0 && (
          <View style={[styles.section, Elevation.sm]}>
            <View style={styles.reviewTitleRow}>
              <Text style={styles.sectionLabel}>함께 여행한 후기</Text>
              <Text style={styles.reviewCount}>{user.reviews.length}개</Text>
            </View>
            {user.reviews.map((review, idx) => (
              <View
                key={review.id}
                style={[
                  styles.reviewRow,
                  idx < user.reviews!.length - 1 && styles.reviewRowBorder,
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Avatar nickname={review.reviewer.nickname} size={26} />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.reviewer.nickname}</Text>
                    <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
                  </View>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button
            label="같이 여행 계획하기"
            onPress={handleChat}
            loading={chatLoading}
          />
          <TouchableOpacity
            style={styles.secondaryAction}
            activeOpacity={0.7}
            onPress={() => router.push(`/mate/reviews?userId=${user.id}`)}
          >
            <Text style={styles.secondaryActionText}>여행 후기 전체 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Floating nav over hero
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Space.xl,
    paddingBottom: Space.md,
    backgroundColor: 'transparent',
  },
  navBtn: { padding: 6, width: 38 },

  scroll: { paddingBottom: 56 },

  // Hero
  heroImage: { height: 300 },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Space.md,
    width: '100%',
  },
  heroAvatarWrap: { position: 'relative', flexShrink: 0 },
  verifiedDotOnPhoto: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.olive,
    borderWidth: 2, borderColor: Colors.white,
  },
  heroText: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  heroName: {
    fontSize: 26,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: -0.5,
    ...Platform.select({ web: { fontFamily: Font.serif }, native: {} }),
  },
  verifiedBadge: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedBadgeText: { fontSize: 10, color: Colors.white, fontWeight: '700', letterSpacing: 0.3 },
  heroMeta: { fontSize: 13, color: 'rgba(255,255,255,0.78)', fontWeight: '400' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  // Trust badges row below hero
  badgesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: Space.xl,
    paddingVertical: Space.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  heroBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  heroBadgeText: { fontSize: 11, fontWeight: '600' },
  heroBadgeVerified: { backgroundColor: 'rgba(110,125,98,0.13)' },
  heroBadgeTextVerified: { color: Colors.olive },
  heroBadgeClean: { backgroundColor: 'rgba(107,140,173,0.13)' },
  heroBadgeTextClean: { color: Colors.dustBlue },
  heroBadgeActive: { backgroundColor: Colors.accentLight },
  heroBadgeTextActive: { color: Colors.accent },
  heroBadgeVet: {
    backgroundColor: 'rgba(196,165,106,0.14)',
    borderWidth: 1, borderColor: 'rgba(196,165,106,0.3)',
  },
  heroBadgeTextVet: { color: '#A08040' },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Space.xl,
    paddingHorizontal: Space.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  statsItem: { flex: 1, alignItems: 'center', gap: 5 },
  statsValue: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  statsLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  statsDivider: { width: 1, height: 28, backgroundColor: Colors.cardBorder },

  // Trip card
  tripCard: {
    marginHorizontal: Space.xl,
    marginTop: Space.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Space.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tripCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  overlapBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  overlapText: { fontSize: 9, color: Colors.white, fontWeight: '700', letterSpacing: 0.5 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tripDest: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  tripDate: { fontSize: 13, color: Colors.textSecondary },

  // Sections
  section: {
    marginTop: Space.md,
    marginHorizontal: Space.xl,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Space.lg,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: Space.md,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bioText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '400',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  reviewTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  reviewCount: { fontSize: 12, color: Colors.textMuted },
  reviewRow: { paddingVertical: Space.lg, gap: 10 },
  reviewRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewerInfo: { flex: 1 },
  reviewerName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  reviewStars: { fontSize: 11, color: '#C4A052', marginTop: 2 },
  reviewContent: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

  personalityRow: { flexDirection: 'row', gap: 8 },
  personalityChip: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
    borderRadius: Radius.sm,
    paddingVertical: Space.lg,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 5,
  },
  personalityChipKey: { fontSize: 10, color: Colors.textMuted, fontWeight: '500', letterSpacing: 0.3 },
  personalityChipValue: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.2 },

  actions: { paddingHorizontal: Space.xl, marginTop: Space.xl, gap: 10 },
  secondaryAction: { alignItems: 'center', paddingVertical: 4 },
  secondaryActionText: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'underline' },
});
