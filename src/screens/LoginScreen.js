import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← 뒤로</Text>
          </TouchableOpacity>

          <Text style={styles.title}>돌아오셨군요! ✈️</Text>
          <Text style={styles.sub}>또 떠나볼까요?</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일 주소 입력"
              placeholderTextColor={Colors.textHint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.pwWrap}>
              <TextInput
                style={styles.pwInput}
                placeholder="비밀번호 입력"
                placeholderTextColor={Colors.textHint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.replace('Main')}>
            <Text style={styles.btnPrimaryText}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>또는</Text>
            <View style={styles.divLine} />
          </View>

          <View style={styles.socialCol}>
            {[
              { emoji: '🔵', label: 'Google로 로그인' },
              { emoji: '🍎', label: 'Apple로 로그인' },
              { emoji: '🟡', label: '카카오로 로그인' },
            ].map((s) => (
              <TouchableOpacity
                key={s.label}
                style={styles.socialBtn}
                onPress={() => navigation.replace('Main')}
              >
                <Text style={styles.socialText}>{s.emoji}  {s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
            <Text style={styles.signupHint}>
              계정이 없으신가요? <Text style={{ color: Colors.primary, fontWeight: '700' }}>회원가입</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  inner: { padding: 24, paddingTop: 16, gap: 14 },
  back: { marginBottom: 8 },
  backText: { fontSize: 14, color: Colors.textSub },
  title: { fontSize: 24, fontWeight: '800', color: Colors.black },
  sub: { fontSize: 13, color: Colors.textMute, marginTop: -8 },
  formGroup: { gap: 6 },
  label: { fontSize: 13, color: Colors.textSub, fontWeight: '600' },
  input: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: '#fafaf7',
  },
  pwWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#fafaf7',
  },
  pwInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: { fontSize: 18 },
  btnPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPrimaryText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  divRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  divLine: { flex: 1, height: 0.5, backgroundColor: Colors.border },
  divText: { fontSize: 12, color: Colors.textMute },
  socialCol: { gap: 8 },
  socialBtn: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialText: { fontSize: 14, color: Colors.textSub, fontWeight: '500' },
  signupHint: { fontSize: 13, color: Colors.textMute, textAlign: 'center' },
});
