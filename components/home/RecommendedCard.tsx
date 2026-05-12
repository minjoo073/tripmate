import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';

interface Props {
  item: MatchResult;
}

export function RecommendedCard({ item }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <Avatar nickname={item.user.nickname} size={56} />
      <Text style={styles.name} numberOfLines={1}>{item.user.nickname}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.matchRate}%</Text>
      </View>
      <Text style={styles.destination} numberOfLines={1}>📍 {item.trip.destination}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 116,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    gap: 6,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  destination: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
