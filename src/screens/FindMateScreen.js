import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch,
} from 'react-native';
import { Colors } from '../constants/colors';
import { mates, styleTags } from '../data/mockData';

export default function FindMateScreen({ navigation }) {
  const [destination, setDestination] = useState('오사카');
  const [selectedStyles, setSelectedStyles] = useState(['맛집', '액티비티']);
  const [genderAny, setGenderAny] = useState(true);
  const [scheduleMatch, setScheduleMatch] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const toggleStyle = (s) => {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSearch = () => {
    navigation.navigate('MatchList', { mates });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finde a Mate</Text>
        <Text style={styles.headerSub}>여행지와 스타일이 맞는 동행을 찾아드려요</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>여행지</Text>
          <TouchableOpacity style={styles.inputBox}>
            <Text style={destination ? styles.inputText : styles.inputPlaceholder}>
              {destination || '도시, 국가 입력'}
            </Text>
            <Text>📍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSmall}>출발일</Text>
            <TouchableOpacity style={styles.inputBox}>
              <Text style={styles.inputPlaceholder}>연도.월.일</Text>
              <Text>📅</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSmall}>귀국일</Text>
            <TouchableOpacity style={styles.inputBox}>
              <Text style={styles.inputPlaceholder}>연도.월.일</Text>
              <Text>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>여행 스타일</Text>
          <View style={styles.tagWrap}>
            {styleTags.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => toggleStyle(s)}
                style={[styles.tag, selectedStyles.includes(s) && styles.tagActive]}
              >
                <Text style={[styles.tagText, selectedStyles.includes(s) && styles.tagTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>필터</Text>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>성별 무관</Text>
            <Switch
              value={genderAny}
              onValueChange={setGenderAny}
              trackColor={{ true: Colors.primary, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>일정 겹치는 메이트만</Text>
            <Switch
              value={scheduleMatch}
              onValueChange={setScheduleMatch}
              trackColor={{ true: Colors.primary, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={[styles.filterRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.filterLabel}>인증 완료 메이트만</Text>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ true: Colors.primary, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍  메이트 검색</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.black },
  headerSub: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  content: { padding: 16, gap: 18 },
  formGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.black },
  labelSmall: { fontSize: 12, color: Colors.textSub, marginBottom: 4 },
  inputBox: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#fafaf7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { fontSize: 14, color: Colors.text },
  inputPlaceholder: { fontSize: 13, color: Colors.textHint },
  dateRow: { flexDirection: 'row', gap: 10 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: Colors.tagBorder,
    backgroundColor: Colors.tagBg,
  },
  tagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { fontSize: 12, color: Colors.tagText, fontWeight: '600' },
  tagTextActive: { color: Colors.white },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  filterLabel: { fontSize: 14, color: Colors.text },
  searchBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  searchBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
