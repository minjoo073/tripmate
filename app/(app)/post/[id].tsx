import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Post } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { getPost } from '../../../services/communityService';
import { startChat } from '../../../services/chatService';

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
    Alert.alert('참가 신청', '이 여행에 참가 신청을 보내드릴까요?', [
      { text: '취소', style: 'cancel' },
      { text: '신청하기', onPress: () => Alert.alert('완료', '참가 신청을 보냈어요!') },
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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {post.category === 'mate' ? '🤝 Mate 모집' : post.category === 'tips' ? '✈️ Travel Tips' : '⭐ 후기'}
            </Text>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
        </View>

        <View style={styles.authorRow}>
          <Avatar nickname={post.author.nickname} size={40} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.nickname}</Text>
            <Text style={styles.authorDate}>{date}</Text>
          </View>
          <View style={styles.stats}>
            <Text style={styles.stat}>♡ {post.likes + (liked ? 1 : 0)}</Text>
            <Text style={styles.stat}>💬 {post.comments}</Text>
          </View>
        </View>

        {post.trip && (
          <View style={styles.tripBanner}>
            <Text style={styles.tripDest}>📍 {post.trip.destination}, {post.trip.country}</Text>
            <Text style={styles.tripDate}>📅 {post.trip.startDate} ~ {post.trip.endDate}</Text>
          </View>
        )}

        <Text style={styles.bodyText}>{post.content}</Text>

        <View style={styles.tagSection}>
          <Text style={styles.tagLabel}>여행 스타일</Text>
          <View style={styles.tagRow}>
            {post.travelStyles.map((s) => (
              <View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
            ))}
          </View>
        </View>

        {post.trip?.schedule && post.trip.schedule.length > 0 && (
          <View style={styles.scheduleSection}>
            <Text style={styles.tagLabel}>예상 일정</Text>
            {post.trip.schedule.map((s) => (
              <View key={s.date} style={styles.scheduleRow}>
                <Text style={styles.scheduleDate}>{s.date}</Text>
                <Text style={styles.scheduleActivities}>{s.activities.join(' · ')}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button label="참가 신청" onPress={handleJoin} variant="secondary" style={styles.joinBtn} />
        <Button label="채팅하기 💬" onPress={handleChat} loading={chatLoading} style={styles.chatBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  back: { fontSize: 22, color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  titleCard: { backgroundColor: Colors.cardDark, borderRadius: 16, padding: 16, gap: 10, marginBottom: 16 },
  categoryBadge: { backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  postTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, lineHeight: 26 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  authorDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { fontSize: 13, color: Colors.textSecondary },
  tripBanner: { backgroundColor: Colors.primaryBg, borderRadius: 12, padding: 14, marginBottom: 16, gap: 6 },
  tripDest: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  tripDate: { fontSize: 13, color: Colors.primary },
  bodyText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 24, marginBottom: 20 },
  tagSection: { marginBottom: 16 },
  tagLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: Colors.primaryBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  tagText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  scheduleSection: { marginBottom: 16 },
  scheduleRow: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  scheduleDate: { fontSize: 13, fontWeight: '600', color: Colors.primary, width: 40 },
  scheduleActivities: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  bottomActions: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 12, gap: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  joinBtn: { flex: 1 },
  chatBtn: { flex: 1 },
});
