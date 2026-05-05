import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { currentUser, styleTags } from '../data/mockData';

export default function ProfileEditScreen({ navigation }) {
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [selectedStyles, setSelectedStyles] = useState(currentUser.styles);

  const toggleStyle = (s) => {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <Avatar emoji={currentUser.avatar} bg={currentUser.avatarBg} size={80} />
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>사진 변경</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기본 정보</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름 입력"
                placeholderTextColor={Colors.textHint}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>나이</Text>
              <TextInput
                style={styles.input}
                defaultValue={String(currentUser.age)}
                keyboardType="number-pad"
                placeholder="나이 입력"
                placeholderTextColor={Colors.textHint}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>직업</Text>
              <TextInput
                style={styles.input}
                defaultValue={currentUser.job}
                placeholder="직업 입력"
                placeholderTextColor={Colors.textHint}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>자기소개</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={bio}
              onChangeText={setBio}
              placeholder="나를 소개해주세요!"
              placeholderTextColor={Colors.textHint}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>{bio.length}/200</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>여행 스타일</Text>
            <Text style={styles.sectionHint}>최대 5개 선택</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>인증</Text>
            {[
              { label: '이메일 인증', verified: currentUser.verified.email, icon: '📧' },
              { label: '인스타그램 연동', verified: currentUser.verified.instagram, icon: '📷' },
              { label: 'SNS 연동', verified: currentUser.verified.sns, icon: '🔗' },
            ].map((item) => (
              <View key={item.label} style={styles.verRow}>
                <Text style={styles.verIcon}>{item.icon}</Text>
                <Text style={styles.verLabel}>{item.label}</Text>
                {item.verified ? (
                  <View style={styles.verBadge}>
                    <Text style={styles.verBadgeText}>✓ 인증됨</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.verBtn}>
                    <Text style={styles.verBtnText}>연동하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={{ height: 30 }} />
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
  backText: { fontSize: 14, color: Colors.textSub },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  saveText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  content: { padding: 16, gap: 16 },
  avatarSection: { alignItems: 'center', gap: 12, paddingVertical: 16 },
  changePhotoBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  changePhotoText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.black },
  sectionHint: { fontSize: 12, color: Colors.textMute, marginTop: -6 },
  formGroup: { gap: 6 },
  label: { fontSize: 13, color: Colors.textSub, fontWeight: '600' },
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
  charCount: { fontSize: 12, color: Colors.textHint, textAlign: 'right' },
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
  verRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verIcon: { fontSize: 18, width: 24 },
  verLabel: { fontSize: 14, color: Colors.text, flex: 1 },
  verBadge: {
    backgroundColor: Colors.greenBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  verBadgeText: { fontSize: 12, color: Colors.green, fontWeight: '600' },
  verBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
});
