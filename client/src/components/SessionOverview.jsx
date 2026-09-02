import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Share2,
  Tag
} from 'lucide-react';

export function SessionOverview({
  studyData,
  onStartFlashcards,
  onStartQuiz,
  onRegenerate,
  onCopySummary
}) {
  const [copied, setCopied] = useState(false);

  const title = studyData?.title || 'Study Session';
  const difficulty = studyData?.difficulty || 'medium';
  const cardsCount = studyData?.cards?.length || 10;
  const questionsCount = studyData?.questions?.length || 10;
  const summary = studyData?.summary ||
    `This study session covers fundamental principles, architectural tradeoffs, and high-yield examination questions for ${title}. Focus on understanding core concepts before taking the mastery assessment.`;

  // Deduce or list concepts
  const concepts = studyData?.concepts ||
    (studyData?.questions?.map((q) => q.topic).filter(Boolean).slice(0, 6)) ||
    ['Core Fundamentals', 'State & Memory', 'Concurrency', 'Edge Scenarios', 'Optimization'];

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onCopySummary) onCopySummary();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="session-overview-root">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="session-header-block">
        <div className="session-meta-row">
          <div className="session-badges-wrap">
            <span className="badge-ai-generated">
              <Sparkles size={13} />
              <span>AI Generated</span>
            </span>
            <span className={`badge-difficulty ${difficulty}`}>
              {difficulty.toUpperCase()}
            </span>
          </div>

          <div className="session-stats-pills">
            <span className="session-stat-pill">
              <Layers size={14} /> {cardsCount} Flashcards
            </span>
            <span className="session-stat-pill">
              <HelpCircle size={14} /> {questionsCount} Quiz Questions
            </span>
          </div>
        </div>

        <h1 className="session-main-title">{title}</h1>
      </div>

      {/* AI Summary Card */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div className="summary-title-wrap">
            <BookOpen size={18} className="summary-icon" />
            <h3>AI Summary</h3>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn-summary-action"
              onClick={handleCopy}
              title="Copy summary"
            >
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className="btn-summary-action"
              onClick={onRegenerate}
              title="Regenerate this session"
            >
              <RotateCcw size={14} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        <p className="summary-text">{summary}</p>
      </div>

      {/* Key Concepts Interactive Section */}
      <div className="concepts-section">
        <h4 className="concepts-section-title">
          <Tag size={15} />
          <span>Key Concepts Extracted</span>
        </h4>
        <div className="concepts-chips-grid">
          {concepts.map((concept, idx) => (
            <div key={idx} className="concept-chip">
              <span className="concept-chip-index">{idx + 1}</span>
              <span className="concept-chip-name">{concept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Main Action Cards: Flashcards & Quiz */}
      <div className="action-cards-grid">
        {/* Flashcards Card */}
        <div
          className="action-card flashcards-action"
          onClick={onStartFlashcards}
          role="button"
          tabIndex={0}
        >
          <div className="action-card-top">
            <div className="action-icon-box flashcard-color">
              <Layers size={26} />
            </div>
            <span className="action-count-pill">{cardsCount} Cards</span>
          </div>

          <div className="action-card-content">
            <h3 className="action-card-title">Flashcards</h3>
            <p className="action-card-desc">
              Master concepts through active recall with 3D interactive flip cards and confidence ratings.
            </p>
          </div>

          <div className="action-card-footer">
            <span className="action-btn-text">Start Flashcards</span>
            <ArrowRight size={18} className="action-arrow" />
          </div>
        </div>

        {/* Quiz Card */}
        <div
          className="action-card quiz-action"
          onClick={onStartQuiz}
          role="button"
          tabIndex={0}
        >
          <div className="action-card-top">
            <div className="action-icon-box quiz-color">
              <HelpCircle size={26} />
            </div>
            <span className="action-count-pill">{questionsCount} Questions</span>
          </div>

          <div className="action-card-content">
            <h3 className="action-card-title">Multiple Choice Quiz</h3>
            <p className="action-card-desc">
              Test your understanding, receive instant answer feedback, and identify weak topics for re-testing.
            </p>
          </div>

          <div className="action-card-footer">
            <span className="action-btn-text">Start Quiz</span>
            <ArrowRight size={18} className="action-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
