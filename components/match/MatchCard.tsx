import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';

interface Props {
  item: MatchResult;
  rank: number;
}

export function MatchCard({ item, rank }: Props) {
  const opacity = item.matchRate >= 95 ? 1 : item.matchRate >= 85 ? 0.7 : 0.5;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <Avatar nickname={item.user.nickname} size={48} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.user.nickname}</Text>
          {item.user.isVerified && <Text style={styles.verified}>✓ 인증</Text>}
        </View>
        <Text style={styles.detail}>{item.trip.destination} · {item.trip.startDate} ~ {item.trip.endDate}</Text>
        <View style={styles.tagRow}>
          {item.user.travelStyles.slice(0, 3).map((s) => (
            <View key={s} style={styles.tag}>
              <Text style={styles.tagText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.rate, { color: `rgba(53, 76, 123, ${opacity})` }]}>{item.matchRate}%</Text>
        <Text style={styles.heart}>♡</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
    marginBottom: 10,
  },
  info: { flex: 1, minWidth: 0, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  verified: { fontSize: 11, color: Colors.primary, fontWeight: '600', backgroundColor: Colors.primaryBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  detail: { fontSize: 12, color: Colors.textSecondary },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: { backgroundColor: Colors.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 11, color: Colors.primary, fontWeight: '500' },
  right: { alignItems: 'center', gap: 6, flexShrink: 0 },
  rate: { fontSize: 18, fontWeight: '800' },
  heart: { fontSize: 18, color: Colors.textSecondary },
});
