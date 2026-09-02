import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from './Flashcard';
import { ProgressBar } from './ProgressBar';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Check,
  Award,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Gauge,
  ThumbsUp,
  Smile,
  AlertCircle
} from 'lucide-react';

export function FlashcardViewer({
  studyData,
  onTakeQuiz,
  onRestartDeck,
  onBackToOverview
}) {
  const [cards, setCards] = useState(studyData?.cards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardRatings, setCardRatings] = useState({}); // { [id]: 'easy' | 'good' | 'hard' }
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setCards(studyData?.cards || []);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCardRatings({});
    setIsCompleted(false);
  }, [studyData]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];
  const difficulty = studyData?.difficulty || 'medium';

  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentIndex, totalCards]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRateCard = (rating) => {
    const cardId = currentCard?.id || currentIndex;
    setCardRatings((prev) => ({
      ...prev,
      [cardId]: rating
    }));
    // Auto advance smoothly
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const handleRestart = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setIsCompleted(false);
    setCardRatings({});
    if (onRestartDeck) onRestartDeck();
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip]);

  // Completion State Screen
  if (isCompleted) {
    const easyCount = Object.values(cardRatings).filter((r) => r === 'easy').length;
    const goodCount = Object.values(cardRatings).filter((r) => r === 'good').length;
    const hardCount = Object.values(cardRatings).filter((r) => r === 'hard').length;

    return (
      <div className="flashcard-completion-card">
        <div className="completion-icon-ring">
          <Award size={42} className="completion-trophy-icon" />
        </div>

        <h2 className="completion-title">Nice work! You've reviewed all {totalCards} cards.</h2>
        <p className="completion-sub">
          Active recall strengthens synaptic connections. Next, test your knowledge with the mastery quiz.
        </p>

        {/* Rating Breakdown Pill */}
        <div className="completion-stats-row">
          <div className="completion-stat-box easy">
            <span className="count">{easyCount}</span>
            <span className="label">Mastered</span>
          </div>
          <div className="completion-stat-box good">
            <span className="count">{goodCount}</span>
            <span className="label">Good</span>
          </div>
          <div className="completion-stat-box hard">
            <span className="count">{hardCount}</span>
            <span className="label">Need Review</span>
          </div>
        </div>

        <div className="completion-actions-row">
          {onTakeQuiz && (
            <button className="btn-hero-primary" onClick={onTakeQuiz}>
              <HelpCircle size={18} />
              <span>Take Quiz →</span>
            </button>
          )}

          <button className="btn-hero-secondary" onClick={handleRestart}>
            <RotateCcw size={16} />
            <span>Review Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="flashcard-viewer-root">
      {/* Top Header Bar */}
      <div className="viewer-top-bar">
        <div>
          <div className="viewer-badge-row">
            <span className="badge-type">Flashcards</span>
            <span className={`badge-difficulty ${difficulty}`}>{difficulty.toUpperCase()}</span>
          </div>
          <h2 className="viewer-title">{studyData?.title || 'Active Recall Deck'}</h2>
        </div>

        <div className="viewer-quick-controls">
          <button
            className="btn-viewer-control"
            onClick={handleShuffle}
            title="Shuffle deck"
          >
            <Shuffle size={15} />
            <span>Shuffle</span>
          </button>

          <button
            className="btn-viewer-control"
            onClick={handleRestart}
            title="Restart deck"
          >
            <RotateCcw size={15} />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        current={currentIndex + 1}
        total={totalCards}
        label={`Card ${currentIndex + 1} of ${totalCards}`}
      />

      {/* 3D Flashcard */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        cardIndex={currentIndex}
        totalCards={totalCards}
      />

      {/* Confidence Rating Buttons (shown after flipping) */}
      {isFlipped && (
        <div className="card-rating-bar">
          <span className="rating-prompt">How well did you know this?</span>
          <div className="rating-buttons-group">
            <button
              className="btn-rate rate-hard"
              onClick={() => handleRateCard('hard')}
            >
              <AlertCircle size={15} />
              <span>Hard</span>
            </button>
            <button
              className="btn-rate rate-good"
              onClick={() => handleRateCard('good')}
            >
              <Smile size={15} />
              <span>Good</span>
            </button>
            <button
              className="btn-rate rate-easy"
              onClick={() => handleRateCard('easy')}
            >
              <ThumbsUp size={15} />
              <span>Easy</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Controls */}
      <div className="flashcard-nav-bar">
        <button
          className="btn-nav-prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <button className="btn-nav-flip" onClick={handleFlip}>
          <RotateCcw size={16} />
          <span>Flip Card</span>
        </button>

        <button className="btn-nav-next" onClick={handleNext}>
          <span>{currentIndex === totalCards - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Keyboard Shortcuts Helper */}
      <div className="viewer-shortcuts-hint">
        <span>Keyboard shortcuts:</span>
        <kbd>Space</kbd> to flip &bull; <kbd>←</kbd> previous &bull; <kbd>→</kbd> next
      </div>
    </div>
  );
}
