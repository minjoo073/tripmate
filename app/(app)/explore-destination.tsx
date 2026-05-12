import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

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
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>여행지별 메이트</Text>
          <Text style={styles.subtitle}>가고 싶은 여행지를 선택해보세요</Text>
        </View>
      </View>

      {/* Region tabs */}
      <View style={styles.regionTabs}>
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.regionTab, activeRegion === r && styles.regionTabActive]}
            onPress={() => setActiveRegion(r)}
          >
            <Text style={[styles.regionTabText, activeRegion === r && styles.regionTabTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.flag}>{dest.flag}</Text>
              <View style={styles.destInfo}>
                <View style={styles.destNameRow}>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destCountry}>{dest.country}</Text>
                </View>
                <Text style={styles.highlight}>{dest.highlight}</Text>
                <View style={styles.tagsRow}>
                  {dest.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.mateCountBadge}>
                <Text style={styles.mateCount}>{dest.mateCount}</Text>
                <Text style={styles.mateCountLabel}>명 모집중</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  regionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  regionTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  regionTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  regionTabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  regionTabTextActive: { color: Colors.white, fontWeight: '700' },

  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, gap: 12 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flex: 1 },
  flag: { fontSize: 36, marginTop: 2 },
  destInfo: { flex: 1, gap: 6 },
  destNameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  destName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  destCountry: { fontSize: 12, color: Colors.textSecondary },
  highlight: { fontSize: 13, color: Colors.textSecondary },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

  cardRight: { alignItems: 'center', gap: 4, marginLeft: 8 },
  mateCountBadge: { alignItems: 'center' },
  mateCount: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  mateCountLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  arrow: { fontSize: 20, color: Colors.textPlaceholder },
});
