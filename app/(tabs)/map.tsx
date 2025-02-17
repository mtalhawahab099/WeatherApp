import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as Location from 'expo-location';

// Conditionally import MapView to avoid web issues
let MapView: any;
let Marker: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { currentWeather, favorites } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
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
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapText}>
            Maps are currently only available on mobile devices.
            Please use the iOS or Android app to view the map.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#f5f5f5',
  },
  webMapText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    maxWidth: 300,
    lineHeight: 24,
  },
});