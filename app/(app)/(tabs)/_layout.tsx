import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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
  const color = focused ? Colors.bg : 'rgba(248,244,239,0.45)';

  const iconEl = {
    home: <HomeIcon color={color} size={22} filled={focused} />,
    explore: <ExploreIcon color={color} size={22} />,
    community: <CommunityIcon color={color} size={22} filled={focused} />,
    chat: <ChatNavIcon color={color} size={22} />,
    profile: <ProfileNavIcon color={color} size={22} />,
  }[icon];

  return (
    <View style={tabStyles.wrap}>
      <View style={tabStyles.iconWrap}>
        {iconEl}
      </View>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
      {focused && <View style={tabStyles.indicatorBar} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, color: 'rgba(248,244,239,0.45)', fontWeight: '400', letterSpacing: 0.2 },
  labelActive: { color: Colors.bg, fontWeight: '600' },
  indicatorBar: {
    height: 2,
    width: 20,
    borderRadius: 1,
    backgroundColor: Colors.bg,
  },
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        [role="tab"] {
          justify-content: center !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      `;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
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
