import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

export function ErrorState({ error, onRetry, onEditInput, onGenerateAgain }) {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage = error?.message || 'Something went wrong while generating your study material.';
  const errorCode = error?.code || 'UNKNOWN_ERROR';

  return (
    <div className="error-card">
      <div className="error-icon-box">
        <AlertTriangle size={32} strokeWidth={2.2} />
      </div>

      <h2 className="error-title">
        Something went wrong while generating your study material.
      </h2>

      <p className="error-desc">
        {errorMessage}
      </p>

      {/* Optional technical error details */}
      <div style={{ marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', margin: '0 auto' }}
        >
          <span>Error Code: {errorCode}</span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDetails && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: '0.8rem',
            textAlign: 'left',
            fontFamily: 'monospace',
            color: 'var(--text-secondary)',
            overflowX: 'auto'
          }}>
            <div><strong>Code:</strong> {errorCode}</div>
            <div><strong>Message:</strong> {errorMessage}</div>
            {error?.details && (
              <div><strong>Details:</strong> {JSON.stringify(error.details, null, 2)}</div>
            )}
          </div>
        )}
      </div>

      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary" style={{ width: 'auto' }}>
            <RotateCcw size={18} />
            <span>Retry</span>
          </button>
        )}

        {onEditInput && (
          <button onClick={onEditInput} className="btn-secondary">
            <Edit3 size={18} />
            <span>Edit Input</span>
          </button>
        )}

        {onGenerateAgain && (
          <button onClick={onGenerateAgain} className="btn-secondary">
            <span>Generate Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
