import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { ArrowLeftIcon, HeartIcon, MapPinIcon } from '../../components/ui/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { StyleTag } from '../../components/ui/StyleTag';
import { mockMatchResults } from '../../mock/data';

// Mock: 찜한 동행자 목록 (첫 3명)
const LIKED = mockMatchResults.slice(0, 3);

export default function LikedMatesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>LIKED</Text>
          <Text style={styles.title}>찜한 동행자</Text>
        </View>
        <View style={styles.countBadge}>
          <HeartIcon color={Colors.accent} size={13} filled />
          <Text style={styles.countText}>{LIKED.length}</Text>
        </View>
      </View>

      {LIKED.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <HeartIcon color={Colors.textMuted} size={28} />
          </View>
          <Text style={styles.emptyTitle}>아직 찜한 동행자가 없어요</Text>
          <Text style={styles.emptyDesc}>마음에 드는 동행자를 찜해보세요</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/match/list')} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>동행자 찾기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {LIKED.map((item) => {
            const reRate = 80 + (item.user.travelCount % 15);
            const filledDots = Math.round(item.matchRate / 20);
            return (
              <TouchableOpacity
                key={item.user.id}
                style={styles.card}
                activeOpacity={0.82}
                onPress={() => router.push(`/mate/${item.user.id}`)}
              >
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={styles.avatarWrap}>
                    <Avatar nickname={item.user.nickname} size={52} />
                    {item.user.isVerified && <View style={styles.verifiedDot} />}
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.user.nickname}</Text>
                    <View style={styles.destRow}>
                      <MapPinIcon color={Colors.textMuted} size={11} />
                      <Text style={styles.dest}>{item.trip.destination}</Text>
                      <Text style={styles.dateSep}>·</Text>
                      <Text style={styles.date}>{item.trip.startDate.slice(5, 7)}월</Text>
                    </View>
                  </View>
                  {/* Match rate + heart */}
                  <View style={styles.rightCol}>
                    <View style={styles.matchWrap}>
                      <Text style={styles.matchPct}>{item.matchRate}%</Text>
                      <View style={styles.compatDots}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <View
                            key={i}
                            style={[styles.compatDot, i <= filledDots && styles.compatDotFilled]}
                          />
                        ))}
                      </View>
                    </View>
                    <View style={styles.heartBadge}>
                      <HeartIcon color={Colors.accent} size={12} filled />
                    </View>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.tagRow}>
                  {item.user.travelStyles.slice(0, 3).map((s) => (
                    <StyleTag key={s} label={s} />
                  ))}
                </View>

                {/* Trust badges */}
                <View style={styles.trustRow}>
                  {item.user.isVerified && (
                    <View style={[styles.badge, styles.badgeVerified]}>
                      <View style={styles.verifiedBadgeDot} />
                      <Text style={[styles.badgeText, styles.badgeTextVerified]}>인증 완료</Text>
                    </View>
                  )}
                  <View style={[styles.badge, styles.badgeRetrip]}>
                    <Text style={[styles.badgeText, styles.badgeTextRetrip]}>재동행 {reRate}%</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeResponse]}>
                    <Text style={[styles.badgeText, styles.badgeTextResponse]}>응답 빠름</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 16 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 4,
  },
  title: {
    fontSize: 26, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 18,
  },
  countText: { fontSize: 12, fontWeight: '600', color: Colors.accent },

  scroll: { flex: 1 },
  content: { padding: 20, gap: 12 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarWrap: { position: 'relative' },
  verifiedDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.olive,
    borderWidth: 1.5, borderColor: Colors.card,
  },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dest: { fontSize: 12, color: Colors.textSecondary },
  dateSep: { fontSize: 12, color: Colors.textMuted },
  date: { fontSize: 12, color: Colors.textMuted },

  rightCol: { alignItems: 'flex-end', gap: 8 },
  matchWrap: { alignItems: 'flex-end', gap: 5 },
  matchPct: { fontSize: 13, fontWeight: '700', color: Colors.primary, letterSpacing: -0.3 },
  compatDots: { flexDirection: 'row', gap: 3 },
  compatDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.bgDeep },
  compatDotFilled: { backgroundColor: Colors.dustBlue },
  heartBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  trustRow: {
    flexDirection: 'row', gap: 6,
    paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.cardBorder,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 6, paddingHorizontal: 9, paddingVertical: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },
  badgeVerified: { backgroundColor: 'rgba(110,125,98,0.12)' },
  verifiedBadgeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.olive },
  badgeTextVerified: { color: Colors.olive },
  badgeRetrip: { backgroundColor: 'rgba(107,140,173,0.13)' },
  badgeTextRetrip: { color: Colors.dustBlue },
  badgeResponse: { backgroundColor: Colors.accentLight },
  badgeTextResponse: { color: Colors.accent },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 40 },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.2 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
