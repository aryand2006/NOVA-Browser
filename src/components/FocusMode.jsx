import React from 'react';
import '../styles/FocusMode.css';

const FocusMode = ({ onExit }) => {
  return (
    <div className="focus-mode-overlay">
      <div className="focus-mode-message">
        <h3>Focus Mode Activated</h3>
        <p>Distractions minimized. Notifications paused.</p>
        <button 
          className="primary-button"
          onClick={onExit}
        >
          Exit Focus Mode
        </button>
      </div>
    </div>
  );
};

export default FocusMode;
