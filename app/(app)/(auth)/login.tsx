import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
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
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 32 }]}>
        <Text style={styles.logo}>✈️</Text>
        <Text style={styles.title}>다시 만나서 반가워요</Text>
        <Text style={styles.subtitle}>여행을 계속해볼까요?</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('google')} activeOpacity={0.82}>
            <Text style={styles.socialBtnIcon}>🔵</Text>
            <Text style={styles.socialBtnText}>Google로 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('apple')} activeOpacity={0.82}>
            <Text style={styles.socialBtnIcon}>🍎</Text>
            <Text style={styles.socialBtnText}>Apple로 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.kakaoBtn]} onPress={() => handleSocialLogin('kakao')} activeOpacity={0.82}>
            <Text style={styles.socialBtnIcon}>🟡</Text>
            <Text style={[styles.socialBtnText, styles.kakaoText]}>카카오로 로그인</Text>
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
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 8,
  },
  logo: { fontSize: 36, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 0 },
  field: { marginBottom: 16 },
  loginBtn: { marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: Colors.textSecondary },
  socialButtons: { gap: 10 },
  socialBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  socialBtnIcon: { fontSize: 18 },
  socialBtnText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  kakaoBtn: { backgroundColor: '#FEE500', borderColor: '#FEE500' },
  kakaoText: { color: '#3C1E1E' },
  signupLink: { marginTop: 28, alignItems: 'center' },
  signupText: { fontSize: 14, color: Colors.textSecondary },
  signupBold: { fontWeight: '700', color: Colors.primary },
});
