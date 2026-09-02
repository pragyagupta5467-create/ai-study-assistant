import React from 'react';
import { BookOpen, Moon, Sun, RotateCcw } from 'lucide-react';

export function Header({ theme, onToggleTheme, onReset, hasActiveStudySet }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-logo" onClick={onReset} role="button" tabIndex={0}>
          <div className="brand-icon-box">
            <BookOpen size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="brand-title">AI Study Assistant</h1>
          </div>
        </div>

        <div className="header-actions">
          {hasActiveStudySet && (
            <button
              onClick={onReset}
              className="btn-secondary"
              title="Start a new study session"
            >
              <RotateCcw size={16} />
              <span>New Session</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle light/dark theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
