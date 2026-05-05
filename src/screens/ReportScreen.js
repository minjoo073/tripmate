import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Switch,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';

const reasons = [
  '부적절한 프로필 사진',
  '허위 정보 기재',
  '불쾌한 메시지 전송',
  '사기 / 금전 요구',
  '성희롱 / 성적 발언',
  '기타',
];

export default function ReportScreen({ navigation, route }) {
  const mate = route.params?.mate;
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신고하기</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {mate && (
          <View style={styles.targetCard}>
            <Avatar emoji={mate.avatar} bg={mate.avatarBg} size={44} />
            <View>
              <Text style={styles.targetName}>{mate.name} 님을 신고합니다</Text>
              <Text style={styles.targetSub}>허위 신고 시 불이익을 받을 수 있어요</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>신고 사유</Text>
          {reasons.map((r) => (
            <TouchableOpacity
              key={r}
              style={styles.reasonRow}
              onPress={() => setSelectedReason(r)}
            >
              <View style={[styles.radio, selectedReason === r && styles.radioOn]}>
                {selectedReason === r && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.reasonText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 내용 (선택)</Text>
          <TextInput
            style={styles.textarea}
            placeholder="신고 내용을 자세히 설명해주세요..."
            placeholderTextColor={Colors.textHint}
            value={detail}
            onChangeText={setDetail}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.blockRow}>
          <View>
            <Text style={styles.blockLabel}>동시에 차단하기</Text>
            <Text style={styles.blockSub}>차단하면 서로 프로필을 볼 수 없어요</Text>
          </View>
          <Switch
            value={alsoBlock}
            onValueChange={setAlsoBlock}
            trackColor={{ true: Colors.primary, false: Colors.border }}
            thumbColor={Colors.white}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !selectedReason && styles.submitBtnDisabled]}
          onPress={() => selectedReason && navigation.goBack()}
        >
          <Text style={styles.submitBtnText}>신고 접수하기</Text>
        </TouchableOpacity>

        <Text style={styles.notice}>신고는 24시간 이내에 검토되며, 처리 결과를 알림으로 안내드려요.</Text>
        <View style={{ height: 20 }} />
      </ScrollView>
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
  content: { padding: 16, gap: 14 },
  targetCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  targetName: { fontSize: 14, fontWeight: '700', color: Colors.black },
  targetSub: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  reasonText: { fontSize: 14, color: Colors.text },
  textarea: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.bg,
    height: 100,
    textAlignVertical: 'top',
  },
  blockRow: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  blockLabel: { fontSize: 15, fontWeight: '600', color: Colors.black },
  blockSub: { fontSize: 12, color: Colors.textMute, marginTop: 2 },
  submitBtn: {
    backgroundColor: Colors.red,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: Colors.textHint },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  notice: { fontSize: 12, color: Colors.textMute, textAlign: 'center', lineHeight: 18 },
});
