import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View, StyleSheet } from 'react-native';

function AppShell() {
  const pathname = usePathname();
  const isLanding = pathname === '/landing';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="match/loading" options={{ animation: 'fade' }} />
      <Stack.Screen name="match/list" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="match/confirmed" options={{ animation: 'fade' }} />
      <Stack.Screen name="mate/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="post/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <GestureHandlerRootView style={styles.webRoot}>
        <View style={styles.webBg}>
          <View style={styles.phoneFrame}>
            <SafeAreaProvider
              initialMetrics={{
                insets: { top: 44, bottom: 34, left: 0, right: 0 },
                frame: { x: 0, y: 0, width: 390, height: 844 },
              }}
              style={styles.phoneInner}
            >
              <AuthProvider>
                <StatusBar style="auto" />
                <AppShell />
              </AuthProvider>
            </SafeAreaProvider>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <AppShell />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webRoot: { flex: 1 },
  webBg: {
    flex: 1,
    backgroundColor: '#0f1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 390,
    height: 844,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 48,
  },
  phoneInner: {
    flex: 1,
    overflow: 'hidden',
  },
});
