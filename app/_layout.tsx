import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadStoredData } from '@/store/weatherSlice';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    loadStoredState();
  }, []);

  const loadStoredState = async () => {
    try {
      const [recentSearches, favorites, useCelsius] = await Promise.all([
        AsyncStorage.getItem('recentSearches'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('useCelsius'),
      ]);

      store.dispatch(loadStoredData({
        recentSearches: recentSearches ? JSON.parse(recentSearches) : [],
        favorites: favorites ? JSON.parse(favorites) : [],
        useCelsius: useCelsius ? JSON.parse(useCelsius) : true,
      }));
    } catch (error) {
      console.error('Error loading stored state:', error);
    }
  };

  return (
    <Provider store={store}>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: Platform.OS === 'android' ? 'fade' : 'default'
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="+not-found" 
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Not Found'
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  );
}