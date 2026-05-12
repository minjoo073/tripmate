import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { MessageIcon, UsersIcon, HeartIcon } from '../../components/ui/Icon';

type NotiType = 'message' | 'companion' | 'like';
const MOCK_NOTIFICATIONS: { id: string; type: NotiType; title: string; body: string; time: string; read: boolean }[] = [
  { id: '1', type: 'message', title: '조승연 님이 메시지를 보냈어요', body: '저도 6월 15일부터예요 ㅎㅎ', time: '방금', read: false },
  { id: '2', type: 'companion', title: '한소희 님이 동행을 수락했어요!', body: '오사카 여행 동행이 확정되었어요', time: '1시간 전', read: false },
  { id: '3', type: 'like', title: '누군가 회원님을 찜했어요', body: '회원님의 프로필을 찜한 분이 있어요', time: '어제', read: true },
];

function NotiIcon({ type }: { type: NotiType }) {
  const iconColor = {
    message: Colors.primary,
    companion: '#22C55E',
    like: '#EF4444',
  }[type];
  const bgColor = {
    message: Colors.primaryBg,
    companion: 'rgba(34,197,94,0.1)',
    like: 'rgba(239,68,68,0.1)',
  }[type];
  return (
    <View style={[notiIconStyles.box, { backgroundColor: bgColor }]}>
      {type === 'message' && <MessageIcon color={iconColor} size={20} />}
      {type === 'companion' && <UsersIcon color={iconColor} size={20} />}
      {type === 'like' && <HeartIcon color={iconColor} size={20} />}
    </View>
  );
}
const notiIconStyles = StyleSheet.create({
  box: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>알림</Text>
      </View>
      <ScrollView>
        {MOCK_NOTIFICATIONS.map((item, i) => (
          <View key={item.id}>
            <View style={[styles.item, !item.read && styles.itemUnread]}>
              <NotiIcon type={item.type} />
              <View style={styles.info}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              {!item.read && <View style={styles.dot} />}
            </View>
            {i < MOCK_NOTIFICATIONS.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  back: { fontSize: 22, color: Colors.textPrimary },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, backgroundColor: Colors.white },
  itemUnread: { backgroundColor: 'rgba(74, 125, 255, 0.05)' },
  info: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },
  itemBody: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  time: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.cardBorder },
});
