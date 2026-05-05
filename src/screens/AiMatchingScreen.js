import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated,
} from 'react-native';
import { Colors } from '../constants/colors';
import { mates } from '../data/mockData';

const steps = [
  { label: '일정 분석 중', icon: '📅', desc: '여행 날짜 겹침을 계산하고 있어요' },
  { label: '스타일 매칭 중', icon: '🎨', desc: 'AI가 여행 스타일 벡터를 분석해요' },
  { label: '신뢰도 검증 중', icon: '🔐', desc: '인증 정보와 리뷰를 검토하고 있어요' },
  { label: '순위 산정 중', icon: '🏆', desc: '최적의 매칭 순위를 계산하고 있어요' },
];

export default function AiMatchingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(() => setDone(true), 600);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentStep + 1) / steps.length,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 동행 매칭</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {!done ? (
          <>
            <Text style={styles.mainIcon}>🤖</Text>
            <Text style={styles.mainTitle}>AI가 분석하고 있어요</Text>
            <Text style={styles.mainSub}>잠시만 기다려주세요</Text>

            <View style={styles.progressBarWrap}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressPct}>{Math.round(((currentStep + 1) / steps.length) * 100)}%</Text>

            <View style={styles.stepsBox}>
              {steps.map((s, i) => (
                <View key={s.label} style={styles.stepRow}>
                  <View style={[
                    styles.stepCircle,
                    i < currentStep && styles.stepDone,
                    i === currentStep && styles.stepActive,
                  ]}>
                    <Text style={styles.stepIcon}>{i <= currentStep ? s.icon : '⏳'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stepLabel, i <= currentStep && styles.stepLabelActive]}>
                      {s.label}
                    </Text>
                    {i === currentStep && (
                      <Text style={styles.stepDesc}>{s.desc}</Text>
                    )}
                  </View>
                  {i < currentStep && <Text style={styles.checkmark}>✓</Text>}
                  {i === currentStep && <Text style={styles.spinner}>⟳</Text>}
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.doneIcon}>🎉</Text>
            <Text style={styles.doneTitle}>매칭 완료!</Text>
            <Text style={styles.doneSub}>{mates.length}명의 메이트를 찾았어요</Text>

            <View style={styles.topMates}>
              {mates.slice(0, 3).map((m, i) => (
                <View key={m.id} style={[styles.topMateCard, i === 0 && styles.topMateCardFirst]}>
                  <Text style={{ fontSize: i === 0 ? 36 : 28 }}>{m.avatar}</Text>
                  <Text style={styles.topMateName}>{m.name}</Text>
                  <Text style={[styles.topMatePct, { color: i === 0 ? Colors.primary : Colors.textSub }]}>
                    {m.matchPct}%
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.resultBtn}
              onPress={() => navigation.navigate('MatchList', { mates })}
            >
              <Text style={styles.resultBtnText}>전체 결과 보기 ({mates.length}명)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>돌아가기</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  body: { flex: 1, alignItems: 'center', padding: 24, gap: 14 },
  mainIcon: { fontSize: 60, marginTop: 20 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: Colors.black },
  mainSub: { fontSize: 14, color: Colors.textMute },
  progressBarWrap: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  progressPct: { fontSize: 13, color: Colors.primary, fontWeight: '700', alignSelf: 'flex-end' },
  stepsBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepDone: { backgroundColor: Colors.greenBg, borderColor: Colors.greenBorder },
  stepActive: { backgroundColor: Colors.tagBg, borderColor: Colors.primary },
  stepIcon: { fontSize: 16 },
  stepLabel: { fontSize: 14, color: Colors.textMute },
  stepLabelActive: { color: Colors.black, fontWeight: '700' },
  stepDesc: { fontSize: 11, color: Colors.textMute, marginTop: 2 },
  checkmark: { fontSize: 16, color: Colors.green },
  spinner: { fontSize: 18, color: Colors.primary },
  doneIcon: { fontSize: 70, marginTop: 20 },
  doneTitle: { fontSize: 26, fontWeight: '800', color: Colors.black },
  doneSub: { fontSize: 14, color: Colors.textMute },
  topMates: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 10,
    justifyContent: 'center',
  },
  topMateCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  topMateCardFirst: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    paddingVertical: 20,
  },
  topMateName: { fontSize: 13, fontWeight: '700', color: Colors.black },
  topMatePct: { fontSize: 16, fontWeight: '800' },
  resultBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resultBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  backBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: { fontSize: 14, color: Colors.textSub },
});
