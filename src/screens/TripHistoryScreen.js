import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { tripHistory } from '../data/mockData';

const tabs = ['전체', '완료', '진행중', '취소'];

const statusConfig = {
  completed: { label: '완료', bg: Colors.greenBg, text: Colors.green, border: Colors.greenBorder },
  ongoing: { label: '진행중', bg: Colors.tagBg, text: Colors.primary, border: Colors.tagBorder },
  cancelled: { label: '취소', bg: Colors.redBg, text: Colors.red, border: '#f1b8b8' },
};

export default function TripHistoryScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('전체');

  const filtered = tripHistory.filter((t) => {
    if (activeTab === '전체') return true;
    return t.status === { '완료': 'completed', '진행중': 'ongoing', '취소': 'cancelled' }[activeTab];
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>동행 히스토리</Text>
        <View style={{ width: 24 }} />
      </View>

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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item }) => {
          const status = statusConfig[item.status];
          return (
            <View style={styles.historyCard}>
              <View style={styles.cardTop}>
                <Text style={styles.destText}>{item.destination}</Text>
                <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
                  <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.dateText}>{item.startDate} ~ {item.endDate}</Text>

              <View style={styles.mateRow}>
                <Avatar emoji={item.mate.avatar} bg={item.mate.avatarBg} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mateName}>{item.mate.name} 님과의 여행</Text>
                  <Text style={styles.matchPct}>매칭률 {item.matchPct}%</Text>
                </View>
                {item.status === 'completed' && !item.reviewed && (
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => navigation.navigate('Review', { mate: item.mate })}
                  >
                    <Text style={styles.reviewBtnText}>리뷰 쓰기</Text>
                  </TouchableOpacity>
                )}
                {item.reviewed && (
                  <View style={styles.reviewedBadge}>
                    <Text style={styles.reviewedText}>✓ 리뷰 완료</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
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
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  destText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 12, color: Colors.textMute },
  mateRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  mateName: { fontSize: 13, fontWeight: '600', color: Colors.black },
  matchPct: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  reviewBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reviewBtnText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  reviewedBadge: {
    backgroundColor: Colors.greenBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  reviewedText: { fontSize: 11, color: Colors.green, fontWeight: '600' },
});
