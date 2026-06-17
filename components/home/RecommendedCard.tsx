import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors, Elevation, Radius } from '../../constants/colors';
import { StyleTag } from '../ui/StyleTag';
import { DestImage } from '../ui/DestImage';

interface Props {
  item: MatchResult;
}

export function RecommendedCard({ item }: Props) {
  const recompanionRate = 80 + (item.user.travelCount % 15);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      {/* City photo banner — clipped by card overflow:hidden */}
      <DestImage
        dest={item.trip.destination}
        style={styles.banner}
        radius={0}
        scrim="bottom"
        align="flex-end"
      >
        <Text style={styles.destOnImage} numberOfLines={1}>
          {item.trip.destination}
        </Text>
      </DestImage>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.avatarWrap}>
          <Avatar nickname={item.user.nickname} size={48} />
          {item.user.isVerified && <View style={styles.verifiedDot} />}
        </View>
        <Text style={styles.name} numberOfLines={1}>{item.user.nickname}</Text>
        <StyleTag label={item.user.travelStyles[0] ?? '자유여행'} size="sm" />
        <View style={styles.rateRow}>
          <Text style={styles.rateText}>재동행 {recompanionRate}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    ...Elevation.md,
  },
  banner: {
    height: 72,
  },
  destOnImage: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  content: {
    padding: 12,
    paddingTop: 10,
    alignItems: 'center',
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
  rateRow: {
    marginTop: 2,
  },
  rateText: {
    fontSize: 10,
    color: Colors.olive,
    fontWeight: '600',
  },
});
