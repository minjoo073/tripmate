import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { styleTags } from '../data/mockData';

export default function TripRegisterScreen({ navigation }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [intro, setIntro] = useState('');
  const [genderAny, setGenderAny] = useState(true);
  const [shareSchedule, setShareSchedule] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const toggleStyle = (s) => {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 등록</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>여행지 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="나라, 도시 입력 (예: 일본, 오사카)"
              placeholderTextColor={Colors.textHint}
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelSm}>출발일 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="2025.04.05"
                placeholderTextColor={Colors.textHint}
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelSm}>귀국일 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="2025.04.18"
                placeholderTextColor={Colors.textHint}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>여행 스타일 <Text style={styles.required}>*</Text></Text>
            <Text style={styles.labelHint}>나와 잘 맞는 동행을 찾는데 사용돼요 (최대 5개)</Text>
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
            <Text style={styles.label}>동행 조건</Text>
            {[
              { label: '성별 무관', value: genderAny, setter: setGenderAny },
              { label: '일정 공유 필수', value: shareSchedule, setter: setShareSchedule },
              { label: '인증 완료 메이트만', value: verifiedOnly, setter: setVerifiedOnly },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.condRow}
                onPress={() => item.setter(!item.value)}
              >
                <View style={[styles.checkbox, item.value && styles.checkboxOn]}>
                  {item.value && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                <Text style={styles.condLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>여행 소개</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="어떤 여행을 계획하고 있나요? 동행자에게 하고 싶은 말을 적어주세요."
              placeholderTextColor={Colors.textHint}
              value={intro}
              onChangeText={setIntro}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitBtnText}>✈️  여행 등록하기</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: 16, gap: 20 },
  formGroup: { gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.black },
  labelSm: { fontSize: 13, color: Colors.textSub, marginBottom: 4 },
  labelHint: { fontSize: 12, color: Colors.textMute, marginTop: -4 },
  required: { color: Colors.red },
  input: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: '#fafaf7',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  dateRow: { flexDirection: 'row', gap: 10 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: Colors.tagBorder,
    backgroundColor: Colors.tagBg,
  },
  tagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { fontSize: 13, color: Colors.tagText, fontWeight: '600' },
  tagTextActive: { color: Colors.white },
  condRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkIcon: { fontSize: 13, color: Colors.white, fontWeight: '700' },
  condLabel: { fontSize: 14, color: Colors.text },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
