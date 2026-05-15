import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { mockUsers, mockTrips } from '../../../mock/data';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AIRPORT_CODES: Record<string, string> = {
  '오사카': 'KIX', '도쿄': 'NRT', '파리': 'CDG', '바르셀로나': 'BCN',
  '방콕': 'BKK', '하노이': 'HAN', '제주': 'CJU', '뉴욕': 'JFK',
  '런던': 'LHR', '로마': 'FCO', '프라하': 'PRG', '리스본': 'LIS',
};

function Barcode() {
  const pattern = [2,1,3,1,2,1,1,3,2,1,1,2,3,1,2,1,1,3,1,2,1,2,3,1,1,2,1,3,2,1,2,1,1,3,1,2,3,1,1,2,1,3,1,1,2,3,1,2,1,3,2,1,1,2,3,1,2,1,1,3];
  return (
    <View style={{ flexDirection: 'row', height: 48, width: '100%' }}>
      {pattern.map((w, i) => (
        <View
          key={i}
          style={{
            flex: w,
            backgroundColor: i % 2 === 0 ? 'rgba(42,33,24,0.80)' : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

const TRAVEL_VIBES = [
  '여행 스타일이 잘 맞아요',
  '같이 다니면 잘 맞을 것 같아요',
  '이번 여행, 혼자보다 좋을지도',
  '로컬 여행 취향이 닮아있어요',
  '같은 속도로 여행하는 사람이에요',
];

const BG = '#FFF9D7';
const NAVY = Colors.primary;        // #3B5178
const NAVY_FAINT = 'rgba(59,81,120,0.10)';
const NAVY_MID = 'rgba(59,81,120,0.25)';

function TravelRing({ rate }: { rate: number }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const anim = new Animated.Value(0);
    anim.addListener(({ value }) => {
      setOffset(CIRCUMFERENCE * (1 - value));
    });
    Animated.timing(anim, {
      toValue: rate / 100,
      duration: 1800,
      useNativeDriver: false,
    }).start();
    return () => anim.removeAllListeners();
  }, [rate]);

  return (
    <Svg width={128} height={128}>
      <Circle cx={64} cy={64} r={RADIUS} stroke={NAVY_FAINT} strokeWidth={1.5} fill="none" />
      <Circle
        cx={64} cy={64} r={RADIUS}
        stroke={NAVY}
        strokeWidth={2}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
      />
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const x1 = 64 + (RADIUS - 8) * Math.cos(rad);
        const y1 = 64 + (RADIUS - 8) * Math.sin(rad);
        const x2 = 64 + (RADIUS - 4) * Math.cos(rad);
        const y2 = 64 + (RADIUS - 4) * Math.sin(rad);
        return <Line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={NAVY_MID} strokeWidth={1} />;
      })}
    </Svg>
  );
}

export default function ConfirmedScreen() {
  const insets = useSafeAreaInsets();
  const { partnerId, tripId } = useLocalSearchParams<{ partnerId: string; tripId: string }>();

  const partner = mockUsers.find((u) => u.id === partnerId) ?? mockUsers[1];
  const trip = mockTrips.find((t) => t.id === tripId) ?? mockTrips[0];
  const matchRate = 97;
  const vibe = TRAVEL_VIBES[matchRate % TRAVEL_VIBES.length];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        { opacity: fadeAnim },
      ]}
    >
      {/* Top label */}
      <View style={styles.topLabel}>
        <View style={styles.topLabelDot} />
        <Text style={styles.topLabelText}>TRAVEL MATCH</Text>
        <View style={styles.topLabelDot} />
      </View>

      {/* Ring + Avatars */}
      <Animated.View style={[styles.profileWrap, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.avatarSide}>
          <Avatar nickname="나" size={58} />
          <Text style={styles.avatarLabel}>나</Text>
        </View>
        <View style={styles.ringWrap}>
          <TravelRing rate={matchRate} />
          <View style={styles.ringCenter}>
            <Text style={styles.ringRate}>{matchRate}<Text style={styles.ringUnit}>%</Text></Text>
          </View>
        </View>
        <View style={styles.avatarSide}>
          <Avatar nickname={partner.nickname} size={58} />
          <Text style={styles.avatarLabel}>{partner.nickname}</Text>
        </View>
      </Animated.View>

      {/* Boarding Pass card */}
      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderLabel}>BOARDING PASS</Text>
          <View style={styles.stampWrap}>
            <Text style={styles.stampText}>CONFIRMED</Text>
          </View>
        </View>

        {/* Route: ICN → KIX */}
        <View style={styles.routeRow}>
          <View style={styles.routeCol}>
            <Text style={styles.routeCode}>ICN</Text>
            <Text style={styles.routeCity}>서울</Text>
          </View>
          <View style={styles.routeMiddle}>
            <View style={styles.routeLine} />
            <Text style={styles.routePlane}>✈</Text>
            <View style={styles.routeLine} />
          </View>
          <View style={[styles.routeCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.routeCode}>{AIRPORT_CODES[trip.destination] ?? 'INT'}</Text>
            <Text style={styles.routeCity}>{trip.destination}</Text>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>DATE</Text>
            <Text style={styles.infoVal}>{trip.startDate?.replace(/-/g, '.')}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>UNTIL</Text>
            <Text style={styles.infoVal}>{trip.endDate?.replace(/-/g, '.')}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>PASSENGER</Text>
            <Text style={styles.infoVal}>{partner.nickname}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>MATCH</Text>
            <Text style={styles.infoVal}>{matchRate}%</Text>
          </View>
        </View>

        {/* Perforated divider */}
        <View style={styles.perfRow}>
          <View style={styles.perfNotchL} />
          <View style={styles.perfDash} />
          <View style={styles.perfNotchR} />
        </View>

        {/* Barcode */}
        <View style={styles.barcodeWrap}>
          <Barcode />
          <Text style={styles.barcodeNum}>TM · {trip.startDate?.replace(/-/g, '')} · {AIRPORT_CODES[trip.destination] ?? 'INT'}</Text>
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[styles.actions, { transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/chat/c1')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>여행 이야기 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')} activeOpacity={0.7}>
          <Text style={styles.secondaryBtn}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 28,
  },

  topLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topLabelDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: NAVY_MID },
  topLabelText: {
    fontSize: 10,
    color: NAVY,
    fontWeight: '700',
    letterSpacing: 4,
    opacity: 0.6,
  },

  profileWrap: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarSide: { alignItems: 'center', gap: 8 },
  avatarLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500', letterSpacing: 0.3 },

  ringWrap: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringRate: { fontSize: 30, fontWeight: '600', color: NAVY, letterSpacing: -1 },
  ringUnit: { fontSize: 13, fontWeight: '400', color: Colors.dustBlue },

  vibeWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14 },
  vibeLine: { flex: 1, height: 1, backgroundColor: NAVY_FAINT },
  vibeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#FEFBEF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(180,160,80,0.28)',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  cardHeaderLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
  },
  stampWrap: {
    borderWidth: 1,
    borderColor: NAVY_MID,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  stampText: { fontSize: 8, color: NAVY, fontWeight: '700', letterSpacing: 1.5, opacity: 0.65 },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  routeCol: { alignItems: 'flex-start', minWidth: 60 },
  routeCode: { fontSize: 28, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -1 },
  routeCity: { fontSize: 10, color: Colors.textMuted, fontWeight: '500', letterSpacing: 0.5, marginTop: 2 },
  routeMiddle: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  routeLine: { flex: 1, height: 1, backgroundColor: NAVY_FAINT },
  routePlane: { fontSize: 16, marginHorizontal: 6, color: Colors.textMuted },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  infoCell: { width: '45%', gap: 3 },
  infoLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.8, textTransform: 'uppercase' },
  infoVal: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.2 },

  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -1,
  },
  perfNotchL: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BG,
    marginLeft: -8,
  },
  perfNotchR: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BG,
    marginRight: -8,
  },
  perfDash: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderColor: 'rgba(160,140,60,0.35)',
  },

  barcodeWrap: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  barcodeNum: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  actions: { width: '100%', gap: 14 },
  primaryBtn: {
    height: 52,
    backgroundColor: NAVY,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white, letterSpacing: -0.1 },
  secondaryBtn: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
