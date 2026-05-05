import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
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
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('My Trips');

  const handleSignOut = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/login'); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Avatar nickname={user?.nickname ?? '나'} size={80} variant="light" />
        <Text style={styles.nickname}>{user?.nickname ?? '여행자'}</Text>
        <Text style={styles.meta}>서울 · SNS 인증 ✓</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statValue}>128</Text><Text style={styles.statLabel}>팔로워</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>3</Text><Text style={styles.statLabel}>여행</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>4.9</Text><Text style={styles.statLabel}>리뷰</Text></View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.emptyText}>아직 리뷰가 없어요</Text>
          </View>
        )}
        {activeTab === 'Saved' && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>찜한 메이트가 없어요</Text>
          </View>
        )}

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>프로필 편집</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>알림 설정</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={handleSignOut}>
            <Text style={[styles.settingText, { color: Colors.red }]}>로그아웃</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  nickname: { fontSize: 22, fontWeight: '700', color: Colors.white },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: Colors.white },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, color: Colors.textPrimary, fontWeight: '600' },
  tripInfo: { flex: 1 },
  tripDest: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  tripDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  tripCompanion: { fontSize: 12, color: Colors.primary, marginTop: 2 },
  rating: { fontSize: 14, color: '#F59E0B' },
  empty: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
  settingsSection: {
    marginTop: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingText: { fontSize: 15, color: Colors.textPrimary },
  settingArrow: { fontSize: 16, color: Colors.textSecondary },
});
