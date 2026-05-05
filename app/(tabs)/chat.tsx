import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { ChatRoom } from '../../types';
import { ChatListItem } from '../../components/chat/ChatListItem';
import { getChatRooms } from '../../services/chatService';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    getChatRooms().then(setRooms);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
      </View>
      <ScrollView>
        {rooms.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 채팅이 없어요{'\n'}메이트를 찾아 대화를 시작해보세요 💬</Text>
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
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
