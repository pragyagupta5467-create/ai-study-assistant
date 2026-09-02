import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Tag,
  HelpCircle,
  Check
} from 'lucide-react';

export function WrongAnswersView({
  mistakes = [],
  onStartRetest,
  onClearMistakes,
  onStartNewQuiz
}) {
  const [clearedIds, setClearedIds] = useState([]);

  const activeMistakes = mistakes.filter((m) => !clearedIds.includes(m.id));

  const handleDismissMistake = (id) => {
    setClearedIds((prev) => [...prev, id]);
  };

  // Empty State
  if (activeMistakes.length === 0) {
    return (
      <div className="empty-mistakes-card">
        <div className="empty-icon-box">
          <CheckCircle2 size={44} color="var(--success)" />
        </div>
        <h2 className="empty-title">You're doing great!</h2>
        <p className="empty-sub">
          Nothing to review right now. You haven't made any unmastered mistakes in your recent quizzes.
        </p>
        <button
          className="btn-hero-primary"
          onClick={onStartNewQuiz}
          style={{ width: 'auto', margin: '1.5rem auto 0' }}
        >
          <HelpCircle size={18} />
          <span>Start a New Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="wrong-answers-root">
      {/* Header Banner */}
      <div className="mistakes-header-banner">
        <div>
          <div className="mistakes-badge">
            <AlertTriangle size={14} />
            <span>Mistakes Mastery Hub</span>
          </div>
          <h1 className="mistakes-title">Your Mistakes</h1>
          <p className="mistakes-sub">
            Review what you missed and turn mistakes into mastery through active re-testing.
          </p>
        </div>

        <div className="mistakes-header-actions">
          <button
            className="btn-retest-all"
            onClick={() => onStartRetest(activeMistakes)}
          >
            <RotateCcw size={17} />
            <span>Re-test Wrong Answers ({activeMistakes.length})</span>
          </button>
        </div>
      </div>

      {/* Mistake Cards List */}
      <div className="mistakes-list">
        {activeMistakes.map((item, idx) => (
          <div key={item.id || idx} className="mistake-card-item">
            <div className="mistake-card-header">
              <div className="mistake-topic-pill">
                <Tag size={12} />
                <span>{item.topicName || 'General Concept'}</span>
              </div>
              <span className="mistake-index-pill">Question #{idx + 1}</span>
            </div>

            <h3 className="mistake-question-text">{item.question}</h3>

            <div className="mistake-answers-grid">
              {/* Your Wrong Answer */}
              <div className="answer-box your-wrong-answer">
                <div className="answer-box-label">
                  <XCircle size={15} color="var(--danger)" />
                  <span>Your Answer:</span>
                </div>
                <div className="answer-box-content">{item.yourAnswer}</div>
              </div>

              {/* Correct Answer */}
              <div className="answer-box correct-answer">
                <div className="answer-box-label">
                  <CheckCircle2 size={15} color="var(--success)" />
                  <span>Correct Answer:</span>
                </div>
                <div className="answer-box-content">{item.correctAnswer}</div>
              </div>
            </div>

            {/* Explanation */}
            {item.explanation && (
              <div className="mistake-explanation-box">
                <strong>Explanation:</strong> {item.explanation}
              </div>
            )}

            <div className="mistake-card-footer">
              <button
                type="button"
                className="btn-mark-mastered"
                onClick={() => handleDismissMistake(item.id)}
              >
                <Check size={14} />
                <span>Mark as Mastered</span>
              </button>

              <button
                type="button"
                className="btn-single-retest"
                onClick={() => onStartRetest([item])}
              >
                <span>Practice this question →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
