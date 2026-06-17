import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Elevation, Radius, Space } from '../../constants/colors';
import { ArrowLeftIcon, EditIcon, CompassIcon } from '../../components/ui/Icon';
import { DestImage } from '../../components/ui/DestImage';
import { useTrips } from '../../context/TripsContext';

const AIRPORT_CODES: Record<string, string> = {
  '오사카': 'KIX', '도쿄': 'NRT', '방콕': 'BKK', '파리': 'CDG',
  '뉴욕': 'JFK', '발리': 'DPS', '싱가포르': 'SIN', '바르셀로나': 'BCN',
  '런던': 'LHR', '로마': 'FCO', '프라하': 'PRG', '리스본': 'LIS',
  '다낭': 'DAD',
};

function cityOnly(dest: string) { return dest.split(',')[0].trim(); }
function airportFor(dest: string) { return AIRPORT_CODES[cityOnly(dest)] ?? 'INT'; }

function ymdToDots(s: string) {
  if (!s) return '';
  return s.replace(/-/g, '.');
}

function nightsFor(startISO: string, endISO: string) {
  if (!startISO || !endISO) return '';
  const n = Math.round((new Date(endISO).getTime() - new Date(startISO).getTime()) / 86400000);
  return n > 0 ? `${n}박 ${n + 1}일` : '';
}

const BG = '#F8F4EF';
const CARD_BG = '#FEFBEF';
const NAVY = Colors.primary;
const NAVY_FAINT = 'rgba(59,81,120,0.10)';
const NAVY_MID = 'rgba(59,81,120,0.22)';

function Barcode() {
  const pattern = [2,1,3,1,2,1,1,3,2,1,1,2,3,1,2,1,1,3,1,2,1,2,3,1,1,2,1,3,2,1,2,1,1,3,1,2,3,1,1,2];
  return (
    <View style={styles.barcodeRow}>
      {pattern.map((w, i) => (
        <View key={i} style={[styles.barcodeBar, { flex: w, backgroundColor: i % 2 === 0 ? 'rgba(42,33,24,0.75)' : 'transparent' }]} />
      ))}
    </View>
  );
}

interface TripDisplay {
  destination: string;
  airportCode: string;
  startDate: string;
  endDate: string;
  duration: string;
  themes: string[];
  companions: string;
  memo: string;
}

function TripContent({ trip }: { trip: TripDisplay }) {
  return (
    <View style={styles.tripWrap}>
      {/* Destination hero — full-bleed city photo */}
      <DestImage
        dest={trip.destination}
        style={styles.heroImg}
        scrim="bottom"
        radius={Radius.lg}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>DESTINATION</Text>
          <Text style={styles.heroCity}>{trip.destination}</Text>
          {trip.duration ? <Text style={styles.heroDuration}>{trip.duration}</Text> : null}
        </View>
      </DestImage>

      <View style={[styles.card, Elevation.md]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderLabel}>BOARDING PASS</Text>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>PLANNED</Text>
          </View>
        </View>

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
          <View style={[styles.routeCol, styles.routeColRight]}>
            <Text style={styles.routeCode}>{trip.airportCode}</Text>
            <Text style={styles.routeCity}>{trip.destination}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>DATE</Text>
            <Text style={styles.infoVal}>{trip.startDate}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>UNTIL</Text>
            <Text style={styles.infoVal}>{trip.endDate}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoVal}>{trip.duration || '–'}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>COMPANION</Text>
            <Text style={styles.infoVal}>{trip.companions}</Text>
          </View>
        </View>

        <View style={styles.perfRow}>
          <View style={styles.perfNotchL} />
          <View style={styles.perfDash} />
          <View style={styles.perfNotchR} />
        </View>

        {trip.themes.length > 0 ? (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsSectionLabel}>TRAVEL STYLE</Text>
            <View style={styles.tagWrap}>
              {trip.themes.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {trip.memo ? (
          <View style={styles.memoSection}>
            <Text style={styles.tagsSectionLabel}>MEMO</Text>
            <Text style={styles.memoText}>"{trip.memo}"</Text>
          </View>
        ) : null}

        <View style={styles.perfRow}>
          <View style={styles.perfNotchL} />
          <View style={styles.perfDash} />
          <View style={styles.perfNotchR} />
        </View>

        <View style={styles.barcodeWrap}>
          <Barcode />
          <Text style={styles.barcodeNum}>TM · {trip.startDate.replace(/\./g, '')} · {trip.airportCode}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>동행 찾는 중</Text>
        </View>
        <Text style={styles.statusSub}>매칭 알림을 켜두면 빠르게 연결돼요</Text>
      </View>

      <TouchableOpacity
        style={styles.matchBtn}
        onPress={() => router.push('/match/loading')}
        activeOpacity={0.87}
      >
        <CompassIcon color={Colors.white} size={16} />
        <Text style={styles.matchBtnText}>동행자 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>아직 등록된 여행 계획이 없어요</Text>
      <Text style={styles.emptyDesc}>계획을 등록하면 보드패스가 여기에 만들어져요</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/trip-plan')} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>+ 여행 계획 등록</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TripDetailScreen() {
  const insets = useSafeAreaInsets();
  const { upcoming, reload } = useTrips();
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const trip: TripDisplay | null = upcoming
    ? {
        destination: upcoming.destination,
        airportCode: airportFor(upcoming.destination),
        startDate: ymdToDots(upcoming.startDate),
        endDate: ymdToDots(upcoming.endDate),
        duration: nightsFor(upcoming.startDate, upcoming.endDate),
        themes: upcoming.themes ?? [],
        companions: upcoming.companions || '미정',
        memo: upcoming.memo ?? '',
      }
    : null;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/profile');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>MY TRIP</Text>
          <Text style={styles.headerTitle}>여행 계획</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/trip-plan')}>
          <EditIcon color={Colors.textMuted} size={17} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {trip ? <TripContent trip={trip} /> : <EmptyState />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 2 },
  headerLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5 },
  headerTitle: { fontSize: 17, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3 },

  scroll: { flex: 1 },
  content: { padding: 20, gap: 14 },

  tripWrap: { gap: Space.md },

  heroImg: { height: 200 },
  heroContent: { gap: Space.xs },
  heroEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 2.5,
    marginBottom: 2,
  },
  heroCity: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: -0.5,
    ...Platform.select({ web: { fontFamily: Font.serif }, native: {} }),
  },
  heroDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: Radius.lg,
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
  cardHeaderLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5 },
  stamp: {
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
    paddingVertical: 10,
  },
  routeCol: { alignItems: 'flex-start', minWidth: 60 },
  routeColRight: { alignItems: 'flex-end' },
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

  perfRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -1 },
  perfNotchL: { width: 16, height: 16, borderRadius: 8, backgroundColor: BG, marginLeft: -8 },
  perfNotchR: { width: 16, height: 16, borderRadius: 8, backgroundColor: BG, marginRight: -8 },
  perfDash: { flex: 1, height: 1, borderStyle: 'dashed', borderTopWidth: 1, borderColor: 'rgba(160,140,60,0.35)' },

  tagsSection: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  tagsSectionLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    backgroundColor: 'rgba(59,81,120,0.07)',
    borderWidth: 1,
    borderColor: NAVY_FAINT,
  },
  tagText: { fontSize: 12, color: NAVY, fontWeight: '400' },

  memoSection: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  memoText: {
    fontSize: 13, color: Colors.textSecondary, fontStyle: 'italic',
    lineHeight: 20, letterSpacing: -0.1,
  },

  barcodeWrap: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  barcodeRow: { flexDirection: 'row', height: 40, width: '100%' },
  barcodeBar: { height: '100%' },
  barcodeNum: {
    fontSize: 9, color: Colors.textMuted, fontWeight: '500',
    letterSpacing: 1.5, textAlign: 'center',
  },

  statusCard: {
    backgroundColor: 'rgba(110,125,98,0.08)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(110,125,98,0.15)',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.olive },
  statusText: { fontSize: 13, fontWeight: '600', color: Colors.olive },
  statusSub: { fontSize: 11, color: Colors.textMuted },

  matchBtn: {
    backgroundColor: NAVY,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  matchBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white, letterSpacing: -0.2 },

  emptyWrap: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  emptyDesc: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
