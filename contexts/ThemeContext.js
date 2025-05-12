import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'system', // 'light', 'dark', or 'system'
    accent: '#3a86ff',
    fontSize: 'medium', // 'small', 'medium', 'large'
    reducedMotion: false,
    roundedCorners: true,
    compactMode: false
  });

  // Monitor system preferences for theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme.mode === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);
  
  // Apply theme on init and theme changes
  useEffect(() => {
    applyTheme();
    saveTheme();
  }, [theme]);
  
  // Load saved theme on startup
  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const savedTheme = localStorage.getItem('horizon-theme');
        if (savedTheme) {
          setTheme(prev => ({ ...prev, ...JSON.parse(savedTheme) }));
        }
      } catch (error) {
        console.error("Error loading theme from storage:", error);
      }
    };
    
    loadSavedTheme();
  }, []);
  
  const applyTheme = () => {
    const root = document.documentElement;
    
    // Determine if we should use dark mode
    let isDarkMode;
    if (theme.mode === 'system') {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDarkMode = theme.mode === 'dark';
    }
    
    // Set class on HTML element
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    
    // Apply accent color
    root.style.setProperty('--primary', theme.accent);
    
    // Apply font size
    let rootFontSize;
    switch (theme.fontSize) {
      case 'small':
        rootFontSize = '14px';
        break;
      case 'large':
        rootFontSize = '18px';
        break;
      default:
        rootFontSize = '16px';
    }
    root.style.fontSize = rootFontSize;
    
    // Apply animation settings
    if (theme.reducedMotion) {
      root.style.setProperty('--transition-speed', '0s');
    } else {
      root.style.setProperty('--transition-speed', '0.3s');
    }
    
    // Apply corner roundness
    root.style.setProperty('--border-radius', theme.roundedCorners ? '8px' : '2px');
    
    // Apply compact mode
    root.style.setProperty('--spacing-unit', theme.compactMode ? '4px' : '8px');
  };
  
  const saveTheme = () => {
    localStorage.setItem('horizon-theme', JSON.stringify(theme));
  };
  
  const updateTheme = (updates) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme,
      updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
