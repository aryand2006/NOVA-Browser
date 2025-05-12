import React, { useRef, useEffect } from 'react';
import WebView from './WebView';
import SplitViewDivider from './SplitViewDivider';
import { useTabs } from '../contexts/TabsContext';
import '../styles/BrowserView.css';

const BrowserView = ({ 
  tabs, 
  activeTab, 
  splitView, 
  splitRatio, 
  onSplitViewToggle,
  onSplitDrag
}) => {
  const containerRef = useRef(null);
  const { activateTab } = useTabs();
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  // For split view, we find another tab to show or use the active one
  const secondTabData = splitView ? 
    tabs.find(tab => !tab.isActive && tab.id !== activeTab) || activeTabData : 
    null;
  
  // Handle resize of container
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Update layout if needed
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // No active tab case
  if (!activeTabData) {
    return (
      <div className="browser-view empty-state" ref={containerRef}>
        <div className="empty-view">
          <div className="empty-icon">🏝️</div>
          <h3>No tabs open</h3>
          <p>Open a new tab to start browsing</p>
          <button 
            className="primary-button"
            onClick={() => {
              const newTabId = createTab();
              activateTab(newTabId);
            }}
          >
            New Tab
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`browser-view ${splitView ? 'split-mode' : ''}`}
      ref={containerRef}
    >
      <div 
        className="primary-view"
        style={{ width: splitView ? `${splitRatio}%` : '100%' }}
      >
        <WebView tab={activeTabData} />
      </div>
      
      {splitView && secondTabData && (
        <>
          <SplitViewDivider onDrag={onSplitDrag} />
          
          <div 
            className="secondary-view"
            style={{ width: `${100 - splitRatio}%` }}
          >
            <WebView tab={secondTabData} />
          </div>
        </>
      )}
      
      <div className="browser-view-controls">
        <button 
          className={`split-view-toggle ${splitView ? 'active' : ''}`}
          onClick={onSplitViewToggle}
          title={splitView ? "Exit Split View" : "Split View"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BrowserView;
