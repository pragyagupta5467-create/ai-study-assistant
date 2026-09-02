import React from 'react';
import {
  Flame,
  Award,
  BookOpen,
  Layers,
  HelpCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function ProgressView({
  stats,
  topics = [],
  weeklyActivity = [],
  onNewSession
}) {
  const hasActivity = topics.length > 0 || stats.quizzesCompleted > 0 || stats.flashcardsReviewed > 0;
  const streak = stats.streakDays || (stats.quizzesCompleted > 0 ? 1 : 0);
  const totalHours = weeklyActivity.reduce((acc, curr) => acc + (curr.hours || 0), 0);
  const maxWeeklyHours = Math.max(...weeklyActivity.map((d) => d.hours || 0), 1);

  if (!hasActivity) {
    return (
      <div className="progress-view-root">
        <div className="progress-header-banner">
          <div>
            <div className="progress-badge">
              <TrendingUp size={14} />
              <span>Learning Analytics</span>
            </div>
            <h1 className="progress-title">Your Study Progress</h1>
            <p className="progress-sub">
              Track your consistency, topic mastery levels, and weekly focus metrics.
            </p>
          </div>
        </div>

        {/* Empty State Banner */}
        <div className="empty-mistakes-card" style={{ marginTop: '1.5rem' }}>
          <div className="empty-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <TrendingUp size={44} />
          </div>
          <h2 className="empty-title">No learning activity yet</h2>
          <p className="empty-sub">
            Generate your first study set, flip through flashcards, and take quizzes to populate your personal study analytics.
          </p>
          <button
            className="btn-hero-primary"
            onClick={onNewSession}
            style={{ width: 'auto', margin: '1.5rem auto 0' }}
          >
            <Sparkles size={18} />
            <span>Start Your First Study Session</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-view-root">
      {/* Header Banner */}
      <div className="progress-header-banner">
        <div>
          <div className="progress-badge">
            <TrendingUp size={14} />
            <span>Learning Analytics</span>
          </div>
          <h1 className="progress-title">Your Study Progress</h1>
          <p className="progress-sub">
            Track your study consistency, mastery rates, and weekly focus metrics.
          </p>
        </div>
      </div>

      {/* Streak & Core Metrics Grid */}
      <div className="streak-hero-grid">
        {/* Streak Card */}
        <div className="streak-card-main">
          <div className="streak-top-row">
            <div className="streak-flame-box">
              <Flame size={28} />
            </div>
            <span className="streak-status-tag">Active Streak</span>
          </div>
          <div className="streak-days-count">{streak} {streak === 1 ? 'Day' : 'Days'}</div>
          <p className="streak-message">
            {streak > 0
              ? `You've studied ${streak} ${streak === 1 ? 'day' : 'days'} in a row! Keep up the momentum.`
              : 'Complete a study session today to start your streak!'}
          </p>
        </div>

        {/* 3 Analytics Summary Cards */}
        <div className="analytics-summary-box">
          <div className="summary-metric-item">
            <div className="metric-icon-bg primary">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="metric-num">{stats.topicsStudied}</div>
              <div className="metric-label">Topics Studied</div>
            </div>
          </div>

          <div className="summary-metric-item">
            <div className="metric-icon-bg success">
              <Award size={18} />
            </div>
            <div>
              <div className="metric-num">
                {stats.quizzesCompleted > 0 && stats.averageScore !== null
                  ? `${stats.averageScore}%`
                  : '—'}
              </div>
              <div className="metric-label">Average Accuracy</div>
            </div>
          </div>

          <div className="summary-metric-item">
            <div className="metric-icon-bg secondary">
              <Layers size={18} />
            </div>
            <div>
              <div className="metric-num">{stats.flashcardsReviewed}</div>
              <div className="metric-label">Cards Reviewed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="weekly-activity-card">
        <div className="card-heading-row">
          <div>
            <h3 className="card-heading-title">Weekly Activity</h3>
            <p className="card-heading-sub">Daily hours logged across flashcards and quizzes</p>
          </div>
          <div className="weekly-total-tag">
            <span>Total: <strong>{totalHours.toFixed(1)} hrs</strong> this week</span>
          </div>
        </div>

        <div className="weekly-chart-grid">
          {weeklyActivity.map((item, idx) => {
            const barHeightPct = Math.round(((item.hours || 0) / maxWeeklyHours) * 100);

            return (
              <div key={idx} className="chart-bar-column">
                <div className="bar-tooltip">{item.hours || 0}h</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                  />
                </div>
                <span className="bar-day-label">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      {topics.length > 0 && (
        <div className="topic-mastery-card">
          <h3 className="card-heading-title" style={{ marginBottom: '1.25rem' }}>
            Topic Mastery Levels
          </h3>

          <div className="mastery-list">
            {topics.map((t) => (
              <div key={t.id} className="mastery-item-row">
                <div className="mastery-item-info">
                  <div className="mastery-item-title">{t.title}</div>
                  <div className="mastery-item-sub">{t.subtitle || `${t.cards?.length || 0} Flashcards`}</div>
                </div>

                <div className="mastery-item-bar-wrap">
                  <div className="mastery-bar-track">
                    <div
                      className="mastery-bar-fill"
                      style={{ width: `${t.progress || 0}%` }}
                    />
                  </div>
                  <span className="mastery-item-pct">{t.progress || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
