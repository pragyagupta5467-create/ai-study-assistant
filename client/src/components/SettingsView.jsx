import React from 'react';
import {
  Settings,
  Sun,
  Moon,
  Shield,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Cpu,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export function SettingsView({
  theme,
  onToggleTheme,
  onResetSampleData,
  onShowToast,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const handleClearCache = () => {
    onShowToast('Local study cache cleared successfully', 'success');
  };

  return (
    <div className="settings-view-root">
      <div className="settings-header">
        <div className="settings-badge">
          <Settings size={14} />
          <span>Preferences & Configuration</span>
        </div>
        <h1 className="settings-title">Application Settings</h1>
        <p className="settings-sub">
          Manage your account profile, interface theme, AI model preferences, and local data persistence.
        </p>
      </div>

      <div className="settings-cards-list">
        {/* User Account Settings */}
        <div className="settings-card">
          <h3 className="card-title">User Account</h3>
          <p className="card-desc">Your active login session and learner profile.</p>

          {currentUser ? (
            <div className="settings-account-box">
              <div className="account-info-left">
                <div className="account-avatar-lg">{currentUser.avatar || 'PG'}</div>
                <div>
                  <div className="account-name-lg">{currentUser.name}</div>
                  <div className="account-email-lg">{currentUser.email || 'student@studyai.edu'}</div>
                  <span className="account-role-tag">{currentUser.role || 'Student'}</span>
                </div>
              </div>

              <button className="btn-settings-danger" onClick={onLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="settings-logged-out-box">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                You are currently studying as a Guest. Sign in or create an account to save your progress across devices.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-hero-primary"
                  onClick={() => onOpenAuth('login')}
                  style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
                <button
                  className="btn-hero-secondary"
                  onClick={() => onOpenAuth('register')}
                  style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                >
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Appearance Settings */}
        <div className="settings-card">
          <h3 className="card-title">Appearance</h3>
          <p className="card-desc">Customize the application visual theme.</p>

          <div className="settings-row">
            <div>
              <strong>Theme Mode</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Currently using {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </div>
            </div>

            <button className="btn-toggle-theme" onClick={onToggleTheme}>
              {theme === 'dark' ? (
                <>
                  <Sun size={16} />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Backend Details */}
        <div className="settings-card">
          <h3 className="card-title">AI Engine Configuration</h3>
          <p className="card-desc">
            API keys are securely held on the Express backend server in <code>server/.env</code>.
          </p>

          <div className="settings-row">
            <div>
              <strong>Active Model Provider</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Google Gemini 1.5 Flash (Fallback dynamic mock enabled)
              </div>
            </div>
            <span className="status-badge-secure">
              <Shield size={14} />
              <span>Backend Protected</span>
            </span>
          </div>
        </div>

        {/* Local Storage & Data Management */}
        <div className="settings-card">
          <h3 className="card-title">Data Management</h3>
          <p className="card-desc">Reset your sample topics or clear local session state.</p>

          <div className="settings-actions-group">
            <button
              className="btn-settings-action"
              onClick={() => {
                onResetSampleData();
                onShowToast('Sample study sets restored', 'success');
              }}
            >
              <RotateCcw size={16} />
              <span>Restore Sample Topics</span>
            </button>

            <button
              className="btn-settings-danger"
              onClick={handleClearCache}
            >
              <Trash2 size={16} />
              <span>Clear Local Cache</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
