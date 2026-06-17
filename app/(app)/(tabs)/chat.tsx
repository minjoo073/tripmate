import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Radius, Space } from '../../../constants/colors';
import { ChatRoom } from '../../../types';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import { getChatRooms } from '../../../services/chatService';
import { MessageIcon, EditIcon } from '../../../components/ui/Icon';
import { router, useFocusEffect } from 'expo-router';

const STATUS_TABS = ['전체', '대화 중', '수락 대기'] as const;
type StatusTab = typeof STATUS_TABS[number];

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>('전체');

  useFocusEffect(
    useCallback(() => {
      getChatRooms().then(setRooms);
    }, [])
  );

  const unreadCount = rooms.reduce((n, r) => n + (r.unreadCount ?? 0), 0);
  const pendingCount = rooms.filter((r) => r.status === 'pending').length;

  const filtered = rooms.filter((r) => {
    if (activeTab === '대화 중') return r.status === 'accepted' || r.status === 'tips';
    if (activeTab === '수락 대기') return r.status === 'pending';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>TRAVEL TALK</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>여행 대화</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={() => router.push('/(tabs)/explore')}
            activeOpacity={0.8}
          >
            <EditIcon color={Colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>

        {/* Pending request hint */}
        {pendingCount > 0 && (
          <View style={styles.pendingBar}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>
              동행 신청 <Text style={styles.pendingCount}>{pendingCount}건</Text> 수락 대기 중
            </Text>
          </View>
        )}

        {/* Status tabs */}
        {rooms.length > 0 && (
          <View style={styles.tabRow}>
            {STATUS_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <MessageIcon color={Colors.textMuted} size={24} />
            </View>
            <Text style={styles.emptyTitle}>
              {rooms.length === 0 ? '아직 대화가 없어요' : '해당 대화가 없어요'}
            </Text>
            <Text style={styles.emptyDesc}>
              {rooms.length === 0
                ? '여행 메이트를 찾아 이야기를 시작해보세요'
                : '다른 탭을 확인해보세요'}
            </Text>
            {rooms.length === 0 && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(tabs)/explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyBtnText}>동행 찾기</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((item) => <ChatListItem key={item.id} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 0,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 16,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    ...Platform.select({ web: { fontFamily: Font.serif }, default: {} }),
  },
  unreadBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  newChatBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pendingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    marginBottom: Space.md,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  pendingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  pendingCount: {
    fontWeight: '700',
    color: Colors.accent,
  },

  tabRow: {
    flexDirection: 'row',
    gap: 0,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.textPrimary, borderBottomWidth: 2 },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '400' },
  tabTextActive: { color: Colors.textPrimary, fontWeight: '600' },

  scrollContent: { flexGrow: 1, paddingTop: Space.xs, paddingBottom: Space.xxl },

  empty: {
    paddingTop: 72,
    alignItems: 'center',
    gap: 10,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
