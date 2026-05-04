import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar, Tag, MatchBadge, VerifiedBadge, StarRating } from '../components/common';

export default function ProfileDetailScreen({ navigation, route }) {
  const mate = route.params?.mate;
  if (!mate) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Report', { mate })}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View style={styles.hero}>
          <Avatar emoji={mate.avatar} bg={mate.avatarBg} size={80} />
          <View style={styles.heroInfo}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{mate.name}</Text>
              <Text style={styles.heroAge}>{mate.age}세</Text>
            </View>
            <Text style={styles.heroJob}>{mate.job}</Text>
            <View style={styles.heroMeta}>
              <StarRating rating={mate.rating} />
              <Text style={styles.heroReview}>리뷰 {mate.reviewCount}개</Text>
            </View>
          </View>
          <View style={styles.matchBadgeBox}>
            <MatchBadge pct={mate.matchPct} size="lg" />
            <Text style={styles.matchLabel}>매칭률</Text>
          </View>
        </View>

        {/* Match breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>매칭 분석</Text>
          {[
            { label: '일정 겹침', pct: 95 },
            { label: '스타일 유사도', pct: mate.matchPct - 5 },
            { label: '신뢰도 점수', pct: 88 },
          ].map((item) => (
            <View key={item.label} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.pct}%` }]} />
              </View>
              <Text style={styles.progressPct}>{item.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Trip info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 정보</Text>
          <View style={styles.tripCard}>
            <View style={styles.tripRow}>
              <Text style={styles.tripIcon}>✈️</Text>
              <View>
                <Text style={styles.tripDest}>{mate.destination}</Text>
                <Text style={styles.tripDate}>{mate.startDate} ~ {mate.endDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Style tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 스타일</Text>
          <View style={styles.tagWrap}>
            {mate.styles.map((s) => (
              <Tag key={s} label={s} active />
            ))}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자기소개</Text>
          <View style={styles.bioBox}>
            <Text style={styles.bioText}>{mate.bio}</Text>
          </View>
        </View>

        {/* Verified badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인증</Text>
          <View style={styles.verRow}>
            {mate.verified.email && <VerifiedBadge label="이메일" />}
            {mate.verified.instagram && <VerifiedBadge label="인스타그램" />}
            {mate.verified.sns && <VerifiedBadge label="SNS" />}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => navigation.navigate('ChatRoom', { mate })}
        >
          <Text style={styles.chatBtnText}>💬  채팅하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.matchBtn}
          onPress={() => navigation.navigate('AiMatching')}
        >
          <Text style={styles.matchBtnText}>🤖 AI 매칭 요청</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  backText: { fontSize: 20, color: Colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  moreText: { fontSize: 20, color: Colors.textSub },
  hero: {
    backgroundColor: Colors.white,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroInfo: { flex: 1, gap: 4 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroName: { fontSize: 20, fontWeight: '800', color: Colors.black },
  heroAge: { fontSize: 14, color: Colors.textMute },
  heroJob: { fontSize: 13, color: Colors.textSub },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  heroReview: { fontSize: 11, color: Colors.textMute },
  matchBadgeBox: { alignItems: 'center', gap: 2 },
  matchLabel: { fontSize: 10, color: Colors.textMute },
  section: {
    backgroundColor: Colors.white,
    margin: 10,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.black },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressLabel: { fontSize: 12, color: Colors.textSub, width: 70 },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: '700', color: Colors.primary, width: 36, textAlign: 'right' },
  tripCard: {
    backgroundColor: Colors.bg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tripIcon: { fontSize: 22 },
  tripDest: { fontSize: 14, fontWeight: '700', color: Colors.black },
  tripDate: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  bioBox: {
    backgroundColor: Colors.bg,
    borderRadius: 8,
    padding: 12,
  },
  bioText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  verRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    padding: 14,
    paddingBottom: 28,
    flexDirection: 'row',
    gap: 10,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  matchBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  matchBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
