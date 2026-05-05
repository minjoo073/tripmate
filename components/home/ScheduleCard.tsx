import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';

interface Props {
  item: MatchResult;
}

export function ScheduleCard({ item }: Props) {
  const opacity = item.matchRate >= 95 ? 1 : item.matchRate >= 85 ? 0.7 : 0.5;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <Avatar nickname={item.user.nickname} size={44} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.user.nickname}</Text>
        <Text style={styles.detail}>{item.trip.destination} · {item.trip.startDate} ~ {item.trip.endDate}</Text>
      </View>
      <Text style={[styles.rate, { color: `rgba(53, 76, 123, ${opacity})` }]}>{item.matchRate}%</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
    marginBottom: 10,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  detail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  rate: { fontSize: 16, fontWeight: '700' },
});
