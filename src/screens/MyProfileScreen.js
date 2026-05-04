import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar, VerifiedBadge, StarRating } from '../components/common';
import { currentUser } from '../data/mockData';

const tabs = ['여행 이력', '리뷰', '저장'];

export default function MyProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('여행 이력');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 프로필</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Avatar emoji={currentUser.avatar} bg={currentUser.avatarBg} size={72} />
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('ProfileEdit')}
            >
              <Text style={styles.editBtnText}>✏️ 편집</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userJob}>{currentUser.age}세 · {currentUser.job}</Text>
          <Text style={styles.userBio}>{currentUser.bio}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{currentUser.tripCount}</Text>
              <Text style={styles.statLabel}>여행</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{currentUser.reviewCount}</Text>
              <Text style={styles.statLabel}>리뷰</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <StarRating rating={currentUser.rating} />
              <Text style={styles.statLabel}>평점</Text>
            </View>
          </View>

          <View style={styles.verRow}>
            {currentUser.verified.email && <VerifiedBadge label="이메일" />}
            {currentUser.verified.instagram && <VerifiedBadge label="인스타그램" />}
          </View>

          <View style={styles.styleRow}>
            {currentUser.styles.map((s) => (
              <View key={s} style={styles.styleTag}>
                <Text style={styles.styleTagText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          {[
            { icon: '✈️', label: '여행 등록', onPress: () => navigation.navigate('TripRegister') },
            { icon: '📋', label: '동행 히스토리', onPress: () => navigation.navigate('TripHistory') },
            { icon: '⭐', label: '리뷰 작성', onPress: () => navigation.navigate('Review') },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickBtn} onPress={a.onPress}>
              <Text style={styles.quickIcon}>{a.icon}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab section */}
        <View style={styles.tabRow}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[styles.tab, activeTab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === '여행 이력' && (
            <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
              <View style={styles.historyPreview}>
                <Text style={styles.historyIcon}>✈️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDest}>오사카, 일본</Text>
                  <Text style={styles.historyDate}>2025.01.10 ~ 01.17 · 조승연 님</Text>
                </View>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>완료</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {activeTab === '리뷰' && (
            <View style={styles.emptyTab}>
              <Text style={styles.emptyIcon}>⭐</Text>
              <Text style={styles.emptyText}>아직 작성한 리뷰가 없어요</Text>
            </View>
          )}
          {activeTab === '저장' && (
            <View style={styles.emptyTab}>
              <Text style={styles.emptyIcon}>🔖</Text>
              <Text style={styles.emptyText}>저장된 메이트가 없어요</Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.black },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerIcon: { fontSize: 22 },
  profileCard: {
    backgroundColor: Colors.white,
    padding: 20,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  profileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  editBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editBtnText: { fontSize: 13, color: Colors.textSub },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.black },
  userJob: { fontSize: 13, color: Colors.textMute },
  userBio: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textMute },
  statDivider: { width: 0.5, height: 30, backgroundColor: Colors.border },
  verRow: { flexDirection: 'row', gap: 8 },
  styleRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  styleTag: {
    backgroundColor: Colors.tagBg,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.tagBorder,
  },
  styleTagText: { fontSize: 12, color: Colors.tagText, fontWeight: '600' },
  quickActions: {
    flexDirection: 'row',
    padding: 14,
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontSize: 11, color: Colors.textSub, fontWeight: '600' },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textMute, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  tabContent: { padding: 14 },
  historyPreview: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  historyIcon: { fontSize: 24 },
  historyDest: { fontSize: 14, fontWeight: '700', color: Colors.black },
  historyDate: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  completedBadge: {
    backgroundColor: Colors.greenBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  completedText: { fontSize: 11, color: Colors.green, fontWeight: '700' },
  emptyTab: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 14, color: Colors.textMute },
});
