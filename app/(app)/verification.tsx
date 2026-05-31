import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useVerification } from '../../context/VerificationContext';
import {
  ArrowLeftIcon, PhoneIcon, MailIcon, IdCardIcon, LinkIcon, StarIcon,
  ShieldCheckIcon, AwardIcon, TrendingUpIcon, MessageIcon, LockIcon,
} from '../../components/ui/Icon';

type VerifyStatus = 'none' | 'pending' | 'done';

interface VerifyItem {
  key: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  trust: number;
}

const ICON_COLOR = Colors.primary;
const ICON_SIZE = 24;

const VERIFY_ITEMS: VerifyItem[] = [
  { key: 'phone', icon: <PhoneIcon color={ICON_COLOR} size={ICON_SIZE} />, title: '휴대폰 인증', desc: '본인 명의 휴대폰으로 인증합니다.', trust: 20 },
  { key: 'email', icon: <MailIcon color={ICON_COLOR} size={ICON_SIZE} />, title: '이메일 인증', desc: '이메일 주소를 인증합니다.', trust: 10 },
  { key: 'id', icon: <IdCardIcon color={ICON_COLOR} size={ICON_SIZE} />, title: '신분증 인증', desc: '주민등록증 또는 여권으로 본인 확인을 합니다.', trust: 30 },
  { key: 'instagram', icon: <LinkIcon color={ICON_COLOR} size={ICON_SIZE} />, title: '인스타그램 연결', desc: 'SNS 활동으로 실존 인물임을 확인합니다.', trust: 15 },
  { key: 'review', icon: <StarIcon color={ICON_COLOR} size={ICON_SIZE} />, title: '동행 후기 3건 이상', desc: '다른 메이트의 실제 후기로 신뢰도를 높입니다.', trust: 25 },
];

function trustColor(score: number) {
  if (score >= 80) return Colors.olive;
  if (score >= 50) return Colors.dustBlue;
  return Colors.accent;
}

function trustLabel(score: number) {
  if (score >= 80) return '신뢰 우수';
  if (score >= 50) return '신뢰 보통';
  return '인증 필요';
}

export default function VerificationScreen() {
  const insets = useSafeAreaInsets();
  const { isVerified, setVerified } = useVerification();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const statusOf = (key: string): VerifyStatus =>
    isVerified(key) ? 'done' : pendingKey === key ? 'pending' : 'none';

  const totalTrust = VERIFY_ITEMS.reduce((sum, item) => sum + (isVerified(item.key) ? item.trust : 0), 0);
  const maxTrust = VERIFY_ITEMS.reduce((sum, item) => sum + item.trust, 0);
  const trustPct = Math.round((totalTrust / maxTrust) * 100);
  const doneCount = VERIFY_ITEMS.filter((i) => isVerified(i.key)).length;

  const runFakeFlow = (key: string, successTitle: string, successMsg: string) => {
    setPendingKey(key);
    setTimeout(async () => {
      await setVerified(key, true);
      setPendingKey(null);
      Alert.alert(successTitle, successMsg);
    }, 1500);
  };

  const handleVerify = (key: string) => {
    if (isVerified(key) || pendingKey) return;

    if (key === 'id') {
      Alert.alert(
        '신분증 인증',
        '주민등록증 또는 여권 사진을 업로드합니다.\n개인정보는 암호화되어 안전하게 처리됩니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '인증하기', onPress: () => runFakeFlow(key, '인증 완료', '신분증 인증이 완료되었습니다.') },
        ],
      );
    } else if (key === 'instagram') {
      Alert.alert(
        '인스타그램 연결',
        '인스타그램 계정을 연결하면 프로필에 인증 배지가 표시됩니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '연결하기', onPress: () => runFakeFlow(key, '연결 완료', '인스타그램이 연결되었습니다.') },
        ],
      );
    } else if (key === 'review') {
      Alert.alert('안내', '동행 후기는 여행 완료 후 자동으로 반영됩니다.');
    } else {
      runFakeFlow(key, '인증 완료', '인증이 완료되었습니다.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>TRUST CENTER</Text>
          <Text style={styles.title}>신뢰 인증</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trust score card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: trustColor(trustPct) }]}>{trustPct}</Text>
              <Text style={styles.scoreUnit}>점</Text>
            </View>
            <View style={styles.scoreInfo}>
              <View style={[styles.trustBadge, { backgroundColor: trustColor(trustPct) + '1A' }]}>
                <View style={[styles.trustDot, { backgroundColor: trustColor(trustPct) }]} />
                <Text style={[styles.trustBadgeText, { color: trustColor(trustPct) }]}>{trustLabel(trustPct)}</Text>
              </View>
              <Text style={styles.scoreDesc}>
                {doneCount}/{items.length}개 항목 인증 완료
              </Text>
            </View>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${trustPct}%`, backgroundColor: trustColor(trustPct) }]} />
          </View>
          <Text style={styles.scoreHint}>
            인증을 완료할수록 매칭 우선순위가 올라가고, 다른 메이트에게 신뢰감을 줄 수 있어요.
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>인증 혜택</Text>
          <View style={styles.benefitRow}>
            <AwardIcon color={Colors.primary} size={16} />
            <Text style={styles.benefitText}>프로필에 인증 배지 표시</Text>
          </View>
          <View style={styles.benefitRow}>
            <TrendingUpIcon color={Colors.primary} size={16} />
            <Text style={styles.benefitText}>매칭 추천 우선 노출</Text>
          </View>
          <View style={styles.benefitRow}>
            <MessageIcon color={Colors.primary} size={16} />
            <Text style={styles.benefitText}>채팅 신청 시 수락률 2배 증가</Text>
          </View>
          <View style={styles.benefitRow}>
            <ShieldCheckIcon color={Colors.primary} size={16} />
            <Text style={styles.benefitText}>동행자에게 안심 정보 제공</Text>
          </View>
        </View>

        {/* Verification items */}
        <Text style={styles.sectionTitle}>인증 항목</Text>
        {VERIFY_ITEMS.map((item) => {
          const s = statusOf(item.key);
          return (
            <View key={item.key} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.itemIconWrap}>{item.icon}</View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={[
                      styles.trustPointBadge,
                      s === 'done' && styles.trustPointBadgeDone,
                    ]}>
                      <Text style={[
                        styles.trustPointText,
                        s === 'done' && styles.trustPointTextDone,
                      ]}>+{item.trust}점</Text>
                    </View>
                  </View>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
              </View>
              {s === 'done' ? (
                <View style={styles.doneBadge}>
                  <Text style={styles.doneText}>인증 완료</Text>
                </View>
              ) : s === 'pending' ? (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>확인 중...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.verifyBtn}
                  onPress={() => handleVerify(item.key)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.verifyBtnText}>인증하기</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Safety notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeTitleRow}>
            <LockIcon color={Colors.textPrimary} size={15} />
            <Text style={styles.noticeTitle}>안전 안내</Text>
          </View>
          <Text style={styles.noticeText}>
            제출된 개인정보는 본인 확인 용도로만 사용되며, 확인 후 즉시 암호화 처리됩니다.
            다른 사용자에게 개인정보가 노출되지 않습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: { padding: 4 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },

  scoreCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 16,
  },
  scoreTop: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreValue: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  scoreUnit: { fontSize: 14, fontWeight: '500', color: Colors.textMuted, marginTop: 8 },
  scoreInfo: { flex: 1, gap: 8 },
  trustBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
  },
  trustDot: { width: 6, height: 6, borderRadius: 3 },
  trustBadgeText: { fontSize: 12, fontWeight: '700' },
  scoreDesc: { fontSize: 13, color: Colors.textSecondary },
  progressBg: {
    height: 6, borderRadius: 3,
    backgroundColor: Colors.bgDeep,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  scoreHint: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  benefitsCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(59,81,120,0.10)',
  },
  benefitsTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { fontSize: 13, color: Colors.textSecondary },

  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: Colors.textPrimary,
    marginTop: 4,
  },

  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
  },
  itemTop: { flexDirection: 'row', gap: 14 },
  itemIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center' as const, justifyContent: 'center' as const,
    marginTop: 2,
  },
  itemInfo: { flex: 1, gap: 6 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  trustPointBadge: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  trustPointBadgeDone: { backgroundColor: 'rgba(110,125,98,0.12)' },
  trustPointText: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  trustPointTextDone: { color: Colors.olive },
  itemDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  doneBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(110,125,98,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  doneText: { fontSize: 13, fontWeight: '600', color: Colors.olive },

  pendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pendingText: { fontSize: 13, fontWeight: '600', color: Colors.accent },

  verifyBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  verifyBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  noticeCard: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginTop: 4,
  },
  noticeTitleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  noticeText: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
});
