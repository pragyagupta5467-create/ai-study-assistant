import React from 'react';
import { StatCard } from './StatCard';
import { TopicCard } from './TopicCard';
import {
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Award,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export function Dashboard({
  stats,
  topics,
  onNewSession,
  onSelectTopic,
  onContinueLearning
}) {
  const currentTopic = topics[0] || {
    title: 'Operating Systems',
    subtitle: 'Process Management & Concurrency',
    progress: 68
  };

  return (
    <div className="dashboard-view-root">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero-card">
        <div className="hero-left-content">
          <div className="hero-greeting-badge">
            <Sparkles size={14} />
            <span>AI Learning Platform</span>
          </div>
          <h1 className="hero-greeting-title">
            Good evening, Pragya <span className="wave-hand">👋</span>
          </h1>
          <p className="hero-greeting-sub">
            Ready to turn your study time into progress? Generate a new study set from your lecture notes or pick up where you left off.
          </p>

          <div className="hero-actions-row">
            <button
              className="btn-hero-primary"
              onClick={onNewSession}
            >
              <Sparkles size={18} />
              <span>+ New Study Session</span>
            </button>

            <button
              className="btn-hero-secondary"
              onClick={() => onSelectTopic(currentTopic)}
            >
              <Play size={16} />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>

        <div className="hero-decorative-orb" />
      </section>

      {/* 4 Key Statistics Cards */}
      <section className="dashboard-stats-grid">
        <StatCard
          label="Topics Studied"
          value={stats.topicsStudied}
          subtext="4 subjects active"
          icon={BookOpen}
          color="var(--primary)"
          trend="+2 this week"
        />
        <StatCard
          label="Flashcards Reviewed"
          value={stats.flashcardsReviewed}
          subtext="88% retention rate"
          icon={Layers}
          color="var(--secondary)"
          trend="+42 today"
        />
        <StatCard
          label="Quizzes Completed"
          value={stats.quizzesCompleted}
          subtext="3 re-tests passed"
          icon={HelpCircle}
          color="var(--success)"
          trend="+4 this week"
        />
        <StatCard
          label="Average Score"
          value={`${stats.averageScore}%`}
          subtext="Top 10% mastery"
          icon={Award}
          color="#f59e0b"
          trend="+6% vs last month"
        />
      </section>

      {/* Continue Learning Large Card */}
      <section className="continue-learning-section">
        <div className="continue-card">
          <div className="continue-card-left">
            <div className="continue-badge">
              <span className="pulse-dot" />
              <span>Continue where you left off</span>
            </div>
            <h2 className="continue-topic-title">{currentTopic.title}</h2>
            <p className="continue-topic-sub">
              {currentTopic.subtitle || 'Process Management & Synchronization algorithms'}
            </p>

            <div className="continue-meta-tags">
              <span className="continue-meta-pill">
                <CheckCircle2 size={13} /> Active Session
              </span>
              <span className="continue-meta-pill">
                <Layers size={13} /> {currentTopic.cardsCount || 10} Flashcards
              </span>
            </div>
          </div>

          <div className="continue-card-right">
            {/* Circular Progress Gauge */}
            <div className="circular-progress-wrap">
              <svg className="circular-progress-svg" viewBox="0 0 100 100">
                <circle
                  className="circle-bg"
                  cx="50"
                  cy="50"
                  r="42"
                />
                <circle
                  className="circle-fill"
                  cx="50"
                  cy="50"
                  r="42"
                  style={{
                    strokeDashoffset: 264 - (264 * (currentTopic.progress || 68)) / 100
                  }}
                />
              </svg>
              <div className="circle-inner-content">
                <span className="circle-pct">{currentTopic.progress || 68}%</span>
                <span className="circle-lbl">Done</span>
              </div>
            </div>

            <button
              className="btn-continue-action"
              onClick={() => onSelectTopic(currentTopic)}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Topics Grid */}
      <section className="recent-topics-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Study Topics</h2>
            <p className="section-sub">Select any study deck to review flashcards or take an assessment.</p>
          </div>

          <button
            className="btn-link-action"
            onClick={onNewSession}
          >
            <span>+ Create Topic</span>
          </button>
        </div>

        <div className="topics-grid">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onSelect={onSelectTopic}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
