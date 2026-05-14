import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { HeartIcon, ArrowLeftIcon, MapPinIcon, CalendarIcon } from '../../../components/ui/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { User } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
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
      {/* Nav */}
      <View style={[styles.navBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLiked((l) => !l)} style={styles.navBtn}>
          <HeartIcon color={liked ? Colors.accent : Colors.textMuted} size={20} filled={liked} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Avatar nickname={user.nickname} size={76} />
          </View>
          <View style={styles.heroRight}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.nickname}</Text>
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.hereMeta}>{user.age}세{user.mbti ? ` · ${user.mbti}` : ''}</Text>
            <View style={styles.locationRow}>
              <MapPinIcon color={Colors.textMuted} size={11} />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
            <Text style={styles.heroVibe}>{vibe}</Text>
          </View>
        </View>

        {/* Trust System */}
        <View style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <Text style={styles.trustTitle}>여행자 정보</Text>
            <View style={styles.trustScore}>
              <Text style={styles.trustScoreText}>안심 여행자</Text>
            </View>
          </View>
          <View style={styles.trustGrid}>
            <View style={styles.trustItem}>
              <Text style={styles.trustValue}>{user.travelCount}회</Text>
              <Text style={styles.trustLabel}>동행 여행</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustValue}>{recompanionRate}%</Text>
              <Text style={styles.trustLabel}>재동행률</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustValue}>{responseRate}%</Text>
              <Text style={styles.trustLabel}>응답률</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustValue}>{user.rating}</Text>
              <Text style={styles.trustLabel}>평점</Text>
            </View>
          </View>
          <View style={styles.trustBadges}>
            {user.isVerified && (
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>신원 인증 완료</Text>
              </View>
            )}
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>클린 이력</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>최근 24시간 활동</Text>
            </View>
            {user.travelCount >= 10 && (
              <View style={[styles.trustBadge, styles.trustBadgeGold]}>
                <Text style={[styles.trustBadgeText, styles.trustBadgeTextGold]}>
                  베테랑 여행자
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Travel schedule */}
        {matchResult && (
          <View style={styles.tripCard}>
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
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>소개</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Travel style */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>여행 취향</Text>
          <View style={styles.tagRow}>
            {user.travelStyles.map((style) => (
              <View key={style} style={styles.styleTag}>
                <Text style={styles.styleTagText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Travel personality */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>여행 성향</Text>
          <View style={styles.personalityGrid}>
            <View style={styles.personalityItem}>
              <Text style={styles.personalityValue}>느긋한</Text>
              <Text style={styles.personalityKey}>여행 속도</Text>
            </View>
            <View style={styles.personalityDivider} />
            <View style={styles.personalityItem}>
              <Text style={styles.personalityValue}>저녁형</Text>
              <Text style={styles.personalityKey}>활동 시간</Text>
            </View>
            <View style={styles.personalityDivider} />
            <View style={styles.personalityItem}>
              <Text style={styles.personalityValue}>함께</Text>
              <Text style={styles.personalityKey}>여행 스타일</Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        {user.reviews && user.reviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.reviewTitleRow}>
              <Text style={styles.sectionLabel}>함께 여행한 후기</Text>
              <Text style={styles.reviewCount}>{user.reviews.length}개</Text>
            </View>
            {user.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar nickname={review.reviewer.nickname} size={28} />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.reviewer.nickname}</Text>
                    <Text style={styles.reviewDate}>{'★'.repeat(review.rating)}</Text>
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
          <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.7}>
            <Text style={styles.secondaryActionText}>여행 후기 전체 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.bg,
  },
  navBtn: { padding: 6, width: 38 },
  scroll: { paddingBottom: 48 },

  hero: {
    flexDirection: 'row',
    gap: 18,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 4,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  heroLeft: {},
  heroRight: { flex: 1, gap: 5, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  verifiedBadge: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hereMeta: { fontSize: 12, color: Colors.textMuted },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 12, color: Colors.textMuted },
  heroVibe: {
    fontSize: 12,
    color: Colors.dustBlue,
    fontStyle: 'italic',
    marginTop: 2,
  },

  trustCard: {
    margin: 20,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 16,
  },
  trustHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  trustScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustScoreText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  trustGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustItem: { flex: 1, alignItems: 'center', gap: 4 },
  trustValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  trustLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  trustDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.cardBorder,
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  trustBadge: {
    backgroundColor: Colors.bgDeep,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  trustBadgeGold: {
    backgroundColor: 'rgba(196,160,82,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(196,160,82,0.3)',
  },
  trustBadgeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  trustBadgeTextGold: {
    color: '#A08040',
  },

  tripCard: {
    marginHorizontal: 20,
    marginBottom: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  tripCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  overlapBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  overlapText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tripDest: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  tripDate: { fontSize: 13, color: Colors.textSecondary },

  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bioText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '400',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleTag: {
    backgroundColor: Colors.bgDeep,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  styleTagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },

  reviewTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 10,
    gap: 10,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewerInfo: { flex: 1 },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviewDate: { fontSize: 12, color: '#C4A052', marginTop: 1 },
  reviewContent: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  personalityGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
  },
  personalityItem: { flex: 1, alignItems: 'center', gap: 4 },
  personalityValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  personalityKey: { fontSize: 10, color: Colors.textMuted, fontWeight: '400' },
  personalityDivider: { width: 1, height: 28, backgroundColor: Colors.cardBorder },

  actions: { paddingHorizontal: 20, marginTop: 28, gap: 10 },
  secondaryAction: { alignItems: 'center', paddingVertical: 4 },
  secondaryActionText: {
    fontSize: 13,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
