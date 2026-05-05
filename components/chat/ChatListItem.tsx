import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChatRoom } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';

interface Props {
  item: ChatRoom;
}

export function ChatListItem({ item }: Props) {
  const time = new Date(item.lastMessageAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.85}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Avatar nickname={item.partner.nickname} size={48} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.partner.nickname}</Text>
        <Text style={styles.message} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.white,
    gap: 12,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  message: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  time: { fontSize: 11, color: Colors.textSecondary },
  badge: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  badgeText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
});
