import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TabBar from './TabBar';
import BrowserView from './BrowserView';
import { useTabs } from '../contexts/TabsContext';
import { useWorkspaces } from '../contexts/WorkspacesContext';
import '../styles/Shell.css';

const Shell = ({ 
  onShowCommandCenter, 
  onShowWorkspaceSwitcher,
  onTabPreview,
  onToggleFocusMode,
  focusModeActive
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [splitViewActive, setSplitViewActive] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  
  const { tabs, activeTab, createTab, activateTab, closeTab } = useTabs();
  const { workspaces, activeWorkspace } = useWorkspaces();
  
  const activeWorkspaceData = workspaces.find(w => w.id === activeWorkspace) || {};
  const tabsInActiveWorkspace = tabs.filter(tab => tab.workspaceId === activeWorkspace);
  
  const handleNewTab = () => {
    const newTabId = createTab();
    activateTab(newTabId);
  };
  
  const handleTabClick = (tabId) => {
    activateTab(tabId);
  };
  
  const handleTabClose = (tabId) => {
    closeTab(tabId);
  };
  
  const handleSplitViewToggle = () => {
    setSplitViewActive(prev => !prev);
  };
  
  const handleSplitDrag = (e) => {
    if (!splitViewActive) return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - container.left;
    const percentage = (mouseX / container.width) * 100;
    
    // Constrain between 20% and 80%
    const constrainedPercentage = Math.max(20, Math.min(80, percentage));
    setSplitRatio(constrainedPercentage);
  };

  return (
    <div className="shell-container">
      <Sidebar 
        expanded={sidebarExpanded}
        onToggleExpand={() => setSidebarExpanded(prev => !prev)}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onShowWorkspaceSwitcher={onShowWorkspaceSwitcher}
        focusModeActive={focusModeActive}
      />
      
      <div className="main-area">
        <TopBar 
          onShowCommandCenter={onShowCommandCenter}
          onToggleFocusMode={onToggleFocusMode}
          activeWorkspace={activeWorkspaceData}
          focusModeActive={focusModeActive}
        />
        
        <TabBar 
          tabs={tabsInActiveWorkspace}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onNewTab={handleNewTab}
          onTabPreview={onTabPreview}
          focusModeActive={focusModeActive}
        />
        
        <BrowserView 
          tabs={tabsInActiveWorkspace}
          activeTab={activeTab}
          splitView={splitViewActive}
          splitRatio={splitRatio}
          onSplitViewToggle={handleSplitViewToggle}
          onSplitDrag={handleSplitDrag}
        />
      </div>
    </div>
  );
};

export default Shell;
