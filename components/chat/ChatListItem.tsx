import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChatRoom } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';

interface Props {
  item: ChatRoom;
}

export function ChatListItem({ item }: Props) {
  const time = new Date(item.lastMessageAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  const isAccepted = item.status === 'accepted';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarWrap}>
        <Avatar nickname={item.partner.nickname} size={48} />
        {isAccepted && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.partner.nickname}</Text>
          {isAccepted ? (
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>동행 확정</Text>
            </View>
          ) : (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>대기 중</Text>
            </View>
          )}
        </View>

        {item.trip && (
          <View style={styles.tripRow}>
            <MapPinIcon color={Colors.textMuted} size={10} />
            <Text style={styles.tripText}>{item.trip.destination}</Text>
            {item.trip.startDate && (
              <Text style={styles.tripDate}>· {item.trip.startDate.slice(5, 7)}월</Text>
            )}
          </View>
        )}

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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarWrap: { position: 'relative' },
  onlineDot: {
    position: 'absolute',
    bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5, borderColor: Colors.card,
  },
  info: { flex: 1, minWidth: 0, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  confirmedBadge: {
    backgroundColor: 'rgba(110,125,98,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confirmedText: { fontSize: 9, fontWeight: '700', color: Colors.olive, letterSpacing: 0.3 },
  pendingBadge: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingText: { fontSize: 9, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripText: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  tripDate: { fontSize: 11, color: Colors.textMuted },
  message: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  right: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  time: { fontSize: 10, color: Colors.textMuted, fontWeight: '400' },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
});
