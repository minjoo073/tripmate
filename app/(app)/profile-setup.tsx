import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { TRAVEL_STYLES } from '../../mock/data';
import { getProfileIcon, PROFILE_ICONS } from '../../constants/profileIcons';

const MBTI_LIST = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

const PERSONALITIES = [
  { key: 'planning', labelA: '계획형', labelB: '즉흥형', icon: '🗺️' },
  { key: 'social', labelA: '함께 시간', labelB: '혼자 시간', icon: '👥' },
  { key: 'morning', labelA: '아침형', labelB: '야행성', icon: '🌅' },
  { key: 'budget', labelA: '가성비형', labelB: '프리미엄형', icon: '💰' },
  { key: 'pace', labelA: '빠른 일정', labelB: '느린 여유', icon: '⏱️' },
];

const LOCATIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기'];

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { profile, save: saveProfile } = useProfile();

  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [selectedMbti, setSelectedMbti] = useState(profile.mbti);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(profile.styles);
  const [personalities, setPersonalities] = useState<Record<string, 'A' | 'B'>>(profile.personalities);
  const [avatarIndex, setAvatarIndex] = useState<number | null>(profile.avatarIndex);
  const [pickerOpen, setPickerOpen] = useState(false);

  const avatarSource =
    avatarIndex !== null ? PROFILE_ICONS[avatarIndex] : getProfileIcon(nickname || '나');

  const toggleStyle = (s: string) =>
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const setPersonality = (key: string, side: 'A' | 'B') =>
    setPersonalities((prev) => ({ ...prev, [key]: side }));

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    const ok = await saveProfile({
      avatarIndex,
      bio,
      location,
      mbti: selectedMbti,
      styles: selectedStyles,
      personalities,
    });
    if (!ok) {
      Alert.alert('저장 실패', '프로필을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (user && nickname.trim() !== user.nickname) {
      await updateUser({ nickname: nickname.trim() });
    }
    Alert.alert('저장 완료', '프로필이 업데이트됐어요! ✈️', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>내 여행 프로필</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 아바타 */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={() => setPickerOpen((v) => !v)} activeOpacity={0.85}>
            <Image source={avatarSource} style={styles.avatarImage} resizeMode="contain" />
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditBadgeText}>✎</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPickerOpen((v) => !v)}>
            <Text style={styles.avatarChange}>{pickerOpen ? '닫기' : '아이콘 선택'}</Text>
          </TouchableOpacity>
        </View>

        {pickerOpen && (
          <View style={styles.inlinePicker}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.inlinePickerRow}
            >
              {PROFILE_ICONS.map((icon, idx) => {
                const selected = avatarIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.inlineIconOption, selected && styles.inlineIconOptionActive]}
                    onPress={() => setAvatarIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <Image source={icon} style={styles.inlineIconImage} resizeMode="contain" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 기본 정보 */}
        <SectionHeader title="기본 정보" />
        <View style={styles.card}>
          <FieldLabel label="닉네임" />
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임 입력"
            placeholderTextColor={Colors.textPlaceholder}
            maxLength={12}
            returnKeyType="done"
            blurOnSubmit
          />
          <FieldLabel label="소개글" />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="나를 소개해주세요. 여행 스타일, 좋아하는 것들을 써보세요 ✏️"
            placeholderTextColor={Colors.textPlaceholder}
            multiline
            maxLength={120}
            returnKeyType="done"
            blurOnSubmit
          />
          <Text style={styles.charCount}>{bio.length}/120</Text>
        </View>

        {/* 거주 지역 */}
        <SectionHeader title="거주 지역" />
        <View style={styles.tagsWrap}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.tag, location === loc && styles.tagActive]}
              onPress={() => setLocation(loc)}
            >
              <Text style={[styles.tagText, location === loc && styles.tagTextActive]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MBTI */}
        <SectionHeader title="MBTI" />
        <View style={styles.tagsWrap}>
          {MBTI_LIST.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.tag, selectedMbti === m && styles.tagActive]}
              onPress={() => setSelectedMbti(m === selectedMbti ? '' : m)}
            >
              <Text style={[styles.tagText, selectedMbti === m && styles.tagTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 여행 스타일 */}
        <SectionHeader title="여행 스타일" subtitle="최대 5개 선택" />
        <View style={styles.tagsWrap}>
          {TRAVEL_STYLES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.tag, selectedStyles.includes(s) && styles.tagActive]}
              onPress={() => {
                if (!selectedStyles.includes(s) && selectedStyles.length >= 5) {
                  Alert.alert('알림', '최대 5개까지 선택할 수 있어요.');
                  return;
                }
                toggleStyle(s);
              }}
            >
              <Text style={[styles.tagText, selectedStyles.includes(s) && styles.tagTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 여행 성향 */}
        <SectionHeader title="여행 성향" subtitle="나를 표현하는 스타일을 선택해요" />
        <View style={styles.personalityList}>
          {PERSONALITIES.map((p) => (
            <View key={p.key} style={styles.personalityRow}>
              <Text style={styles.personalityIcon}>{p.icon}</Text>
              <TouchableOpacity
                style={[styles.personalityBtn, personalities[p.key] === 'A' && styles.personalityBtnActive]}
                onPress={() => setPersonality(p.key, 'A')}
              >
                <Text style={[styles.personalityBtnText, personalities[p.key] === 'A' && styles.personalityBtnTextActive]}>
                  {p.labelA}
                </Text>
              </TouchableOpacity>
              <View style={styles.personalityDivider} />
              <TouchableOpacity
                style={[styles.personalityBtn, personalities[p.key] === 'B' && styles.personalityBtnActive]}
                onPress={() => setPersonality(p.key, 'B')}
              >
                <Text style={[styles.personalityBtnText, personalities[p.key] === 'B' && styles.personalityBtnTextActive]}>
                  {p.labelB}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 신뢰 인증 */}
        <SectionHeader title="신뢰 인증" subtitle="인증 완료 시 신뢰도가 올라가요" />
        <TouchableOpacity
          style={styles.snsBtn}
          onPress={() => router.push('/verification')}
        >
          <Text style={styles.snsBtnIcon}>🛡️</Text>
          <View style={styles.snsBtnInfo}>
            <Text style={styles.snsBtnTitle}>신뢰 인증 센터</Text>
            <Text style={styles.snsBtnDesc}>신분증, SNS 등 인증을 완료하면 배지가 표시돼요</Text>
          </View>
          <Text style={styles.snsBtnArrow}>›</Text>
        </TouchableOpacity>

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>프로필 저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.fieldLabel}>{label}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: { padding: 4, width: 40 },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  saveBtnText: { fontSize: 14, color: Colors.white, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },

  avatarSection: { alignItems: 'center', paddingVertical: 8, gap: 10 },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 84, height: 84 },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  avatarEditBadgeText: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  avatarChange: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  inlinePicker: {
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 10,
  },
  inlinePickerRow: {
    paddingHorizontal: 10,
    gap: 8,
    alignItems: 'center',
  },
  inlineIconOption: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inlineIconOptionActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  inlineIconImage: { width: '70%', height: '70%' },

  sectionHeader: { gap: 2, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sectionSubtitle: { fontSize: 12, color: Colors.textSecondary },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 8,
  },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginTop: 4 },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  textArea: { height: 88, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: Colors.textPlaceholder, textAlign: 'right' },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tagTextActive: { color: Colors.white, fontWeight: '700' },

  personalityList: { gap: 10 },
  personalityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  personalityIcon: { fontSize: 20, width: 28 },
  personalityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  personalityBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  personalityBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  personalityBtnTextActive: { color: Colors.white, fontWeight: '700' },
  personalityDivider: { width: 1, height: 20, backgroundColor: Colors.cardBorder },

  snsBtn: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  snsBtnIcon: { fontSize: 28 },
  snsBtnInfo: { flex: 1 },
  snsBtnTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  snsBtnDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  snsBtnArrow: { fontSize: 20, color: Colors.textPlaceholder },

  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { fontSize: 16, color: Colors.white, fontWeight: '700' },
});
