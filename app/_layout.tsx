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
        <GestureHandlerRootView style={styles.webFrame}>
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
  // 데스크톱 전체: 어두운 배경으로 양옆 채움
  webOuter: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  // 폰 크기 내부 프레임: maxWidth 480, 그림자로 부각
  webFrame: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 48,
    elevation: 24,
  },
});
