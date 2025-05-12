import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for system preferences
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Load user preferences
    try {
      const savedPrefs = localStorage.getItem('horizonBrowserPrefs');
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        if (preferences.darkMode !== undefined) {
          setDarkMode(preferences.darkMode);
        }
      }
    } catch (err) {
      console.error('Error loading theme preferences:', err);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    // Save user preferences
    try {
      const preferences = JSON.parse(localStorage.getItem('horizonBrowserPrefs') || '{}');
      localStorage.setItem(
        'horizonBrowserPrefs',
        JSON.stringify({ ...preferences, darkMode })
      );
    } catch (err) {
      console.error('Error saving theme preferences:', err);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
