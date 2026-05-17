import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Avatar } from '../../components/ui/Avatar';
import { ArrowLeftIcon } from '../../components/ui/Icon';
import { router } from 'expo-router';
import { JoinSheet } from '../../components/mate/JoinSheet';

const MOCK_POSTS: Record<string, MatePost[]> = {
  오사카: [
    { id: '1', user: { id: '1', nickname: '한소희', age: 26, gender: 'female', isVerified: true }, destination: '오사카, 일본', dates: '2025.06.15 – 06.19', styles: ['카페', '사진', '맛집'], currentCount: 1, maxCount: 2, desc: '오사카 구석구석 맛집 투어 같이 할 분! 코리아타운부터 난바까지 함께해요 🍜' },
    { id: '2', user: { id: '2', nickname: '조승연', age: 27, gender: 'male', isVerified: true }, destination: '오사카, 일본', dates: '2025.06.20 – 06.23', styles: ['현지시장', '나이트라이프'], currentCount: 2, maxCount: 3, desc: '도톤보리 야경 보고 현지 이자카야에서 한잔 하실 분 환영 🍺' },
    { id: '3', user: { id: '3', nickname: '양세은', age: 28, gender: 'female', isVerified: true }, destination: '오사카, 일본', dates: '2025.07.01 – 07.05', styles: ['카페', '힐링', '쇼핑'], currentCount: 1, maxCount: 2, desc: '천천히 힐링하는 여행 함께해요. 카페 순례 고수입니다 ☕' },
  ],
  도쿄: [
    { id: '4', user: { id: '4', nickname: '장기은', age: 25, gender: 'female', isVerified: false }, destination: '도쿄, 일본', dates: '2025.07.05 – 07.10', styles: ['쇼핑', '액티비티'], currentCount: 1, maxCount: 3, desc: '하라주쿠, 시부야 쇼핑 같이 하실 분! 에너지 넘치는 분 환영 🛍️' },
    { id: '5', user: { id: '5', nickname: '정다은', age: 29, gender: 'female', isVerified: true }, destination: '도쿄, 일본', dates: '2025.07.12 – 07.16', styles: ['역사/문화', '관광', '사진'], currentCount: 1, maxCount: 2, desc: '아사쿠사, 우에노 문화 코스 함께 걸어요 🗼' },
  ],
  방콕: [
    { id: '6', user: { id: '6', nickname: '이수아', age: 25, gender: 'female', isVerified: true }, destination: '방콕, 태국', dates: '2025.08.01 – 08.06', styles: ['맛집', '현지시장', '사진'], currentCount: 2, maxCount: 4, desc: '짜뚜짝 시장부터 왕궁까지! 로컬 음식 탐방 같이 해요 🌶️' },
    { id: '9', user: { id: '7', nickname: '김태양', age: 30, gender: 'male', isVerified: false }, destination: '방콕, 태국', dates: '2025.08.10 – 08.14', styles: ['액티비티', '나이트라이프'], currentCount: 1, maxCount: 3, desc: '방콕 야시장, 무에타이 관람, 루프탑바까지! 활발하게 다닐 분 🌙' },
  ],
  파리: [
    { id: '7', user: { id: '8', nickname: '박지원', age: 27, gender: 'female', isVerified: true }, destination: '파리, 프랑스', dates: '2025.09.10 – 09.17', styles: ['관광', '사진', '카페'], currentCount: 1, maxCount: 2, desc: '에펠탑, 루브르, 몽마르트르... 파리의 모든 것을 천천히 누려요 🗼' },
    { id: '10', user: { id: '9', nickname: '오채원', age: 24, gender: 'female', isVerified: true }, destination: '파리, 프랑스', dates: '2025.09.20 – 09.25', styles: ['카페', '힐링', '쇼핑'], currentCount: 1, maxCount: 2, desc: '파리 감성 카페 투어와 마르셰 쇼핑 함께해요 ☕' },
  ],
  뉴욕: [
    { id: '8', user: { id: '10', nickname: '강도윤', age: 30, gender: 'male', isVerified: true }, destination: '뉴욕, 미국', dates: '2025.10.05 – 10.12', styles: ['나이트라이프', '액티비티', '관광'], currentCount: 1, maxCount: 3, desc: '맨해튼에서 브루클린까지! 빠르고 강렬한 뉴욕 여행 함께해요 🗽' },
    { id: '11', user: { id: '11', nickname: '임지현', age: 27, gender: 'female', isVerified: false }, destination: '뉴욕, 미국', dates: '2025.10.15 – 10.20', styles: ['쇼핑', '관광', '사진'], currentCount: 2, maxCount: 4, desc: '타임스퀘어, 센트럴파크, MOMA 같이 구경해요! 🗽' },
  ],
};

type MatePost = {
  id: string;
  user: { id: string; nickname: string; age: number; gender: string; isVerified: boolean };
  destination: string;
  dates: string;
  styles: string[];
  currentCount: number;
  maxCount: number;
  desc: string;
};

const ALL_DESTINATIONS = ['오사카', '도쿄', '방콕', '파리', '뉴욕'];

export default function MatesScreen() {
  const insets = useSafeAreaInsets();
  const { destination: paramDest } = useLocalSearchParams<{ destination?: string }>();
  const [selected, setSelected] = useState<string>(paramDest ?? '오사카');
  const [joinTarget, setJoinTarget] = useState<MatePost | null>(null);

  const posts = MOCK_POSTS[selected] ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backBtn}
        >
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>MATES</Text>
          <Text style={styles.title}>메이트 모집</Text>
          <Text style={styles.subtitle}>같이 떠날 여행 동행을 찾아보세요</Text>
        </View>
      </View>

      {/* Destination tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.destScroll}
        contentContainerStyle={styles.destScrollContent}
      >
        {ALL_DESTINATIONS.map((dest) => (
          <TouchableOpacity
            key={dest}
            style={[styles.destTab, selected === dest && styles.destTabActive]}
            onPress={() => setSelected(dest)}
          >
            <Text style={[styles.destTabText, selected === dest && styles.destTabTextActive]}>
              {dest}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✈️</Text>
            <Text style={styles.emptyTitle}>아직 모집 글이 없어요</Text>
            <Text style={styles.emptyDesc}>첫 번째 메이트를 모집해보세요!</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Avatar nickname={post.user.nickname} size={46} />
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{post.user.nickname}</Text>
                    <Text style={styles.userAge}>{post.user.age}세</Text>
                    {post.user.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>인증</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.destination}>📍 {post.destination}</Text>
                  <Text style={styles.dates}>🗓 {post.dates}</Text>
                </View>
              </View>

              <Text style={styles.desc}>{post.desc}</Text>

              <View style={styles.tagsRow}>
                {post.styles.map((s) => (
                  <View key={s} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {post.currentCount}/{post.maxCount}명 모집 중
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => setJoinTarget(post)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.chatBtnText}>동행 신청</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <JoinSheet
        visible={!!joinTarget}
        onClose={() => setJoinTarget(null)}
        userId={joinTarget?.user.id ?? ''}
        nickname={joinTarget?.user.nickname ?? ''}
        destination={joinTarget?.destination}
        dates={joinTarget?.dates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 14 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 3, fontWeight: '400' },

  destScroll: { maxHeight: 56 },
  destScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  destTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  destTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  destTabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  destTabTextActive: { color: Colors.white, fontWeight: '600' },

  scroll: { flex: 1 },
  list: { padding: 20, gap: 14 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  userInfo: { flex: 1, gap: 4 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.2 },
  userAge: { fontSize: 12, color: Colors.textMuted, fontWeight: '400' },
  verifiedBadge: {
    backgroundColor: 'rgba(110,125,98,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: Colors.olive, fontWeight: '600' },
  destination: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  dates: { fontSize: 12, color: Colors.textMuted, fontWeight: '400' },

  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 14,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.1)',
  },
  tagText: { fontSize: 11, color: Colors.primary, fontWeight: '500' },

  cardBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 2, borderTopWidth: 1, borderTopColor: Colors.cardBorder,
  },
  countBadge: {
    backgroundColor: 'rgba(180,217,204,0.4)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(91,158,110,0.2)',
  },
  countText: { fontSize: 11, color: Colors.green, fontWeight: '500' },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chatBtnText: { fontSize: 13, color: Colors.white, fontWeight: '500', letterSpacing: -0.1 },

  empty: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, fontWeight: '400' },
});
