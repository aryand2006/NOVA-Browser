import React, { useState, useRef, useEffect } from 'react';
import '../styles/CommandCenter.css';

const CommandCenter = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const commands = [
    {
      id: 'search',
      icon: '🔍',
      text: `Search for "${query || 'anything'}"`,
      shortcut: 'Enter',
      action: () => alert(`Searching for: ${query}`)
    },
    {
      id: 'split',
      icon: '⋮⋮',
      text: 'Toggle Split View',
      shortcut: '⌘+\\',
      action: () => alert('Split view toggled')
    },
    {
      id: 'focus',
      icon: '⚪',
      text: 'Toggle Focus Mode',
      shortcut: '⌘+⇧+F',
      action: () => alert('Focus mode toggled')
    },
    {
      id: 'workspace',
      icon: '📚',
      text: 'Switch Workspace',
      shortcut: '⌘+⇧+W',
      action: () => alert('Workspace switcher opened')
    }
  ];
  
  const filteredCommands = query
    ? commands.filter(cmd => cmd.text.toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="command-center" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a command or search..."
        />
        <div className="command-results">
          {filteredCommands.map(command => (
            <div 
              key={command.id}
              className="command-item"
              onClick={() => {
                command.action();
                onClose();
              }}
            >
              <div className="command-icon">{command.icon}</div>
              <div className="command-text">{command.text}</div>
              <div className="command-shortcut">{command.shortcut}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
