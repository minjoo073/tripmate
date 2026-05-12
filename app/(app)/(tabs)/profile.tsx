import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { router } from 'expo-router';
import { SettingsIcon, MessageIcon, BookmarkIcon } from '../../../components/ui/Icon';

const TABS = ['내 여행', '리뷰', '저장'];

const MOCK_TRIPS = [
  { id: '1', dest: '오사카, 일본', date: '2025.06.15 – 06.19', companion: '조승연', rating: 5, status: 'done' },
  { id: '2', dest: '도쿄, 일본', date: '2025.07.05 – 07.10', companion: '예정', rating: 0, status: 'upcoming' },
  { id: '3', dest: '방콕, 태국', date: '2024.12.20 – 12.25', companion: '한소희', rating: 5, status: 'done' },
];

const STATUS_COLORS: Record<string, string> = {
  upcoming: Colors.primaryBg,
  done: Colors.success,
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  upcoming: Colors.primary,
  done: Colors.textPrimary,
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: '예정',
  done: '완료',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('내 여행');

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <SettingsIcon color={Colors.textSecondary} size={22} />
        </TouchableOpacity>

        <Avatar nickname={user?.nickname ?? '나'} size={80} />
        <Text style={styles.nickname}>{user?.nickname ?? '여행자'}</Text>
        <Text style={styles.meta}>서울 · SNS 인증 ✓</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/profile-setup')}
        >
          <Text style={styles.editBtnText}>프로필 편집</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>여행</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>평점</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === '내 여행' && (
          <>
            <Text style={styles.sectionLabel}>나의 여행 기록</Text>
            {MOCK_TRIPS.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripCardLeft}>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[trip.status] }]}>
                    <Text style={[styles.statusText, { color: STATUS_TEXT_COLORS[trip.status] }]}>
                      {STATUS_LABELS[trip.status]}
                    </Text>
                  </View>
                  <Text style={styles.tripDest}>{trip.dest}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripCompanion}>동행 · {trip.companion}</Text>
                </View>
                {trip.rating > 0 && (
                  <Text style={styles.rating}>{'★'.repeat(trip.rating)}</Text>
                )}
              </View>
            ))}
          </>
        )}
        {activeTab === '리뷰' && (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}><MessageIcon color={Colors.textPlaceholder} size={32} /></View>
            <Text style={styles.emptyTitle}>아직 리뷰가 없어요</Text>
            <Text style={styles.emptyDesc}>여행 후 메이트 리뷰를 남겨보세요</Text>
          </View>
        )}
        {activeTab === '저장' && (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}><BookmarkIcon color={Colors.textPlaceholder} size={32} /></View>
            <Text style={styles.emptyTitle}>찜한 메이트가 없어요</Text>
            <Text style={styles.emptyDesc}>마음에 드는 메이트를 저장해보세요</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingsBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 6,
  },
  settingsBtnText: { fontSize: 22 },

  nickname: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: 13, color: Colors.textSecondary },

  editBtn: {
    backgroundColor: Colors.bg,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  editBtnText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.cardBorder },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  tripCardLeft: { flex: 1, gap: 5 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  tripDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  tripDate: { fontSize: 12, color: Colors.textSecondary },
  tripCompanion: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  rating: { fontSize: 13, color: '#F59E0B' },

  empty: { paddingTop: 48, alignItems: 'center', gap: 10 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },
});
