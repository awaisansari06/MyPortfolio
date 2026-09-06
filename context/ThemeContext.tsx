'use client';

import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme | 'system') => void;
  resolvedTheme?: string;
  systemTheme?: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

const ThemeSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, resolvedTheme, setTheme, systemTheme } = useNextTheme();

  const activeTheme = (resolvedTheme || theme || 'dark') as Theme;

  const toggleTheme = () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        toggleTheme,
        setTheme: (t: Theme | 'system') => setTheme(t),
        resolvedTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <ThemeSyncProvider>{children}</ThemeSyncProvider>
    </NextThemesProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);
