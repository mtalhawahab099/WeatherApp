import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  weather: string;
  humidity: number;
  windSpeed: number;
  lat: number;
  lon: number;
}

interface WeatherState {
  currentWeather: WeatherData | null;
  recentSearches: WeatherData[];
  favorites: WeatherData[];
  useCelsius: boolean;
}

const initialState: WeatherState = {
  currentWeather: null,
  recentSearches: [],
  favorites: [],
  useCelsius: true,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
      if (!state.recentSearches.find(w => w.id === action.payload.id)) {
        state.recentSearches = [action.payload, ...state.recentSearches.slice(0, 4)];
      }
      AsyncStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    },
    toggleFavorite: (state, action: PayloadAction<WeatherData>) => {
      const index = state.favorites.findIndex(f => f.id === action.payload.id);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    toggleTemperatureUnit: (state) => {
      state.useCelsius = !state.useCelsius;
      AsyncStorage.setItem('useCelsius', JSON.stringify(state.useCelsius));
    },
    loadStoredData: (state, action: PayloadAction<{
      recentSearches: WeatherData[];
      favorites: WeatherData[];
      useCelsius: boolean;
    }>) => {
      state.recentSearches = action.payload.recentSearches;
      state.favorites = action.payload.favorites;
      state.useCelsius = action.payload.useCelsius;
    },
  },
});

export const {
  setCurrentWeather,
  toggleFavorite,
  toggleTemperatureUnit,
  loadStoredData,
} = weatherSlice.actions;

export default weatherSlice.reducer;