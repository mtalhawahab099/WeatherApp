import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Switch,
  useColorScheme,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentWeather, toggleTemperatureUnit } from '@/store/weatherSlice';
import { RootState } from '@/store';
import WeatherCard from '@/components/WeatherCard';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function WeatherScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const flatListRef = useRef<FlatList>(null);
  const { currentWeather, recentSearches, useCelsius } = useSelector(
    (state: RootState) => state.weather
  );

  const searchCity = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://192.168.100.202:3000/cities?city_like=${(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.length > 0) {
        dispatch(setCurrentWeather(data[0]));
        setSearchQuery('');
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else {
        setError('City not found. Please try another city name.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch weather data. Please make sure json-server is running.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (currentWeather) {
      await searchCity(currentWeather.city);
    }
    setRefreshing(false);
  }, [currentWeather, searchCity]);

  const renderWeatherCard = useCallback(({ item }) => (
    <WeatherCard
      data={item}
      onPress={() => {
        setSearchQuery(item.city);
        dispatch(setCurrentWeather(item));
      }}
    />
  ), [dispatch]);

  return (
    <Animated.View 
      entering={FadeIn}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background }
      ]}>
      <View style={styles.header}>
        <View style={[
          styles.searchContainer,
          { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0' }
        ]}>
          <Ionicons
            name="search"
            size={20}
            color={Colors[colorScheme ?? 'light'].text}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}
            placeholder="Search city..."
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchCity(searchQuery)}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.unitToggle}>
          <Text style={[
            styles.unitText,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>°C</Text>
          <Switch
            value={!useCelsius}
            onValueChange={() => dispatch(toggleTemperatureUnit())}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={Platform.OS === 'ios' 
              ? '#fff'
              : !useCelsius ? '#f5dd4b' : '#f4f3f4'
            }
          />
          <Text style={[
            styles.unitText,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>°F</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme ?? 'light'].tint} 
          />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons 
            name="alert-circle" 
            size={24} 
            color="red" 
            style={styles.errorIcon} 
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={currentWeather 
          ? [currentWeather, ...recentSearches.filter(w => w.id !== currentWeather.id)] 
          : recentSearches
        }
        renderItem={renderWeatherCard}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
            colors={[Colors[colorScheme ?? 'light'].tint]}
          />
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="search" 
                size={50} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <Text style={[
                styles.emptyText,
                { color: Colors[colorScheme ?? 'light'].text }
              ]}>
                Search for a city to see the weather
              </Text>
            </View>
          ) : null
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  centered: {
    padding: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});