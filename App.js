import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function PhoneFrame({ children }) {
  if (Platform.OS !== 'web') return children;

  return (
    <View style={styles.desktop}>
      {/* 배경 그라디언트 느낌 */}
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />

      {/* 브랜드 */}
      <View style={styles.brandRow}>
        <Text style={styles.brandIcon}>📍</Text>
        <Text style={styles.brandName}>TripMate</Text>
        <Text style={styles.brandSub}>여행 동행 매칭 서비스</Text>
      </View>

      {/* 폰 외곽 (notch 포함) */}
      <View style={styles.phoneOuter}>
        {/* 노치 */}
        <View style={styles.notch}>
          <View style={styles.notchCamera} />
        </View>
        {/* 버튼들 */}
        <View style={styles.sideButtonLeft1} />
        <View style={styles.sideButtonLeft2} />
        <View style={styles.sideButtonRight} />

        {/* 화면 영역 */}
        <View style={styles.phoneScreen}>
          {/* 상태바 */}
          <View style={styles.statusBar}>
            <Text style={styles.statusTime}>9:41</Text>
            <View style={styles.statusRight}>
              <Text style={styles.statusIcon}>▲▲▲</Text>
              <Text style={styles.statusIcon}>WiFi</Text>
              <Text style={styles.statusBattery}>■</Text>
            </View>
          </View>
          {/* 앱 콘텐츠 */}
          <View style={{ flex: 1, overflow: 'hidden' }}>
            {children}
          </View>
          {/* 홈 인디케이터 */}
          <View style={styles.homeIndicator}>
            <View style={styles.homeBar} />
          </View>
        </View>
      </View>

      <Text style={styles.hint}>← 스크롤하여 탐색</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PhoneFrame>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </PhoneFrame>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 20,
    paddingVertical: 40,
    overflow: 'auto',
  },
  bgDecor1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(45,58,140,0.3)',
    top: -100,
    left: -100,
  },
  bgDecor2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(240,168,48,0.15)',
    bottom: -50,
    right: -50,
  },
  brandRow: {
    alignItems: 'center',
    gap: 4,
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  phoneOuter: {
    width: 375,
    height: 780,
    backgroundColor: '#111',
    borderRadius: 50,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
    elevation: 30,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333',
  },
  notch: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: [{ translateX: -50 }],
    width: 100,
    height: 28,
    backgroundColor: '#111',
    borderRadius: 20,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notchCamera: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  sideButtonLeft1: {
    position: 'absolute',
    left: -3,
    top: 120,
    width: 3,
    height: 32,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  sideButtonLeft2: {
    position: 'absolute',
    left: -3,
    top: 168,
    width: 3,
    height: 32,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  sideButtonRight: {
    position: 'absolute',
    right: -3,
    top: 140,
    width: 3,
    height: 60,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  statusBar: {
    height: 36,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    flexShrink: 0,
  },
  statusTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 8,
    color: '#111',
    fontWeight: '700',
  },
  statusBattery: {
    fontSize: 10,
    color: '#111',
  },
  homeIndicator: {
    height: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  homeBar: {
    width: 120,
    height: 4,
    backgroundColor: '#111',
    borderRadius: 2,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
});
