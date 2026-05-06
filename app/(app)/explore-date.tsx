import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type MonthKey = 'this' | 'next' | 'in2' | 'in3';

type TravelPost = {
  id: string;
  nickname: string;
  age: number;
  gender: 'female' | 'male';
  destination: string;
  flag: string;
  startDate: string;
  endDate: string;
  nights: number;
  styles: string[];
  mateCount: string;
  isVerified: boolean;
};

const MONTH_TABS: { key: MonthKey; label: string; sub: string }[] = [
  { key: 'this', label: '이번 달', sub: '5월' },
  { key: 'next', label: '다음 달', sub: '6월' },
  { key: 'in2', label: '2개월 후', sub: '7월' },
  { key: 'in3', label: '3개월 후', sub: '8월' },
];

const POSTS: Record<MonthKey, TravelPost[]> = {
  this: [
    { id: '1', nickname: '한소희', age: 26, gender: 'female', destination: '오사카', flag: '🇯🇵', startDate: '5월 18일', endDate: '5월 22일', nights: 4, styles: ['맛집', '사진'], mateCount: '1/2', isVerified: true },
    { id: '2', nickname: '조승연', age: 27, gender: 'male', destination: '도쿄', flag: '🇯🇵', startDate: '5월 24일', endDate: '5월 29일', nights: 5, styles: ['관광', '쇼핑'], mateCount: '1/3', isVerified: true },
    { id: '3', nickname: '양세은', age: 28, gender: 'female', destination: '방콕', flag: '🇹🇭', startDate: '5월 30일', endDate: '6월 3일', nights: 4, styles: ['힐링', '현지시장'], mateCount: '2/4', isVerified: false },
  ],
  next: [
    { id: '4', nickname: '장기은', age: 25, gender: 'female', destination: '발리', flag: '🇮🇩', startDate: '6월 5일', endDate: '6월 10일', nights: 5, styles: ['액티비티', '힐링'], mateCount: '1/2', isVerified: false },
    { id: '5', nickname: '정다은', age: 29, gender: 'female', destination: '파리', flag: '🇫🇷', startDate: '6월 15일', endDate: '6월 22일', nights: 7, styles: ['관광', '카페'], mateCount: '1/2', isVerified: true },
    { id: '6', nickname: '한소희', age: 26, gender: 'female', destination: '오사카', flag: '🇯🇵', startDate: '6월 18일', endDate: '6월 22일', nights: 4, styles: ['맛집', '쇼핑'], mateCount: '1/2', isVerified: true },
    { id: '7', nickname: '조승연', age: 27, gender: 'male', destination: '싱가포르', flag: '🇸🇬', startDate: '6월 25일', endDate: '6월 29일', nights: 4, styles: ['관광', '맛집'], mateCount: '2/3', isVerified: true },
  ],
  in2: [
    { id: '8', nickname: '양세은', age: 28, gender: 'female', destination: '뉴욕', flag: '🇺🇸', startDate: '7월 4일', endDate: '7월 12일', nights: 8, styles: ['관광', '쇼핑'], mateCount: '1/2', isVerified: true },
    { id: '9', nickname: '장기은', age: 25, gender: 'female', destination: '바르셀로나', flag: '🇪🇸', startDate: '7월 10일', endDate: '7월 17일', nights: 7, styles: ['나이트라이프', '관광'], mateCount: '1/3', isVerified: false },
  ],
  in3: [
    { id: '10', nickname: '정다은', age: 29, gender: 'female', destination: '시드니', flag: '🇦🇺', startDate: '8월 1일', endDate: '8월 8일', nights: 7, styles: ['관광', '액티비티'], mateCount: '1/2', isVerified: true },
    { id: '11', nickname: '한소희', age: 26, gender: 'female', destination: '방콕', flag: '🇹🇭', startDate: '8월 15일', endDate: '8월 20일', nights: 5, styles: ['맛집', '현지시장'], mateCount: '1/3', isVerified: true },
  ],
};

export default function ExploreDateScreen() {
  const insets = useSafeAreaInsets();
  const [activeMonth, setActiveMonth] = useState<MonthKey>('next');

  const posts = POSTS[activeMonth];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>날짜별 메이트</Text>
          <Text style={styles.subtitle}>여행 일정이 맞는 동행을 찾아보세요</Text>
        </View>
      </View>

      {/* Month tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthTabScroll}
        contentContainerStyle={styles.monthTabContent}
      >
        {MONTH_TABS.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.monthTab, activeMonth === m.key && styles.monthTabActive]}
            onPress={() => setActiveMonth(m.key)}
          >
            <Text style={[styles.monthTabLabel, activeMonth === m.key && styles.monthTabLabelActive]}>
              {m.label}
            </Text>
            <Text style={[styles.monthTabSub, activeMonth === m.key && styles.monthTabSubActive]}>
              {m.sub}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count badge */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          <Text style={styles.countNum}>{posts.length}명</Text>이 이 시기에 여행을 계획하고 있어요
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            {/* Date bar */}
            <View style={styles.dateBanner}>
              <Text style={styles.dateBannerFlag}>{post.flag}</Text>
              <Text style={styles.dateBannerDest}>{post.destination}</Text>
              <View style={styles.dateBannerRight}>
                <Text style={styles.dateBannerDate}>
                  {post.startDate} – {post.endDate}
                </Text>
                <View style={styles.nightsBadge}>
                  <Text style={styles.nightsText}>{post.nights}박</Text>
                </View>
              </View>
            </View>

            {/* User row */}
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.nickname[0]}</Text>
              </View>
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{post.nickname}</Text>
                  <Text style={styles.userMeta}>
                    {post.age}세 · {post.gender === 'female' ? '여성' : '남성'}
                  </Text>
                  {post.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>인증</Text>
                    </View>
                  )}
                </View>
                <View style={styles.tagsRow}>
                  {post.styles.map((s) => (
                    <View key={s} style={styles.tag}>
                      <Text style={styles.tagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.mateSlot}>
                <Text style={styles.mateSlotNum}>{post.mateCount}</Text>
                <Text style={styles.mateSlotLabel}>인원</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatBtn}
              onPress={() => router.push(`/mate/${post.id}`)}
            >
              <Text style={styles.chatBtnText}>💬 채팅 신청</Text>
            </TouchableOpacity>
          </View>
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

  monthTabScroll: { maxHeight: 72 },
  monthTabContent: { paddingHorizontal: 20, gap: 10, flexDirection: 'row', paddingBottom: 8 },
  monthTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    gap: 2,
  },
  monthTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  monthTabLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  monthTabLabelActive: { color: Colors.white },
  monthTabSub: { fontSize: 11, color: Colors.textPlaceholder },
  monthTabSubActive: { color: 'rgba(255,255,255,0.75)' },

  countRow: { paddingHorizontal: 20, paddingVertical: 12 },
  countText: { fontSize: 13, color: Colors.textSecondary },
  countNum: { fontWeight: '700', color: Colors.primary },

  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, gap: 14 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dateBanner: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dateBannerFlag: { fontSize: 20 },
  dateBannerDest: { fontSize: 15, fontWeight: '700', color: Colors.white, flex: 1 },
  dateBannerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBannerDate: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  nightsBadge: {
    backgroundColor: Colors.pointYellow,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  nightsText: { fontSize: 11, color: Colors.textPrimary, fontWeight: '700' },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  userInfo: { flex: 1, gap: 6 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  userMeta: { fontSize: 12, color: Colors.textSecondary },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', gap: 6 },
  tag: {
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  mateSlot: { alignItems: 'center', gap: 2 },
  mateSlotNum: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  mateSlotLabel: { fontSize: 10, color: Colors.textSecondary },

  chatBtn: {
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chatBtnText: { fontSize: 14, color: Colors.white, fontWeight: '700' },
});
