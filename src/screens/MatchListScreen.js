import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar, Card, MatchBadge } from '../components/common';
import { mates } from '../data/mockData';

export default function MatchListScreen({ navigation, route }) {
  const mateList = route.params?.mates || mates;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Match List</Text>
          <Text style={styles.headerSub}>나의 여행과 맞는 메이트 {mateList.length}명</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AiMatching')}>
          <Text style={styles.aiLink}>AI 매칭</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mateList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail', { mate: item })}>
            <Card style={styles.mateCard}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <Avatar emoji={item.avatar} bg={item.avatarBg} size={50} />
              <View style={styles.mateInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.mateName}>{item.name}</Text>
                  {item.verified.instagram && (
                    <View style={styles.verBadge}><Text style={styles.verText}>인증</Text></View>
                  )}
                </View>
                <Text style={styles.mateDetail}>{item.destination} · {item.startDate.slice(5)} ~ {item.endDate.slice(5)}</Text>
                <View style={styles.tagRow}>
                  {item.styles.slice(0, 3).map((s) => (
                    <View key={s} style={styles.miniTag}>
                      <Text style={styles.miniTagText}>{s}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingText}>{item.rating} ({item.reviewCount})</Text>
                </View>
              </View>
              <MatchBadge pct={item.matchPct} />
            </Card>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>매칭률순</Text>
            <Text style={styles.sortChev}>▼</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 20, color: Colors.text },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.black },
  headerSub: { fontSize: 11, color: Colors.textMute },
  aiLink: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  sortLabel: { fontSize: 12, color: Colors.textMute },
  sortChev: { fontSize: 9, color: Colors.textMute },
  mateCard: { flexDirection: 'row', alignItems: 'center', gap: 10, position: 'relative', paddingLeft: 28 },
  rankBadge: {
    position: 'absolute',
    left: 10,
    top: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontSize: 9, color: Colors.white, fontWeight: '800' },
  mateInfo: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mateName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  verBadge: {
    backgroundColor: Colors.greenBg,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  verText: { fontSize: 9, color: Colors.green, fontWeight: '600' },
  mateDetail: { fontSize: 11, color: Colors.textMute },
  tagRow: { flexDirection: 'row', gap: 4 },
  miniTag: {
    backgroundColor: Colors.tagBg,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 0.3,
    borderColor: Colors.tagBorder,
  },
  miniTagText: { fontSize: 10, color: Colors.tagText },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { color: Colors.star, fontSize: 11 },
  ratingText: { fontSize: 11, color: Colors.textMute },
});
