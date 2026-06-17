import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors, Editorial, Elevation, Radius, Space, Font,
} from '../../constants/colors';
import { ArrowLeftIcon } from '../../components/ui/Icon';

type StyleItem = { label: string; emoji: string; count: number; desc: string };

const STYLE_ITEMS: StyleItem[] = [
  { label: '카페', emoji: '☕', count: 128, desc: '카페 투어, 감성 공간 탐방' },
  { label: '사진', emoji: '📸', count: 104, desc: '포토스팟, 감성 사진 촬영' },
  { label: '힐링', emoji: '🌿', count: 96, desc: '느리게 쉬는 여유로운 여행' },
  { label: '맛집', emoji: '🍜', count: 143, desc: '현지 맛집 탐방 & 미식 투어' },
  { label: '관광', emoji: '🗺️', count: 87, desc: '유명 관광지, 랜드마크 투어' },
  { label: '쇼핑', emoji: '🛍️', count: 72, desc: '로컬 쇼핑, 면세점, 아울렛' },
  { label: '액티비티', emoji: '🏄', count: 61, desc: '스포츠, 어드벤처, 체험 활동' },
  { label: '나이트라이프', emoji: '🌙', count: 54, desc: '바, 클럽, 야경 투어' },
  { label: '역사/문화', emoji: '🏛️', count: 48, desc: '유적지, 박물관, 전통 체험' },
  { label: '현지시장', emoji: '🧺', count: 42, desc: '재래시장, 야시장, 플리마켓' },
  { label: '피식', emoji: '😄', count: 38, desc: '웃음 넘치는 즐거운 동행' },
];

type MateCard = {
  id: string;
  nickname: string;
  age: number;
  gender: 'female' | 'male';
  destination: string;
  flag: string;
  styles: string[];
  rating: number;
  isVerified: boolean;
  bio: string;
};

const MATES: MateCard[] = [
  { id: '1', nickname: '한소희', age: 26, gender: 'female', destination: '오사카', flag: '🇯🇵', styles: ['카페', '사진', '힐링'], rating: 4.9, isVerified: true, bio: '카페 리스트 300개 보유 중 ☕ 감성 사진 같이 찍어요' },
  { id: '2', nickname: '조승연', age: 27, gender: 'male', destination: '도쿄', flag: '🇯🇵', styles: ['맛집', '현지시장', '사진'], rating: 4.8, isVerified: true, bio: '현지 골목 투어 전문가. 맛집 리스트 공유해요!' },
  { id: '6', nickname: '이수아', age: 25, gender: 'female', destination: '발리', flag: '🇮🇩', styles: ['힐링', '카페', '관광'], rating: 4.7, isVerified: true, bio: '느리게 힐링하는 여행을 좋아해요 🌿' },
  { id: '7', nickname: '김민준', age: 31, gender: 'male', destination: '방콕', flag: '🇹🇭', styles: ['쇼핑', '액티비티', '나이트라이프'], rating: 4.6, isVerified: false, bio: '에너지 넘치는 여행 함께해요! 밤에도 활발해요 🌙' },
  { id: '8', nickname: '박지원', age: 27, gender: 'female', destination: '파리', flag: '🇫🇷', styles: ['관광', '역사/문화', '사진'], rating: 4.9, isVerified: true, bio: '꼼꼼한 계획파. 유럽 문화 탐방 같이 해요 🏛️' },
  { id: '9', nickname: '신예은', age: 24, gender: 'female', destination: '싱가포르', flag: '🇸🇬', styles: ['맛집', '쇼핑', '카페'], rating: 4.8, isVerified: true, bio: '맛집과 쇼핑은 필수! 싱가포르 로컬 맛 탐방해요 🍜' },
  { id: '10', nickname: '강도윤', age: 30, gender: 'male', destination: '뉴욕', flag: '🇺🇸', styles: ['나이트라이프', '액티비티', '관광'], rating: 4.7, isVerified: true, bio: '맨해튼 거리를 걷고 브루클린 바에서 마무리해요 🗽' },
];

export default function ExploreStyleScreen() {
  const insets = useSafeAreaInsets();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (label: string) => {
    setSelectedStyles((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    );
  };

  const filteredMates =
    selectedStyles.length === 0
      ? MATES
      : MATES.filter((m) => selectedStyles.some((s) => m.styles.includes(s)));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>BY STYLE</Text>
          <Text style={styles.title}>스타일별 메이트</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Style grid */}
        <View style={styles.styleIntro}>
          <Text style={styles.sectionTitle}>어떤 여행을 좋아하세요?</Text>
          <Text style={styles.sectionSub}>여러 개 선택할 수 있어요</Text>
        </View>

        <View style={styles.styleGrid}>
          {STYLE_ITEMS.map((item) => {
            const selected = selectedStyles.includes(item.label);
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.styleCard, selected && styles.styleCardActive]}
                onPress={() => toggleStyle(item.label)}
                activeOpacity={0.88}
              >
                <Text style={styles.styleEmoji}>{item.emoji}</Text>
                <Text style={[styles.styleLabel, selected && styles.styleLabelActive]}>
                  {item.label}
                </Text>
                <View style={[styles.styleCount, selected && styles.styleCountActive]}>
                  <Text style={[styles.styleCountText, selected && styles.styleCountTextActive]}>
                    {item.count}명
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>
            {selectedStyles.length > 0
              ? `"${selectedStyles.join(', ')}" 선호 메이트`
              : '전체 메이트'}
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Mate list */}
        {filteredMates.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>조건에 맞는 메이트가 없어요</Text>
            <Text style={styles.emptyDesc}>다른 스타일을 선택해보세요</Text>
          </View>
        ) : (
          <View style={styles.mateList}>
            {filteredMates.map((mate) => (
              <TouchableOpacity
                key={mate.id}
                style={styles.mateCard}
                onPress={() => router.push(`/mate/${mate.id}`)}
                activeOpacity={0.88}
              >
                <View style={styles.mateAvatar}>
                  <Text style={styles.mateAvatarText}>{mate.nickname[0]}</Text>
                </View>
                <View style={styles.mateInfo}>
                  <View style={styles.mateNameRow}>
                    <Text style={styles.mateName}>{mate.nickname}</Text>
                    <Text style={styles.mateMeta}>
                      {mate.age}세 · {mate.gender === 'female' ? '여성' : '남성'}
                    </Text>
                    {mate.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>인증</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mateBio} numberOfLines={1}>{mate.bio}</Text>
                  <View style={styles.mateDestRow}>
                    <Text style={styles.mateDest}>{mate.flag} {mate.destination}</Text>
                    <Text style={styles.mateRating}>★ {mate.rating}</Text>
                  </View>
                  <View style={styles.mateTagsRow}>
                    {mate.styles.map((s) => (
                      <View
                        key={s}
                        style={[
                          styles.mateTag,
                          selectedStyles.includes(s) && styles.mateTagMatch,
                        ]}
                      >
                        <Text style={[
                          styles.mateTagText,
                          selectedStyles.includes(s) && styles.mateTagTextMatch,
                        ]}>
                          {s}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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

  scroll: { flex: 1 },
  content: { gap: Space.lg },

  styleIntro: {
    paddingHorizontal: Space.xl,
    paddingTop: Space.xxl,
    paddingBottom: Space.xs,
    gap: Space.xs,
    backgroundColor: Colors.card,
  },
  sectionTitle: { fontSize: 17, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.2 },
  sectionSub: { fontSize: 12, color: Colors.textSecondary },

  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
    paddingHorizontal: Space.xl,
    paddingBottom: Space.xl,
    backgroundColor: Colors.card,
  },
  styleCard: {
    width: '30%', flexGrow: 1,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    paddingVertical: Space.lg,
    paddingHorizontal: Space.sm,
    alignItems: 'center',
    gap: Space.sm,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    ...Elevation.sm,
  },
  styleCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  styleEmoji: { fontSize: 28 },
  styleLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  styleLabelActive: { color: Colors.white },
  styleCount: {
    backgroundColor: Colors.bgDeep,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.sm, paddingVertical: 2,
  },
  styleCountActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  styleCountText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  styleCountTextActive: { color: 'rgba(255,255,255,0.85)' },

  divider: {
    flexDirection: 'row', alignItems: 'center', gap: Space.md,
    paddingHorizontal: Space.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  dividerText: {
    fontSize: 12, color: Colors.textSecondary, fontWeight: '600',
    flexShrink: 1, textAlign: 'center',
  },

  empty: { paddingTop: 40, alignItems: 'center', gap: Space.md },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },

  mateList: { paddingHorizontal: Space.xl, gap: Space.md, paddingBottom: Space.xs },

  mateCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Space.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
    ...Elevation.sm,
  },
  mateAvatar: {
    width: 52, height: 52, borderRadius: Radius.pill,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  mateAvatarText: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  mateInfo: { flex: 1, gap: 5 },
  mateNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  mateName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  mateMeta: { fontSize: 12, color: Colors.textSecondary },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.sm, paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  mateBio: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  mateDestRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  mateDest: { fontSize: 12, color: Colors.textSecondary },
  mateRating: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },
  mateTagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  mateTag: {
    backgroundColor: Colors.bgDeep,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md, paddingVertical: 3,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  mateTagMatch: { backgroundColor: Colors.primaryBg, borderColor: Colors.primary },
  mateTagText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  mateTagTextMatch: { color: Colors.primary, fontWeight: '700' },
});
