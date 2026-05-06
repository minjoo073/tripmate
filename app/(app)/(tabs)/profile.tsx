import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { router } from 'expo-router';

const TABS = ['My Trips', 'Reviews', 'Saved'];

const MOCK_TRIPS = [
  { id: '1', dest: '오사카, 일본', date: '2025.06.15 – 06.19', companion: '조승연', rating: 5, status: 'done' },
  { id: '2', dest: '도쿄, 일본', date: '2025.07.05 – 07.10', companion: '예정', rating: 0, status: 'upcoming' },
  { id: '3', dest: '방콕, 태국', date: '2024.12.20 – 12.25', companion: '한소희', rating: 5, status: 'done' },
];

const STATUS_COLORS: Record<string, string> = {
  upcoming: Colors.pointTeal,
  done: Colors.pointBlueGray,
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: '진행중',
  done: '완료',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('My Trips');

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        {/* 설정 아이콘 */}
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsIconText}>⚙️</Text>
        </TouchableOpacity>

        <Avatar nickname={user?.nickname ?? '나'} size={84} variant="light" />
        <Text style={styles.nickname}>{user?.nickname ?? '여행자'}</Text>
        <Text style={styles.meta}>서울 · SNS 인증 ✓</Text>

        {/* 프로필 편집 버튼 */}
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => router.push('/profile-setup')}
        >
          <Text style={styles.editProfileBtnText}>✏️ 프로필 편집</Text>
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
            <Text style={styles.statLabel}>리뷰</Text>
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
        {activeTab === 'My Trips' && (
          <>
            {MOCK_TRIPS.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[trip.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[trip.status]}</Text>
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripDest}>{trip.dest}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripCompanion}>동행: {trip.companion}</Text>
                </View>
                {trip.rating > 0 && (
                  <Text style={styles.rating}>{'★'.repeat(trip.rating)}</Text>
                )}
              </View>
            ))}
          </>
        )}
        {activeTab === 'Reviews' && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>아직 리뷰가 없어요</Text>
            <Text style={styles.emptyDesc}>여행 후 메이트 리뷰를 남겨보세요</Text>
          </View>
        )}
        {activeTab === 'Saved' && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>❤️</Text>
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
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 10,
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 6,
  },
  settingsIconText: { fontSize: 24 },

  nickname: { fontSize: 22, fontWeight: '700', color: Colors.white },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },

  editProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileBtnText: { fontSize: 13, color: Colors.white, fontWeight: '600' },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48, gap: 10 },

  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 11, color: Colors.textPrimary, fontWeight: '600' },
  tripInfo: { flex: 1, gap: 3 },
  tripDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  tripDate: { fontSize: 12, color: Colors.textSecondary },
  tripCompanion: { fontSize: 12, color: Colors.primary },
  rating: { fontSize: 14, color: '#F59E0B' },

  empty: { paddingTop: 48, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary },
});
