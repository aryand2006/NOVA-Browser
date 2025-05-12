import React, { useState, useRef } from 'react';
import { useTabs } from '../contexts/TabsContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/TopBar.css';

const TopBar = ({ 
  onShowCommandCenter, 
  onToggleFocusMode,
  activeWorkspace,
  focusModeActive
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  
  const { tabs, activeTab, navigateTab } = useTabs();
  const { theme, updateTheme } = useTheme();
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  // Update URL input when active tab changes
  React.useEffect(() => {
    if (activeTabData && !isEditing) {
      setUrlInput(activeTabData.url);
    }
  }, [activeTabData, isEditing]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTabData && urlInput) {
      // Prepend https:// if no protocol is specified
      let processedUrl = urlInput;
      if (!urlInput.match(/^[a-zA-Z]+:\/\//)) {
        // Check if it's a search query or URL
        if (urlInput.includes(' ') || !urlInput.includes('.')) {
          processedUrl = `https://www.google.com/search?q=${encodeURIComponent(urlInput)}`;
        } else {
          processedUrl = `https://${urlInput}`;
        }
      }
      
      navigateTab(activeTabData.id, processedUrl);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };
  
  const handleFocus = () => {
    setIsEditing(true);
    inputRef.current?.select();
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    if (activeTabData) {
      setUrlInput(activeTabData.url);
    }
  };

  return (
    <div className={`top-bar ${focusModeActive ? 'focus-mode-active' : ''}`}>
      <div className="top-bar-left">
        <div className="navigation-buttons">
          <button className="nav-button" title="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="nav-button" title="Go forward">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="nav-button" title="Reload">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
        
        <div className="workspace-indicator" style={{ backgroundColor: activeWorkspace?.color }}>
          {activeWorkspace?.icon}
        </div>
      </div>
      
      <form className="address-bar" onSubmit={handleSubmit}>
        {activeTabData?.favicon && !isEditing && (
          <img 
            src={activeTabData.favicon} 
            alt="" 
            className="favicon"
          />
        )}
        {!isEditing && (
          <div className="ssl-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          className="url-input"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search or enter URL"
        />
      </form>
      
      <div className="top-bar-actions">
        <button 
          className="action-button" 
          title="Command center (⌘K)"
          onClick={onShowCommandCenter}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        </button>
        
        <button 
          className={`action-button ${focusModeActive ? 'active' : ''}`} 
          title="Focus mode (⌘⇧F)"
          onClick={onToggleFocusMode}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        
        <button 
          className={`theme-toggle ${theme.mode === 'dark' ? 'dark' : theme.mode === 'light' ? 'light' : 'system'}`}
          onClick={() => {
            const modes = ['light', 'dark', 'system'];
            const currentIndex = modes.indexOf(theme.mode);
            const nextIndex = (currentIndex + 1) % modes.length;
            updateTheme({ mode: modes[nextIndex] });
          }}
        >
          <div className="theme-toggle-track">
            <div className="theme-toggle-thumb"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
