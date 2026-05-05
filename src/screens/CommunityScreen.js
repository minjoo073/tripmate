import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { communityPosts } from '../data/mockData';

const tabs = ['전체', 'Mate 모임', 'Travel Tips', '후기'];

export default function CommunityScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('전체');

  const filtered = communityPosts.filter((p) => {
    if (activeTab === '전체') return true;
    if (activeTab === 'Mate 모임') return p.category === 'mate';
    if (activeTab === 'Travel Tips') return p.category === 'tips';
    if (activeTab === '후기') return p.category === 'review';
    return true;
  });

  const categoryEmoji = { mate: '✈️', tips: '💡', review: '📝' };
  const categoryLabel = { mate: 'Mate', tips: 'Tips', review: '후기' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treavle Bard</Text>
        <Text style={styles.headerSub}>여행자들의 커뮤니티</Text>
      </View>

      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setActiveTab(t)}
            style={[styles.tab, activeTab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postCard}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
          >
            <View style={styles.postTop}>
              <View style={[styles.catBadge, item.category === 'mate' && styles.catBadgeMate]}>
                <Text style={styles.catText}>{categoryEmoji[item.category]} {categoryLabel[item.category]}</Text>
              </View>
              {item.joined !== null && (
                <View style={styles.joinBadge}>
                  <Text style={styles.joinText}>{item.joined}/{item.maxJoin}명</Text>
                </View>
              )}
            </View>

            <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>

            {item.destination && (
              <View style={styles.destRow}>
                <Text style={styles.destIcon}>📍</Text>
                <Text style={styles.destText}>{item.destination}</Text>
                {item.startDate && (
                  <Text style={styles.dateText}> · {item.startDate.slice(5)} ~ {item.endDate.slice(5)}</Text>
                )}
              </View>
            )}

            {item.category === 'mate' && (
              <View style={styles.styleRow}>
                {item.styles.map((s) => (
                  <View key={s} style={styles.styleTag}>
                    <Text style={styles.styleTagText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.postFooter}>
              <View style={styles.authorRow}>
                <Avatar emoji={item.authorAvatar} bg={item.authorAvatarBg} size={22} />
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.postTime}>{item.time}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statText}>❤️ {item.likes}</Text>
                <Text style={styles.statText}>💬 {item.comments}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.black },
  headerSub: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textMute, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  postTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: {
    backgroundColor: Colors.tagBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: Colors.tagBorder,
  },
  catBadgeMate: { backgroundColor: '#fff3e0', borderColor: '#ffd580' },
  catText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  joinBadge: {
    backgroundColor: Colors.greenBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  joinText: { fontSize: 11, color: Colors.green, fontWeight: '600' },
  postTitle: { fontSize: 15, fontWeight: '700', color: Colors.black, lineHeight: 21 },
  destRow: { flexDirection: 'row', alignItems: 'center' },
  destIcon: { fontSize: 12, marginRight: 4 },
  destText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  dateText: { fontSize: 12, color: Colors.textMute },
  styleRow: { flexDirection: 'row', gap: 5 },
  styleTag: {
    backgroundColor: Colors.tagBg,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 0.3,
    borderColor: Colors.tagBorder,
  },
  styleTagText: { fontSize: 10, color: Colors.tagText },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: { fontSize: 12, color: Colors.textSub, fontWeight: '600' },
  postTime: { fontSize: 11, color: Colors.textHint },
  statsRow: { flexDirection: 'row', gap: 10 },
  statText: { fontSize: 12, color: Colors.textMute },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 28, color: Colors.white, lineHeight: 36 },
});
