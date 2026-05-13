import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tag } from '../../../components/ui/Tag';
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
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>메이트 찾기</Text>
        <Text style={styles.subtitle}>여행지와 스타일이 맞는 동행을 찾아드려요</Text>
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
          placeholder="도시, 국가 입력"
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

        <Text style={styles.sectionLabel}>여행 스타일</Text>
        <View style={styles.tagWrap}>
          {TRAVEL_STYLES.map((style) => (
            <Tag
              key={style}
              label={style}
              selected={selectedStyles.includes(style)}
              onPress={() => toggleStyle(style)}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>필터</Text>
        <View style={styles.filterList}>
          <View style={styles.filterRow}>
            <View style={styles.filterLabelWrap}>
              <Text style={styles.filterLabel}>성별 무관</Text>
              <Text style={styles.filterDesc}>모든 성별의 메이트</Text>
            </View>
            <Toggle value={anyGender} onValueChange={setAnyGender} />
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterLabelWrap}>
              <Text style={styles.filterLabel}>일정 겹치는 메이트만</Text>
              <Text style={styles.filterDesc}>내 일정과 겹치는 기간만</Text>
            </View>
            <Toggle value={scheduleOverlap} onValueChange={setScheduleOverlap} />
          </View>
          <View style={[styles.filterRow, styles.filterRowLast]}>
            <View style={styles.filterLabelWrap}>
              <Text style={styles.filterLabel}>인증 완료 희망만</Text>
              <Text style={styles.filterDesc}>SNS 인증 완료 메이트만</Text>
            </View>
            <Toggle value={verifiedOnly} onValueChange={setVerifiedOnly} />
          </View>
        </View>

        <Button label="메이트 검색" onPress={handleSearch} style={styles.searchBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.white,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },
  field: { marginBottom: 16 },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  dateField: { flex: 1 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  filterList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  filterRowLast: { borderBottomWidth: 0 },
  filterLabelWrap: { gap: 2 },
  filterLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  filterDesc: { fontSize: 11, color: Colors.textSecondary },
  searchBtn: {},
});
