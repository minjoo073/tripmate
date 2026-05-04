import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch,
} from 'react-native';
import { Colors } from '../constants/colors';

const settingsGroups = [
  {
    title: '계정',
    items: [
      { label: '이메일 주소', value: 'jieun@example.com', type: 'nav' },
      { label: '비밀번호 변경', type: 'nav' },
      { label: '연결된 소셜 계정', type: 'nav' },
    ],
  },
  {
    title: '알림',
    items: [
      { label: '매칭 알림', type: 'toggle', key: 'match' },
      { label: '채팅 알림', type: 'toggle', key: 'chat' },
      { label: '커뮤니티 알림', type: 'toggle', key: 'community' },
      { label: '이벤트 & 프로모션', type: 'toggle', key: 'event' },
    ],
  },
  {
    title: '개인정보',
    items: [
      { label: '프로필 공개 범위', value: '전체 공개', type: 'nav' },
      { label: '차단 목록', type: 'nav' },
      { label: '개인정보 처리방침', type: 'nav' },
    ],
  },
  {
    title: '지원',
    items: [
      { label: '공지사항', type: 'nav' },
      { label: '고객 센터', type: 'nav' },
      { label: '앱 버전', value: 'v1.0.0', type: 'info' },
    ],
  },
];

export default function SettingsScreen({ navigation }) {
  const [toggles, setToggles] = useState({ match: true, chat: true, community: false, event: false });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, idx) => (
                <View key={item.label}>
                  {idx > 0 && <View style={styles.sep} />}
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={toggles[item.key]}
                        onValueChange={(v) => setToggles((prev) => ({ ...prev, [item.key]: v }))}
                        trackColor={{ true: Colors.primary, false: Colors.border }}
                        thumbColor={Colors.white}
                      />
                    ) : item.type === 'nav' ? (
                      <View style={styles.navRight}>
                        {item.value && <Text style={styles.navValue}>{item.value}</Text>}
                        <Text style={styles.navChev}>›</Text>
                      </View>
                    ) : (
                      <Text style={styles.infoValue}>{item.value}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Splash')}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
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
  group: { paddingHorizontal: 14, paddingTop: 20 },
  groupTitle: { fontSize: 12, color: Colors.textMute, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: { fontSize: 15, color: Colors.black },
  sep: { height: 0.5, backgroundColor: Colors.borderLight, marginLeft: 16 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navValue: { fontSize: 13, color: Colors.textMute },
  navChev: { fontSize: 20, color: Colors.textMute },
  infoValue: { fontSize: 13, color: Colors.textMute },
  logoutBtn: {
    margin: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutText: { fontSize: 15, color: Colors.textSub, fontWeight: '600' },
  withdrawBtn: {
    marginHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  withdrawText: { fontSize: 13, color: Colors.red },
});
