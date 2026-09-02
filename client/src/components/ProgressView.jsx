import React from 'react';
import {
  Flame,
  Award,
  BookOpen,
  Layers,
  HelpCircle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { WEEKLY_ACTIVITY } from '../data/mockData';

export function ProgressView({ stats, topics = [] }) {
  const maxWeeklyHours = Math.max(...WEEKLY_ACTIVITY.map((d) => d.hours));

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
          <div className="streak-days-count">7 Days</div>
          <p className="streak-message">
            You've studied 7 days in a row! Personal record is <strong>12 days</strong>.
          </p>
        </div>

        {/* 3 Analytics Summary Cards */}
        <div className="analytics-summary-box">
          <div className="summary-metric-item">
            <div className="metric-icon-bg primary">
              <Clock size={18} />
            </div>
            <div>
              <div className="metric-num">23.8 hrs</div>
              <div className="metric-label">Total Study Time</div>
            </div>
          </div>

          <div className="summary-metric-item">
            <div className="metric-icon-bg success">
              <Award size={18} />
            </div>
            <div>
              <div className="metric-num">{stats.averageScore}%</div>
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
            <span>Total: <strong>23.9 hrs</strong> this week</span>
          </div>
        </div>

        <div className="weekly-chart-grid">
          {WEEKLY_ACTIVITY.map((item, idx) => {
            const barHeightPct = Math.round((item.hours / maxWeeklyHours) * 100);
            const isToday = item.day === 'Wed';

            return (
              <div key={idx} className="chart-bar-column">
                <div className="bar-tooltip">{item.hours}h</div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${isToday ? 'today' : ''}`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
                <span className={`bar-day-label ${isToday ? 'active' : ''}`}>{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="topic-mastery-card">
        <h3 className="card-heading-title" style={{ marginBottom: '1.25rem' }}>
          Topic Mastery Levels
        </h3>

        <div className="mastery-list">
          {topics.map((t) => (
            <div key={t.id} className="mastery-item-row">
              <div className="mastery-item-info">
                <div className="mastery-item-title">{t.title}</div>
                <div className="mastery-item-sub">{t.subtitle}</div>
              </div>

              <div className="mastery-item-bar-wrap">
                <div className="mastery-bar-track">
                  <div
                    className="mastery-bar-fill"
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                <span className="mastery-item-pct">{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
