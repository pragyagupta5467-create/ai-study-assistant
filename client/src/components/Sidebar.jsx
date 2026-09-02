import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  HelpCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ChevronRight,
  BookOpen,
  X,
  Flame,
  Plus,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assistant', label: 'Study Assistant', icon: Sparkles, badge: 'AI' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'wrong-answers', label: 'Wrong Answers', icon: AlertTriangle, showMistakeBadge: true },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export function Sidebar({
  activeView,
  onNavigate,
  recentTopics = [],
  onSelectTopic,
  mistakesCount = 0,
  streakDays = 0,
  theme,
  onToggleTheme,
  isOpen,
  onCloseMobile,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <div
            className="sidebar-brand"
            onClick={() => {
              onNavigate('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-gem">
              <Sparkles size={18} />
            </div>
            <div className="brand-text-wrap">
              <div className="brand-name">StudyAI</div>
              <div className="brand-tagline">Learn smarter.</div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            className="sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick New Session Action */}
        <div className="sidebar-quick-action">
          <button
            className="btn-sidebar-create"
            onClick={() => {
              onNavigate('assistant');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <Plus size={16} />
            <span>New Study Session</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="sidebar-nav-scroll">
          <div className="sidebar-section-title">MAIN</div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const hasMistakes = item.showMistakeBadge && mistakesCount > 0;

              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="nav-link-left">
                    <Icon size={18} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="nav-badge ai">{item.badge}</span>
                  )}

                  {hasMistakes && (
                    <span className="nav-badge alert">{mistakesCount}</span>
                  )}

                  {isActive && <div className="nav-active-pill" />}
                </button>
              );
            })}
          </nav>

          {/* User's Study Topics Section */}
          <div className="sidebar-section-title" style={{ marginTop: '1.5rem' }}>
            <span>YOUR STUDY</span>
          </div>

          <div className="sidebar-topics-list">
            {recentTopics.length > 0 ? (
              recentTopics.slice(0, 6).map((topic) => (
                <button
                  key={topic.id}
                  className="sidebar-topic-item"
                  onClick={() => {
                    onSelectTopic(topic);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="topic-item-dot" />
                  <span className="topic-item-name" title={topic.title}>
                    {topic.title}
                  </span>
                  <ChevronRight size={14} className="topic-item-arrow" />
                </button>
              ))
            ) : (
              <div className="sidebar-empty-topics-hint">
                <span>No topics yet</span>
              </div>
            )}
          </div>

          {/* Daily Streak Widget */}
          <div className="sidebar-streak-card">
            <div className="streak-icon-wrap">
              <Flame size={18} />
            </div>
            <div className="streak-info">
              <div className="streak-title">
                {streakDays > 0 ? `${streakDays}-Day Study Streak` : 'Study Streak'}
              </div>
              <div className="streak-sub">
                {streakDays > 0
                  ? 'Keep studying daily to maintain your record!'
                  : 'Complete a study session to start your streak!'}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          {currentUser ? (
            <div className="user-profile-widget" onClick={() => onNavigate('settings')}>
              <div className="user-avatar">
                <span>{currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}</span>
                <div className="user-online-dot" />
              </div>
              <div className="user-details">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role || 'Student'}</div>
              </div>
            </div>
          ) : (
            <div className="logged-out-sidebar-actions">
              <button
                className="btn-sidebar-auth"
                onClick={() => onOpenAuth('login')}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            </div>
          )}

          <div className="sidebar-footer-actions">
            <button
              className="theme-mini-btn"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
