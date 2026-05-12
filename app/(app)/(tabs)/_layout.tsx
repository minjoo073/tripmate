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
  const color = focused ? Colors.primary : Colors.textPlaceholder;
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
  wrap: { alignItems: 'center', paddingTop: 4, width: 56, gap: 3 },
  label: { fontSize: 10, color: Colors.textPlaceholder, fontWeight: '400' },
  labelActive: { color: Colors.primary, fontWeight: '600' },
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.navBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 4,
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
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="community" label="커뮤니티" /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="chat" label="채팅" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="profile" label="프로필" /> }}
      />
    </Tabs>
  );
}
