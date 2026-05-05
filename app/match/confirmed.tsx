import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Avatar } from '../../components/ui/Avatar';
import { mockUsers, mockTrips } from '../../mock/data';

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AnimatedCircle({ rate }: { rate: number }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const anim = new Animated.Value(0);
    anim.addListener(({ value }) => {
      setOffset(CIRCUMFERENCE * (1 - value));
    });
    Animated.timing(anim, { toValue: rate / 100, duration: 1200, useNativeDriver: false }).start();
    return () => anim.removeAllListeners();
  }, [rate]);

  return (
    <Svg width={148} height={148}>
      <Circle cx={74} cy={74} r={RADIUS} stroke="rgba(255,255,255,0.15)" strokeWidth={10} fill="none" />
      <Circle
        cx={74}
        cy={74}
        r={RADIUS}
        stroke={Colors.pointYellow}
        strokeWidth={10}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 74 74)"
      />
    </Svg>
  );
}

export default function ConfirmedScreen() {
  const insets = useSafeAreaInsets();
  const { partnerId, tripId } = useLocalSearchParams<{ partnerId: string; tripId: string }>();

  const partner = mockUsers.find((u) => u.id === partnerId) ?? mockUsers[1];
  const trip = mockTrips.find((t) => t.id === tripId) ?? mockTrips[0];
  const matchRate = 97;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, opacity: fadeAnim }]}>
      <View style={styles.profiles}>
        <Avatar nickname="나" size={64} />
        <View style={styles.gauge}>
          <AnimatedCircle rate={matchRate} />
          <View style={styles.gaugeCenter}>
            <Text style={styles.gaugeRate}>{matchRate}%</Text>
          </View>
        </View>
        <Avatar nickname={partner.nickname} size={64} />
      </View>

      <Text style={styles.title}>동행 확정! 🎉</Text>
      <Text style={styles.subtitle}>{partner.nickname} 님과 함께하는 여행이 확정되었어요</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>TRIP SUMMARY</Text>
        <Text style={styles.summaryItem}>📍 {trip.destination}, {trip.country}</Text>
        <Text style={styles.summaryItem}>📅 {trip.startDate} – {trip.endDate}</Text>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>💛 매칭률 {matchRate}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push('/chat/c1')}
          activeOpacity={0.85}
        >
          <Text style={styles.chatBtnText}>→ 채팅 계속하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')}>
          <Text style={styles.homeBtn}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  profiles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gauge: {
    width: 148,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeRate: { fontSize: 28, fontWeight: '800', color: Colors.pointYellow },
  title: { fontSize: 28, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '700', textAlign: 'center', letterSpacing: 1 },
  summaryItem: { fontSize: 14, color: Colors.white },
  matchBadge: {
    backgroundColor: 'rgba(255,249,215,0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  matchBadgeText: { fontSize: 13, color: Colors.pointYellow, fontWeight: '700' },
  actions: { width: '100%', gap: 12 },
  chatBtn: {
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  homeBtn: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
});
