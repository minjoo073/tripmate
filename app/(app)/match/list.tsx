import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { MatchCard } from '../../../components/match/MatchCard';
import { mockMatchResults } from '../../../mock/data';

export default function MatchListScreen() {
  const insets = useSafeAreaInsets();
  const { results: resultsParam } = useLocalSearchParams<{ results: string }>();
  const results: MatchResult[] = resultsParam ? JSON.parse(resultsParam) : mockMatchResults;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>매칭 결과</Text>
          <Text style={styles.subtitle}>{results.length}명의 메이트를 찾았어요</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.map((item, index) => <MatchCard key={item.user.id} item={item} rank={index + 1} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
});
