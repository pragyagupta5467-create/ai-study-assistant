import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Command,
  ChevronRight,
  Check,
  Flame,
  Award,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  User
} from 'lucide-react';

export function Navbar({
  activeViewTitle,
  activeTopicTitle,
  onOpenMobileSidebar,
  onOpenSearch,
  theme,
  onToggleTheme,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Quiz completed!', desc: 'You scored 85% on Operating Systems.', time: '10m ago', icon: Award, read: false },
    { id: 2, title: '7-Day Streak Active 🔥', desc: 'Study 15 minutes today to keep your streak.', time: '2h ago', icon: Flame, read: false },
    { id: 3, title: 'New AI flashcard set ready', desc: 'Java Collections flashcard deck prepared.', time: 'Yesterday', icon: Sparkles, read: true }
  ];

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        {/* Hamburger for Mobile */}
        <button
          className="navbar-hamburger"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Page Breadcrumb / Title */}
        <div className="navbar-breadcrumbs">
          <span
            className="breadcrumb-root"
            onClick={() => onNavigate('dashboard')}
          >
            StudyAI
          </span>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current">
            {activeViewTitle}
          </span>
          {activeTopicTitle && (
            <>
              <ChevronRight size={14} className="breadcrumb-separator" />
              <span className="breadcrumb-subtopic">{activeTopicTitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Search Bar Trigger */}
        <button
          className="navbar-search-btn"
          onClick={onOpenSearch}
          title="Search topics & notes (Ctrl+K)"
        >
          <Search size={15} />
          <span className="search-placeholder">Search topics, notes...</span>
          <span className="search-kbd">
            <kbd>⌘K</kbd>
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="navbar-dropdown-wrapper">
          <button
            className={`navbar-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="notification-badge" />
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <h4>Notifications</h4>
                <span className="unread-count">2 New</span>
              </div>
              <div className="popover-list">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className={`popover-item ${!n.read ? 'unread' : ''}`}>
                      <div className="popover-item-icon">
                        <Icon size={16} />
                      </div>
                      <div className="popover-item-content">
                        <div className="popover-item-title">{n.title}</div>
                        <div className="popover-item-desc">{n.desc}</div>
                        <div className="popover-item-time">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          className="navbar-icon-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile or Auth Action */}
        {currentUser ? (
          <div className="navbar-dropdown-wrapper">
            <div
              className="navbar-user-chip"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="user-avatar-sm">{currentUser.avatar || 'PG'}</div>
              <span className="user-name-sm">{currentUser.name}</span>
            </div>

            {showUserMenu && (
              <div className="user-menu-popover">
                <div className="user-menu-header">
                  <div className="user-avatar-md">{currentUser.avatar || 'PG'}</div>
                  <div className="user-menu-meta">
                    <div className="user-menu-name">{currentUser.name}</div>
                    <div className="user-menu-email">{currentUser.email || 'student@studyai.edu'}</div>
                  </div>
                </div>

                <div className="user-menu-links">
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings size={15} />
                    <span>Settings & Preferences</span>
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      onNavigate('progress');
                      setShowUserMenu(false);
                    }}
                  >
                    <Award size={15} />
                    <span>Study Analytics</span>
                  </button>

                  <div className="user-menu-divider" />

                  <button
                    className="user-menu-item danger"
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-auth-buttons">
            <button
              className="btn-nav-login"
              onClick={() => onOpenAuth('login')}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              className="btn-nav-signup"
              onClick={() => onOpenAuth('register')}
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
