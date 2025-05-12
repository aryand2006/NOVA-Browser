import React from 'react';
import '../styles/WorkspaceSwitcher.css';

const WorkspaceSwitcher = ({ onClose }) => {
  const workspaces = [
    { id: 'work', name: 'Work', icon: 'W', color: '#3a86ff', tabs: 9 },
    { id: 'research', name: 'Research', icon: 'R', color: '#8338ec', tabs: 12 },
    { id: 'social', name: 'Social', icon: 'S', color: '#ff006e', tabs: 4 },
    { id: 'personal', name: 'Personal Projects', icon: 'P', color: '#ff006e', tabs: 7 },
    { id: 'learning', name: 'Learning', icon: 'L', color: '#10b981', tabs: 5 }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="workspace-switcher" onClick={e => e.stopPropagation()}>
        <h2>Switch Workspace</h2>
        <div className="workspace-list">
          {workspaces.map(workspace => (
            <div 
              key={workspace.id} 
              className="workspace-item"
              onClick={() => {
                alert(`Switching to ${workspace.name} workspace`);
                onClose();
              }}
            >
              <div 
                className="workspace-icon" 
                style={{ backgroundColor: workspace.color }}
              >
                {workspace.icon}
              </div>
              <div className="workspace-info">
                <div className="workspace-name">{workspace.name}</div>
                <div className="workspace-tabs">{workspace.tabs} tabs</div>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="primary-button create-workspace-button"
          onClick={() => {
            alert('Creating new workspace');
            onClose();
          }}
        >
          Create New Workspace
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSwitcher;
