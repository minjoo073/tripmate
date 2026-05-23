import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/colors';
import { HeartIcon, MessageIcon, MapPinIcon } from '../ui/Icon';
import { StyleTag } from '../ui/StyleTag';

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

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.72}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      {/* Category dot + label + time */}
      <View style={styles.topRow}>
        <View style={[styles.catDot, { backgroundColor: cat.dotColor }]} />
        <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      {/* Location + date */}
      {(destination || (isMatePost && item.trip)) ? (
        <View style={styles.metaRow}>
          {destination ? (
            <>
              <MapPinIcon color={Colors.textMuted} size={10} />
              <Text style={styles.metaText}>{destination}</Text>
            </>
          ) : null}
          {isMatePost && item.trip && (
            <Text style={styles.metaDate}>
              {destination ? ' · ' : ''}{item.trip.startDate} – {item.trip.endDate}
            </Text>
          )}
        </View>
      ) : null}

      {/* Travel style tags */}
      {item.travelStyles.length > 0 && (
        <View style={styles.tagRow}>
          {item.travelStyles.slice(0, 3).map((s) => (
            <StyleTag key={s} label={s} />
          ))}
        </View>
      )}

      {/* Footer: author + stats */}
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
  row: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    gap: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    gap: 5,
    flexShrink: 0,
  },
  stat: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 3,
  },
});
