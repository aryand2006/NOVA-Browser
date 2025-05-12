import React, { useState, useEffect, useRef } from 'react';
import '../styles/CommandCenter.css';

const CommandCenter = ({ onClose, onToggleFocusMode, onShowWorkspaces }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const commands = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
      text: `Search for "${query || 'anything'}"`,
      shortcut: 'Enter',
      action: () => {
        console.log(`Searching for: ${query}`);
        onClose();
      }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      ),
      text: 'Toggle Split View',
      shortcut: '⌘+\\',
      action: () => {
        console.log('Toggle split view');
        onClose();
      }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ),
      text: 'Toggle Focus Mode',
      shortcut: '⌘+⇧+F',
      action: onToggleFocusMode
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h0M12 15h0M17 15h0" />
        </svg>
      ),
      text: 'Show Workspaces',
      shortcut: '⌘+⇧+W',
      action: onShowWorkspaces
    }
  ];

  const filteredCommands = query
    ? commands.filter(cmd => cmd.text.toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div className="command-center-overlay" onClick={onClose}>
      <div className="command-center" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          placeholder="Type a command or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filteredCommands.length > 0) {
              filteredCommands[0].action();
            }
          }}
        />
        
        <div className="command-results">
          {filteredCommands.map((command, index) => (
            <div 
              key={index}
              className="command-item"
              onClick={command.action}
            >
              <div className="command-icon">{command.icon}</div>
              <div className="command-text">{command.text}</div>
              <div className="command-shortcut">{command.shortcut}</div>
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="command-no-results">No matching commands found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
