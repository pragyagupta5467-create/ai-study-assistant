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
  CheckCircle2,
  Plus
} from 'lucide-react';

export function Dashboard({
  currentUser,
  stats,
  topics = [],
  onNewSession,
  onSelectTopic,
  onContinueLearning
}) {
  const currentTopic = topics.length > 0 ? topics[0] : null;
  const hasTopics = topics.length > 0;

  // Format greeting
  const greetingName = currentUser?.name ? `, ${currentUser.name}` : '';

  // Format average score (display dash '—' when 0 quizzes)
  const averageScoreDisplay =
    stats.quizzesCompleted > 0 && stats.averageScore !== null
      ? `${stats.averageScore}%`
      : '—';

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
            Good evening{greetingName} <span className="wave-hand">👋</span>
          </h1>
          <p className="hero-greeting-sub">
            Ready to turn your study time into progress? Generate a new study set from your notes or pick up where you left off.
          </p>

          <div className="hero-actions-row">
            <button
              className="btn-hero-primary"
              onClick={onNewSession}
            >
              <Sparkles size={18} />
              <span>+ New Study Session</span>
            </button>

            {hasTopics && (
              <button
                className="btn-hero-secondary"
                onClick={() => onSelectTopic(currentTopic)}
              >
                <Play size={16} />
                <span>Continue Learning</span>
              </button>
            )}
          </div>
        </div>

        <div className="hero-decorative-orb" />
      </section>

      {/* 4 Key Dynamic Statistics Cards */}
      <section className="dashboard-stats-grid">
        <StatCard
          label="Topics Studied"
          value={stats.topicsStudied}
          subtext={hasTopics ? `${stats.topicsStudied} active sets` : 'No study sets yet'}
          icon={BookOpen}
          color="var(--primary)"
        />
        <StatCard
          label="Flashcards Reviewed"
          value={stats.flashcardsReviewed}
          subtext={stats.flashcardsReviewed > 0 ? 'Cards reviewed' : 'Start reviewing cards'}
          icon={Layers}
          color="var(--secondary)"
        />
        <StatCard
          label="Quizzes Completed"
          value={stats.quizzesCompleted}
          subtext={stats.quizzesCompleted > 0 ? 'Assessments taken' : 'Take your first quiz'}
          icon={HelpCircle}
          color="var(--success)"
        />
        <StatCard
          label="Average Score"
          value={averageScoreDisplay}
          subtext={stats.quizzesCompleted > 0 ? 'Overall accuracy' : 'No quiz attempts yet'}
          icon={Award}
          color="#f59e0b"
        />
      </section>

      {/* Continue Learning Section (Dynamic or Clean Zero-State) */}
      <section className="continue-learning-section">
        {hasTopics ? (
          <div className="continue-card">
            <div className="continue-card-left">
              <div className="continue-badge">
                <span className="pulse-dot" />
                <span>Continue where you left off</span>
              </div>
              <h2 className="continue-topic-title">{currentTopic.title}</h2>
              <p className="continue-topic-sub">
                {currentTopic.subtitle || 'Active study session'}
              </p>

              <div className="continue-meta-tags">
                <span className="continue-meta-pill">
                  <CheckCircle2 size={13} /> Active Session
                </span>
                <span className="continue-meta-pill">
                  <Layers size={13} /> {currentTopic.cardsCount || currentTopic.cards?.length || 0} Flashcards
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
                      strokeDashoffset: 264 - (264 * (currentTopic.progress || 0)) / 100
                    }}
                  />
                </svg>
                <div className="circle-inner-content">
                  <span className="circle-pct">{currentTopic.progress || 0}%</span>
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
        ) : (
          <div className="continue-card start-first-card">
            <div className="continue-card-left">
              <div className="continue-badge" style={{ color: 'var(--primary)' }}>
                <Sparkles size={14} />
                <span>Start your first study session</span>
              </div>
              <h2 className="continue-topic-title">No active study sessions yet</h2>
              <p className="continue-topic-sub">
                Paste your lecture notes or enter any topic to generate structured flashcards and quizzes instantly with AI.
              </p>
            </div>

            <div className="continue-card-right">
              <button
                className="btn-hero-primary"
                onClick={onNewSession}
                style={{ width: 'auto', padding: '0.85rem 1.75rem' }}
              >
                <span>Start Studying</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Recent Topics Section */}
      <section className="recent-topics-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Study Topics</h2>
            <p className="section-sub">
              {hasTopics
                ? 'Select any study deck to review flashcards or take an assessment.'
                : 'Your generated study materials will appear here.'}
            </p>
          </div>

          <button
            className="btn-link-action"
            onClick={onNewSession}
          >
            <span>+ Create Topic</span>
          </button>
        </div>

        {hasTopics ? (
          <div className="topics-grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onSelect={onSelectTopic}
              />
            ))}
          </div>
        ) : (
          <div className="empty-topics-banner">
            <div className="empty-topics-icon">
              <BookOpen size={36} />
            </div>
            <h3 className="empty-topics-title">No study sessions yet</h3>
            <p className="empty-topics-sub">
              Click "+ New Study Session" above to create your first set of AI flashcards and quizzes.
            </p>
            <button
              className="btn-hero-secondary"
              onClick={onNewSession}
              style={{ marginTop: '1rem' }}
            >
              <Plus size={16} />
              <span>Create First Study Set</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
