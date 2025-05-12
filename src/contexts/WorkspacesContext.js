import React, { createContext, useState, useContext } from 'react';

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

  return (
    <WorkspacesContext.Provider 
      value={{ 
        workspaces, 
        activeWorkspace,
        switchWorkspace,
        createWorkspace
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
