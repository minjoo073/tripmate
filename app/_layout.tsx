import { Stack, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

// Inject SUIT font for web
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

    // Apply SUIT as default font
    const style = document.createElement('style');
    style.textContent = `
      body, * { font-family: 'SUIT', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif !important; }
      .editorial-label { font-family: 'Cormorant Garamond', Georgia, serif !important; }
    `;
    document.head.appendChild(style);
  }
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="landing" />
      </Stack>
    </GestureHandlerRootView>
  );
}
