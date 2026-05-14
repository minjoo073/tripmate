import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Toggle } from '../../../components/ui/Toggle';
import { TRAVEL_STYLES } from '../../../mock/data';
import { FindMateFilter } from '../../../types';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [anyGender, setAnyGender] = useState(true);
  const [scheduleOverlap, setScheduleOverlap] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleSearch = () => {
    const filter: FindMateFilter = {
      destination, startDate, endDate,
      travelStyles: selectedStyles,
      anyGender, scheduleOverlap, verifiedOnly,
    };
    router.push({ pathname: '/match/loading', params: { filter: JSON.stringify(filter) } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>FIND YOUR COMPANION</Text>
        <Text style={styles.title}>동행 찾기</Text>
        <Text style={styles.subtitle}>여행지와 스타일이 맞는 여행자를 연결해드려요</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="여행지"
          value={destination}
          onChangeText={setDestination}
          placeholder="도시 또는 국가"
          containerStyle={styles.field}
        />

        <View style={styles.dateRow}>
          <Input
            label="출발일"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY.MM.DD"
            containerStyle={styles.dateField}
            keyboardType="numeric"
          />
          <Input
            label="귀국일"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY.MM.DD"
            containerStyle={styles.dateField}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.styleSection}>
          <Text style={styles.sectionLabel}>여행 스타일</Text>
          <Text style={styles.sectionSub}>나와 비슷한 여행자를 찾아드려요</Text>
          <View style={styles.tagWrap}>
            {TRAVEL_STYLES.map((style) => (
              <TouchableOpacity
                key={style}
                style={[styles.styleTag, selectedStyles.includes(style) && styles.styleTagActive]}
                onPress={() => toggleStyle(style)}
                activeOpacity={0.75}
              >
                <Text style={[styles.styleTagText, selectedStyles.includes(style) && styles.styleTagTextActive]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>필터 옵션</Text>
          <View style={styles.filterList}>
            <View style={styles.filterRow}>
              <View style={styles.filterLabelWrap}>
                <Text style={styles.filterLabel}>성별 무관</Text>
                <Text style={styles.filterDesc}>모든 성별의 여행자</Text>
              </View>
              <Toggle value={anyGender} onValueChange={setAnyGender} />
            </View>
            <View style={styles.filterRow}>
              <View style={styles.filterLabelWrap}>
                <Text style={styles.filterLabel}>일정 겹치는 분만</Text>
                <Text style={styles.filterDesc}>내 일정과 겹치는 기간</Text>
              </View>
              <Toggle value={scheduleOverlap} onValueChange={setScheduleOverlap} />
            </View>
            <View style={[styles.filterRow, styles.filterRowLast]}>
              <View style={styles.filterLabelWrap}>
                <Text style={styles.filterLabel}>인증 완료 여행자만</Text>
                <Text style={styles.filterDesc}>SNS 인증 완료</Text>
              </View>
              <Toggle value={verifiedOnly} onValueChange={setVerifiedOnly} />
            </View>
          </View>
        </View>

        <Button label="여행자 찾기" onPress={handleSearch} style={styles.searchBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },
  field: { marginBottom: 16 },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  dateField: { flex: 1 },

  styleSection: { marginBottom: 28 },
  filterSection: { marginBottom: 28 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  styleTagActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  styleTagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  styleTagTextActive: {
    color: Colors.white,
    fontWeight: '500',
  },

  filterList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  filterRowLast: { borderBottomWidth: 0 },
  filterLabelWrap: { gap: 2 },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  filterDesc: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  searchBtn: {},
});
