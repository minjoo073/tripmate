import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, UsersIcon } from '../../components/ui/Icon';

const THEMES = [
  '맛집 탐방', '카페 투어', '자연·풍경', '역사·문화',
  '쇼핑', '액티비티', '야경 산책', '휴양', '사진 촬영', '로컬 탐방',
];

const COMPANIONS = ['1명', '2명', '3명', '상관없음'];

export default function TripPlanScreen() {
  const insets = useSafeAreaInsets();

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [companions, setCompanions] = useState('');
  const [memo, setMemo] = useState('');

  function toggleTheme(t: string) {
    setThemes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function handleSave() {
    // 저장 후 프로필로 이동 (실제 구현 시 API 연동)
    router.replace('/(tabs)/profile');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/profile')}>
            <ArrowLeftIcon color={Colors.textPrimary} size={20} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>TRIP PLANNING</Text>
            <Text style={styles.headerTitle}>여행 계획</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.hint}>동행을 찾는 데 필요한 정보만 입력하세요. 상세 일정은 매칭 후 공유해도 늦지 않아요.</Text>

          {/* 목적지 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPinIcon color={Colors.textMuted} size={13} />
              <Text style={styles.sectionLabel}>어디로 가나요?</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="도시, 나라  예) 바르셀로나, 스페인"
              placeholderTextColor={Colors.textMuted}
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* 여행 기간 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CalendarIcon color={Colors.textMuted} size={13} />
              <Text style={styles.sectionLabel}>언제 가나요?</Text>
            </View>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.input, styles.dateInput]}
                placeholder="출발  2025.08.10"
                placeholderTextColor={Colors.textMuted}
                value={startDate}
                onChangeText={setStartDate}
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.dateDash}>–</Text>
              <TextInput
                style={[styles.input, styles.dateInput]}
                placeholder="귀국  2025.08.17"
                placeholderTextColor={Colors.textMuted}
                value={endDate}
                onChangeText={setEndDate}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* 여행 테마 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✦</Text>
              <Text style={styles.sectionLabel}>어떤 여행인가요? <Text style={styles.sectionSub}>(복수 선택)</Text></Text>
            </View>
            <View style={styles.tagWrap}>
              {THEMES.map((t) => {
                const active = themes.includes(t);
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tag, active && styles.tagActive]}
                    onPress={() => toggleTheme(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 동행 인원 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UsersIcon color={Colors.textMuted} size={13} />
              <Text style={styles.sectionLabel}>몇 명과 함께하고 싶으세요?</Text>
            </View>
            <View style={styles.companionRow}>
              {COMPANIONS.map((c) => {
                const active = companions === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.companionBtn, active && styles.companionBtnActive]}
                    onPress={() => setCompanions(c)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.companionText, active && styles.companionTextActive]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 한 줄 소개 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✦</Text>
              <Text style={styles.sectionLabel}>이 여행을 한 문장으로 <Text style={styles.sectionSub}>(선택)</Text></Text>
            </View>
            <TextInput
              style={[styles.input, styles.memoInput]}
              placeholder="예) 골목골목 걸으며 느끼는 유럽의 일상"
              placeholderTextColor={Colors.textMuted}
              value={memo}
              onChangeText={setMemo}
              maxLength={40}
              multiline={false}
            />
            <Text style={styles.charCount}>{memo.length} / 40</Text>
          </View>

          {/* 공개 안내 */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              입력한 정보는 동행을 찾을 때만 공개됩니다. 상세 일정·숙소·항공편은 포함되지 않아요.
            </Text>
          </View>
        </ScrollView>

        {/* 저장 버튼 */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.saveBtn, (!destination || !startDate || !endDate) && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.88}
            disabled={!destination || !startDate || !endDate}
          >
            <Text style={styles.saveBtnText}>계획 저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 2 },
  headerLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2.5 },
  headerTitle: { fontSize: 17, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3 },
  headerRight: { width: 36 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 28 },

  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    backgroundColor: Colors.bgDeep,
    borderRadius: 10,
    padding: 13,
  },

  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { fontSize: 11, color: Colors.textMuted },
  sectionLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  sectionSub: { fontSize: 11, fontWeight: '400', color: Colors.textMuted },

  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateInput: { flex: 1 },
  dateDash: { fontSize: 16, color: Colors.textMuted, flexShrink: 0 },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  tagText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  tagTextActive: { color: Colors.primary, fontWeight: '500' },

  companionRow: { flexDirection: 'row', gap: 8 },
  companionBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  companionBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  companionText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  companionTextActive: { color: Colors.primary, fontWeight: '500' },

  memoInput: { fontSize: 13 },
  charCount: { fontSize: 10, color: Colors.textMuted, textAlign: 'right', marginTop: -4 },

  notice: {
    backgroundColor: 'rgba(192,135,70,0.08)',
    borderRadius: 10,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(192,135,70,0.18)',
  },
  noticeText: { fontSize: 11, color: Colors.accent, lineHeight: 17 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white, letterSpacing: -0.2 },
});
