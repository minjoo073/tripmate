import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { HeartIcon, ArrowLeftIcon } from '../../../components/ui/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { User } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { getMateProfile } from '../../../services/matchService';
import { startChat } from '../../../services/chatService';
import { mockMatchResults } from '../../../mock/data';

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
      {/* Navigation header */}
      <View style={[styles.navBar, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeftIcon color={Colors.textPrimary} size={22} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>프로필</Text>
        <TouchableOpacity onPress={() => setLiked((l) => !l)} style={styles.navBtn}>
          <HeartIcon color={liked ? '#EF4444' : Colors.textPlaceholder} size={22} filled={liked} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Avatar nickname={user.nickname} size={80} />
          <Text style={styles.name}>{user.nickname}</Text>
          <Text style={styles.meta}>
            {user.age}세 · {user.location}{user.mbti ? `  · ${user.mbti}` : ''}
          </Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ SNS 인증 완료</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
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

        {/* Travel style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 스타일</Text>
          <View style={styles.tagRow}>
            {user.travelStyles.map((style) => (
              <View key={style} style={styles.styleTag}>
                <Text style={styles.styleTagText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>자기소개</Text>
            <View style={styles.bioBox}>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          </View>
        )}

        {/* Trip info */}
        {matchResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>여행 일정</Text>
            <View style={styles.tripBox}>
              <Text style={styles.tripItem}>📍  {matchResult.trip.destination}, {matchResult.trip.country}</Text>
              <Text style={styles.tripItem}>📅  {matchResult.trip.startDate} – {matchResult.trip.endDate}</Text>
            </View>
          </View>
        )}

        {/* Reviews */}
        {user.reviews && user.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>리뷰</Text>
            {user.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar nickname={review.reviewer.nickname} size={30} />
                  <Text style={styles.reviewerName}>{review.reviewer.nickname}</Text>
                  <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button label="채팅 시작하기" onPress={handleChat} loading={chatLoading} />
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  navBtn: { padding: 6, width: 40 },
  navBtnText: { fontSize: 22, color: Colors.textPrimary },
  navTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  likeIcon: { fontSize: 22 },
  scroll: { paddingBottom: 36 },

  profileCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: 13, color: Colors.textSecondary },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  verifiedText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.cardBorder },

  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleTag: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  styleTagText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },

  bioBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  bioText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },

  tripBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    gap: 8,
  },
  tripItem: { fontSize: 14, color: Colors.textPrimary },

  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    marginBottom: 10,
    gap: 10,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewerName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  reviewRating: { fontSize: 13, color: '#F59E0B' },
  reviewContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  actions: { paddingHorizontal: 20, marginTop: 28 },
});
