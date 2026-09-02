import React from 'react';
import { TopicPerformance } from './TopicPerformance';
import { Brain, CheckCircle2, AlertTriangle, Target, Sparkles } from 'lucide-react';

export function LearningAnalysis({
  questions,
  userAnswers,
  onPracticeWeakTopics,
  isLoadingWeakPractice = false
}) {
  // 1. Group question stats by topic
  const topicStatsMap = {};

  questions.forEach((q, idx) => {
    const topic = q.topic || 'General Concepts';
    if (!topicStatsMap[topic]) {
      topicStatsMap[topic] = { total: 0, correct: 0 };
    }
    topicStatsMap[topic].total += 1;
    if (userAnswers[idx] === q.correctAnswer) {
      topicStatsMap[topic].correct += 1;
    }
  });

  const topicList = Object.entries(topicStatsMap).map(([topic, stats]) => {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    return {
      topic,
      total: stats.total,
      correct: stats.correct,
      accuracy,
      status: accuracy >= 60 ? 'strong' : 'weak'
    };
  });

  // Sort: weak topics first, then by lowest accuracy
  topicList.sort((a, b) => a.accuracy - b.accuracy);

  const strongTopics = topicList.filter((t) => t.status === 'strong');
  const weakTopics = topicList.filter((t) => t.status === 'weak');
  const weakTopicNames = weakTopics.map((t) => t.topic);

  return (
    <div className="learning-analysis-container">
      <div className="analysis-header">
        <div className="analysis-badge">
          <Brain size={16} />
          <span>AI Learning Analysis</span>
        </div>
        <h3 className="analysis-title">Knowledge Mastery & Topic Breakdown</h3>
        <p className="analysis-subtitle">
          Based on your quiz answers, our AI analyzed your strengths and identified concepts that need reinforcement.
        </p>
      </div>

      {/* Learning Insights: Strong Areas vs Needs Improvement */}
      <div className="insights-grid">
        {/* Strong Areas Card */}
        <div className="insight-card strong-card">
          <div className="insight-card-header">
            <CheckCircle2 size={18} color="var(--success)" />
            <h4>Strong Areas</h4>
          </div>
          {strongTopics.length > 0 ? (
            <ul className="insight-list">
              {strongTopics.map((item, i) => (
                <li key={i} className="insight-item strong">
                  <span className="insight-check">✓</span>
                  <span>{item.topic}</span>
                  <span className="insight-pct">({item.accuracy}%)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="insight-empty">Keep practicing to build your strong mastery areas!</p>
          )}
        </div>

        {/* Needs Improvement Card */}
        <div className="insight-card weak-card">
          <div className="insight-card-header">
            <AlertTriangle size={18} color="var(--danger)" />
            <h4>Needs Improvement</h4>
          </div>
          {weakTopics.length > 0 ? (
            <ul className="insight-list">
              {weakTopics.map((item, i) => (
                <li key={i} className="insight-item weak">
                  <span className="insight-warn">⚠</span>
                  <span>{item.topic}</span>
                  <span className="insight-pct">({item.accuracy}%)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="insight-empty" style={{ color: 'var(--success)' }}>
              🎉 Excellent! No weak topics detected. You've demonstrated great mastery.
            </p>
          )}
        </div>
      </div>

      {/* Topic Performance Progress Bars */}
      <div className="topic-perf-section">
        <h4 className="topic-perf-title">Topic Performance</h4>
        <div className="topic-perf-list">
          {topicList.map((item) => (
            <TopicPerformance
              key={item.topic}
              topic={item.topic}
              accuracy={item.accuracy}
              correct={item.correct}
              total={item.total}
              status={item.status}
            />
          ))}
        </div>
      </div>

      {/* Practice Weak Topics Button */}
      {weakTopics.length > 0 && onPracticeWeakTopics && (
        <div className="weak-topics-cta">
          <div className="weak-cta-content">
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                Ready to conquer your weak spots?
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Generate a fresh, targeted practice quiz focused only on <strong>{weakTopicNames.join(', ')}</strong>.
              </p>
            </div>
            <button
              type="button"
              disabled={isLoadingWeakPractice}
              onClick={() => onPracticeWeakTopics(weakTopicNames)}
              className="btn-primary"
              style={{ width: 'auto', minWidth: '220px', whiteSpace: 'nowrap' }}
            >
              <Target size={18} />
              <span>
                {isLoadingWeakPractice ? 'Generating Practice...' : `Practice Weak Topics (${weakTopics.length})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
