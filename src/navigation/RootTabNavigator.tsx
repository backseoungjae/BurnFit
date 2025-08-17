import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Entypo } from '@react-native-vector-icons/entypo';
import { EvilIcons } from '@react-native-vector-icons/evil-icons';
import { FontAwesome5 } from '@react-native-vector-icons/fontawesome5';
import { Octicons } from '@react-native-vector-icons/octicons';

import HomeScreen from '@/screens/HomeScreen';
import CalendarScreen from '@/screens/CalendarScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import MypageScreen from '@/screens/MypageScreen';

type IconProps = { focused: boolean; color: string; size: number };

const HomeTabIcon = ({ color, size }: IconProps) => (
  <Entypo name="home" size={size} color={color} />
);

const CalendarTabIcon = ({ color, size }: IconProps) => (
  <EvilIcons name="calendar" size={size} color={color} />
);

const LibraryTabIcon = ({ color, size }: IconProps) => (
  <FontAwesome5 name="dumbbell" iconStyle="solid" size={size} color={color} />
);

const MyPageTabIcon = ({ color, size }: IconProps) => (
  <Octicons name="person-fill" size={size} color={color} />
);

const Tab = createBottomTabNavigator();

export default function RootTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#9AA0A6',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'HOME', tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'CALENDAR', tabBarIcon: CalendarTabIcon }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: 'LIBRARY', tabBarIcon: LibraryTabIcon }}
      />
      <Tab.Screen
        name="MyPage"
        component={MypageScreen}
        options={{ title: 'MY PAGE', tabBarIcon: MyPageTabIcon }}
      />
    </Tab.Navigator>
  );
}
