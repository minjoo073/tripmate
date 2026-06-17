import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutChangeEvent, Pressable, Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Elevation, Radius, Space } from '../../constants/colors';
import { DestImage } from '../../components/ui/DestImage';
import { ArrowLeftIcon } from '../../components/ui/Icon';


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

const TRIPS = [
  { year: '2024', flag: '🇹🇭', country: '태국',         cities: ['치앙마이'],                          start: '2024.12.19', end: '2024.12.26' },
  { year: '2024', flag: '🇪🇸', country: '스페인',        cities: ['세비야', '마드리드', '바르셀로나'],   start: '2024.03.01', end: '2024.03.12' },
  { year: '2024', flag: '🇻🇳', country: '베트남',        cities: ['호치민', '나트랑', '다낭'],           start: '2024.01.02', end: '2024.01.12' },
  { year: '2023', flag: '🇭🇺', country: '중앙유럽',      cities: ['부다페스트', '빈', '프라하'],         start: '2023.05.08', end: '2023.05.18' },
  { year: '2023', flag: '🇫🇷', country: '프랑스',        cities: ['파리'],                              start: '2023.04.05', end: '2023.04.10' },
  { year: '2022', flag: '🇮🇹', country: '이탈리아 · 몰타', cities: ['밀라노', '로마', '몰타'],           start: '2022.06.09', end: '2022.07.05' },
  { year: '2021', flag: '🇨🇳', country: '중국',          cities: ['칭다오'],                            start: '2021.08.04', end: '2021.08.09' },
];

const TRIP_YEARS = Array.from(new Set(TRIPS.map((t) => t.year)));

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
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
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
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Map — full bleed, OSM zoom-1 tiles + city pins */}
        <View style={styles.mapSection} onLayout={onMapLayout}>
          {mapW > 0 && (
            <View style={{ width: mapW, height: mapH, overflow: 'hidden', backgroundColor: '#d4e0eb' }}>
              {([[0,0],[1,0],[0,1],[1,1]] as [number,number][]).map(([tx, ty]) => {
                const tileScale = mapW / 512;
                return (
                  <Image
                    key={`${tx}${ty}`}
                    source={{ uri: `https://a.tile.openstreetmap.org/1/${tx}/${ty}.png` }}
                    style={{
                      position: 'absolute',
                      left: tx * 256 * tileScale,
                      top: ty * 256 * tileScale,
                      width: 256 * tileScale,
                      height: 256 * tileScale,
                    }}
                  />
                );
              })}
              {CITIES.map((c) => {
                const n = 2;
                const tileX = (c.lon + 180) / 360 * n;
                const latRad = c.lat * Math.PI / 180;
                const tileY = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
                const tileScale = mapW / 512;
                const px = tileX * 256 * tileScale;
                const py = tileY * 256 * tileScale;
                const isActive = active === c.city;
                const size = isActive ? 11 : 7;
                return (
                  <TouchableOpacity
                    key={c.city}
                    style={{ position: 'absolute', left: px - size / 2, top: py - size / 2 }}
                    onPress={() => setActive(active === c.city ? null : c.city)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <View style={{
                      width: size, height: size, borderRadius: size / 2,
                      backgroundColor: isActive ? Colors.primary : Colors.accent,
                      borderWidth: 1.5, borderColor: 'white',
                    }} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <View style={styles.mapLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>방문한 도시</Text>
          </View>
        </View>

        {/* Stats strip — inline, no individual boxes */}
        <View style={styles.statsStrip}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Travel journal — grouped by year */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionLabel}>여행 기록</Text>
          {TRIP_YEARS.map((year) => (
            <View key={year}>
              <View style={styles.yearRow}>
                <Text style={styles.yearLabel}>{year}</Text>
                <View style={styles.yearLine} />
              </View>
              {TRIPS.filter((t) => t.year === year).map((t, idx, arr) => (
                <View
                  key={t.country + t.start}
                  style={[styles.tripEntry, idx < arr.length - 1 && styles.tripEntryDivider]}
                >
                  <Text style={styles.tripFlag}>{t.flag}</Text>
                  <View style={styles.tripBody}>
                    <Text style={styles.tripCountry}>{t.country}</Text>
                    <Text style={styles.tripCities}>{t.cities.join(' · ')}</Text>
                  </View>
                  <Text style={styles.tripDate}>{t.start.slice(5, 10)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* City popup — full overlay modal */}
      {activeCity && (
        <Pressable style={styles.popupOverlay} onPress={() => setActive(null)}>
          <Pressable style={styles.popupCard} onPress={(e) => e.stopPropagation()}>
            {/* City photo */}
            <DestImage
              dest={activeCity.city}
              style={styles.popupHero}
              scrim="bottom"
              radius={Radius.md}
            >
              <View style={styles.popupHeroContent}>
                <Text style={styles.popupFlag}>{activeCity.flag}</Text>
                <Text style={styles.popupCity}>{activeCity.city}</Text>
              </View>
            </DestImage>
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
    fontSize: 17,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif }, native: {} }),
  },
  headerRight: { width: 36 },

  scroll: { flex: 1 },

  mapSection: {
    overflow: 'hidden',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
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

  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: {
    fontSize: 26,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    ...Platform.select({ web: { fontFamily: Font.serif }, native: {} }),
  },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.cardBorder },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },

  journalSection: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 12,
    gap: 4,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 4,
  },
  yearLabel: {
    fontSize: 12, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5,
  },
  yearLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  tripEntry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: 14,
  },
  tripEntryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tripFlag: { fontSize: 26, lineHeight: 32 },
  tripBody: { flex: 1, gap: 3, paddingTop: 1 },
  tripCountry: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  tripCities: { fontSize: 12, color: Colors.textMuted },
  tripDate: { fontSize: 11, color: Colors.textMuted, paddingTop: 3, letterSpacing: 0.2 },

  // Popup modal
  popupOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,16,12,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingBottom: Space.xxxl,
    alignItems: 'center',
    gap: Space.sm,
    width: 280,
    overflow: 'hidden',
    ...Elevation.xl,
  },
  popupHero: { width: 280, height: 140 },
  popupHeroContent: { gap: 3 },
  popupFlag: { fontSize: 28 },
  popupCity: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: -0.4,
    ...Platform.select({ web: { fontFamily: Font.serif }, native: {} }),
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
