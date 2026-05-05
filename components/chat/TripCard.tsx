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
      <Text style={styles.heading}>🗺  여행 일정 공유</Text>
      <Text style={styles.title}>{trip.destination} 여행</Text>
      <Text style={styles.date}>📅 {trip.startDate} ~ {trip.endDate}</Text>
      {trip.schedule?.map((s) => (
        <Text key={s.date} style={styles.scheduleItem}>• {s.date} {s.activities.join(' · ')}</Text>
      ))}

      {showActions && !accepted && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
            <Text style={styles.rejectText}>✕  거절</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.acceptText}>✓  동행 수락</Text>
          </TouchableOpacity>
        </View>
      )}

      {accepted && (
        <View style={styles.acceptedRow}>
          <View style={styles.acceptedDot} />
          <Text style={styles.acceptedText}>동행 수락 완료!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    gap: 6,
  },
  heading: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  title: { fontSize: 15, fontWeight: '700', color: Colors.white },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  scheduleItem: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  rejectBtn: { flex: 1, height: 40, backgroundColor: 'rgba(239,68,68,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.red },
  rejectText: { fontSize: 13, fontWeight: '600', color: Colors.red },
  acceptBtn: { flex: 1, height: 40, backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.green },
  acceptText: { fontSize: 13, fontWeight: '600', color: Colors.green },
  acceptedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  acceptedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green },
  acceptedText: { fontSize: 13, color: Colors.green, fontWeight: '600' },
});
