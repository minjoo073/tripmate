import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type GenderFilter = 'all' | 'female' | 'male';
type AgeRange = 'all' | '20s' | '30s' | '40s';

type MateCard = {
  id: string;
  nickname: string;
  age: number;
  gender: 'female' | 'male';
  destination: string;
  flag: string;
  dates: string;
  styles: string[];
  rating: number;
  travelCount: number;
  isVerified: boolean;
  bio: string;
  mbti?: string;
};

const ALL_MATES: MateCard[] = [
  { id: '1', nickname: '한소희', age: 26, gender: 'female', destination: '오사카', flag: '🇯🇵', dates: '6월 15일 – 19일', styles: ['카페', '사진', '힐링'], rating: 4.9, travelCount: 15, isVerified: true, bio: '카페 투어 고수 ☕ 감성 사진 함께 찍어요', mbti: 'ENFP' },
  { id: '2', nickname: '조승연', age: 27, gender: 'male', destination: '도쿄', flag: '🇯🇵', dates: '6월 20일 – 25일', styles: ['맛집', '현지시장'], rating: 4.8, travelCount: 12, isVerified: true, bio: '현지 골목 탐방, 맛집 리스트 공유해요!', mbti: 'ENTP' },
  { id: '3', nickname: '양세은', age: 28, gender: 'female', destination: '발리', flag: '🇮🇩', dates: '7월 5일 – 10일', styles: ['힐링', '관광'], rating: 4.7, travelCount: 8, isVerified: true, bio: '천천히 힐링 여행 선호해요 🌿', mbti: 'INFJ' },
  { id: '4', nickname: '장기은', age: 25, gender: 'female', destination: '방콕', flag: '🇹🇭', dates: '7월 12일 – 17일', styles: ['쇼핑', '액티비티', '나이트라이프'], rating: 4.6, travelCount: 6, isVerified: false, bio: '에너지 넘치는 여행 함께해요! 🌙', mbti: 'ESFP' },
  { id: '5', nickname: '정다은', age: 29, gender: 'female', destination: '파리', flag: '🇫🇷', dates: '8월 1일 – 8일', styles: ['관광', '역사/문화', '사진'], rating: 4.9, travelCount: 20, isVerified: true, bio: '꼼꼼한 계획파, 유럽 문화 탐방해요 🏛️', mbti: 'ISTJ' },
  { id: '6', nickname: '이민준', age: 30, gender: 'male', destination: '뉴욕', flag: '🇺🇸', dates: '8월 10일 – 17일', styles: ['관광', '사진', '나이트라이프'], rating: 4.7, travelCount: 10, isVerified: true, bio: '뉴욕 에너지 제대로 느끼고 싶어요 🗽', mbti: 'ESTP' },
  { id: '7', nickname: '박지영', age: 32, gender: 'female', destination: '싱가포르', flag: '🇸🇬', dates: '7월 20일 – 25일', styles: ['맛집', '관광', '쇼핑'], rating: 4.8, travelCount: 18, isVerified: true, bio: '싱가포르 맛집 투어 계획 중 🍜', mbti: 'ENFJ' },
  { id: '8', nickname: '김태현', age: 24, gender: 'male', destination: '바르셀로나', flag: '🇪🇸', dates: '9월 5일 – 12일', styles: ['관광', '액티비티', '나이트라이프'], rating: 4.5, travelCount: 4, isVerified: false, bio: '첫 유럽 여행! 같이 설레는 분 환영 ✈️', mbti: 'ENFP' },
];

const AGE_RANGES: { key: AgeRange; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '20s', label: '20대' },
  { key: '30s', label: '30대' },
  { key: '40s', label: '40대+' },
];

export default function ExploreGenderScreen() {
  const insets = useSafeAreaInsets();
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [ageRange, setAgeRange] = useState<AgeRange>('all');

  const filtered = ALL_MATES.filter((m) => {
    if (genderFilter !== 'all' && m.gender !== genderFilter) return false;
    if (ageRange === '20s' && (m.age < 20 || m.age >= 30)) return false;
    if (ageRange === '30s' && (m.age < 30 || m.age >= 40)) return false;
    if (ageRange === '40s' && m.age < 40) return false;
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>성별 · 나이 메이트</Text>
          <Text style={styles.subtitle}>원하는 조건의 동행을 찾아보세요</Text>
        </View>
      </View>

      {/* Gender filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>성별</Text>
        <View style={styles.genderBtns}>
          {([
            { key: 'all', label: '성별 무관', emoji: '🙌' },
            { key: 'female', label: '여성만', emoji: '👩' },
            { key: 'male', label: '남성만', emoji: '👨' },
          ] as { key: GenderFilter; label: string; emoji: string }[]).map((g) => (
            <TouchableOpacity
              key={g.key}
              style={[styles.genderBtn, genderFilter === g.key && styles.genderBtnActive]}
              onPress={() => setGenderFilter(g.key)}
            >
              <Text style={styles.genderBtnEmoji}>{g.emoji}</Text>
              <Text style={[styles.genderBtnText, genderFilter === g.key && styles.genderBtnTextActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Age filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>나이대</Text>
        <View style={styles.ageBtns}>
          {AGE_RANGES.map((a) => (
            <TouchableOpacity
              key={a.key}
              style={[styles.ageBtn, ageRange === a.key && styles.ageBtnActive]}
              onPress={() => setAgeRange(a.key)}
            >
              <Text style={[styles.ageBtnText, ageRange === a.key && styles.ageBtnTextActive]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Result count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          <Text style={styles.resultNum}>{filtered.length}명</Text>의 메이트가 있어요
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>조건에 맞는 메이트가 없어요</Text>
            <Text style={styles.emptyDesc}>조건을 변경해보세요</Text>
          </View>
        ) : (
          filtered.map((mate) => (
            <TouchableOpacity
              key={mate.id}
              style={styles.card}
              onPress={() => router.push(`/mate/${mate.id}`)}
              activeOpacity={0.85}
            >
              {/* Avatar + basic info */}
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: mate.gender === 'female' ? 'rgba(255,182,193,0.3)' : Colors.primaryBg }]}>
                  <Text style={styles.avatarText}>{mate.nickname[0]}</Text>
                  <Text style={styles.avatarGender}>{mate.gender === 'female' ? '👩' : '👨'}</Text>
                </View>
                <View style={styles.basicInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{mate.nickname}</Text>
                    <Text style={styles.ageBadge}>{mate.age}세</Text>
                    {mate.mbti && (
                      <View style={styles.mbtiBadge}>
                        <Text style={styles.mbtiText}>{mate.mbti}</Text>
                      </View>
                    )}
                    {mate.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>인증</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.bio} numberOfLines={1}>{mate.bio}</Text>
                  <View style={styles.statsRow}>
                    <Text style={styles.stat}>✈️ {mate.travelCount}회</Text>
                    <Text style={styles.statDot}>·</Text>
                    <Text style={styles.stat}>★ {mate.rating}</Text>
                  </View>
                </View>
              </View>

              {/* Destination */}
              <View style={styles.destRow}>
                <Text style={styles.destFlag}>{mate.flag}</Text>
                <View style={styles.destInfo}>
                  <Text style={styles.destName}>{mate.destination}</Text>
                  <Text style={styles.destDates}>{mate.dates}</Text>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagsRow}>
                {mate.styles.map((s) => (
                  <View key={s} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.chatBtn} onPress={() => router.push(`/mate/${mate.id}`)}>
                  <Text style={styles.chatBtnText}>채팅하기 →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
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

  filterSection: { paddingHorizontal: 20, marginBottom: 12 },
  filterLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8 },
  genderBtns: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  genderBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderBtnEmoji: { fontSize: 18 },
  genderBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  genderBtnTextActive: { color: Colors.white },

  ageBtns: { flexDirection: 'row', gap: 8 },
  ageBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  ageBtnActive: { backgroundColor: Colors.primaryBg, borderColor: Colors.primary },
  ageBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  ageBtnTextActive: { color: Colors.primary, fontWeight: '700' },

  resultRow: { paddingHorizontal: 20, paddingBottom: 12 },
  resultText: { fontSize: 13, color: Colors.textSecondary },
  resultNum: { fontWeight: '700', color: Colors.primary },

  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, gap: 14 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  avatarGender: { position: 'absolute', bottom: -2, right: -2, fontSize: 16 },
  basicInfo: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  ageBadge: { fontSize: 13, color: Colors.textSecondary },
  mbtiBadge: {
    backgroundColor: Colors.pointPurple,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  mbtiText: { fontSize: 11, color: Colors.textPrimary, fontWeight: '700' },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  bio: { fontSize: 13, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stat: { fontSize: 12, color: Colors.textSecondary },
  statDot: { fontSize: 12, color: Colors.textPlaceholder },

  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 12,
  },
  destFlag: { fontSize: 28 },
  destInfo: { gap: 2 },
  destName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  destDates: { fontSize: 12, color: Colors.textSecondary },

  tagsRow: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  chatBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chatBtnText: { fontSize: 12, color: Colors.white, fontWeight: '700' },

  empty: { paddingTop: 40, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },
});
