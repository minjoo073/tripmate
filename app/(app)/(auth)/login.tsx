import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CompassIcon } from '../../../components/ui/Icon';
import { useAuth } from '../../../context/AuthContext';
import { login } from '../../../services/authService';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      const user = await login('social@tripmate.app', 'social');
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      Alert.alert('오류', '소셜 로그인에 실패했어요.');
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
            onChangeText={setEmail}
            placeholder="이메일 주소 입력"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.field}
          />
          <Input
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호 입력"
            isPassword
            containerStyle={styles.field}
          />
          <Button label="로그인" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('google')} activeOpacity={0.82}>
            <Text style={styles.socialBtnIcon}>G</Text>
            <Text style={styles.socialBtnText}>Google로 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('apple')} activeOpacity={0.82}>
            <Text style={styles.socialBtnIcon}>⌘</Text>
            <Text style={styles.socialBtnText}>Apple로 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.kakaoBtn]} onPress={() => handleSocialLogin('kakao')} activeOpacity={0.82}>
            <Text style={styles.kakaoIcon}>K</Text>
            <Text style={[styles.socialBtnText, styles.kakaoText]}>카카오로 계속하기</Text>
          </TouchableOpacity>
        </View>

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

  signupLink: { marginTop: 32, alignItems: 'center' },
  signupText: { fontSize: 13, color: Colors.textMuted },
  signupBold: { fontWeight: '600', color: Colors.primary },
});
