import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    updateThemeBasedOnTime();
    const interval = setInterval(updateThemeBasedOnTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const updateThemeBasedOnTime = () => {
    const hour = new Date().getHours();
    
    // Dark mode between 6 PM (18) and 6 AM (6)
    const shouldBeDark = hour >= 18 || hour < 6;
    setTheme(shouldBeDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);