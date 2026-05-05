import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';
import { getMateProfile } from '../../services/matchService';
import { startChat } from '../../services/chatService';
import { mockMatchResults } from '../../mock/data';

const STYLE_COLORS: Record<string, string> = {
  '카페': Colors.pointYellow,
  '역사/문화': Colors.pointBlueGray,
  '사진': Colors.pointPurple,
  '힐링': Colors.pointTeal,
};

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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLiked((l) => !l)} style={styles.likeBtn}>
          <Text style={styles.likeIcon}>{liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile top */}
        <View style={styles.profileTop}>
          <Avatar nickname={user.nickname} size={80} />
          <Text style={styles.name}>{user.nickname}</Text>
          <Text style={styles.meta}>{user.age}세 · {user.location}{user.mbti ? ` · ${user.mbti}` : ''}</Text>
          {user.isVerified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ SNS 인증 완료</Text></View>}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{matchResult?.matchRate ?? 90}%</Text>
            <Text style={styles.statLabel}>매칭률</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.travelCount}</Text>
            <Text style={styles.statLabel}>여행 횟수</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.rating}</Text>
            <Text style={styles.statLabel}>평점</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 스타일</Text>
          <View style={styles.tagRow}>
            {user.travelStyles.map((style) => (
              <Tag key={style} label={style} selected color={STYLE_COLORS[style]} />
            ))}
          </View>
        </View>

        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>자기소개</Text>
            <View style={styles.bioBox}>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          </View>
        )}

        {matchResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>여행 일정</Text>
            <View style={styles.tripInfo}>
              <Text style={styles.tripDest}>📍 {matchResult.trip.destination}, {matchResult.trip.country}</Text>
              <Text style={styles.tripDate}>📅 {matchResult.trip.startDate} ~ {matchResult.trip.endDate}</Text>
            </View>
          </View>
        )}

        {user.reviews && user.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>리뷰</Text>
            {user.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar nickname={review.reviewer.nickname} size={32} />
                  <Text style={styles.reviewerName}>{review.reviewer.nickname}</Text>
                  <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button label="💬  채팅 시작" onPress={handleChat} loading={chatLoading} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: Colors.primary,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: Colors.white },
  likeBtn: { padding: 4 },
  likeIcon: { fontSize: 22 },
  scroll: { paddingBottom: 32 },
  profileTop: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 32,
    gap: 8,
  },
  name: { fontSize: 22, fontWeight: '700', color: Colors.white },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  verifiedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: -16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.white },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bioBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  bioText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  tripInfo: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.cardBorder, gap: 6 },
  tripDest: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  tripDate: { fontSize: 13, color: Colors.textSecondary },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 8,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  reviewerName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  reviewRating: { fontSize: 13, color: '#F59E0B' },
  reviewContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  actions: { paddingHorizontal: 20, marginTop: 24 },
});
