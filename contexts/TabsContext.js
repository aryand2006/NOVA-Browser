import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWorkspaces } from './WorkspacesContext';
import { nanoid } from 'nanoid';

const TabsContext = createContext();

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }) => {
  const { activeWorkspace, addTabToWorkspace, removeTabFromWorkspace } = useWorkspaces();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabHistory, setTabHistory] = useState({});
  const [archivedTabs, setArchivedTabs] = useState([]);

  // Load tabs from storage on init
  useEffect(() => {
    const loadTabsFromStorage = () => {
      try {
        const savedTabs = localStorage.getItem('horizon-tabs');
        const savedActiveTab = localStorage.getItem('horizon-active-tab');
        const savedTabHistory = localStorage.getItem('horizon-tab-history');
        const savedArchivedTabs = localStorage.getItem('horizon-archived-tabs');
        
        if (savedTabs) {
          setTabs(JSON.parse(savedTabs));
        }
        
        if (savedActiveTab) {
          setActiveTab(savedActiveTab);
        }
        
        if (savedTabHistory) {
          setTabHistory(JSON.parse(savedTabHistory));
        }
        
        if (savedArchivedTabs) {
          setArchivedTabs(JSON.parse(savedArchivedTabs));
        }
      } catch (error) {
        console.error("Error loading tabs from storage:", error);
      }
    };
    
    loadTabsFromStorage();
  }, []);
  
  // Save tabs to storage when changed
  useEffect(() => {
    localStorage.setItem('horizon-tabs', JSON.stringify(tabs));
    
    if (activeTab) {
      localStorage.setItem('horizon-active-tab', activeTab);
    }
    
    localStorage.setItem('horizon-tab-history', JSON.stringify(tabHistory));
    localStorage.setItem('horizon-archived-tabs', JSON.stringify(archivedTabs));
  }, [tabs, activeTab, tabHistory, archivedTabs]);

  const createTab = (url = '', title = 'New Tab') => {
    const tabId = nanoid();
    const newTab = {
      id: tabId,
      url: url || 'about:newtab',
      title: title || 'New Tab',
      favicon: url ? `https://www.google.com/s2/favicons?domain=${url}` : '',
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      isActive: false,
      isLoading: true,
      isPinned: false,
      workspaceId: activeWorkspace,
      position: tabs.length
    };
    
    setTabs([...tabs, newTab]);
    addTabToWorkspace(activeWorkspace, newTab);
    
    return tabId;
  };
  
  const activateTab = (tabId) => {
    // Update last accessed time and active state
    setTabs(tabs.map(tab => ({
      ...tab,
      lastAccessed: tab.id === tabId ? Date.now() : tab.lastAccessed,
      isActive: tab.id === tabId
    })));
    
    setActiveTab(tabId);
  };
  
  const closeTab = (tabId) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose) return;
    
    // If closing active tab, activate next logical tab
    if (tabToClose.isActive) {
      const currentIndex = tabs.findIndex(tab => tab.id === tabId);
      const tabsInSameWorkspace = tabs.filter(tab => 
        tab.workspaceId === tabToClose.workspaceId && tab.id !== tabId
      );
      
      if (tabsInSameWorkspace.length > 0) {
        // Try to activate the tab to the right, or left if at the end
        const nextTabIndex = Math.min(currentIndex, tabsInSameWorkspace.length - 1);
        activateTab(tabsInSameWorkspace[nextTabIndex].id);
      }
    }
    
    setTabs(tabs.filter(tab => tab.id !== tabId));
    removeTabFromWorkspace(tabToClose.workspaceId, tabId);
  };

  const updateTab = (tabId, updates) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };
  
  const navigateTab = (tabId, url, pushToHistory = true) => {
    // Find current tab data for history
    const currentTab = tabs.find(tab => tab.id === tabId);
    if (!currentTab) return;
    
    // Add current URL to history before navigating
    if (pushToHistory && currentTab.url && currentTab.url !== 'about:blank') {
      setTabHistory(prev => ({
        ...prev,
        [tabId]: [
          ...(prev[tabId] || []),
          { url: currentTab.url, title: currentTab.title }
        ]
      }));
    }
    
    updateTab(tabId, { 
      url, 
      isLoading: true,
      lastAccessed: Date.now()
    });
    
    // Simulate page load
    setTimeout(() => {
      const domain = new URL(url).hostname.replace('www.', '');
      updateTab(tabId, { 
        isLoading: false,
        title: `${domain.charAt(0).toUpperCase()}${domain.slice(1)}`,
        favicon: `https://www.google.com/s2/favicons?domain=${url}`
      });
    }, 800);
  };
  
  const goBack = (tabId) => {
    const history = tabHistory[tabId];
    if (!history || history.length === 0) return;
    
    const previousPage = history[history.length - 1];
    
    // Update history
    setTabHistory(prev => ({
      ...prev,
      [tabId]: prev[tabId].slice(0, -1)
    }));
    
    // Navigate without pushing to history
    navigateTab(tabId, previousPage.url, false);
    updateTab(tabId, { title: previousPage.title });
  };
  
  const archiveTab = (tabId) => {
    const tabToArchive = tabs.find(tab => tab.id === tabId);
    if (!tabToArchive) return;
    
    setArchivedTabs([...archivedTabs, { ...tabToArchive, archivedAt: Date.now() }]);
    closeTab(tabId);
  };
  
  const restoreTab = (archivedTabId) => {
    const tabToRestore = archivedTabs.find(tab => tab.id === archivedTabId);
    if (!tabToRestore) return;
    
    // Create a new tab with the archived data
    const restoredTabId = createTab(tabToRestore.url, tabToRestore.title);
    
    // Update it with all the properties from archived tab
    updateTab(restoredTabId, {
      favicon: tabToRestore.favicon,
      isPinned: tabToRestore.isPinned
    });
    
    // Remove from archived tabs
    setArchivedTabs(archivedTabs.filter(tab => tab.id !== archivedTabId));
    
    return restoredTabId;
  };

  const moveTab = (tabId, toPosition) => {
    const currentPosition = tabs.findIndex(tab => tab.id === tabId);
    if (currentPosition === -1) return;
    
    // Create a new array with the moved tab
    const newTabs = [...tabs];
    const [movedTab] = newTabs.splice(currentPosition, 1);
    newTabs.splice(toPosition, 0, movedTab);
    
    // Update positions
    setTabs(newTabs.map((tab, index) => ({
      ...tab,
      position: index
    })));
  };
  
  const pinTab = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    updateTab(tabId, { isPinned: !tab.isPinned });
    
    // Reorder tabs - pinned tabs go first
    const pinnedTabs = tabs.filter(t => t.id === tabId || t.isPinned);
    const unpinnedTabs = tabs.filter(t => t.id !== tabId && !t.isPinned);
    
    setTabs([...pinnedTabs, ...unpinnedTabs].map((tab, index) => ({
      ...tab,
      position: index
    })));
  };

  return (
    <TabsContext.Provider value={{
      tabs,
      activeTab,
      tabHistory,
      archivedTabs,
      createTab,
      activateTab,
      closeTab,
      updateTab,
      navigateTab,
      goBack,
      archiveTab,
      restoreTab,
      moveTab,
      pinTab
    }}>
      {children}
    </TabsContext.Provider>
  );
};
