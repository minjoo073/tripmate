import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar, MatchBadge } from '../components/common';
import { currentUser } from '../data/mockData';

export default function TripConfirmScreen({ navigation, route }) {
  const mate = route.params?.mate;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>동행 확정</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.celebIcon}>🎊</Text>
        <Text style={styles.title}>동행이 확정되었어요!</Text>
        <Text style={styles.sub}>함께하는 여행이 기다리고 있어요</Text>

        {/* Match card */}
        <View style={styles.matchCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarBox}>
              <Avatar emoji={currentUser.avatar} bg={currentUser.avatarBg} size={60} />
              <Text style={styles.avatarName}>{currentUser.name}</Text>
            </View>
            <View style={styles.matchCenter}>
              <MatchBadge pct={mate?.matchPct || 97} size="lg" />
              <Text style={styles.matchLabel}>매칭률</Text>
              <Text style={styles.heartIcon}>❤️</Text>
            </View>
            <View style={styles.avatarBox}>
              <Avatar emoji={mate?.avatar || '🐱'} bg={mate?.avatarBg} size={60} />
              <Text style={styles.avatarName}>{mate?.name || '메이트'}</Text>
            </View>
          </View>

          <View style={styles.tripSummary}>
            <Text style={styles.tripTitle}>✈️  여행 요약</Text>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>목적지</Text>
              <Text style={styles.tripValue}>{mate?.destination || currentUser.trip?.destination}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>출발일</Text>
              <Text style={styles.tripValue}>{mate?.startDate || currentUser.trip?.startDate}</Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>귀국일</Text>
              <Text style={styles.tripValue}>{mate?.endDate || currentUser.trip?.endDate}</Text>
            </View>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>서로 존중하며 즐거운 여행 되세요!</Text>
          </View>
        </View>

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('ChatRoom', { mate })}
          >
            <Text style={styles.primaryBtnText}>💬  채팅 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.secondaryBtnText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
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
  body: { flex: 1, alignItems: 'center', padding: 20, gap: 16 },
  celebIcon: { fontSize: 64, marginTop: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.black },
  sub: { fontSize: 14, color: Colors.textMute },
  matchCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  avatarBox: { alignItems: 'center', gap: 6 },
  avatarName: { fontSize: 13, fontWeight: '700', color: Colors.black },
  matchCenter: { alignItems: 'center', gap: 4 },
  matchLabel: { fontSize: 11, color: Colors.textMute },
  heartIcon: { fontSize: 20 },
  tripSummary: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  tripTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  tripRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tripLabel: { fontSize: 13, color: Colors.textMute },
  tripValue: { fontSize: 13, fontWeight: '600', color: Colors.black },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.tagBg,
    borderRadius: 8,
    padding: 10,
  },
  tipIcon: { fontSize: 16 },
  tipText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  btnGroup: { width: '100%', gap: 10 },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 14, color: Colors.textSub },
});
