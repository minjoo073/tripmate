import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';
import { StyleTag } from '../ui/StyleTag';

interface Props {
  item: MatchResult;
  rank: number;
}

export function MatchCard({ item, rank }: Props) {
  const filledDots = Math.round(item.matchRate / 20);
  const reRate = 80 + (item.user.travelCount % 15);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      {/* Top row */}
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
        {/* Match rate */}
        <View style={styles.matchWrap}>
          <Text style={styles.matchPct}>{item.matchRate}%</Text>
          <View style={styles.compatDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[styles.compatDot, i <= filledDots && styles.compatDotFilled]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Travel style tags */}
      <View style={styles.tagRow}>
        {item.user.travelStyles.slice(0, 3).map((s) => (
          <StyleTag key={s} label={s} />
        ))}
      </View>

      {/* Trust badges */}
      <View style={styles.trustRow}>
        {item.user.isVerified && (
          <View style={[styles.badge, styles.badgeVerified]}>
            <View style={styles.verifiedBadgeDot} />
            <Text style={[styles.badgeText, styles.badgeTextVerified]}>인증 완료</Text>
          </View>
        )}
        <View style={[styles.badge, styles.badgeRetrip]}>
          <Text style={[styles.badgeText, styles.badgeTextRetrip]}>재동행 {reRate}%</Text>
        </View>
        <View style={[styles.badge, styles.badgeResponse]}>
          <Text style={[styles.badgeText, styles.badgeTextResponse]}>응답 빠름</Text>
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
    gap: 14,
    marginBottom: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },

  // Top row
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarWrap: { position: 'relative' },
  verifiedDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5, borderColor: Colors.card,
  },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dest: { fontSize: 12, color: Colors.textSecondary },
  dateSep: { fontSize: 12, color: Colors.textMuted },
  date: { fontSize: 12, color: Colors.textMuted },

  // Match rate
  matchWrap: { alignItems: 'flex-end', gap: 5 },
  matchPct: {
    fontSize: 13, fontWeight: '700',
    color: Colors.primary, letterSpacing: -0.3,
  },
  compatDots: { flexDirection: 'row', gap: 3 },
  compatDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: Colors.bgDeep,
  },
  compatDotFilled: { backgroundColor: Colors.dustBlue },

  // Style tags — soft navy tint
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  styleTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.12)',
  },
  styleTagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

  // Trust badges
  trustRow: {
    flexDirection: 'row', gap: 6,
    paddingTop: 12,
    marginTop: 2,
    borderTopWidth: 1, borderTopColor: Colors.cardBorder,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 6,
    paddingHorizontal: 9, paddingVertical: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },

  // 인증 완료 — olive green
  badgeVerified: { backgroundColor: 'rgba(110,125,98,0.12)' },
  verifiedBadgeDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: Colors.olive,
  },
  badgeTextVerified: { color: Colors.olive },

  // 재동행 — dust blue
  badgeRetrip: { backgroundColor: 'rgba(107,140,173,0.13)' },
  badgeTextRetrip: { color: Colors.dustBlue },

  // 응답 빠름 — warm accent
  badgeResponse: { backgroundColor: Colors.accentLight },
  badgeTextResponse: { color: Colors.accent },
});
