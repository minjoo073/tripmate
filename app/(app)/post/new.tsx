import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { ArrowLeftIcon, MapPinIcon, CameraIcon } from '../../../components/ui/Icon';

const POST_TYPES = [
  { id: 'travel', label: '여행 기록', desc: '다녀온 여행의 기억을 기록해요' },
  { id: 'local', label: '로컬 추천', desc: '현지인만 아는 장소를 공유해요' },
  { id: 'companion', label: '동행 찾기', desc: '같이 여행할 분을 모집해요' },
];

const STYLE_TAGS = ['맛집', '카페', '관광', '사진', '쇼핑', '액티비티', '힐링', '역사/문화', '야경', '로컬'];

export default function NewPostScreen() {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState('travel');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [destination, setDestination] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  function toggleTag(t: string) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function handlePost() {
    router.replace('/(tabs)/community');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <ArrowLeftIcon color={Colors.textPrimary} size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기록하기</Text>
          <TouchableOpacity
            style={[styles.postBtn, !canSubmit && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={[styles.postBtnText, !canSubmit && styles.postBtnTextDisabled]}>게시</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post type selector */}
          <View style={styles.typeRow}>
            {POST_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt.id}
                style={[styles.typeCard, type === pt.id && styles.typeCardActive]}
                onPress={() => setType(pt.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.typeLabel, type === pt.id && styles.typeLabelActive]}>{pt.label}</Text>
                <Text style={[styles.typeDesc, type === pt.id && styles.typeDescActive]}>{pt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo placeholder */}
          <TouchableOpacity style={styles.photoArea} activeOpacity={0.8}>
            <CameraIcon color={Colors.textMuted} size={24} />
            <Text style={styles.photoText}>사진 추가</Text>
            <Text style={styles.photoSub}>최대 10장</Text>
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.field}>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />
          </View>

          {/* Content */}
          <View style={styles.field}>
            <TextInput
              style={styles.contentInput}
              placeholder="여행 이야기를 자유롭게 써보세요..."
              placeholderTextColor={Colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Destination */}
          <View style={styles.inlineField}>
            <MapPinIcon color={Colors.textMuted} size={13} />
            <TextInput
              style={styles.inlineInput}
              placeholder="여행지 (예: 도쿄, 일본)"
              placeholderTextColor={Colors.textMuted}
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* Tags */}
          <View style={styles.tagSection}>
            <Text style={styles.tagSectionTitle}>여행 스타일 태그</Text>
            <View style={styles.tagWrap}>
              {STYLE_TAGS.map((t) => {
                const active = tags.includes(t);
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tag, active && styles.tagActive]}
                    onPress={() => toggleTag(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.2 },
  postBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  postBtnDisabled: { backgroundColor: Colors.bgDeep },
  postBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
  postBtnTextDisabled: { color: Colors.textMuted },

  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },

  typeRow: { flexDirection: 'row', gap: 8 },
  typeCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  typeCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  typeLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  typeLabelActive: { color: Colors.primary },
  typeDesc: { fontSize: 10, color: Colors.textMuted, lineHeight: 14 },
  typeDescActive: { color: Colors.dustBlue },

  photoArea: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  photoSub: { fontSize: 11, color: Colors.textMuted },

  field: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  titleInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  contentInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    minHeight: 140,
  },

  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inlineInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  tagSection: { gap: 10 },
  tagSectionTitle: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  tagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  tagTextActive: { color: Colors.primary, fontWeight: '500' },
});
