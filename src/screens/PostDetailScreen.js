import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';

export default function PostDetailScreen({ navigation, route }) {
  const post = route.params?.post;
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  if (!post) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시물</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.authorSection}>
          <Avatar emoji={post.authorAvatar} bg={post.authorAvatarBg} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
          {post.category === 'mate' && (
            <TouchableOpacity style={styles.chatNowBtn}>
              <Text style={styles.chatNowText}>Chat Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{post.title}</Text>

          {post.destination && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoLabel}>목적지</Text>
                <Text style={styles.infoValue}>{post.destination}</Text>
              </View>
              {post.startDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📅</Text>
                  <Text style={styles.infoLabel}>여행 기간</Text>
                  <Text style={styles.infoValue}>{post.startDate} ~ {post.endDate}</Text>
                </View>
              )}
              {post.joined !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>👥</Text>
                  <Text style={styles.infoLabel}>모집 현황</Text>
                  <Text style={[styles.infoValue, { color: Colors.primary, fontWeight: '700' }]}>
                    {post.joined}/{post.maxJoin}명
                  </Text>
                </View>
              )}
            </View>
          )}

          {post.styles && post.styles.length > 0 && (
            <View style={styles.styleRow}>
              {post.styles.map((s) => (
                <View key={s} style={styles.styleTag}>
                  <Text style={styles.styleTagText}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.body}>{post.content}</Text>
          <Text style={styles.body}>
            {post.category === 'mate'
              ? '관심 있으신 분은 댓글이나 채팅으로 연락주세요! 서로 여행 스타일을 얘기해보고 결정하면 좋을 것 같아요. 일정이나 스타일이 비슷하다면 정말 즐거운 여행이 될 것 같습니다 😊'
              : '더 자세한 내용은 댓글로 질문해주세요! 여행 관련 궁금한 점 있으시면 뭐든 도와드릴게요.'}
          </Text>
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setLiked(!liked)}>
            <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionText}>{liked ? post.likes + 1 : post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          {post.category === 'mate' && (
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>✈️  Join Trip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentTitle}>댓글 {post.comments}개</Text>
          {[
            { id: '1', name: '정다은', avatar: '🐝', bg: '#eeeeff', text: '저도 관심 있어요! 연락드려도 될까요?', time: '1시간 전' },
            { id: '2', name: '양세은', avatar: '🐠', bg: '#eeffdd', text: '오사카 맛집 추천받고 싶어요 😊', time: '3시간 전' },
          ].map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <Avatar emoji={c.avatar} bg={c.bg} size={34} />
              <View style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentName}>{c.name}</Text>
                  <Text style={styles.commentTime}>{c.time}</Text>
                </View>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.commentInput}>
        <TextInput
          style={styles.commentBox}
          placeholder="댓글을 입력하세요..."
          placeholderTextColor={Colors.textHint}
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  backText: { fontSize: 20, color: Colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  moreText: { fontSize: 20, color: Colors.textSub },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  authorName: { fontSize: 14, fontWeight: '700', color: Colors.black },
  postTime: { fontSize: 12, color: Colors.textMute },
  chatNowBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatNowText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  content: { backgroundColor: Colors.white, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.black, lineHeight: 26 },
  infoCard: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoIcon: { fontSize: 14, width: 20 },
  infoLabel: { fontSize: 12, color: Colors.textMute, width: 60 },
  infoValue: { fontSize: 13, color: Colors.text },
  styleRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  styleTag: {
    backgroundColor: Colors.tagBg,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.tagBorder,
  },
  styleTagText: { fontSize: 12, color: Colors.tagText, fontWeight: '600' },
  body: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 13, color: Colors.textSub, fontWeight: '600' },
  joinBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },
  commentsSection: { padding: 16, gap: 14 },
  commentTitle: { fontSize: 14, fontWeight: '700', color: Colors.black },
  commentRow: { flexDirection: 'row', gap: 10 },
  commentBubble: { flex: 1, backgroundColor: Colors.white, borderRadius: 10, padding: 10, gap: 4 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  commentName: { fontSize: 13, fontWeight: '700', color: Colors.black },
  commentTime: { fontSize: 11, color: Colors.textMute },
  commentText: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  commentBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.bg,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { fontSize: 18, color: Colors.white, fontWeight: '700' },
});
