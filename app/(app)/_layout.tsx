import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../../context/AuthContext';
import { PersonalityProvider } from '../../context/PersonalityContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="match/loading" options={{ animation: 'fade' }} />
      <Stack.Screen name="match/list" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="match/confirmed" options={{ animation: 'fade' }} />
      <Stack.Screen name="mate/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="post/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="mates" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="profile-setup" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="travel-personality" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="trip-plan" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="explore-destination" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="explore-date" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="explore-style" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="explore-gender" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function AppLayout() {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <View style={styles.webBg}>
        <View style={styles.phoneFrame}>
          <SafeAreaProvider
            initialMetrics={{
              insets: { top: 59, bottom: 34, left: 0, right: 0 },
              frame: { x: 0, y: 0, width: 390, height: 844 },
            }}
            style={styles.phoneInner}
          >
            <AuthProvider>
              <PersonalityProvider>
                <StatusBar style="auto" />
                <AppStack />
              </PersonalityProvider>
            </AuthProvider>
          </SafeAreaProvider>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PersonalityProvider>
          <StatusBar style="auto" />
          <AppStack />
        </PersonalityProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
