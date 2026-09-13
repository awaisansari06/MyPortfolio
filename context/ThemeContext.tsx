'use client';

import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorMode = 'dark' | 'light';

interface ThemeContextType {
  /** Current resolved color mode */
  theme: ColorMode;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Set color mode explicitly */
  setTheme: (theme: ColorMode | 'system') => void;
  resolvedTheme?: string;
  systemTheme?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

// ─── Inner provider (must be inside NextThemesProvider) ──────────────────────

const ThemeSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, resolvedTheme, setTheme, systemTheme } = useNextTheme();

  const activeTheme = (resolvedTheme || theme || 'dark') as ColorMode;

  const toggleTheme = () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        toggleTheme,
        setTheme: (t: ColorMode | 'system') => setTheme(t),
        resolvedTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Public Providers & Hooks ─────────────────────────────────────────────────

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

/** Hook returning color theme state and controls */
export const useTheme = () => useContext(ThemeContext);
