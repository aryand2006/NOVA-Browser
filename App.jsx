import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspacesProvider } from './contexts/WorkspacesContext';
import { TabsProvider } from './contexts/TabsContext';
import Shell from './components/Shell';
import CommandCenter from './components/CommandCenter';
import WorkspaceSwitcher from './components/WorkspaceSwitcher';
import FocusMode from './components/FocusMode';
import TabPreview from './components/TabPreview';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import './styles/globals.css';

function App() {
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [tabPreview, setTabPreview] = useState({ visible: false, tab: null, position: { x: 0, y: 0 } });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command center (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandCenterOpen(prev => !prev);
      }
      
      // Workspace switcher (Cmd+Shift+W / Ctrl+Shift+W)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'w') {
        e.preventDefault();
        setWorkspaceSwitcherOpen(prev => !prev);
      }
      
      // Focus mode (Cmd+Shift+F / Ctrl+Shift+F)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        setFocusModeActive(prev => !prev);
      }
      
      // Escape key to close overlays
      if (e.key === 'Escape') {
        if (commandCenterOpen) setCommandCenterOpen(false);
        if (workspaceSwitcherOpen) setWorkspaceSwitcherOpen(false);
        if (tabPreview.visible) setTabPreview(prev => ({ ...prev, visible: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandCenterOpen, workspaceSwitcherOpen, tabPreview.visible]);
  
  // Handle mouse movement outside of browser to hide tab preview
  useEffect(() => {
    const handleMouseLeave = () => {
      if (tabPreview.visible) {
        setTabPreview(prev => ({ ...prev, visible: false }));
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [tabPreview.visible]);

  return (
    <ThemeProvider>
      <WorkspacesProvider>
        <TabsProvider>
          <div className={`browser-app ${focusModeActive ? 'focus-mode' : ''}`}>
            <Shell 
              onShowCommandCenter={() => setCommandCenterOpen(true)}
              onShowWorkspaceSwitcher={() => setWorkspaceSwitcherOpen(true)}
              onTabPreview={(tab, position) => setTabPreview({ visible: true, tab, position })}
              onToggleFocusMode={() => setFocusModeActive(prev => !prev)}
              focusModeActive={focusModeActive}
            />
            
            {commandCenterOpen && (
              <CommandCenter 
                onClose={() => setCommandCenterOpen(false)}
                onActivateCommand={() => setCommandCenterOpen(false)}
              />
            )}
            
            {workspaceSwitcherOpen && (
              <WorkspaceSwitcher 
                onClose={() => setWorkspaceSwitcherOpen(false)}
              />
            )}
            
            {focusModeActive && (
              <FocusMode onExit={() => setFocusModeActive(false)} />
            )}
            
            {tabPreview.visible && tabPreview.tab && (
              <TabPreview 
                tab={tabPreview.tab} 
                position={tabPreview.position} 
              />
            )}
            
            <KeyboardShortcuts />
          </div>
        </TabsProvider>
      </WorkspacesProvider>
    </ThemeProvider>
  );
}

export default App;
