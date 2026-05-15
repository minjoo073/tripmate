import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutChangeEvent, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon, Circle, Line, Rect, G, Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { ArrowLeftIcon } from '../../components/ui/Icon';

function pin(lon: number, lat: number) {
  return { x: lon + 180, y: 90 - lat };
}

const OCEAN  = '#D4DFEC';
const LAND   = '#EDE8DF';
const BORDER = '#CFC8BA';
const GRID   = 'rgba(255,255,255,0.32)';

const CONTINENTS = [
  '15,22 40,18 62,17 82,15 103,15 122,26 130,44 120,47 110,64 93,74 72,69 60,56 55,40 40,30',
  '110,64 116,68 120,72 115,74 110,72 107,67',
  '100,76 122,75 136,87 145,94 148,101 143,113 130,129 115,145 112,145 107,137 103,126 100,94',
  '170,54 186,47 196,46 212,45 222,48 220,20 205,18 190,20 182,28 178,38',
  '148,10 163,8 172,14 168,24 154,26 142,22 142,14',
  '163,75 196,74 224,78 233,78 226,88 229,103 220,119 210,125 196,125 193,118 191,108 190,90 190,83 180,85',
  '222,48 220,18 240,18 280,22 310,24 340,22 340,30 320,42 307,52 295,64 290,68 285,80 284,88 268,84 260,82 255,90 260,82 252,68 246,74 236,78 224,78 218,66 216,54',
  '318,48 322,50 320,56 316,58 313,55 314,50',
  '294,112 308,108 317,102 324,108 333,118 330,128 325,130 316,125 304,125 296,124',
  '344,126 347,124 348,130 345,132',
];

const CITIES = [
  // Thailand 2024
  { city: '치앙마이',   country: '태국',      flag: '🇹🇭', count: 1, lon:  98.98, lat: 18.79, startDate: '2024.12.19', endDate: '2024.12.26' },
  // Spain 2024
  { city: '세비야',     country: '스페인',    flag: '🇪🇸', count: 1, lon:  -5.99, lat: 37.39, startDate: '2024.03.08', endDate: '2024.03.12' },
  { city: '마드리드',   country: '스페인',    flag: '🇪🇸', count: 1, lon:  -3.70, lat: 40.42, startDate: '2024.03.05', endDate: '2024.03.08' },
  { city: '바르셀로나', country: '스페인',    flag: '🇪🇸', count: 1, lon:   2.15, lat: 41.39, startDate: '2024.03.01', endDate: '2024.03.05' },
  // Vietnam 2024
  { city: '호치민',     country: '베트남',    flag: '🇻🇳', count: 1, lon: 106.63, lat: 10.82, startDate: '2024.01.08', endDate: '2024.01.12' },
  { city: '나트랑',     country: '베트남',    flag: '🇻🇳', count: 1, lon: 109.19, lat: 12.24, startDate: '2024.01.05', endDate: '2024.01.08' },
  { city: '다낭',       country: '베트남',    flag: '🇻🇳', count: 1, lon: 108.22, lat: 16.05, startDate: '2024.01.02', endDate: '2024.01.05' },
  // Central Europe 2023
  { city: '부다페스트', country: '헝가리',    flag: '🇭🇺', count: 1, lon:  19.04, lat: 47.50, startDate: '2023.05.14', endDate: '2023.05.18' },
  { city: '빈',         country: '오스트리아',flag: '🇦🇹', count: 1, lon:  16.37, lat: 48.21, startDate: '2023.05.11', endDate: '2023.05.14' },
  { city: '프라하',     country: '체코',      flag: '🇨🇿', count: 1, lon:  14.44, lat: 50.08, startDate: '2023.05.08', endDate: '2023.05.11' },
  // France 2023
  { city: '파리',       country: '프랑스',    flag: '🇫🇷', count: 1, lon:   2.35, lat: 48.85, startDate: '2023.04.05', endDate: '2023.04.10' },
  // Italy + Malta 2022
  { city: '몰타',       country: '몰타',      flag: '🇲🇹', count: 1, lon:  14.51, lat: 35.90, startDate: '2022.07.01', endDate: '2022.07.05' },
  { city: '로마',       country: '이탈리아',  flag: '🇮🇹', count: 1, lon:  12.50, lat: 41.90, startDate: '2022.06.12', endDate: '2022.06.16' },
  { city: '밀라노',     country: '이탈리아',  flag: '🇮🇹', count: 1, lon:   9.19, lat: 45.47, startDate: '2022.06.09', endDate: '2022.06.12' },
  // China 2021
  { city: '칭다오',     country: '중국',      flag: '🇨🇳', count: 1, lon: 120.38, lat: 36.07, startDate: '2021.08.04', endDate: '2021.08.09' },
];

const STATS = [
  { value: '10', label: '개국' },
  { value: '15', label: '도시' },
  { value: '15', label: '회 여행' },
  { value: '2',  label: '예정' },
];

export default function RouteArchiveScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string | null>(null);
  const [mapW, setMapW] = useState(0);
  const mapH = mapW > 0 ? Math.round(mapW * 0.52) : 0;

  function onMapLayout(e: LayoutChangeEvent) {
    setMapW(e.nativeEvent.layout.width);
  }

  const activeCity = CITIES.find((c) => c.city === active) ?? null;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)/profile')}
        >
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>ROUTE ARCHIVE</Text>
          <Text style={styles.headerTitle}>내 여행 지도</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.mapCard} onLayout={onMapLayout}>
          {mapW > 0 && (
            <Svg width={mapW} height={mapH} viewBox="0 0 360 180">
              <Rect x={0} y={0} width={360} height={180} fill={OCEAN} />

              {/* Grid */}
              <Line x1={0}   y1={90}    x2={360} y2={90}    stroke={GRID} strokeWidth={0.6} />
              <Line x1={180} y1={0}     x2={180} y2={180}   stroke={GRID} strokeWidth={0.6} />
              <Line x1={0}   y1={66.5}  x2={360} y2={66.5}  stroke={GRID} strokeWidth={0.3} strokeDasharray="3 5" />
              <Line x1={0}   y1={113.5} x2={360} y2={113.5} stroke={GRID} strokeWidth={0.3} strokeDasharray="3 5" />
              <Line x1={90}  y1={0}     x2={90}  y2={180}   stroke={GRID} strokeWidth={0.3} />
              <Line x1={270} y1={0}     x2={270} y2={180}   stroke={GRID} strokeWidth={0.3} />

              {/* Continents */}
              {CONTINENTS.map((pts, i) => (
                <Polygon key={i} points={pts} fill={LAND} stroke={BORDER} strokeWidth={0.55} />
              ))}

              {/* City pins — clean teardrop shape */}
              {CITIES.map((c) => {
                const p = pin(c.lon, c.lat);
                const isActive = active === c.city;
                const color = isActive ? Colors.primary : Colors.accent;
                const r = isActive ? 4 : 2.8;
                const offset = isActive ? 5 : 3.5;
                return (
                  <G key={c.city}>
                    {/* Circle head */}
                    <Circle
                      cx={p.x} cy={p.y - offset} r={r}
                      fill={color} stroke="white" strokeWidth={0.8}
                    />
                    {/* Triangle tail */}
                    <Path
                      d={`M ${p.x - r * 0.65},${p.y - offset + r * 0.6}
                          L ${p.x + r * 0.65},${p.y - offset + r * 0.6}
                          L ${p.x},${p.y + r * 0.5} Z`}
                      fill={color}
                    />
                    {/* Inner dot (selected only) */}
                    {isActive && (
                      <Circle cx={p.x} cy={p.y - offset} r={1.5} fill="white" opacity={0.95} />
                    )}
                  </G>
                );
              })}
            </Svg>
          )}

          {/* Legend */}
          <View style={styles.mapLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>방문한 도시</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* City list */}
        <Text style={styles.sectionLabel}>방문한 도시</Text>
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c.city}
            style={[styles.cityCard, active === c.city && styles.cityCardActive]}
            onPress={() => setActive(active === c.city ? null : c.city)}
            activeOpacity={0.82}
          >
            <Text style={styles.cityFlag}>{c.flag}</Text>
            <View style={styles.cityInfo}>
              <View style={styles.cityRow}>
                <Text style={styles.cityName}>{c.city}</Text>
                <Text style={styles.citySub}>{c.country}</Text>
              </View>
              <Text style={styles.cityMeta}>{c.startDate} – {c.endDate}</Text>
            </View>
            <View style={[styles.countBadge, active === c.city && styles.countBadgeActive]}>
              <Text style={[styles.countText, active === c.city && styles.countTextActive]}>
                {c.count}회
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* City popup — full overlay modal */}
      {activeCity && (
        <Pressable style={styles.popupOverlay} onPress={() => setActive(null)}>
          <Pressable style={styles.popupCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.popupFlag}>{activeCity.flag}</Text>
            <Text style={styles.popupCity}>{activeCity.city}</Text>
            <Text style={styles.popupCountry}>{activeCity.country}</Text>
            <View style={styles.popupDivider} />
            <View style={styles.popupRow}>
              <View style={styles.popupStat}>
                <Text style={styles.popupStatValue}>{activeCity.count}회</Text>
                <Text style={styles.popupStatLabel}>방문</Text>
              </View>
              <View style={styles.popupStatDivider} />
              <View style={styles.popupStat}>
                <Text style={styles.popupStatValue}>{activeCity.startDate}</Text>
                <Text style={styles.popupStatValue}>– {activeCity.endDate}</Text>
                <Text style={styles.popupStatLabel}>여행 기간</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.popupClose} onPress={() => setActive(null)}>
              <Text style={styles.popupCloseText}>닫기</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 2 },
  headerLabel: {
    fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5,
  },
  headerTitle: {
    fontSize: 17, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3,
  },
  headerRight: { width: 36 },

  scroll: { flex: 1 },
  content: { paddingTop: 20, paddingHorizontal: 20 },

  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: 'rgba(42,33,24,0.07)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 2,
    position: 'relative',
  },

  mapLegend: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  legendDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.accent },
  legendText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: { fontSize: 21, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12,
  },

  cityCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cityCardActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  cityFlag: { fontSize: 26 },
  cityInfo: { flex: 1, gap: 3 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cityName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  citySub: { fontSize: 11, color: Colors.textMuted },
  cityMeta: { fontSize: 11, color: Colors.textMuted },
  countBadge: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  countBadgeActive: { backgroundColor: Colors.accent },
  countText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  countTextActive: { color: Colors.white },

  // Popup modal
  popupOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,16,12,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: 6,
    minWidth: 220,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
  popupFlag: { fontSize: 44, marginBottom: 4 },
  popupCity: {
    fontSize: 26, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.5,
  },
  popupCountry: { fontSize: 13, color: Colors.textMuted, fontWeight: '400' },
  popupDivider: {
    width: 32, height: 1, backgroundColor: Colors.cardBorder, marginVertical: 12,
  },
  popupRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  popupStat: { alignItems: 'center', gap: 3, paddingHorizontal: 20 },
  popupStatValue: {
    fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3,
  },
  popupStatLabel: { fontSize: 10, color: Colors.textMuted },
  popupStatDivider: { width: 1, height: 28, backgroundColor: Colors.cardBorder },
  popupClose: {
    marginTop: 20,
    backgroundColor: Colors.bgDeep,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 9,
  },
  popupCloseText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
});
