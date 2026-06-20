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
      html, body { margin: 0; padding: 0; }
      html, body, #root { min-height: 100vh; }
      body { background: #0f1117; }
      #root { display: flex; flex-direction: column; }
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
        <View style={[styles.phoneFrame, webShadow]}>
          <View style={styles.dynamicIsland} />
          <View style={styles.phoneScreen}>
            <GestureHandlerRootView style={styles.gestureRoot}>
              <AppStack />
            </GestureHandlerRootView>
          </View>
        </View>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStack />
    </GestureHandlerRootView>
  );
}

// iPhone 14 Pro: 393 × 852 logical viewport, ~9.5pt bezel, Dynamic Island ~120×34
const SCREEN_W = 393;
const SCREEN_H = 852;
const BEZEL = 11;

// boxShadow는 RN 표준 타입에 없어 any 캐스트로 web-only 처리
const webShadow = {
  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45), 0 0 0 2px #2a2a2a inset',
} as any;

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    backgroundColor: '#0f1117',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  phoneFrame: {
    width: SCREEN_W + BEZEL * 2,
    height: SCREEN_H + BEZEL * 2,
    backgroundColor: '#0a0a0a',
    borderRadius: 56,
    padding: BEZEL,
    position: 'relative',
  },
  dynamicIsland: {
    position: 'absolute',
    top: BEZEL + 10,
    alignSelf: 'center',
    width: 120,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#000',
    zIndex: 10,
  },
  phoneScreen: {
    width: SCREEN_W,
    height: SCREEN_H,
    borderRadius: 47,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  gestureRoot: {
    flex: 1,
  },
});
