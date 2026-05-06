import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Avatar } from '../../components/ui/Avatar';

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
    { id: '6', user: { id: '1', nickname: '한소희', age: 26, gender: 'female', isVerified: true }, destination: '방콕, 태국', dates: '2025.08.01 – 08.06', styles: ['맛집', '현지시장', '사진'], currentCount: 2, maxCount: 4, desc: '짜뚜짝 시장부터 왕궁까지! 로컬 음식 탐방 같이 해요 🌶️' },
  ],
  파리: [
    { id: '7', user: { id: '3', nickname: '양세은', age: 28, gender: 'female', isVerified: true }, destination: '파리, 프랑스', dates: '2025.09.10 – 09.17', styles: ['관광', '사진', '카페'], currentCount: 1, maxCount: 2, desc: '에펠탑, 루브르, 몽마르트르... 파리의 모든 것을 천천히 누려요 🗼' },
  ],
  뉴욕: [
    { id: '8', user: { id: '2', nickname: '조승연', age: 27, gender: 'male', isVerified: true }, destination: '뉴욕, 미국', dates: '2025.10.05 – 10.12', styles: ['나이트라이프', '액티비티', '관광'], currentCount: 1, maxCount: 3, desc: '맨해튼에서 브루클린까지! 빠르고 강렬한 뉴욕 여행 함께해요 🗽' },
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

  const posts = MOCK_POSTS[selected] ?? [];

  const handleChat = (userId: string) => {
    Alert.alert('채팅 신청', '이 여행자에게 채팅을 신청할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '신청하기', onPress: () => Alert.alert('완료', '채팅 신청을 보냈어요!') },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
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
                <Avatar nickname={post.user.nickname} size={48} />
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
                  onPress={() => handleChat(post.user.id)}
                >
                  <Text style={styles.chatBtnText}>💬 채팅하기</Text>
                </TouchableOpacity>
              </View>
            </View>
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

  destScroll: { maxHeight: 52 },
  destScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
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
  destTabText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  destTabTextActive: { color: Colors.white, fontWeight: '700' },

  scroll: { flex: 1 },
  list: { padding: 20, gap: 16 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  userInfo: { flex: 1, gap: 4 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  userAge: { fontSize: 13, color: Colors.textSecondary },
  verifiedBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  destination: { fontSize: 13, color: Colors.textSecondary },
  dates: { fontSize: 13, color: Colors.textSecondary },

  desc: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 14,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countBadge: {
    backgroundColor: Colors.pointTeal,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  countText: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  chatBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chatBtnText: { fontSize: 14, color: Colors.white, fontWeight: '700' },

  empty: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },
});
