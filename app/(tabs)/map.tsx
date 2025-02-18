import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as Location from 'expo-location';
import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';

// Conditionally import MapView to avoid web issues
let MapView: any;
let Marker: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

interface LocationWeather {
  temperature: number;
  weather: string;
}

// Dark Mode Style for Map
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0d47a1' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#383838' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212121' }],
  },
];

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationWeather, setLocationWeather] = useState<LocationWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const { currentWeather, favorites } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission not granted');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Simulate weather data for current location
        setLocationWeather({
          temperature: Math.round(15 + Math.random() * 10), // Random temperature between 15-25°C
          weather: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)], // Random weather
        });
      } catch (err) {
        setError('Error getting location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 180,
    longitudeDelta: 180,
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[
        styles.container,
        { backgroundColor: Colors[theme].background }
      ]}>
        <View style={styles.webMapPlaceholder}>
          <Text style={[styles.webMapText, { color: Colors[theme].text }]}>
            Maps are currently only available on mobile devices.
            Please use the iOS or Android app to view the map.
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[
        styles.container, 
        styles.centered, 
        { backgroundColor: theme === 'dark' ? '#010101' : Colors[theme].background }
      ]}>
        <ActivityIndicator size="large" color={Colors[theme].mapLoaderColor} />
      </View>
      
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: Colors[theme].text }]}>{error}</Text>
      </View>
    );
  }

  const handleGetLocation = () => {
    setUserLocation(initialRegion);
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Status Bar */}
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={isDarkMode ? darkMapStyle : []} // Apply dark mode map style
      >
        {userLocation && locationWeather && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description={`${locationWeather.temperature}°C, ${locationWeather.weather}`}
            pinColor="blue"
          />
        )}
        {currentWeather && (
          <Marker
            coordinate={{
              latitude: currentWeather.lat,
              longitude: currentWeather.lon,
            }}
            title={currentWeather.city}
            description={`${currentWeather.temperature}°C, ${currentWeather.weather}`}
          />
        )}
        {favorites.map((city) => (
          <Marker
            key={city.id}
            coordinate={{
              latitude: city.lat,
              longitude: city.lon,
            }}
            title={city.city}
            description={`${city.temperature}°C, ${city.weather}`}
            pinColor="gold"
          />
        ))}
      </MapView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
          <Text style={styles.buttonText}>My Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
