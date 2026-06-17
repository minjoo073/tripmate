import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors, Editorial, Elevation, Radius, Space, Font,
} from '../../constants/colors';
import { DestImage } from '../../components/ui/DestImage';
import { ArrowLeftIcon } from '../../components/ui/Icon';

type Region = '아시아' | '유럽' | '미주' | '오세아니아';

type Destination = {
  name: string;
  country: string;
  flag: string;
  region: Region;
  mateCount: number;
  tags: string[];
  highlight: string;
};

const DESTINATIONS: Destination[] = [
  { name: '오사카', country: '일본', flag: '🇯🇵', region: '아시아', mateCount: 34, tags: ['맛집', '쇼핑', '사진'], highlight: '현지 맛집 투어 최고 인기' },
  { name: '도쿄', country: '일본', flag: '🇯🇵', region: '아시아', mateCount: 28, tags: ['관광', '쇼핑', '애니'], highlight: '다양한 문화 체험' },
  { name: '방콕', country: '태국', flag: '🇹🇭', region: '아시아', mateCount: 21, tags: ['맛집', '현지시장', '액티비티'], highlight: '로컬 음식 탐방' },
  { name: '발리', country: '인도네시아', flag: '🇮🇩', region: '아시아', mateCount: 18, tags: ['힐링', '액티비티', '사진'], highlight: '힐링 여행 성지' },
  { name: '싱가포르', country: '싱가포르', flag: '🇸🇬', region: '아시아', mateCount: 15, tags: ['관광', '쇼핑', '맛집'], highlight: '도시형 럭셔리 여행' },
  { name: '세부', country: '필리핀', flag: '🇵🇭', region: '아시아', mateCount: 11, tags: ['액티비티', '힐링', '사진'], highlight: '스쿠버다이빙 천국' },
  { name: '파리', country: '프랑스', flag: '🇫🇷', region: '유럽', mateCount: 17, tags: ['관광', '사진', '카페'], highlight: '예술과 낭만의 도시' },
  { name: '로마', country: '이탈리아', flag: '🇮🇹', region: '유럽', mateCount: 14, tags: ['역사/문화', '맛집', '관광'], highlight: '역사 탐방 & 파스타' },
  { name: '바르셀로나', country: '스페인', flag: '🇪🇸', region: '유럽', mateCount: 12, tags: ['관광', '나이트라이프', '사진'], highlight: '가우디와 플라멩코' },
  { name: '암스테르담', country: '네덜란드', flag: '🇳🇱', region: '유럽', mateCount: 9, tags: ['힐링', '사진', '관광'], highlight: '운하 자전거 투어' },
  { name: '뉴욕', country: '미국', flag: '🇺🇸', region: '미주', mateCount: 13, tags: ['관광', '쇼핑', '나이트라이프'], highlight: '도시 에너지 최강' },
  { name: 'LA', country: '미국', flag: '🇺🇸', region: '미주', mateCount: 10, tags: ['관광', '쇼핑', '액티비티'], highlight: '할리우드 & 해변' },
  { name: '멕시코시티', country: '멕시코', flag: '🇲🇽', region: '미주', mateCount: 7, tags: ['역사/문화', '맛집', '현지시장'], highlight: '문화와 음식의 도시' },
  { name: '시드니', country: '호주', flag: '🇦🇺', region: '오세아니아', mateCount: 11, tags: ['관광', '액티비티', '사진'], highlight: '오페라하우스 & 해변' },
  { name: '멜버른', country: '호주', flag: '🇦🇺', region: '오세아니아', mateCount: 8, tags: ['카페', '관광', '힐링'], highlight: '카페 문화의 성지' },
];

const REGIONS: Region[] = ['아시아', '유럽', '미주', '오세아니아'];

export default function ExploreDestinationScreen() {
  const insets = useSafeAreaInsets();
  const [activeRegion, setActiveRegion] = useState<Region>('아시아');

  const filtered = DESTINATIONS.filter((d) => d.region === activeRegion);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>DESTINATIONS</Text>
          <Text style={styles.title}>여행지별 메이트</Text>
        </View>
      </View>

      {/* Region tabs — horizontal pill scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.regionTabScroll}
        contentContainerStyle={styles.regionTabContent}
      >
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.regionTab, activeRegion === r && styles.regionTabActive]}
            onPress={() => setActiveRegion(r)}
            activeOpacity={0.88}
          >
            <Text style={[styles.regionTabText, activeRegion === r && styles.regionTabTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((dest) => (
          <TouchableOpacity
            key={dest.name}
            style={styles.card}
            onPress={() => router.push({ pathname: '/mates', params: { destination: dest.name } })}
            activeOpacity={0.88}
          >
            {/* Full-bleed destination photo */}
            <DestImage
              dest={dest.name}
              style={styles.cardImage}
              scrim="bottom"
              radius={0}
            >
              <View style={styles.cardImageContent}>
                <View style={styles.cardImageLeft}>
                  <Text style={styles.cardCityName}>{dest.name}</Text>
                  <Text style={styles.cardCountry}>{dest.flag} {dest.country}</Text>
                </View>
                <View style={styles.mateBadge}>
                  <Text style={styles.mateCount}>{dest.mateCount}</Text>
                  <Text style={styles.mateLabel}>명 모집중</Text>
                </View>
              </View>
            </DestImage>

            {/* Card body */}
            <View style={styles.cardBody}>
              <Text style={styles.highlight}>{dest.highlight}</Text>
              <View style={styles.tagsRow}>
                {dest.tags.map((t) => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
    paddingHorizontal: Space.xl,
    paddingTop: Space.xxl,
    paddingBottom: Space.lg,
    backgroundColor: Colors.card,
    ...Elevation.sm,
  },
  backBtn: { padding: Space.xs, marginTop: 2 },
  headerText: { flex: 1 },
  headerLabel: {
    ...Editorial.eyebrow,
    color: Colors.accent,
    marginBottom: Space.xs,
  },
  title: {
    fontSize: 22, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.3,
    ...Platform.select({ web: { fontFamily: Font.serif } }),
  },

  regionTabScroll: {
    maxHeight: 60,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  regionTabContent: {
    paddingHorizontal: Space.xl,
    paddingBottom: Space.md,
    paddingTop: 2,
    gap: Space.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionTab: {
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  regionTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  regionTabText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  regionTabTextActive: { color: Colors.white, fontWeight: '600' },

  scroll: { flex: 1 },
  list: { paddingHorizontal: Space.xl, paddingTop: Space.lg, gap: Space.md },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Elevation.md,
  },
  cardImage: { height: 148 },
  cardImageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardImageLeft: { gap: 3 },
  cardCityName: {
    fontSize: 24, fontWeight: '300', color: Colors.white, letterSpacing: -0.4,
    ...Platform.select({ web: { fontFamily: Font.serif } }),
  },
  cardCountry: { fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  mateBadge: { alignItems: 'flex-end', gap: 1 },
  mateCount: { fontSize: 26, fontWeight: '700', color: Colors.white, letterSpacing: -0.5 },
  mateLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)' },

  cardBody: { padding: Space.lg, gap: Space.sm },
  highlight: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
});
