import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChatRoom } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors, Elevation, Radius, Space } from '../../constants/colors';
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
      activeOpacity={0.88}
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
    marginHorizontal: Space.xl,
    marginVertical: Space.sm,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Space.lg,
    gap: 14,
    ...Elevation.md,
  },
  avatarWrap: { position: 'relative' },
  onlineDot: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: Radius.pill,
    backgroundColor: Colors.olive,
    borderWidth: 2, borderColor: Colors.card,
  },
  info: { flex: 1, minWidth: 0, gap: Space.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  confirmedBadge: {
    backgroundColor: 'rgba(110,125,98,0.12)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confirmedText: { fontSize: 9, fontWeight: '700', color: Colors.olive, letterSpacing: 0.3 },
  pendingBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingText: { fontSize: 9, fontWeight: '600', color: Colors.accent, letterSpacing: 0.3 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: Space.xs },
  tripText: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  tripDate: { fontSize: 11, color: Colors.textMuted },
  message: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  right: { alignItems: 'flex-end', gap: 5, flexShrink: 0 },
  time: { fontSize: 10, color: Colors.textMuted, fontWeight: '400' },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
});
