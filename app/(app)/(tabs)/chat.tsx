import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { ChatRoom } from '../../../types';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import { getChatRooms } from '../../../services/chatService';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    getChatRooms().then(setRooms);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
        <Text style={styles.subtitle}>메이트와의 대화</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {rooms.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>아직 채팅이 없어요</Text>
            <Text style={styles.emptyDesc}>메이트를 찾아 대화를 시작해보세요</Text>
          </View>
        ) : (
          rooms.map((item) => <ChatListItem key={item.id} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },
});
