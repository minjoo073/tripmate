import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar, Card, MatchBadge } from '../components/common';
import { currentUser, mates, recommendedMates, categories } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>안녕하세요 👋</Text>
          <Text style={styles.headerTitle}>{currentUser.name} 님의 여행</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.bellWrap}>
          <Text style={styles.bell}>🔔</Text>
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('FindMate')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>어디로, 날짜로 메이트 찾기</Text>
        </TouchableOpacity>

        {/* ── 카테고리 ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>나라별 탐색</Text>
          </View>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { backgroundColor: cat.color, borderColor: cat.borderColor }]}
                onPress={() => navigation.navigate('MatchList', {
                  mates: cat.country
                    ? [...mates, ...recommendedMates].filter((m) => m.country === cat.country)
                    : [...mates, ...recommendedMates],
                })}
                activeOpacity={0.75}
              >
                <Text style={styles.categoryFlag}>{cat.flag}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 내 여행 카드 ── */}
        {currentUser.trip && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>내 여행</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TripRegister')}>
                <Text style={styles.sectionLink}>+ 여행 등록</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.myTripCard}>
              <View style={styles.myTripLeft}>
                <Text style={styles.myTripEmoji}>✈️</Text>
                <View>
                  <Text style={styles.myTripDest}>{currentUser.trip.destination}</Text>
                  <Text style={styles.myTripDate}>
                    {currentUser.trip.startDate} ~ {currentUser.trip.endDate}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.aiBtn}
                onPress={() => navigation.navigate('AiMatching')}
              >
                <Text style={styles.aiBtnText}>🤖 AI 매칭</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── 추천 메이트 (다양한 나라) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌏 추천 메이트</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MatchList', { mates: recommendedMates })}>
              <Text style={styles.sectionLink}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedMates.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.recommendCard}
                onPress={() => navigation.navigate('ProfileDetail', { mate: m })}
                activeOpacity={0.8}
              >
                <View style={styles.recommendAvatarWrap}>
                  <Avatar emoji={m.avatar} bg={m.avatarBg} size={54} />
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagBadgeText}>{m.flag}</Text>
                  </View>
                </View>
                <Text style={styles.recommendName}>{m.name}</Text>
                <Text style={styles.recommendDest}>{m.destination}</Text>
                <Text style={styles.recommendPct}>{m.matchPct}%</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 일정 맞는 메이트 (내 여행지 기준) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 일정 맞는 메이트</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MatchList', { mates })}>
              <Text style={styles.sectionLink}>더보기</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.scheduleSubtitle}>
            🇯🇵 오사카 · 4월 5일~18일 기준
          </Text>
          <View style={{ gap: 8 }}>
            {mates.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => navigation.navigate('ProfileDetail', { mate: m })}
                activeOpacity={0.8}
              >
                <Card style={styles.mateRow}>
                  <View style={styles.mateRowLeft}>
                    <Avatar emoji={m.avatar} bg={m.avatarBg} size={42} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <View style={styles.mateNameRow}>
                        <Text style={styles.mateName}>{m.name}</Text>
                        <Text style={styles.mateAge}>{m.age}세</Text>
                      </View>
                      <Text style={styles.mateDest}>
                        {m.flag} {m.destination} · {m.startDate.slice(5)} ~ {m.endDate.slice(5)}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                        {m.styles.slice(0, 2).map((s) => (
                          <View key={s} style={styles.miniTag}>
                            <Text style={styles.miniTagText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <MatchBadge pct={m.matchPct} />
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  headerSub: { fontSize: 11, color: Colors.textMute },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  bellWrap: { position: 'relative' },
  bell: { fontSize: 22 },
  bellDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.red, borderWidth: 1.5, borderColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 14,
    marginBottom: 8,
    backgroundColor: '#f5f3ee',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { fontSize: 13, color: Colors.textMute },

  section: { paddingHorizontal: 14, marginTop: 18 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.black },
  sectionLink: { fontSize: 12, color: Colors.primaryLight, fontWeight: '600' },

  // 카테고리 그리드
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  categoryFlag: { fontSize: 26 },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: Colors.text },

  // 내 여행
  myTripCard: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myTripLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myTripEmoji: { fontSize: 28 },
  myTripDest: { fontSize: 15, fontWeight: '700', color: Colors.white },
  myTripDate: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  aiBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  aiBtnText: { fontSize: 12, fontWeight: '700', color: Colors.white },

  // 추천 메이트 가로 스크롤
  recommendCard: {
    alignItems: 'center',
    marginRight: 14,
    paddingVertical: 4,
    gap: 4,
    width: 80,
  },
  recommendAvatarWrap: { position: 'relative' },
  flagBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  flagBadgeText: { fontSize: 12 },
  recommendName: { fontSize: 12, fontWeight: '700', color: Colors.black, textAlign: 'center' },
  recommendDest: { fontSize: 10, color: Colors.textMute, textAlign: 'center' },
  recommendPct: { fontSize: 13, fontWeight: '800', color: Colors.primary },

  // 일정 맞는 메이트
  scheduleSubtitle: {
    fontSize: 12,
    color: Colors.textMute,
    marginBottom: 8,
    marginTop: -4,
  },
  mateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mateRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  mateNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mateName: { fontSize: 14, fontWeight: '700', color: Colors.black },
  mateAge: { fontSize: 11, color: Colors.textMute },
  mateDest: { fontSize: 11, color: Colors.textMute, marginTop: 1 },
  miniTag: {
    backgroundColor: Colors.tagBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.3,
    borderColor: Colors.tagBorder,
  },
  miniTagText: { fontSize: 10, color: Colors.tagText },
});
