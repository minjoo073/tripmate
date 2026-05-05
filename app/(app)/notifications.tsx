import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const MOCK_NOTIFICATIONS = [
  { id: '1', icon: '💬', title: '조승연 님이 메시지를 보냈어요', body: '저도 6월 15일부터예요 ㅎㅎ', time: '방금', read: false },
  { id: '2', icon: '🤝', title: '한소희 님이 동행을 수락했어요!', body: '오사카 여행 동행이 확정되었어요', time: '1시간 전', read: false },
  { id: '3', icon: '❤️', title: '누군가 회원님을 찜했어요', body: '회원님의 프로필을 찜한 분이 있어요', time: '어제', read: true },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
              <Text style={styles.icon}>{item.icon}</Text>
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
  itemUnread: { backgroundColor: 'rgba(53, 76, 123, 0.04)' },
  icon: { fontSize: 28, width: 40, textAlign: 'center' },
  info: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },
  itemBody: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  time: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.cardBorder },
});
