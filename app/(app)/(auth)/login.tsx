import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CompassIcon } from '../../../components/ui/Icon';
import { useAuth } from '../../../context/AuthContext';
import { login, guestLogin } from '../../../services/authService';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  const handleGuestLogin = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    setDemoError('');
    try {
      const user = await guestLogin();
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      setDemoError('입장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleLogin = async () => {
    let valid = true;
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      valid = false;
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      setPasswordError('이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 48 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appLabel}>TRIPMATE</Text>
          <CompassIcon color={Colors.textMuted} size={22} />
          <Text style={styles.title}>다시 만나서{'\n'}반가워요</Text>
          <Text style={styles.subtitle}>여행을 계속해볼까요?</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
            placeholder="비밀번호 입력"
            isPassword
            containerStyle={styles.field}
            error={passwordError}
          />
          <Button label="로그인" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social — OAuth SDK 미연동으로 준비 중 상태 */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialBtn, styles.disabledBtn]} disabled activeOpacity={1}>
            <Text style={styles.socialBtnIcon}>G</Text>
            <Text style={styles.socialBtnText}>Google로 계속하기 (준비 중)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.disabledBtn]} disabled activeOpacity={1}>
            <Text style={styles.socialBtnIcon}>⌘</Text>
            <Text style={styles.socialBtnText}>Apple로 계속하기 (준비 중)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.kakaoBtn, styles.disabledBtn]} disabled activeOpacity={1}>
            <Text style={styles.kakaoIcon}>K</Text>
            <Text style={[styles.socialBtnText, styles.kakaoText]}>카카오로 계속하기 (준비 중)</Text>
          </TouchableOpacity>
        </View>

        {/* 데모 입장 — 로그인 없이 앱 체험 */}
        <TouchableOpacity
          style={[styles.demoBtn, demoLoading && styles.demoBtnDisabled]}
          onPress={handleGuestLogin}
          disabled={demoLoading}
          activeOpacity={0.85}
        >
          {demoLoading ? (
            <>
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.demoBtnText}>입장 중...</Text>
            </>
          ) : (
            <Text style={styles.demoBtnText}>🧭  데모 버전으로 입장하기</Text>
          )}
        </TouchableOpacity>
        {demoLoading && (
          <Text style={styles.demoHint}>서버를 깨우는 중이에요. 처음엔 1분까지 걸릴 수 있어요.</Text>
        )}
        {demoError !== '' && (
          <Text style={styles.demoError}>{demoError}</Text>
        )}

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.signupLink}>
          <Text style={styles.signupText}>
            계정이 없으신가요?{'  '}
            <Text style={styles.signupBold}>회원가입</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 48 },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: 20,
  },
  logo: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '300',
    letterSpacing: 0.1,
  },

  form: { gap: 0 },
  field: { marginBottom: 14 },
  loginBtn: { marginTop: 6 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  dividerText: { marginHorizontal: 14, fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },

  socialButtons: { gap: 10 },
  socialBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  disabledBtn: { opacity: 0.45 },
  socialBtnIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    width: 20,
    textAlign: 'center',
  },
  socialBtnText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  kakaoBtn: { backgroundColor: '#FEE500', borderColor: '#FEE500' },
  kakaoIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C1E1E',
    width: 20,
    textAlign: 'center',
  },
  kakaoText: { color: '#3C1E1E' },

  // 데모 버튼: 기존 소셜 버튼과 회원가입 링크 사이 — primary 라이트 톤
  demoBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  demoBtnDisabled: { opacity: 0.6 },
  demoBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  demoHint: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  demoError: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 18,
  },

  signupLink: { marginTop: 32, alignItems: 'center' },
  signupText: { fontSize: 13, color: Colors.textMuted },
  signupBold: { fontWeight: '600', color: Colors.primary },
});
