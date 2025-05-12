import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspacesProvider } from './contexts/WorkspacesContext';
import BrowserLayout from './components/BrowserLayout';
import CommandCenter from './components/CommandCenter';
import FocusModeOverlay from './components/FocusModeOverlay';
import TabPreview from './components/TabPreview';
import WorkspacePopup from './components/WorkspacePopup';
import './styles/globals.css';

function App() {
  const [commandCenterVisible, setCommandCenterVisible] = useState(false);
  const [workspacePopupVisible, setWorkspacePopupVisible] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [tabPreview, setTabPreview] = useState({
    visible: false,
    title: '',
    position: { top: 0, left: 0 },
  });

  const handleKeyDown = useCallback((e) => {
    // Command center - Cmd+K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandCenterVisible(prev => !prev);
    }

    // Workspace popup - Cmd+Shift+W / Ctrl+Shift+W
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'w') {
      e.preventDefault();
      setWorkspacePopupVisible(prev => !prev);
    }

    // Focus mode - Cmd+Shift+F / Ctrl+Shift+F
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
      e.preventDefault();
      setFocusModeActive(prev => !prev);
    }

    // Escape key to close modals
    if (e.key === 'Escape') {
      if (commandCenterVisible) {
        setCommandCenterVisible(false);
      } else if (workspacePopupVisible) {
        setWorkspacePopupVisible(false);
      } else if (focusModeActive) {
        setFocusModeActive(false);
      }
    }
  }, [commandCenterVisible, workspacePopupVisible, focusModeActive]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ThemeProvider>
      <WorkspacesProvider>
        <div className={`app ${focusModeActive ? 'focus-mode' : ''}`}>
          <BrowserLayout 
            onShowCommandCenter={() => setCommandCenterVisible(true)}
            onShowWorkspaces={() => setWorkspacePopupVisible(true)}
            onTabHover={(title, position) => setTabPreview({
              visible: true,
              title,
              position
            })}
            onTabHoverEnd={() => setTabPreview(prev => ({ ...prev, visible: false }))}
          />

          {commandCenterVisible && (
            <CommandCenter 
              onClose={() => setCommandCenterVisible(false)}
              onToggleFocusMode={() => {
                setFocusModeActive(prev => !prev);
                setCommandCenterVisible(false);
              }}
              onShowWorkspaces={() => {
                setWorkspacePopupVisible(true);
                setCommandCenterVisible(false);
              }}
            />
          )}

          {workspacePopupVisible && (
            <WorkspacePopup onClose={() => setWorkspacePopupVisible(false)} />
          )}

          {focusModeActive && (
            <FocusModeOverlay onExit={() => setFocusModeActive(false)} />
          )}

          <TabPreview 
            visible={tabPreview.visible} 
            title={tabPreview.title}
            position={tabPreview.position} 
          />
        </div>
      </WorkspacesProvider>
    </ThemeProvider>
  );
}

export default App;
