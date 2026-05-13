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
  const barWidth = `${item.matchRate}%` as const;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <Avatar nickname={item.user.nickname} size={50} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.user.nickname}</Text>
          {item.user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>인증</Text>
            </View>
          )}
        </View>
        <Text style={styles.detail}>
          {item.trip.destination} · {item.trip.startDate}
        </Text>
        <View style={styles.tagRow}>
          {item.user.travelStyles.slice(0, 3).map((s) => (
            <View key={s} style={styles.tag}>
              <Text style={styles.tagText}>{s}</Text>
            </View>
          ))}
        </View>
        {/* Match bar */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.rate}>{item.matchRate}%</Text>
        <Text style={styles.rateLabel}>매칭률</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    gap: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  info: { flex: 1, minWidth: 0, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  detail: { fontSize: 12, color: Colors.textSecondary },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  barBg: {
    height: 3,
    backgroundColor: Colors.bg,
    borderRadius: 999,
    marginTop: 4,
  },
  barFill: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  right: { alignItems: 'center', gap: 2, flexShrink: 0 },
  rate: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  rateLabel: { fontSize: 10, color: Colors.textSecondary },
});
