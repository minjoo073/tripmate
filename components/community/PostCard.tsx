import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';

interface Props {
  item: Post;
}

export function PostCard({ item }: Props) {
  const time = new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <View style={styles.authorRow}>
        <Avatar nickname={item.author.nickname} size={36} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author.nickname}</Text>
          <Text style={styles.authorMeta}>{item.author.location}</Text>
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
      <View style={styles.tagRow}>
        {item.travelStyles.map((s) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.stat}>♡ {item.likes}</Text>
        <Text style={styles.stat}>💬 {item.comments}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadowCard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    gap: 10,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  authorInfo: { flex: 1, minWidth: 0 },
  authorName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  authorMeta: { fontSize: 11, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textSecondary, flexShrink: 0 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22 },
  content: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: Colors.primaryBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  footer: { flexDirection: 'row', gap: 16 },
  stat: { fontSize: 13, color: Colors.textSecondary },
});
