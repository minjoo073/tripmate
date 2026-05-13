import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { ChevronRightIcon } from '../../components/ui/Icon';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

type SettingRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
};

function SettingRow({ label, value, onPress, danger, rightElement }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {rightElement ? (
        rightElement
      ) : (
        <View style={styles.settingRight}>
          {value ? <Text style={styles.settingValue}>{value}</Text> : null}
          {onPress && <ChevronRightIcon color={Colors.textPlaceholder} size={18} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

type SectionProps = { title: string; children: React.ReactNode };
function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [notiMatch, setNotiMatch] = useState(true);
  const [notiChat, setNotiChat] = useState(true);
  const [notiMarketing, setNotiMarketing] = useState(false);

  const handleSignOut = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없어요. 정말 탈퇴하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', style: 'destructive', onPress: () => Alert.alert('완료', '탈퇴 처리되었어요.') },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>설정</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 관리 */}
        <Section title="프로필 관리">
          <SettingRow
            label="프로필 편집"
            value="닉네임, 사진, 소개글"
            onPress={() => router.push('/profile-setup')}
          />
          <SettingRow
            label="여행 스타일 설정"
            value="MBTI, 여행 성향"
            onPress={() => router.push('/profile-setup')}
          />
          <SettingRow
            label="SNS 계정 연결"
            value="인스타그램"
            onPress={() => Alert.alert('준비 중', '곧 제공될 예정이에요!')}
          />
        </Section>

        {/* 알림 설정 */}
        <Section title="알림 설정">
          <SettingRow
            label="메이트 매칭 알림"
            rightElement={
              <Switch
                value={notiMatch}
                onValueChange={setNotiMatch}
                trackColor={{ true: Colors.primary }}
                thumbColor={Colors.white}
              />
            }
          />
          <SettingRow
            label="채팅 알림"
            rightElement={
              <Switch
                value={notiChat}
                onValueChange={setNotiChat}
                trackColor={{ true: Colors.primary }}
                thumbColor={Colors.white}
              />
            }
          />
          <SettingRow
            label="마케팅 알림"
            rightElement={
              <Switch
                value={notiMarketing}
                onValueChange={setNotiMarketing}
                trackColor={{ true: Colors.primary }}
                thumbColor={Colors.white}
              />
            }
          />
        </Section>

        {/* 앱 정보 */}
        <Section title="앱 정보">
          <SettingRow label="앱 버전" value="v1.0.0" />
          <SettingRow
            label="이용약관"
            onPress={() => Alert.alert('이용약관', '이용약관 페이지로 이동합니다.')}
          />
          <SettingRow
            label="개인정보 처리방침"
            onPress={() => Alert.alert('개인정보 처리방침', '개인정보 처리방침 페이지로 이동합니다.')}
          />
          <SettingRow
            label="고객센터 문의"
            onPress={() => Alert.alert('고객센터', '준비 중입니다.')}
          />
        </Section>

        {/* 계정 */}
        <Section title="계정">
          <SettingRow label="로그아웃" onPress={handleSignOut} danger />
          <SettingRow label="회원 탈퇴" onPress={handleDeleteAccount} danger />
        </Section>
      </ScrollView>
    </View>
  );
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
  backBtn: { padding: 4, width: 32 },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 28 },

  section: { gap: 10 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  settingLabelDanger: { color: Colors.red },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 13, color: Colors.textSecondary },
  settingArrow: { fontSize: 20, color: Colors.textPlaceholder },
});
