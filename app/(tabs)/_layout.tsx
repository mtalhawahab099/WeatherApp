import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <>
      <StatusBar style={isDarkMode ? 'dark' : 'light'} />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[theme ?? 'light'].tint,
          tabBarStyle: {
            backgroundColor: Colors[theme ?? 'light'].tabBackgroundColor, // Dark mode background
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'ios' ? 88 : 60,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            color: Colors[theme ?? 'light'].tabLabelColor,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Weather',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="partly-sunny" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
