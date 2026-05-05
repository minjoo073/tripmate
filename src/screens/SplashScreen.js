import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../constants/colors';

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>📍</Text>
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.appName}>TripMate</Text>
          <Text style={styles.slogan}>여행 일정과 스타일로{'\n'}딱 맞는 동행을 찾아보세요</Text>
        </View>

        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnPrimaryText}>회원가입 →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnOutlineText}>로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.socialText}>🔵 Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.socialText}>🍎 Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { borderColor: '#f5b800' }]} onPress={() => navigation.navigate('Main')}>
            <Text style={[styles.socialText, { color: '#b8900a' }]}>🟡 Kakao</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupHint}>계정이 없으신가요? <Text style={{ color: Colors.primary, fontWeight: '700' }}>회원가입</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 40 },
  titleBox: { alignItems: 'center', gap: 8 },
  appName: { fontSize: 32, fontWeight: '800', color: Colors.black, letterSpacing: -0.5 },
  slogan: { fontSize: 15, color: Colors.textMute, textAlign: 'center', lineHeight: 22 },
  btnGroup: { width: '100%', gap: 10, marginTop: 10 },
  btnPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  btnOutline: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  btnOutlineText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  socialRow: { flexDirection: 'row', gap: 8, width: '100%' },
  socialBtn: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  socialText: { fontSize: 12, color: Colors.textSub, fontWeight: '500' },
  signupHint: { fontSize: 13, color: Colors.textMute, marginTop: 4 },
});
