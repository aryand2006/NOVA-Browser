import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Shell = ({ 
  onShowCommandCenter, 
  onShowWorkspaceSwitcher,
  onToggleFocusMode,
  focusModeActive
}) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="coming-soon">
      <div className="logo"></div>
      <h1>NOVA Browser</h1>
      <p>
        Welcome to the NOVA Browser prototype. Our full implementation with advanced features 
        like AI-powered tab management, contextual workspaces, and focus tools 
        is coming soon.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="primary-button"
          onClick={onShowCommandCenter}
        >
          Command Center (⌘K)
        </button>
        <button 
          className="secondary-button"
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button 
          className="secondary-button"
          onClick={onToggleFocusMode}
        >
          {focusModeActive ? 'Exit Focus Mode' : 'Focus Mode'}
        </button>
      </div>
    </div>
  );
};

export default Shell;
