import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Elevation, Radius, Space, Font } from '../../../constants/colors';
import { Post } from '../../../types';
import { PostCard } from '../../../components/community/PostCard';
import { getPosts } from '../../../services/communityService';
import { MapPinIcon, ArrowRightIcon } from '../../../components/ui/Icon';
import { DestImage } from '../../../components/ui/DestImage';
import { router } from 'expo-router';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'mate', label: '동행 찾기' },
  { key: 'tips', label: '여행 기록' },
  { key: 'review', label: '로컬 추천' },
] as const;

type TabKey = typeof TABS[number]['key'];

const FEATURED_POSTS = [
  {
    id: 'f1',
    postId: 'p6',
    city: '오사카',
    coords: '34°N · 135°E',
    tag: '여행 기록',
    tagColor: Colors.accent,
    title: '도톤보리 뒷골목의 오래된 카페들',
    desc: '현지인만 아는 조용한 골목. 오래된 조명과 핸드드립 커피, 그리고 혼자만의 오후.',
    author: '김지아',
    date: '5월 8일',
    likes: 47,
  },
  {
    id: 'f2',
    postId: 'p8',
    city: '도쿄',
    coords: '35°N · 139°E',
    tag: '동행 찾기',
    tagColor: Colors.accent,
    title: '진보초 서점 골목 같이 걸을 분',
    desc: '7월 초 3박 4일, 필름카메라 들고 천천히 걷는 여행. 빠른 일정 싫어하는 분.',
    author: '박승현',
    date: '5월 11일',
    likes: 23,
  },
];

const CITY_TAGS = ['전체', '오사카', '도쿄', '방콕', '파리', '바르셀로나', '뉴욕', '발리', '프라하', '리스본', '이스탄불', '다낭'];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [activeCity, setActiveCity] = useState('전체');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const category = activeTab === 'all' ? undefined : activeTab;
    const city = activeCity === '전체' ? undefined : activeCity;
    getPosts(category, city).then(setPosts);
  }, [activeTab, activeCity]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>TRAVEL JOURNAL</Text>
            <Text style={styles.title}>여행자들의 이야기</Text>
          </View>
          <TouchableOpacity
            style={[styles.writeBtn, Elevation.sm]}
            onPress={() => router.push('/post/new')}
            activeOpacity={0.85}
          >
            <Text style={styles.writeBtnText}>+ 기록하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredHeader}>
            <Text style={styles.featuredLabel}>EDITOR'S PICK</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {FEATURED_POSTS.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={[styles.featuredCard, Elevation.lg]}
                activeOpacity={0.87}
                onPress={() => router.push(`/post/${post.postId}`)}
              >
                <DestImage
                  dest={post.city}
                  style={StyleSheet.absoluteFill}
                  scrim="bottom"
                  radius={Radius.lg}
                />
                {/* Floating tag */}
                <View style={styles.featuredTagWrap}>
                  <Text style={styles.featuredTag}>{post.tag}</Text>
                </View>
                {/* Bottom content */}
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredCity}>{post.city}</Text>
                  <Text style={styles.featuredTitle} numberOfLines={2}>{post.title}</Text>
                  <View style={styles.featuredFooter}>
                    <Text style={styles.featuredAuthor}>{post.author}</Text>
                    <Text style={styles.featuredDate}>{post.date} · ♡ {post.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* City filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityFilterScroll}
          style={styles.cityFilterRow}
        >
          {CITY_TAGS.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityTag, activeCity === city && styles.cityTagActive]}
              onPress={() => setActiveCity(city)}
            >
              {city !== '전체' && activeCity !== city && (
                <MapPinIcon color={Colors.textMuted} size={10} />
              )}
              <Text style={[styles.cityTagText, activeCity === city && styles.cityTagTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Post list */}
        <View style={styles.postList}>
          {posts.map((item) => <PostCard key={item.id} item={item} />)}
          {posts.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
              <Text style={styles.emptyDesc}>첫 번째 여행 이야기를 남겨보세요</Text>
            </View>
          )}
        </View>

        {/* Route sharing banner */}
        <TouchableOpacity
          style={[styles.routeBanner, Elevation.sm]}
          activeOpacity={0.87}
          onPress={() => router.push('/route-archive')}
        >
          <View style={styles.routeBannerLeft}>
            <Text style={styles.routeBannerLabel}>ROUTE ARCHIVE</Text>
            <Text style={styles.routeBannerTitle}>내 여행 루트 공유하기</Text>
            <Text style={styles.routeBannerDesc}>지도 위에 새겨진 나의 발자국</Text>
          </View>
          <ArrowRightIcon color={Colors.accent} size={15} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: Space.xxl,
    paddingTop: Space.huge,
    paddingBottom: Space.lg,
    backgroundColor: Colors.bg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: Space.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    ...Platform.select({ web: { fontFamily: Font.serif } }),
  },
  writeBtn: {
    backgroundColor: Colors.card,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md,
    paddingVertical: Space.xs + 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  writeBtnText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  scrollContent: { paddingTop: 0 },

  // ── Featured ──────────────────────────────────────────────────────────────
  featuredSection: { marginBottom: Space.xs },
  featuredHeader: {
    paddingHorizontal: Space.xxl,
    marginBottom: Space.md,
  },
  featuredLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  featuredScroll: {
    paddingHorizontal: Space.xxl,
    gap: Space.md,
    paddingRight: Space.xxl,
  },
  featuredCard: {
    width: 260,
    height: 300,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredTagWrap: {
    position: 'absolute',
    top: Space.md,
    left: Space.md,
    backgroundColor: 'rgba(16,24,38,0.50)',
    borderRadius: Radius.xs,
    paddingHorizontal: Space.sm,
    paddingVertical: Space.xs - 1,
  },
  featuredTag: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Space.lg,
    gap: Space.xs - 1,
  },
  featuredCity: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Space.xs - 2,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white,
    lineHeight: 22,
    letterSpacing: -0.2,
    ...Platform.select({ web: { fontFamily: Font.serif, fontSize: 18 } }),
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Space.sm,
    paddingTop: Space.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  featuredAuthor: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  featuredDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },

  // ── City filter ───────────────────────────────────────────────────────────
  cityFilterRow: { marginBottom: 0 },
  cityFilterScroll: {
    paddingHorizontal: Space.xxl,
    paddingVertical: Space.md + 2,
    gap: Space.sm,
  },
  cityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    paddingHorizontal: Space.md,
    paddingVertical: Space.xs + 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cityTagActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  cityTagText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  cityTagTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },

  // ── Tab bar ───────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Space.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  tab: {
    paddingVertical: Space.md - 1,
    marginRight: Space.xl + 2,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.textPrimary },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '400' },
  tabTextActive: { color: Colors.textPrimary, fontWeight: '600' },

  // ── Post list ─────────────────────────────────────────────────────────────
  postList: {
    paddingHorizontal: Space.xl,
    paddingTop: Space.sm,
    paddingBottom: Space.xs,
  },

  empty: { paddingTop: Space.huge, alignItems: 'center', gap: Space.sm },
  emptyTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textMuted },

  // ── Route banner ──────────────────────────────────────────────────────────
  routeBanner: {
    marginHorizontal: Space.xl,
    marginTop: Space.md,
    marginBottom: Space.sm,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.md,
    padding: Space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196,135,90,0.2)',
  },
  routeBannerLeft: { flex: 1, gap: Space.xs },
  routeBannerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: Space.xs - 2,
    opacity: 0.7,
  },
  routeBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  routeBannerDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
