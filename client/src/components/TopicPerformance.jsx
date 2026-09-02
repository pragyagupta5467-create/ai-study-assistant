import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export function TopicPerformance({ topic, accuracy, correct, total, status }) {
  const isStrong = status === 'strong';

  return (
    <div className="topic-perf-item">
      <div className="topic-perf-header">
        <div className="topic-name-wrap">
          <span className={`topic-status-badge ${isStrong ? 'strong' : 'weak'}`}>
            {isStrong ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            <span>{isStrong ? 'Strong' : 'Needs Practice'}</span>
          </span>
          <span className="topic-name-text">{topic}</span>
        </div>

        <div className="topic-stats-wrap">
          <span className="topic-ratio-text">{correct}/{total} correct</span>
          <span className={`topic-pct-text ${isStrong ? 'strong' : 'weak'}`}>
            {accuracy}%
          </span>
        </div>
      </div>

      <div className="topic-progress-track">
        <div
          className={`topic-progress-fill ${isStrong ? 'strong' : 'weak'}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
    </div>
  );
}
