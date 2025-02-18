const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    mapLoaderColor: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabBackgroundColor: '#FFFFFF',
    tabLabelColor: '#000000',
    weatherBackground: {
      Sunny: '#FFD700',
      Cloudy: '#A9A9A9',
      Rainy: '#4682B4',
      'Partly Cloudy': '#B8B8B8',
    },
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    mapLoaderColor: '#ccc',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    tabBackgroundColor: '#1E1E1E',
    tabLabelColor: '#FFFFFF',
    weatherBackground: {
      Sunny: '#B8860B',
      Cloudy: '#696969',
      Rainy: '#27408B',
      'Partly Cloudy': '#708090',
    },
  },
};