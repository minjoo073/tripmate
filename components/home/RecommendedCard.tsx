import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';

interface Props {
  item: MatchResult;
}

export function RecommendedCard({ item }: Props) {
  const recompanionRate = 80 + (item.user.travelCount % 15);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <View style={styles.avatarWrap}>
        <Avatar nickname={item.user.nickname} size={52} />
        {item.user.isVerified && <View style={styles.verifiedDot} />}
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.user.nickname}</Text>
      <View style={styles.destRow}>
        <MapPinIcon color={Colors.textMuted} size={10} />
        <Text style={styles.destination} numberOfLines={1}>{item.trip.destination}</Text>
      </View>
      <View style={styles.styleTag}>
        <Text style={styles.styleTagText} numberOfLines={1}>
          {item.user.travelStyles[0] ?? '자유여행'}
        </Text>
      </View>
      <View style={styles.rateRow}>
        <Text style={styles.rateText}>재동행 {recompanionRate}%</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 5,
  },
  avatarWrap: { position: 'relative', marginBottom: 2 },
  verifiedDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  destination: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  styleTag: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 1,
  },
  styleTagText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  rateRow: {
    marginTop: 2,
  },
  rateText: {
    fontSize: 10,
    color: Colors.olive,
    fontWeight: '600',
  },
});
