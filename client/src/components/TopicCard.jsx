import React from 'react';
import {
  Cpu,
  Code2,
  Database,
  Network,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Code2,
  Database,
  Network,
  BookOpen
};

export function TopicCard({ topic, onSelect }) {
  const Icon = ICON_MAP[topic.icon] || BookOpen;

  return (
    <div
      className="topic-card-item"
      onClick={() => onSelect(topic)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(topic);
        }
      }}
    >
      <div className="topic-card-header">
        <div className="topic-icon-wrap">
          <Icon size={22} />
        </div>
        <div className="topic-badge-pill">
          {topic.category || 'Study Set'}
        </div>
      </div>

      <div className="topic-card-body">
        <h3 className="topic-card-title">{topic.title}</h3>
        <p className="topic-card-sub">{topic.subtitle || topic.summary?.slice(0, 70) + '...'}</p>
      </div>

      {/* Progress Track */}
      <div className="topic-card-progress">
        <div className="progress-labels">
          <span>Mastery</span>
          <span className="progress-pct">{topic.progress}%</span>
        </div>
        <div className="topic-card-bar">
          <div
            className="topic-card-fill"
            style={{ width: `${topic.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Meta */}
      <div className="topic-card-footer">
        <div className="topic-meta-tags">
          <span className="meta-tag">
            <Layers size={13} />
            {topic.cardsCount || topic.cards?.length || 10} cards
          </span>
          <span className="meta-tag">
            <HelpCircle size={13} />
            {topic.quizScore}% quiz
          </span>
        </div>

        <div className="topic-hover-action">
          <span>Study</span>
          <ArrowRight size={14} className="hover-arrow" />
        </div>
      </div>
    </div>
  );
}
