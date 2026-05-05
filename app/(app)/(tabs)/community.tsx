import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Post } from '../../../types';
import { PostCard } from '../../../components/community/PostCard';
import { getPosts } from '../../../services/communityService';

const TABS = [
  { key: 'all', label: 'Mate 모집' },
  { key: 'tips', label: 'Travel Tips' },
  { key: 'review', label: '후기' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const category = activeTab === 'all' ? undefined : activeTab as 'tips' | 'review';
    getPosts(category).then(setPosts);
  }, [activeTab]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Treavle Bard</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {posts.map((item) => <PostCard key={item.id} item={item} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  list: { padding: 20, paddingBottom: 40 },
});
