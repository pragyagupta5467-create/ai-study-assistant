import React from 'react';
import { RotateCw, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

export function Flashcard({ card, isFlipped, onFlip, cardIndex, totalCards }) {
  return (
    <div className="flashcard-3d-stage" onClick={onFlip}>
      <div
        className={`flashcard-3d-box ${isFlipped ? 'flipped' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${cardIndex + 1} of ${totalCards}. Click or press space to flip.`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        {/* FRONT FACE (Question) */}
        <div className="flashcard-side flashcard-front-face">
          <div className="card-face-header">
            <span className="card-type-tag front">
              <HelpCircle size={13} />
              <span>Question / Concept</span>
            </span>
            <span className="card-index-tag">
              {cardIndex + 1} / {totalCards}
            </span>
          </div>

          <div className="card-prompt-center">
            <p className="card-prompt-text">{card.front}</p>
          </div>

          <div className="card-flip-prompt">
            <RotateCw size={14} className="flip-icon-spin" />
            <span>Click or press <kbd>Space</kbd> to reveal answer</span>
          </div>
        </div>

        {/* BACK FACE (Answer) */}
        <div className="flashcard-side flashcard-back-face">
          <div className="card-face-header">
            <span className="card-type-tag back">
              <CheckCircle2 size={13} />
              <span>Explanation / Answer</span>
            </span>
            <span className="card-index-tag">
              {cardIndex + 1} / {totalCards}
            </span>
          </div>

          <div className="card-prompt-center">
            <p className="card-prompt-text back-text">{card.back}</p>
          </div>

          <div className="card-flip-prompt">
            <RotateCw size={14} />
            <span>Click or press <kbd>Space</kbd> to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
