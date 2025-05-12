import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspacesProvider } from './contexts/WorkspacesContext';
import Shell from './components/Shell';
import CommandCenter from './components/CommandCenter';
import WorkspaceSwitcher from './components/WorkspaceSwitcher';
import FocusMode from './components/FocusMode';
import './styles/App.css';

function App() {
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);

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
      
      // Escape key to close modals
      if (e.key === 'Escape') {
        if (commandCenterOpen) setCommandCenterOpen(false);
        if (workspaceSwitcherOpen) setWorkspaceSwitcherOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandCenterOpen, workspaceSwitcherOpen]);

  return (
    <ThemeProvider>
      <WorkspacesProvider>
        <div className={`browser-app ${focusModeActive ? 'focus-mode' : ''}`}>
          <Shell 
            onShowCommandCenter={() => setCommandCenterOpen(true)}
            onShowWorkspaceSwitcher={() => setWorkspaceSwitcherOpen(true)}
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
        </div>
      </WorkspacesProvider>
    </ThemeProvider>
  );
}

export default App;
