import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { ChatRoom } from '../../../types';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import { getChatRooms } from '../../../services/chatService';
import { MessageIcon } from '../../../components/ui/Icon';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    getChatRooms().then(setRooms);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>TRAVEL TALK</Text>
        <Text style={styles.title}>여행 대화</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {rooms.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <MessageIcon color={Colors.textMuted} size={24} />
            </View>
            <Text style={styles.emptyTitle}>아직 대화가 없어요</Text>
            <Text style={styles.emptyDesc}>여행 메이트를 찾아 이야기를 시작해보세요</Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  scrollContent: { flexGrow: 1 },
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
});
