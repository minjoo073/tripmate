import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Trip } from '../../types';

interface Props {
  trip: Trip;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  accepted?: boolean;
}

export function TripCard({ trip, onAccept, onReject, showActions, accepted }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text style={styles.headingIcon}>🗺</Text>
        <Text style={styles.heading}>여행 일정 공유</Text>
      </View>
      <Text style={styles.title}>{trip.destination} 여행</Text>
      <Text style={styles.date}>📅  {trip.startDate} – {trip.endDate}</Text>
      {trip.schedule?.map((s) => (
        <Text key={s.date} style={styles.scheduleItem}>· {s.date}  {s.activities.join(' · ')}</Text>
      ))}

      {showActions && !accepted && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.8}>
            <Text style={styles.rejectText}>거절</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.8}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardDark,
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    gap: 8,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headingIcon: { fontSize: 14 },
  heading: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.white },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  scheduleItem: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  rejectBtn: {
    flex: 1,
    height: 42,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  rejectText: { fontSize: 13, fontWeight: '600', color: Colors.red },
  acceptBtn: {
    flex: 2,
    height: 42,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  acceptedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  acceptedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green },
  acceptedText: { fontSize: 13, color: Colors.green, fontWeight: '600' },
});
