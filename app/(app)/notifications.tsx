import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { ArrowLeftIcon, MessageIcon, UsersIcon, HeartIcon } from '../../components/ui/Icon';

type NotiType = 'message' | 'companion' | 'like';

const MOCK_NOTIFICATIONS: {
  id: string; type: NotiType; title: string; body: string; time: string; read: boolean;
}[] = [
  { id: '1', type: 'message',   title: '조승연 님이 메시지를 보냈어요',  body: '저도 6월 15일부터예요 ㅎㅎ',         time: '방금',    read: false },
  { id: '2', type: 'companion', title: '한소희 님이 동행을 수락했어요!', body: '오사카 여행 동행이 확정되었어요',     time: '1시간 전', read: false },
  { id: '3', type: 'like',      title: '누군가 회원님을 찜했어요',       body: '회원님의 프로필을 찜한 분이 있어요', time: '어제',    read: true  },
];

const TYPE_CONFIG: Record<NotiType, { icon: (c: string) => React.ReactNode; iconColor: string; bg: string; accent: string }> = {
  message: {
    icon: (c) => <MessageIcon color={c} size={15} />,
    iconColor: Colors.primary,
    bg: Colors.primaryLight,
    accent: Colors.primary,
  },
  companion: {
    icon: (c) => <UsersIcon color={c} size={15} />,
    iconColor: '#4CAF82',
    bg: 'rgba(76,175,130,0.12)',
    accent: '#4CAF82',
  },
  like: {
    icon: (c) => <HeartIcon color={c} size={15} filled />,
    iconColor: Colors.accent,
    bg: Colors.accentLight,
    accent: Colors.accent,
  },
};

function NotiItem({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) {
  const cfg = TYPE_CONFIG[item.type];
  return (
    <TouchableOpacity activeOpacity={0.75} style={[styles.card, !item.read && styles.cardUnread]}>
      {!item.read && <View style={[styles.accentBar, { backgroundColor: cfg.accent }]} />}
      <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
        {cfg.icon(cfg.iconColor)}
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.itemTitle, !item.read && styles.itemTitleUnread]}>{item.title}</Text>
        <Text style={styles.itemBody}>{item.body}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={[styles.dot, { backgroundColor: cfg.accent }]} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>INBOX</Text>
          <Text style={styles.title}>알림</Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}개 읽지 않음</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Unread section */}
        {MOCK_NOTIFICATIONS.filter((n) => !n.read).length > 0 && (
          <>
            <Text style={styles.sectionLabel}>새 알림</Text>
            {MOCK_NOTIFICATIONS.filter((n) => !n.read).map((item) => (
              <NotiItem key={item.id} item={item} />
            ))}
          </>
        )}

        {/* Read section */}
        {MOCK_NOTIFICATIONS.filter((n) => n.read).length > 0 && (
          <>
            <Text style={[styles.sectionLabel, styles.sectionLabelRead]}>이전 알림</Text>
            {MOCK_NOTIFICATIONS.filter((n) => n.read).map((item) => (
              <NotiItem key={item.id} item={item} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 16 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5 },
  unreadBadge: {
    marginTop: 18,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  unreadBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.primary },

  list: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, marginBottom: 2, marginTop: 2,
  },
  sectionLabelRead: { marginTop: 12, color: Colors.textMuted },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: Colors.white,
    borderColor: 'rgba(59,81,120,0.12)',
    shadowOpacity: 1.5,
  },
  accentBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    borderRadius: 2,
  },

  iconBox: {
    width: 36, height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textCol: { flex: 1, gap: 2 },
  itemTitle: {
    fontSize: 13, fontWeight: '500',
    color: Colors.textSecondary, lineHeight: 18,
  },
  itemTitleUnread: {
    fontWeight: '600', color: Colors.textPrimary,
  },
  itemBody: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  time: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },

  dot: {
    width: 6, height: 6, borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
});
