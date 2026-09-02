import React from 'react';

export function ProgressBar({ current, total, label = 'Progress' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="progress-wrapper">
      <div className="progress-header">
        <span>{label}</span>
        <span>
          {current} of {total} ({percentage}%)
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
