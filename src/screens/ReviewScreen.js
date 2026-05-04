import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';

const reviewTags = ['친절해요', '시간 약속을 잘 지켜요', '여행 계획이 좋아요', '배려심이 넘쳐요', '대화가 잘 통해요', '다음에도 같이 여행하고 싶어요'];

export default function ReviewScreen({ navigation, route }) {
  const mate = route.params?.mate || { name: '한소희', avatar: '🐱', avatarBg: '#ddeeff' };
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [review, setReview] = useState('');

  const toggleTag = (t) => {
    setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리뷰 작성</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.mateCard}>
            <Avatar emoji={mate.avatar} bg={mate.avatarBg} size={56} />
            <View>
              <Text style={styles.mateName}>{mate.name} 님과의 여행</Text>
              <Text style={styles.mateTrip}>오사카, 일본 · 2025.01.10 ~ 01.17</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>별점</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                  <Text style={[styles.star, n <= rating && styles.starOn]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingLabel}>
              {rating === 0 ? '별점을 선택해주세요' :
               rating === 5 ? '최고예요! 🎉' :
               rating === 4 ? '좋았어요 😊' :
               rating === 3 ? '보통이에요 😐' :
               rating === 2 ? '아쉬웠어요 😢' : '별로였어요 😞'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>어떤 점이 좋았나요?</Text>
            <View style={styles.tagWrap}>
              {reviewTags.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => toggleTag(t)}
                  style={[styles.tag, selectedTags.includes(t) && styles.tagActive]}
                >
                  <Text style={[styles.tagText, selectedTags.includes(t) && styles.tagTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>자세한 후기</Text>
            <TextInput
              style={styles.textarea}
              placeholder="함께한 여행은 어땠나요? 솔직한 후기를 남겨주세요."
              placeholderTextColor={Colors.textHint}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={5}
            />
            <Text style={styles.charCount}>{review.length}/300</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={() => rating > 0 && navigation.goBack()}
          >
            <Text style={styles.submitBtnText}>리뷰 등록하기</Text>
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
  content: { padding: 16, gap: 16 },
  mateCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  mateName: { fontSize: 16, fontWeight: '700', color: Colors.black },
  mateTrip: { fontSize: 12, color: Colors.textMute, marginTop: 3 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.black },
  starsRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', paddingVertical: 8 },
  star: { fontSize: 38, color: Colors.border },
  starOn: { color: Colors.star },
  ratingLabel: { textAlign: 'center', fontSize: 14, color: Colors.textSub, fontWeight: '500' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  tagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { fontSize: 13, color: Colors.textSub },
  tagTextActive: { color: Colors.white, fontWeight: '600' },
  textarea: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.bg,
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 12, color: Colors.textHint, textAlign: 'right' },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: Colors.textHint },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
