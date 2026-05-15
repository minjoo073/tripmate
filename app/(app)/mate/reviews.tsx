import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { ArrowLeftIcon } from '../../../components/ui/Icon';
import { Avatar } from '../../../components/ui/Avatar';
import { mockUsers } from '../../../mock/data';

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[starStyles.star, i <= rating && starStyles.starFilled]}>★</Text>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 13, color: Colors.cardBorder },
  starFilled: { color: '#C4A052' },
});

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? count / total : 0;
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${pct * 100}%` as any }]} />
      </View>
      <Text style={barStyles.count}>{count}</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 11, color: Colors.textMuted, width: 16, textAlign: 'right' },
  track: {
    flex: 1, height: 5, borderRadius: 3,
    backgroundColor: Colors.bgDeep, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: '#C4A052', borderRadius: 3 },
  count: { fontSize: 11, color: Colors.textMuted, width: 16 },
});

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) return null;

  const reviews = user.reviews ?? [];
  const total = reviews.length;
  const avg = total > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : '—';

  const countByStar = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>REVIEWS</Text>
          <Text style={styles.headerTitle}>{user.nickname}님의 후기</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.avgScore}>{avg}</Text>
            <StarRow rating={Math.round(Number(avg))} />
            <Text style={styles.totalCount}>후기 {total}개</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRight}>
            {countByStar.map(({ star, count }) => (
              <RatingBar key={star} label={`${star}`} count={count} total={total} />
            ))}
          </View>
        </View>

        {/* User info strip */}
        <View style={styles.userStrip}>
          <Avatar nickname={user.nickname} size={36} />
          <View style={styles.userStripInfo}>
            <Text style={styles.userStripName}>{user.nickname}</Text>
            <Text style={styles.userStripMeta}>동행 여행 {user.travelCount}회</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.canGoBack() ? router.back() : router.replace(`/mate/${user.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.profileBtnText}>프로필 보기</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <View style={styles.reviewList}>
          {reviews.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>✈️</Text>
              <Text style={styles.emptyText}>아직 후기가 없어요</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Avatar nickname={review.reviewer.nickname} size={38} />
                  <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerRow}>
                      <Text style={styles.reviewerName}>{review.reviewer.nickname}</Text>
                      {review.reviewer.isVerified && (
                        <View style={styles.verifiedPill}>
                          <Text style={styles.verifiedText}>인증</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.reviewerMeta}>
                      {review.reviewer.location} · 여행 {review.reviewer.travelCount}회
                    </Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <StarRow rating={review.rating} />
                    <Text style={styles.reviewDate}>
                      {review.createdAt.slice(0, 7).replace('-', '.')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 12 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.4,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  // Summary
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  summaryLeft: { alignItems: 'center', gap: 6, minWidth: 64 },
  avgScore: {
    fontSize: 42, fontWeight: '300', color: Colors.textPrimary,
    letterSpacing: -1, lineHeight: 48,
  },
  totalCount: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  summaryDivider: { width: 1, height: 64, backgroundColor: Colors.cardBorder },
  summaryRight: { flex: 1, gap: 7 },

  // User strip
  userStrip: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userStripInfo: { flex: 1, gap: 3 },
  userStripName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  userStripMeta: { fontSize: 12, color: Colors.textMuted },
  profileBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  profileBtnText: { fontSize: 12, fontWeight: '600', color: Colors.primary },

  // Review list
  reviewList: { gap: 12 },

  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  reviewerInfo: { flex: 1, gap: 4 },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reviewerName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  verifiedPill: {
    backgroundColor: 'rgba(110,125,98,0.13)',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: { fontSize: 9, fontWeight: '700', color: Colors.olive },
  reviewerMeta: { fontSize: 11, color: Colors.textMuted },
  reviewRating: { alignItems: 'flex-end', gap: 4 },
  reviewDate: { fontSize: 10, color: Colors.textMuted },
  reviewContent: {
    fontSize: 14, color: Colors.textSecondary, lineHeight: 22,
  },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
