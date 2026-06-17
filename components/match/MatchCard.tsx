import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MatchResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors, Elevation, Radius } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';
import { StyleTag } from '../ui/StyleTag';
import { DestImage } from '../ui/DestImage';

interface Props {
  item: MatchResult;
  rank: number;
  onJoin?: (item: MatchResult) => void;
}

function matchColor(rate: number) {
  if (rate >= 90) return Colors.olive;
  if (rate >= 80) return Colors.dustBlue;
  return Colors.accent;
}

export function MatchCard({ item, rank, onJoin }: Props) {
  const reRate = 80 + (item.user.travelCount % 15);
  const accentColor = matchColor(item.matchRate);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => router.push(`/mate/${item.user.id}`)}
    >
      {/* City photo header — match rate badge overlaid top-right */}
      <DestImage
        dest={item.trip.destination}
        style={styles.banner}
        radius={0}
        scrim="even"
        align="flex-start"
      >
        <View style={styles.badgeRow}>
          <View style={[styles.matchBadge, { backgroundColor: accentColor + 'E6' }]}>
            <Text style={styles.matchBadgeRate}>{item.matchRate}%</Text>
            <Text style={styles.matchBadgeLabel}>매칭</Text>
          </View>
        </View>
      </DestImage>

      {/* Thin accent line — color encodes match quality tier */}
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />

      {/* Card content */}
      <View style={styles.inner}>
        {/* Top row: avatar + info */}
        <View style={styles.cardTop}>
          <View style={styles.avatarWrap}>
            <Avatar nickname={item.user.nickname} size={50} />
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
        </View>

        {/* Travel style tags */}
        <View style={styles.tagRow}>
          {item.user.travelStyles.slice(0, 3).map((s) => (
            <StyleTag key={s} label={s} />
          ))}
        </View>

        {/* Footer: trust badges + CTA */}
        <View style={styles.footer}>
          <View style={styles.trustRow}>
            {item.user.isVerified && (
              <View style={styles.badge}>
                <View style={styles.verifiedBadgeDot} />
                <Text style={styles.badgeVerifiedText}>인증</Text>
              </View>
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>재동행 {reRate}%</Text>
            </View>
          </View>

          {onJoin && (
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={(e) => { e.stopPropagation?.(); onJoin(item); }}
              activeOpacity={0.85}
            >
              <Text style={styles.joinBtnText}>동행 신청</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    ...Elevation.md,
  },

  /* Photo banner */
  banner: { height: 88 },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchBadgeRate: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  matchBadgeLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.82)',
  },

  /* Quality accent line */
  accentLine: { height: 2, width: '100%' },

  /* Content area */
  inner: { padding: 16, gap: 12 },

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

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.bgDeep,
  },
  trustRow: { flexDirection: 'row', gap: 6, flexShrink: 1 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.bgDeep,
  },
  badgeText: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary },
  verifiedBadgeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.olive },
  badgeVerifiedText: { fontSize: 10, fontWeight: '600', color: Colors.olive },

  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexShrink: 0,
  },
  joinBtnText: { fontSize: 12, fontWeight: '600', color: Colors.white },
});
