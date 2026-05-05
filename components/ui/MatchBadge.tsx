import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface MatchBadgeProps {
  rate: number;
  large?: boolean;
}

export function MatchBadge({ rate, large = false }: MatchBadgeProps) {
  const opacity = rate >= 95 ? 1 : rate >= 85 ? 0.7 : 0.5;
  const color = `rgba(53, 76, 123, ${opacity})`;

  if (large) {
    return (
      <View style={styles.large}>
        <Text style={styles.largeText}>{rate}%</Text>
        <Text style={styles.largeLabel}>매칭률</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: Colors.primaryBg }]}>
      <Text style={[styles.text, { color }]}>{rate}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  large: {
    alignItems: 'center',
  },
  largeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  largeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
