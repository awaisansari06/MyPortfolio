'use client';

import React, { createContext, useContext, useEffect } from 'react';
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

  // Synchronize immediately with pre-hydration class on documentElement if available
  const isClientDark =
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false;

  const activeTheme = (resolvedTheme || (typeof window !== 'undefined' ? (isClientDark ? 'dark' : 'light') : theme) || 'dark') as ColorMode;

  useEffect(() => {
    // Follow the site preference, including manual overrides of the OS theme.
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) {
      icon.href = `/brand/favicon-${activeTheme}.png?v=orbit-1`;
      icon.type = 'image/png';
      icon.sizes.value = '64x64';
    }
  }, [activeTheme]);

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
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      <ThemeSyncProvider>{children}</ThemeSyncProvider>
    </NextThemesProvider>
  );
};

/** Hook returning color theme state and controls */
export const useTheme = () => useContext(ThemeContext);
