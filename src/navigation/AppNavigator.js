import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Colors } from '../constants/colors';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FindMateScreen from '../screens/FindMateScreen';
import MatchListScreen from '../screens/MatchListScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import AiMatchingScreen from '../screens/AiMatchingScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import TripConfirmScreen from '../screens/TripConfirmScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import TripRegisterScreen from '../screens/TripRegisterScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    홈: focused ? '🏠' : '🏡',
    탐색: focused ? '🔍' : '🔎',
    커뮤니티: focused ? '📋' : '📄',
    채팅: focused ? '💬' : '🗨️',
    내프로필: focused ? '👤' : '👥',
  };
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 18 }}>{icons[name]}</Text>
      <Text style={{ fontSize: 10, color: focused ? Colors.primary : Colors.textMute, fontWeight: focused ? '700' : '400' }}>
        {name}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 0.5,
          backgroundColor: Colors.white,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="홈" focused={focused} /> }}
      />
      <Tab.Screen
        name="FindMate"
        component={FindMateScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="탐색" focused={focused} /> }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="커뮤니티" focused={focused} /> }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="채팅" focused={focused} /> }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="내프로필" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="MatchList" component={MatchListScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="AiMatching" component={AiMatchingScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="TripConfirm" component={TripConfirmScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="TripRegister" component={TripRegisterScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}
