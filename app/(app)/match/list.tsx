import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { MatchCard } from '../../../components/match/MatchCard';
import { mockMatchResults } from '../../../mock/data';
import { ArrowLeftIcon } from '../../../components/ui/Icon';
import { JoinSheet } from '../../../components/mate/JoinSheet';

export default function MatchListScreen() {
  const insets = useSafeAreaInsets();
  const { results: resultsParam } = useLocalSearchParams<{ results: string }>();
  const results: MatchResult[] = resultsParam ? JSON.parse(resultsParam) : mockMatchResults;
  const [joinTarget, setJoinTarget] = useState<MatchResult | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>TRAVEL COMPANIONS</Text>
          <Text style={styles.title}>함께할 여행자</Text>
          <Text style={styles.subtitle}>{results.length}명을 찾았어요</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>조건에 맞는 여행자가 없어요</Text>
            <Text style={styles.emptyDesc}>필터를 조금 풀어보면 더 많이 보일 거예요</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()} activeOpacity={0.85}>
              <Text style={styles.emptyBtnText}>조건 다시 설정</Text>
            </TouchableOpacity>
          </View>
        ) : results.map((item, index) => (
          <MatchCard
            key={item.user.id}
            item={item}
            rank={index + 1}
            onJoin={(item) => setJoinTarget(item)}
          />
        ))}
      </ScrollView>

      <JoinSheet
        visible={!!joinTarget}
        onClose={() => setJoinTarget(null)}
        userId={joinTarget?.user.id ?? ''}
        nickname={joinTarget?.user.nickname ?? ''}
        destination={joinTarget?.trip.destination}
        dates={joinTarget ? `${joinTarget.trip.startDate} – ${joinTarget.trip.endDate}` : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 14 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  emptyDesc: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  emptyBtn: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 999, backgroundColor: Colors.primary },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
