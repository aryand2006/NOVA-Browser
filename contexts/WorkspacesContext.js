import React, { createContext, useState, useContext, useEffect } from 'react';

const WorkspacesContext = createContext();

export const useWorkspaces = () => useContext(WorkspacesContext);

export const WorkspacesProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([
    { 
      id: 'work',
      name: 'Work', 
      icon: 'W', 
      color: '#3a86ff',
      tabCount: 9,
      lastUsed: 'today',
      active: false,
      tabs: [] 
    },
    { 
      id: 'research',
      name: 'Research', 
      icon: 'R', 
      color: '#8338ec',
      tabCount: 12,
      lastUsed: 'yesterday',
      active: false,
      tabs: [] 
    },
    { 
      id: 'social',
      name: 'Social', 
      icon: 'S', 
      color: '#ff006e',
      tabCount: 4,
      lastUsed: '3 days ago',
      active: false,
      tabs: [] 
    },
    { 
      id: 'personal',
      name: 'Personal Projects', 
      icon: 'P', 
      color: '#ff006e',
      tabCount: 7,
      lastUsed: 'today',
      active: false,
      tabs: [] 
    },
    { 
      id: 'learning',
      name: 'Learning', 
      icon: 'L', 
      color: '#10b981',
      tabCount: 5,
      lastUsed: 'Active now',
      active: true,
      tabs: [] 
    },
  ]);
  
  const [activeWorkspace, setActiveWorkspace] = useState('learning');
  
  const switchWorkspace = (workspaceId) => {
    setActiveWorkspace(workspaceId);
    setWorkspaces(workspaces.map(workspace => ({
      ...workspace,
      active: workspace.id === workspaceId
    })));
  };
  
  const createWorkspace = (name, icon, color) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    const newWorkspace = {
      id: newId,
      name,
      icon: icon || name.charAt(0).toUpperCase(),
      color: color || '#3a86ff',
      tabCount: 0,
      lastUsed: 'just created',
      active: false,
      tabs: []
    };
    
    setWorkspaces([...workspaces, newWorkspace]);
    return newId;
  };

  const addTabToWorkspace = (workspaceId, tab) => {
    setWorkspaces(workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedTabs = [...workspace.tabs, tab];
        return {
          ...workspace,
          tabs: updatedTabs,
          tabCount: updatedTabs.length
        };
      }
      return workspace;
    }));
  };
  
  const removeTabFromWorkspace = (workspaceId, tabId) => {
    setWorkspaces(workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedTabs = workspace.tabs.filter(tab => tab.id !== tabId);
        return {
          ...workspace,
          tabs: updatedTabs,
          tabCount: updatedTabs.length
        };
      }
      return workspace;
    }));
  };
  
  const moveTabBetweenWorkspaces = (sourceWorkspaceId, targetWorkspaceId, tabId) => {
    const sourceWorkspace = workspaces.find(w => w.id === sourceWorkspaceId);
    if (!sourceWorkspace) return;
    
    const tabToMove = sourceWorkspace.tabs.find(tab => tab.id === tabId);
    if (!tabToMove) return;
    
    setWorkspaces(workspaces.map(workspace => {
      if (workspace.id === sourceWorkspaceId) {
        const updatedTabs = workspace.tabs.filter(tab => tab.id !== tabId);
        return {
          ...workspace,
          tabs: updatedTabs,
          tabCount: updatedTabs.length
        };
      }
      if (workspace.id === targetWorkspaceId) {
        const updatedTabs = [...workspace.tabs, tabToMove];
        return {
          ...workspace,
          tabs: updatedTabs,
          tabCount: updatedTabs.length,
          lastUsed: 'just now'
        };
      }
      return workspace;
    }));
  };
  
  const renameWorkspace = (workspaceId, newName) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, name: newName } 
        : workspace
    ));
  };
  
  const changeWorkspaceColor = (workspaceId, newColor) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, color: newColor } 
        : workspace
    ));
  };
  
  const archiveWorkspace = (workspaceId) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, archived: true } 
        : workspace
    ));
    
    if (activeWorkspace === workspaceId) {
      const nextAvailableWorkspace = workspaces.find(w => 
        w.id !== workspaceId && !w.archived
      );
      
      if (nextAvailableWorkspace) {
        switchWorkspace(nextAvailableWorkspace.id);
      }
    }
  };
  
  const restoreWorkspace = (workspaceId) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, archived: false } 
        : workspace
    ));
  };
  
  const deleteWorkspace = (workspaceId) => {
    if (workspaces.length <= 1) return;
    
    setWorkspaces(workspaces.filter(workspace => workspace.id !== workspaceId));
    
    if (activeWorkspace === workspaceId) {
      const nextAvailableWorkspace = workspaces.find(w => w.id !== workspaceId);
      if (nextAvailableWorkspace) {
        switchWorkspace(nextAvailableWorkspace.id);
      }
    }
  };
  
  useEffect(() => {
    setWorkspaces(workspaces.map(workspace => {
      if (workspace.id === activeWorkspace) {
        return { ...workspace, lastUsed: 'Active now' };
      }
      return workspace;
    }));
  }, [activeWorkspace]);
  
  useEffect(() => {
    localStorage.setItem('horizon-workspaces', JSON.stringify(workspaces));
    localStorage.setItem('horizon-active-workspace', activeWorkspace);
  }, [workspaces, activeWorkspace]);
  
  useEffect(() => {
    try {
      const savedWorkspaces = localStorage.getItem('horizon-workspaces');
      const savedActiveWorkspace = localStorage.getItem('horizon-active-workspace');
      
      if (savedWorkspaces) {
        setWorkspaces(JSON.parse(savedWorkspaces));
      }
      
      if (savedActiveWorkspace) {
        setActiveWorkspace(savedActiveWorkspace);
      }
    } catch (err) {
      console.error("Error loading workspaces from storage:", err);
    }
  }, []);

  return (
    <WorkspacesContext.Provider 
      value={{ 
        workspaces, 
        activeWorkspace,
        switchWorkspace,
        createWorkspace,
        addTabToWorkspace,
        removeTabFromWorkspace,
        moveTabBetweenWorkspaces,
        renameWorkspace,
        changeWorkspaceColor,
        archiveWorkspace,
        restoreWorkspace,
        deleteWorkspace
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
