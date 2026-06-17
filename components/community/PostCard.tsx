import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors, Elevation, Radius, Space, Font } from '../../constants/colors';
import { HeartIcon, MessageIcon, MapPinIcon } from '../ui/Icon';
import { StyleTag } from '../ui/StyleTag';
import { DestImage } from '../ui/DestImage';

interface Props {
  item: Post;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string; dotColor: string }> = {
  all:    { label: '동행 찾기', color: Colors.accent,   dotColor: Colors.accent },
  mate:   { label: '동행 찾기', color: Colors.accent,   dotColor: Colors.accent },
  tips:   { label: '여행 기록', color: Colors.dustBlue, dotColor: Colors.dustBlue },
  review: { label: '로컬 추천', color: Colors.olive,    dotColor: Colors.olive },
};

export function PostCard({ item }: Props) {
  const time = new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  const cat = CATEGORY_LABELS[item.category ?? 'all'] ?? CATEGORY_LABELS['all'];
  const destination = item.trip?.destination ?? '';
  const isMatePost = item.category === 'mate';
  const hasDestination = destination.length > 0;

  // Mate posts get a large hero image; tip/review posts get a right-rail thumbnail
  if (isMatePost && hasDestination) {
    return (
      <TouchableOpacity
        style={[styles.mateCard, Elevation.md]}
        activeOpacity={0.87}
        onPress={() => router.push(`/post/${item.id}`)}
      >
        <DestImage
          dest={destination}
          style={styles.mateImage}
          scrim="bottom"
          radius={0}
        >
          {/* Top row: category + time */}
          <View style={styles.mateTopRow} />
        </DestImage>

        {/* Overlay badges on image */}
        <View style={styles.mateImageBadges}>
          <View style={styles.mateCatBadge}>
            <View style={[styles.catDot, { backgroundColor: 'rgba(255,255,255,0.9)' }]} />
            <Text style={styles.mateCatText}>{cat.label}</Text>
          </View>
          <Text style={styles.mateTimeOnImg}>{time}</Text>
        </View>

        {/* Text body below image */}
        <View style={styles.mateBody}>
          <Text style={styles.mateTitle} numberOfLines={2}>{item.title}</Text>

          {item.trip && (
            <View style={styles.metaRow}>
              <MapPinIcon color={Colors.textMuted} size={10} />
              <Text style={styles.metaText}>{destination}</Text>
              <Text style={styles.metaDate}> · {item.trip.startDate} – {item.trip.endDate}</Text>
            </View>
          )}

          {item.travelStyles.length > 0 && (
            <View style={styles.tagRow}>
              {item.travelStyles.slice(0, 3).map((s) => (
                <StyleTag key={s} label={s} />
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.authorRow}>
              <Avatar nickname={item.author.nickname} size={18} />
              <Text style={styles.authorName}>{item.author.nickname}</Text>
              {item.author.location ? (
                <Text style={styles.authorMeta}> · {item.author.location}</Text>
              ) : null}
            </View>
            <View style={styles.statsRow}>
              <HeartIcon color={Colors.textMuted} size={11} />
              <Text style={styles.stat}>{item.likes}</Text>
              <MessageIcon color={Colors.textMuted} size={11} />
              <Text style={styles.stat}>{item.comments}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Tips / review posts with destination: text-left + right thumbnail
  if (!isMatePost && hasDestination) {
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.87}
        onPress={() => router.push(`/post/${item.id}`)}
      >
        <View style={styles.rowInner}>
          {/* Left: all text */}
          <View style={styles.rowLeft}>
            {/* Category dot + label + time */}
            <View style={styles.topRow}>
              <View style={[styles.catDot, { backgroundColor: cat.dotColor }]} />
              <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

            <View style={styles.metaRow}>
              <MapPinIcon color={Colors.textMuted} size={10} />
              <Text style={styles.metaText}>{destination}</Text>
            </View>

            {item.travelStyles.length > 0 && (
              <View style={styles.tagRow}>
                {item.travelStyles.slice(0, 2).map((s) => (
                  <StyleTag key={s} label={s} />
                ))}
              </View>
            )}
          </View>

          {/* Right: thumbnail */}
          <DestImage
            dest={destination}
            style={styles.thumbnail}
            scrim="none"
            radius={Radius.sm}
          />
        </View>

        {/* Footer below */}
        <View style={styles.footer}>
          <View style={styles.authorRow}>
            <Avatar nickname={item.author.nickname} size={18} />
            <Text style={styles.authorName}>{item.author.nickname}</Text>
            {item.author.location ? (
              <Text style={styles.authorMeta}> · {item.author.location}</Text>
            ) : null}
          </View>
          <View style={styles.statsRow}>
            <HeartIcon color={Colors.textMuted} size={11} />
            <Text style={styles.stat}>{item.likes}</Text>
            <MessageIcon color={Colors.textMuted} size={11} />
            <Text style={styles.stat}>{item.comments}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // No destination: text-only layout
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.87}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <View style={styles.topRow}>
        <View style={[styles.catDot, { backgroundColor: cat.dotColor }]} />
        <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      {isMatePost && item.trip && (
        <View style={styles.metaRow}>
          <Text style={styles.metaDate}>{item.trip.startDate} – {item.trip.endDate}</Text>
        </View>
      )}

      {item.travelStyles.length > 0 && (
        <View style={styles.tagRow}>
          {item.travelStyles.slice(0, 3).map((s) => (
            <StyleTag key={s} label={s} />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <Avatar nickname={item.author.nickname} size={18} />
          <Text style={styles.authorName}>{item.author.nickname}</Text>
          {item.author.location ? (
            <Text style={styles.authorMeta}> · {item.author.location}</Text>
          ) : null}
        </View>
        <View style={styles.statsRow}>
          <HeartIcon color={Colors.textMuted} size={11} />
          <Text style={styles.stat}>{item.likes}</Text>
          <MessageIcon color={Colors.textMuted} size={11} />
          <Text style={styles.stat}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ── Text-only / text+thumbnail shared row ────────────────────────────────
  row: {
    paddingVertical: Space.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: Space.sm + 1,
  },
  rowInner: {
    flexDirection: 'row',
    gap: Space.md,
    alignItems: 'flex-start',
  },
  rowLeft: {
    flex: 1,
    gap: Space.sm,
  },
  thumbnail: {
    width: 88,
    height: 88,
    flexShrink: 0,
  },

  // ── Shared text elements ──────────────────────────────────────────────────
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm - 2,
  },
  catDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  catText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 23,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif, fontWeight: '400' } }),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  metaDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.xs + 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Space.xs - 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs + 1,
    flex: 1,
    minWidth: 0,
  },
  authorName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  authorMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs + 1,
    flexShrink: 0,
  },
  stat: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 3,
  },

  // ── Mate card (full-bleed image) ──────────────────────────────────────────
  mateCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.card,
    marginBottom: Space.lg,
  },
  mateImage: {
    height: 180,
    borderRadius: 0,
  },
  mateImageBadges: {
    position: 'absolute',
    top: Space.md,
    left: Space.md,
    right: Space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mateTopRow: { flex: 1 },
  mateCatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    backgroundColor: 'rgba(16,24,38,0.45)',
    borderRadius: Radius.pill,
    paddingHorizontal: Space.sm,
    paddingVertical: Space.xs,
  },
  mateCatText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  mateTimeOnImg: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  mateBody: {
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
    gap: Space.sm,
  },
  mateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 23,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif, fontWeight: '400' } }),
  },
});
