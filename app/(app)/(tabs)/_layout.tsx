import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import {
  HomeIcon,
  ExploreIcon,
  CommunityIcon,
  ChatNavIcon,
  ProfileNavIcon,
} from '../../../components/ui/Icon';

type IconType = 'home' | 'explore' | 'community' | 'chat' | 'profile';

function TabIcon({ focused, icon, label }: { focused: boolean; icon: IconType; label: string }) {
  const color = focused ? Colors.primary : Colors.textMuted;
  const iconEl = {
    home: <HomeIcon color={color} size={22} filled={focused} />,
    explore: <ExploreIcon color={color} size={22} />,
    community: <CommunityIcon color={color} size={22} filled={focused} />,
    chat: <ChatNavIcon color={color} size={22} />,
    profile: <ProfileNavIcon color={color} size={22} />,
  }[icon];

  return (
    <View style={tabStyles.wrap}>
      {iconEl}
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 2, width: 68, gap: 5 },
  label: { fontSize: 10, color: Colors.textMuted, fontWeight: '400', letterSpacing: 0.2 },
  labelActive: { color: Colors.primary, fontWeight: '600' },
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 74 + insets.bottom,
          backgroundColor: Colors.card,
          borderTopWidth: 1,
          borderTopColor: Colors.cardBorder,
          shadowColor: 'rgba(42,33,24,0.08)',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 6,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" label="홈" /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="explore" label="탐색" /> }}
      />
      <Tabs.Screen
        name="community"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="community" label="피드" /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="chat" label="채팅" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="profile" label="나" /> }}
      />
    </Tabs>
  );
}
