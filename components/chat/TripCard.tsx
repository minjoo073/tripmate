import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, Elevation, Font, Radius, Space } from '../../constants/colors';
import { DestImage } from '../ui/DestImage';
import { Trip } from '../../types';

interface Props {
  trip: Trip;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  accepted?: boolean;
  isOwn?: boolean;
}

export function TripCard({ trip, onAccept, onReject, showActions, accepted, isOwn }: Props) {
  return (
    // Outer wrapper carries the shadow — no overflow:hidden so shadow isn't clipped
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperPartner]}>
      {/* Inner clip gives the image and content their rounded corners */}
      <View style={styles.innerClip}>
        <DestImage
          dest={trip.destination}
          width={600}
          scrim="bottom"
          radius={0}
          style={styles.image}
          align="flex-start"
        >
          {/* Full-height flex container: top label ↔ bottom content */}
          <View style={styles.imageContent}>
            {/* Top: heading pill — glass-style tag */}
            <View style={[styles.headingPill, isOwn ? styles.headingPillOwn : styles.headingPillPartner]}>
              <Text style={styles.headingIcon}>🗺</Text>
              <Text style={styles.heading}>{isOwn ? '내 일정 공유' : '여행 일정 공유'}</Text>
            </View>

            {/* Bottom: sits on the darkest part of the bottom scrim */}
            <View style={styles.bottomContent}>
              <Text style={styles.title} numberOfLines={1}>
                {trip.destination} 여행
              </Text>
              <Text style={styles.date}>📅  {trip.startDate} – {trip.endDate}</Text>
              {trip.schedule?.slice(0, 2).map((s) => (
                <Text key={s.date} style={styles.scheduleItem} numberOfLines={1}>
                  · {s.date}  {s.activities.join(' · ')}
                </Text>
              ))}
            </View>
          </View>
        </DestImage>

        {showActions && !accepted && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.85}>
              <Text style={styles.rejectText}>거절</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.85}>
              <Text style={styles.acceptText}>동행 수락</Text>
            </TouchableOpacity>
          </View>
        )}

        {accepted && (
          <View style={styles.acceptedRow}>
            <View style={styles.acceptedDot} />
            <Text style={styles.acceptedText}>동행 수락 완료</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    marginVertical: Space.sm,
    backgroundColor: Colors.card,
    ...Elevation.md,
  },
  wrapperOwn: {
    borderWidth: 1.5,
    borderColor: 'rgba(59,81,120,0.22)',
  },
  wrapperPartner: {
    borderWidth: 0,
  },
  innerClip: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  image: {
    height: 164,
  },
  imageContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  headingPillOwn: {
    backgroundColor: 'rgba(59,81,120,0.60)',
  },
  headingPillPartner: {
    backgroundColor: 'rgba(28,63,79,0.60)',
  },
  headingIcon: { fontSize: 12 },
  heading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.5,
  },
  bottomContent: { gap: 3 },
  title: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif }, default: {} }),
  },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.80)' },
  scheduleItem: { fontSize: 11, color: 'rgba(255,255,255,0.60)', lineHeight: 18 },

  actions: {
    flexDirection: 'row',
    gap: Space.md,
    padding: Space.md,
    backgroundColor: Colors.card,
  },
  rejectBtn: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  rejectText: { fontSize: 13, fontWeight: '600', color: Colors.red },
  acceptBtn: {
    flex: 2,
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.primary,
  },
  acceptText: { fontSize: 14, fontWeight: '700', color: Colors.white },

  acceptedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.md,
    backgroundColor: Colors.card,
  },
  acceptedDot: { width: 7, height: 7, borderRadius: Radius.pill, backgroundColor: Colors.green },
  acceptedText: { fontSize: 13, color: Colors.green, fontWeight: '600' },
});
