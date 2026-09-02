import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, BookOpen } from 'lucide-react';

const LOADING_MESSAGES = [
  'AI is analyzing your study notes...',
  'Extracting core concepts and key terminology...',
  'Formatting high-yield question items...',
  'Enforcing strict JSON schema validation...',
  'Preparing your interactive study experience...'
];

export function LoadingState({ mode = 'flashcards' }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel-card loading-wrapper">
      <div className="loading-spinner-box">
        <div className="spinner-ring" />
      </div>

      <h2 className="loading-text">
        AI is creating your {mode === 'flashcards' ? 'Flashcards' : 'Quiz'}...
      </h2>

      <p className="loading-step-msg">
        {LOADING_MESSAGES[msgIndex]}
      </p>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <Brain size={16} /> Active Recall
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <BookOpen size={16} /> Structured Schema
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <Sparkles size={16} /> Instant Generation
        </span>
      </div>
    </div>
  );
}
