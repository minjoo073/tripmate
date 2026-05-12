import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { mockUsers, mockTrips } from '../../../mock/data';

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AnimatedCircle({ rate }: { rate: number }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const anim = new Animated.Value(0);
    anim.addListener(({ value }) => {
      setOffset(CIRCUMFERENCE * (1 - value));
    });
    Animated.timing(anim, { toValue: rate / 100, duration: 1400, useNativeDriver: false }).start();
    return () => anim.removeAllListeners();
  }, [rate]);

  return (
    <Svg width={140} height={140}>
      <Circle cx={70} cy={70} r={RADIUS} stroke="rgba(255,255,255,0.10)" strokeWidth={8} fill="none" />
      <Circle
        cx={70}
        cy={70}
        r={RADIUS}
        stroke={Colors.warm}
        strokeWidth={8}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
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
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.labelWrap}>
        <Text style={styles.labelText}>MATCH CONFIRMED</Text>
      </View>

      <View style={styles.profiles}>
        <Avatar nickname="나" size={64} variant="light" />
        <View style={styles.gauge}>
          <AnimatedCircle rate={matchRate} />
          <View style={styles.gaugeCenter}>
            <Text style={styles.gaugeRate}>{matchRate}%</Text>
          </View>
        </View>
        <Avatar nickname={partner.nickname} size={64} variant="light" />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>동행 확정! 🎉</Text>
        <Text style={styles.subtitle}>{partner.nickname} 님과 함께하는{'\n'}여행이 확정되었어요</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>TRIP SUMMARY</Text>
        <View style={styles.summaryDivider} />
        <Text style={styles.summaryItem}>📍  {trip.destination}, {trip.country}</Text>
        <Text style={styles.summaryItem}>📅  {trip.startDate} – {trip.endDate}</Text>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>매칭률 {matchRate}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push('/chat/c1')}
          activeOpacity={0.85}
        >
          <Text style={styles.chatBtnText}>채팅 시작하기 →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')} activeOpacity={0.7}>
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
    padding: 28,
    gap: 24,
  },
  labelWrap: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  labelText: {
    fontSize: 10,
    color: Colors.warm,
    fontWeight: '700',
    letterSpacing: 2,
  },
  profiles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  gauge: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeRate: { fontSize: 26, fontWeight: '800', color: Colors.warm },
  textWrap: { alignItems: 'center', gap: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 22 },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  summaryItem: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  matchBadge: {
    backgroundColor: 'rgba(248,214,109,0.15)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(248,214,109,0.3)',
  },
  matchBadgeText: { fontSize: 13, color: Colors.warm, fontWeight: '700' },
  actions: { width: '100%', gap: 14 },
  chatBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  homeBtn: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
});
