import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RoundHeader } from '../../components/ui/RoundHeader';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

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
      <RoundHeader title="돌아오셨군요! ✈️" subtitle="또 떠나볼까요?" />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('google')}>
            <Text style={styles.socialBtnText}>🔵  Google로 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('apple')}>
            <Text style={styles.socialBtnText}>🍎  Apple로 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.kakaoBtn]} onPress={() => handleSocialLogin('kakao')}>
            <Text style={[styles.socialBtnText, styles.kakaoText]}>🟡  카카오로 로그인</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.signupLink}>
          <Text style={styles.signupText}>
            계정이 없으신가요? <Text style={styles.signupBold}>회원가입</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 0 },
  field: { marginBottom: 16 },
  loginBtn: { marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: Colors.textSecondary },
  socialButtons: { gap: 10 },
  socialBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  kakaoBtn: { backgroundColor: '#FEE500', borderColor: '#FEE500' },
  kakaoText: { color: '#3C1E1E' },
  signupLink: { marginTop: 24, alignItems: 'center' },
  signupText: { fontSize: 14, color: Colors.textSecondary },
  signupBold: { fontWeight: '700', color: Colors.primary },
});
