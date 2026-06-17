import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors, Elevation, Radius, Space } from '../../constants/colors';
import { DestImage } from '../ui/DestImage';

interface Props {
  item: MatchResult;
}

function rateColor(rate: number): string {
  if (rate >= 95) return Colors.olive;
  if (rate >= 85) return Colors.dustBlue;
  return Colors.primary;
}

export function ScheduleCard({ item }: Props) {
  const color = rateColor(item.matchRate);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <Avatar nickname={item.user.nickname} size={44} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.user.nickname}</Text>
        <Text style={styles.detail} numberOfLines={1}>
          {item.trip.destination} · {item.trip.startDate} ~ {item.trip.endDate}
        </Text>
      </View>
      {/* Small city thumbnail — reinforces destination context */}
      <DestImage
        dest={item.trip.destination}
        style={styles.thumb}
        radius={Radius.sm}
        scrim="none"
      />
      <Text style={[styles.rate, { color }]}>{item.matchRate}%</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: Space.md,
    marginBottom: Space.md,
    ...Elevation.sm,
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  detail: { fontSize: 12, color: Colors.textSecondary },
  thumb: { width: 44, height: 44, flexShrink: 0 },
  rate: { fontSize: 16, fontWeight: '700', flexShrink: 0 },
});
