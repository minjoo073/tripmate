import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View, StyleSheet } from 'react-native';

// Inject SUIT font + enforce full-viewport root on web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const existing = document.getElementById('suit-font');
  if (!existing) {
    const link = document.createElement('link');
    link.id = 'suit-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=SUIT:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(link);

    // Cormorant Garamond for editorial headers
    const link2 = document.createElement('link');
    link2.id = 'cormorant-font';
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap';
    document.head.appendChild(link2);

    const style = document.createElement('style');
    style.textContent = `
      html, body { height: 100%; margin: 0; padding: 0; }
      #root { height: 100%; display: flex; flex-direction: column; }
      body, * { font-family: 'SUIT', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif !important; }
      .editorial-label { font-family: 'Cormorant Garamond', Georgia, serif !important; }
    `;
    document.head.appendChild(style);
  }
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="landing" />
    </Stack>
  );
}

export default function RootLayout() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOuter}>
        <GestureHandlerRootView style={styles.webColumn}>
          <AppStack />
        </GestureHandlerRootView>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStack />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // 데스크톱: 양옆을 어둡게 채워 모바일 컬럼만 부각 (베젤·둥근 모서리·그림자 없음 — 폰 목업 X)
  webOuter: {
    flex: 1,
    backgroundColor: '#0f1117',
    alignItems: 'center',
  },
  // 콘텐츠 컬럼: 모바일 폭으로만 표시
  webColumn: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
