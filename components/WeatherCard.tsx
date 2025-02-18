import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '@/store/weatherSlice';
import { RootState } from '@/store';
import Colors from '@/constants/Colors';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  weather: string;
  humidity: number;
  windSpeed: number;
}

interface Props {
  data: WeatherData;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WeatherCard = memo(({ data, onPress }: Props) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { useCelsius, favorites } = useSelector((state: RootState) => state.weather);
  const isFavorite = favorites.some(f => f.id === data.id);

  const getTemperature = () => {
    if (useCelsius) {
      return `${data.temperature}°C`;
    }
    return `${Math.round((data.temperature * 9/5) + 32)}°F`;
  };

  const getWeatherIcon = () => {
    switch (data.weather.toLowerCase()) {
      case 'sunny':
        return 'sunny';
      case 'cloudy':
        return 'cloudy';
      case 'rainy':
        return 'rainy';
      case 'partly cloudy':
        return 'partly-sunny';
      default:
        return 'help-circle';
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <AnimatedPressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: Colors[theme ?? 'light'].weatherBackground[data.weather as keyof typeof Colors.light.weatherBackground],
          },
          animatedStyle,
        ]}>
        <View style={styles.header}>
          <Text style={styles.city}>{data.city}</Text>
          <Pressable
            onPress={() => dispatch(toggleFavorite(data))}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>
        <View style={styles.weatherInfo}>
          <Ionicons name={getWeatherIcon()} size={64} color="#fff" />
          <Text style={styles.temperature}>{getTemperature()}</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={20} color="#fff" />
            <Text style={styles.detailText}>{data.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer" size={20} color="#fff" />
            <Text style={styles.detailText}>{data.windSpeed} km/h</Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  weatherInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 15,
    minWidth: 100,
    justifyContent: 'center',
  },
  detailText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeatherCard;