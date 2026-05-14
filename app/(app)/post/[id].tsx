import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font } from '../../../constants/colors';
import { Post } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { getPost } from '../../../services/communityService';
import { startChat } from '../../../services/chatService';
import { MapPinIcon, HeartIcon, MessageIcon } from '../../../components/ui/Icon';

const CITY_COORDS: Record<string, string> = {
  '오사카': '34°N · 135°E',
  '도쿄':   '35°N · 139°E',
  '방콕':   '13°N · 100°E',
  '파리':   '48°N · 002°E',
  '뉴욕':   '40°N · 073°W',
  '바르셀로나': '41°N · 002°E',
};

const CATEGORY_META: Record<string, { label: string; subLabel: string; color: string; bg: string }> = {
  mate:   { label: '동행 찾기', subLabel: 'TRAVEL MATE',    color: Colors.primary,  bg: Colors.primaryLight },
  tips:   { label: '여행 기록', subLabel: 'TRAVEL LOG',     color: Colors.accent,   bg: Colors.accentLight  },
  review: { label: '로컬 추천', subLabel: 'LOCAL PICK',     color: Colors.olive,    bg: '#EBF0E6'           },
};

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (id) getPost(id).then(setPost);
  }, [id]);

  const handleJoin = () => {
    Alert.alert('동행 신청', '이 여행에 함께하고 싶으신가요?', [
      { text: '취소', style: 'cancel' },
      { text: '신청하기', onPress: () => Alert.alert('신청 완료', '동행 신청을 보냈어요. 곧 연락이 올 거예요!') },
    ]);
  };

  const handleChat = async () => {
    if (!post?.author.id) return;
    setChatLoading(true);
    try {
      const room = await startChat(post.author.id);
      router.push(`/chat/${room.id}`);
    } catch {
      Alert.alert('오류', '채팅을 시작할 수 없어요.');
    } finally {
      setChatLoading(false);
    }
  };

  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const cat = CATEGORY_META[post.category ?? 'mate'] ?? CATEGORY_META['mate'];
  const destination = post.trip?.destination ?? '';
  const coords = CITY_COORDS[destination] ?? null;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>{cat.subLabel}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero title area */}
        <View style={styles.heroSection}>
          <View style={[styles.catPill, { backgroundColor: cat.bg }]}>
            <Text style={[styles.catPillText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>

          {coords && (
            <Text style={styles.coordsText}>{coords}</Text>
          )}
        </View>

        {/* Author row */}
        <View style={styles.authorRow}>
          <Avatar nickname={post.author.nickname} size={38} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.nickname}</Text>
            <Text style={styles.authorDate}>{date}</Text>
          </View>
          <TouchableOpacity style={styles.likeBtn} onPress={() => setLiked(!liked)} activeOpacity={0.7}>
            <HeartIcon color={liked ? Colors.accent : Colors.textMuted} size={14} />
            <Text style={[styles.likeCount, liked && { color: Colors.accent }]}>
              {post.likes + (liked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Trip info card */}
        {post.trip && (
          <View style={styles.tripCard}>
            <View style={styles.tripCardTop}>
              <MapPinIcon color={Colors.primary} size={12} />
              <Text style={styles.tripDest}>{destination}{post.trip.country ? `, ${post.trip.country}` : ''}</Text>
              {coords && <Text style={styles.tripCoords}>{coords}</Text>}
            </View>
            <View style={styles.tripDateRow}>
              <View style={styles.tripDatePill}>
                <Text style={styles.tripDateText}>{post.trip.startDate} – {post.trip.endDate}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Body */}
        <Text style={styles.bodyText}>{post.content}</Text>

        {/* Travel styles */}
        {post.travelStyles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>여행 스타일</Text>
            <View style={styles.tagRow}>
              {post.travelStyles.map((s) => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Schedule */}
        {post.trip?.schedule && post.trip.schedule.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>예상 일정</Text>
            <View style={styles.scheduleCard}>
              {post.trip.schedule.map((s, i) => (
                <View key={s.date} style={[styles.scheduleRow, i < post.trip!.schedule!.length - 1 && styles.scheduleRowBorder]}>
                  <Text style={styles.scheduleDate}>{s.date.slice(5)}</Text>
                  <Text style={styles.scheduleDot}>·</Text>
                  <Text style={styles.scheduleActivities}>{s.activities.join(' · ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Comments count */}
        <View style={styles.commentsHeader}>
          <MessageIcon color={Colors.textMuted} size={13} />
          <Text style={styles.commentsLabel}>댓글 {post.comments}개</Text>
        </View>

      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleJoin} activeOpacity={0.85}>
          <Text style={styles.secondaryBtnText}>동행 신청</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, chatLoading && styles.btnDisabled]}
          onPress={handleChat}
          activeOpacity={0.85}
          disabled={chatLoading}
        >
          <Text style={styles.primaryBtnText}>{chatLoading ? '연결 중...' : '여행 이야기 나누기'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.textPrimary },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    fontFamily: Font.base,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 32, gap: 20 },

  heroSection: { gap: 10, paddingTop: 4 },
  catPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catPillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  coordsText: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontWeight: '500',
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  authorDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  likeCount: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  divider: { height: 1, backgroundColor: Colors.cardBorder },

  tripCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  tripCardTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tripDest: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  tripCoords: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.8 },
  tripDateRow: { flexDirection: 'row' },
  tripDatePill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tripDateText: { fontSize: 11, color: Colors.primary, fontWeight: '600', letterSpacing: 0.2 },

  bodyText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 26,
    fontWeight: '400',
  },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.bgDeep,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  scheduleCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  scheduleDate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    width: 36,
    paddingTop: 1,
  },
  scheduleDot: { fontSize: 13, color: Colors.textMuted },
  scheduleActivities: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  commentsLabel: { fontSize: 13, color: Colors.textMuted },

  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  secondaryBtn: {
    height: 50,
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  primaryBtn: {
    height: 50,
    flex: 2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  btnDisabled: { opacity: 0.5 },
});
