import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import BrowserView from './BrowserView';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/BrowserLayout.css';

const BrowserLayout = ({ 
  onShowCommandCenter,
  onShowWorkspaces,
  onTabHover,
  onTabHoverEnd
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 'tab1', title: 'Quantum Computing', url: 'search?q=How does quantum computing work?', active: true },
    { id: 'tab2', title: 'GitHub: Project', url: 'https://github.com/user/project', active: false },
    { id: 'tab3', title: 'AI Research', url: 'https://research.ai/papers', active: false }
  ]);
  const [splitView, setSplitView] = useState(false);

  const handleTabClick = (tabId) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
  };

  const handleTabClose = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    // If we closed the active tab, activate another one
    if (tabs.find(tab => tab.id === tabId).active && newTabs.length > 0) {
      newTabs[0].active = true;
    }
    
    setTabs(newTabs);
  };

  const handleNewTab = () => {
    const newTabId = `tab${tabs.length + 1}`;
    setTabs([
      ...tabs.map(tab => ({ ...tab, active: false })),
      { id: newTabId, title: 'New Tab', url: 'about:blank', active: true }
    ]);
  };

  return (
    <div className="browser-container">
      <TopBar 
        onThemeToggle={toggleDarkMode} 
        darkMode={darkMode} 
      />
      
      <div className="main-content">
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggleExpand={() => setSidebarExpanded(prev => !prev)}
          onShowWorkspaces={onShowWorkspaces} 
        />
        
        <div className="content-area">
          <TabBar 
            tabs={tabs}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
            onNewTab={handleNewTab}
            onTabHover={onTabHover}
            onTabHoverEnd={onTabHoverEnd}
          />
          
          <BrowserView 
            tabs={tabs}
            splitView={splitView}
            onToggleSplitView={() => setSplitView(prev => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowserLayout;
