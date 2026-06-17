import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Elevation, Radius, Space, Font } from '../../../constants/colors';
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
            style={[styles.postBtn, !canSubmit && styles.postBtnDisabled, canSubmit && Elevation.primary]}
            onPress={handlePost}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={[styles.postBtnText, !canSubmit && styles.postBtnTextDisabled]}>게시</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post type selector */}
          <View style={styles.typeRow}>
            {POST_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt.id}
                style={[
                  styles.typeCard,
                  type === pt.id && styles.typeCardActive,
                  type === pt.id && Elevation.sm,
                ]}
                onPress={() => setType(pt.id)}
                activeOpacity={0.82}
              >
                <Text style={[styles.typeLabel, type === pt.id && styles.typeLabelActive]}>{pt.label}</Text>
                <Text style={[styles.typeDesc, type === pt.id && styles.typeDescActive]}>{pt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo placeholder */}
          <TouchableOpacity style={[styles.photoArea, Elevation.sm]} activeOpacity={0.82}>
            <View style={styles.photoInner}>
              <CameraIcon color={Colors.textMuted} size={22} />
              <Text style={styles.photoText}>사진 추가</Text>
              <Text style={styles.photoSub}>최대 10장</Text>
            </View>
          </TouchableOpacity>

          {/* Title */}
          <View style={[styles.field, Elevation.sm]}>
            <Text style={styles.fieldLabel}>제목</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              placeholderTextColor={Colors.textPlaceholder}
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />
          </View>

          {/* Content */}
          <View style={[styles.field, Elevation.sm]}>
            <Text style={styles.fieldLabel}>본문</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="여행 이야기를 자유롭게 써보세요..."
              placeholderTextColor={Colors.textPlaceholder}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Destination */}
          <View style={[styles.inlineField, Elevation.sm]}>
            <MapPinIcon color={Colors.accent} size={14} />
            <TextInput
              style={styles.inlineInput}
              placeholder="여행지 (예: 도쿄, 일본)"
              placeholderTextColor={Colors.textPlaceholder}
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
                    style={[styles.tag, active && styles.tagActive, active && Elevation.sm]}
                    onPress={() => toggleTag(t)}
                    activeOpacity={0.82}
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
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.2,
    ...Platform.select({ web: { fontFamily: Font.serif, fontWeight: '400', fontSize: 18 } }),
  },
  postBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.xs + 3,
  },
  postBtnDisabled: {
    backgroundColor: Colors.bgDeep,
    shadowColor: 'transparent',
    elevation: 0,
  },
  postBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
  postBtnTextDisabled: { color: Colors.textMuted },

  scroll: { flex: 1 },
  content: {
    padding: Space.xl,
    gap: Space.md,
  },

  // ── Post type cards ───────────────────────────────────────────────────────
  typeRow: { flexDirection: 'row', gap: Space.sm },
  typeCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Space.md,
    gap: Space.xs,
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

  // ── Photo area ────────────────────────────────────────────────────────────
  photoArea: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    height: 120,
    overflow: 'hidden',
  },
  photoInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.xs,
  },
  photoText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  photoSub: { fontSize: 11, color: Colors.textMuted },

  // ── Input fields ──────────────────────────────────────────────────────────
  field: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    paddingTop: Space.md,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: Space.lg,
    marginBottom: Space.xs,
  },
  titleInput: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  contentInput: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 23,
    minHeight: 160,
  },

  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
  },
  inlineInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  // ── Style tags ────────────────────────────────────────────────────────────
  tagSection: { gap: Space.sm },
  tagSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  tag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Space.md,
    paddingVertical: Space.xs + 2,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  tagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  tagTextActive: { color: Colors.primary, fontWeight: '600' },
});
