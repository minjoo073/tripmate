import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tag } from '../../components/ui/Tag';
import { RoundHeader } from '../../components/ui/RoundHeader';
import { useAuth } from '../../context/AuthContext';
import { signup } from '../../services/authService';
import { TRAVEL_STYLES } from '../../mock/data';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleSignup = async () => {
    if (!nickname || !email || !password) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const user = await signup(email, password, nickname);
      await signIn(user);
      router.replace('/(tabs)/');
    } catch {
      Alert.alert('가입 실패', '이미 사용 중인 이메일이에요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <RoundHeader title="TripMate 시작하기 🌍" subtitle="여행 동행을 찾아드릴게요" />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Input label="닉네임" value={nickname} onChangeText={setNickname} placeholder="닉네임 입력" containerStyle={styles.field} />
        <Input label="이메일" value={email} onChangeText={setEmail} placeholder="이메일 주소 입력" keyboardType="email-address" autoCapitalize="none" containerStyle={styles.field} />
        <Input label="비밀번호" value={password} onChangeText={setPassword} placeholder="비밀번호 (8자 이상)" isPassword containerStyle={styles.field} />

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
  bodyContent: { padding: 24 },
  field: { marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 8, marginBottom: 4 },
  sectionCaption: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  submitBtn: { marginBottom: 16 },
  loginLink: { alignItems: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginBold: { fontWeight: '700', color: Colors.primary },
});
