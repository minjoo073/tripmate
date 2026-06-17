import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Space } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tag } from '../../../components/ui/Tag';
import { RoundHeader } from '../../../components/ui/RoundHeader';
import { useAuth } from '../../../context/AuthContext';
import { signup } from '../../../services/authService';
import { TRAVEL_STYLES } from '../../../mock/data';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleSignup = async () => {
    let valid = true;
    if (!nickname) { setNicknameError('닉네임을 입력해주세요.'); valid = false; }
    if (!email) { setEmailError('이메일을 입력해주세요.'); valid = false; }
    if (!password) { setPasswordError('비밀번호를 입력해주세요.'); valid = false; }
    if (!valid) return;

    setLoading(true);
    try {
      const user = await signup(email, password, nickname);
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      setEmailError('이미 사용 중인 이메일이에요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <RoundHeader title="TripMate 시작하기 🌍" subtitle="여행 동행을 찾아드릴게요" />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Input
          label="닉네임"
          value={nickname}
          onChangeText={(v) => { setNickname(v); setNicknameError(''); }}
          placeholder="닉네임 입력"
          containerStyle={styles.field}
          error={nicknameError}
        />
        <Input
          label="이메일"
          value={email}
          onChangeText={(v) => { setEmail(v); setEmailError(''); }}
          placeholder="이메일 주소 입력"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.field}
          error={emailError}
        />
        <Input
          label="비밀번호"
          value={password}
          onChangeText={(v) => { setPassword(v); setPasswordError(''); }}
          placeholder="비밀번호 (8자 이상)"
          isPassword
          containerStyle={styles.field}
          error={passwordError}
        />

        <Text style={styles.sectionLabel}>여행 스타일 선택</Text>
        <Text style={styles.sectionCaption}>나와 맞는 스타일을 골라주세요 (복수 선택 가능)</Text>
        <View style={styles.tagWrap}>
          {TRAVEL_STYLES.map((style) => (
            <Tag
              key={style}
              label={style}
              selected={selectedStyles.includes(style)}
              onPress={() => toggleStyle(style)}
            />
          ))}
        </View>

        <Button label="회원가입 →" onPress={handleSignup} loading={loading} style={styles.submitBtn} />

        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
          <Text style={styles.loginText}>
            이미 계정이 있으신가요? <Text style={styles.loginBold}>로그인</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Space.xxl, paddingTop: Space.xxl, paddingBottom: Space.huge },
  field: { marginBottom: Space.xl },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
    marginTop: Space.xl,
    marginBottom: Space.sm,
  },
  sectionCaption: { fontSize: 12, color: Colors.textSecondary, marginBottom: Space.md },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginBottom: Space.xxl },
  submitBtn: { marginBottom: Space.lg, marginTop: Space.sm },
  loginLink: { alignItems: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginBold: { fontWeight: '700' as const, color: Colors.primary },
});
