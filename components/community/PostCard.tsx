import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { HeartIcon, MessageIcon, MapPinIcon } from '../ui/Icon';

interface Props {
  item: Post;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  all:    { label: '동행 찾기', color: Colors.primary, bg: Colors.primaryLight },
  mate:   { label: '동행 찾기', color: Colors.primary, bg: Colors.primaryLight },
  tips:   { label: '여행 기록', color: Colors.accent,  bg: Colors.accentLight  },
  review: { label: '로컬 추천', color: Colors.olive,   bg: '#EBF0E6'           },
};

const CITY_COORDS: Record<string, string> = {
  '오사카': '34°N · 135°E',
  '도쿄':   '35°N · 139°E',
  '방콕':   '13°N · 100°E',
  '파리':   '48°N · 002°E',
  '뉴욕':   '40°N · 073°W',
  '바르셀로나': '41°N · 002°E',
};

export function PostCard({ item }: Props) {
  const time = new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  const cat = CATEGORY_LABELS[item.category ?? 'all'] ?? CATEGORY_LABELS['all'];
  const destination = item.trip?.destination ?? '';
  const coords = CITY_COORDS[destination] ?? null;
  const isMatePost = item.category === 'mate';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      {/* Top: category + date */}
      <View style={styles.topRow}>
        <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
          <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      {/* Content */}
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>

      {/* Destination with coords — shown when trip data exists */}
      {destination ? (
        <View style={styles.destRow}>
          <MapPinIcon color={Colors.textMuted} size={11} />
          <Text style={styles.destText}>{destination}</Text>
          {coords && <Text style={styles.coords}>{coords}</Text>}
        </View>
      ) : null}

      {/* Companion post: show trip date range */}
      {isMatePost && item.trip && (
        <View style={styles.tripDateRow}>
          <Text style={styles.tripDate}>
            {item.trip.startDate} – {item.trip.endDate}
          </Text>
        </View>
      )}

      {/* Tags */}
      {item.travelStyles.length > 0 && (
        <View style={styles.tagRow}>
          {item.travelStyles.slice(0, 3).map((s) => (
            <View key={s} style={styles.tag}>
              <Text style={styles.tagText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <Avatar nickname={item.author.nickname} size={22} />
          <Text style={styles.authorName}>{item.author.nickname}</Text>
          <Text style={styles.authorLocation}>{item.author.location}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <HeartIcon color={Colors.textMuted} size={12} />
            <Text style={styles.stat}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageIcon color={Colors.textMuted} size={12} />
            <Text style={styles.stat}>{item.comments}</Text>
          </View>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  content: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '400',
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  destText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  coords: {
    fontSize: 10,
    color: Colors.textMuted,
    opacity: 0.6,
    letterSpacing: 0.3,
  },
  tripDateRow: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  tripDate: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    letterSpacing: 0.2,
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
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  authorLocation: {
    fontSize: 11,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  statsRow: { flexDirection: 'row', gap: 12, flexShrink: 0 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stat: { fontSize: 11, color: Colors.textMuted },
});
