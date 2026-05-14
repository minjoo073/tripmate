import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { MatchResult } from '../../../types';
import { MatchCard } from '../../../components/match/MatchCard';
import { mockMatchResults } from '../../../mock/data';
import { ArrowLeftIcon } from '../../../components/ui/Icon';

export default function MatchListScreen() {
  const insets = useSafeAreaInsets();
  const { results: resultsParam } = useLocalSearchParams<{ results: string }>();
  const results: MatchResult[] = resultsParam ? JSON.parse(resultsParam) : mockMatchResults;

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
        {results.map((item, index) => (
          <MatchCard key={item.user.id} item={item} rank={index + 1} />
        ))}
      </ScrollView>
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
    marginBottom: 4,
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
});
