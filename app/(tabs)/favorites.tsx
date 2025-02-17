import React from 'react';
import { View, StyleSheet, FlatList, Text, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import WeatherCard from '@/components/WeatherCard';
import Colors from '@/constants/Colors';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const { favorites } = useSelector((state: RootState) => state.weather);

  if (favorites.length === 0) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background }
      ]}>
        <View style={styles.emptyState}>
          <Text style={[
            styles.emptyStateText,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            No favorite cities yet.{'\n'}Add some from the weather screen!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <WeatherCard data={item} />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
});