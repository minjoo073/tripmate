import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';

interface Props {
  item: MatchResult;
  rank: number;
}

const TRAVEL_VIBES = [
  '여행 스타일이 잘 맞아요',
  '같이 다니면 잘 맞을 것 같아요',
  '이번 여행, 혼자보다 좋을지도',
  '로컬 여행 취향이 닮아있어요',
  '같은 속도로 여행하는 사람이에요',
];

export function MatchCard({ item, rank }: Props) {
  const vibe = TRAVEL_VIBES[(rank - 1) % TRAVEL_VIBES.length];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatarWrap}>
          <Avatar nickname={item.user.nickname} size={52} />
          {item.user.isVerified && <View style={styles.verifiedDot} />}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.user.nickname}</Text>
          <View style={styles.destRow}>
            <MapPinIcon color={Colors.textMuted} size={11} />
            <Text style={styles.dest}>{item.trip.destination}</Text>
            <Text style={styles.dateSep}>·</Text>
            <Text style={styles.date}>{item.trip.startDate.slice(5, 7)}월</Text>
          </View>
        </View>
        <View style={styles.compatWrap}>
          <View style={styles.compatDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.compatDot,
                  i <= Math.round(item.matchRate / 20) && styles.compatDotFilled,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.vibe}>{vibe}</Text>

      <View style={styles.tagRow}>
        {item.user.travelStyles.slice(0, 3).map((s) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.trustRow}>
        {item.user.isVerified && (
          <View style={styles.trustBadge}>
            <View style={styles.trustDot} />
            <Text style={styles.trustBadgeText}>인증 완료</Text>
          </View>
        )}
        <View style={styles.trustBadge}>
          <Text style={styles.trustBadgeText}>재동행 {80 + (item.user.travelCount % 15)}%</Text>
        </View>
        <View style={styles.trustBadge}>
          <Text style={styles.trustBadgeText}>응답 빠름</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  verifiedDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  info: { flex: 1, gap: 5 },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dest: { fontSize: 12, color: Colors.textSecondary },
  dateSep: { fontSize: 12, color: Colors.textMuted },
  date: { fontSize: 12, color: Colors.textMuted },
  compatWrap: { alignItems: 'flex-end', gap: 5 },
  compatDots: { flexDirection: 'row', gap: 3 },
  compatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bgDeep,
  },
  compatDotFilled: {
    backgroundColor: Colors.dustBlue,
  },
  compatLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  trustRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgDeep,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trustDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.olive,
  },
  trustBadgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  vibe: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
    paddingLeft: 2,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.bgDeep,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
