import React from 'react';
import { Layers, HelpCircle } from 'lucide-react';

export function ModeSelector({ selectedMode, onSelectMode, disabled = false }) {
  return (
    <div className="mode-section">
      <div className="input-label-row">
        <label className="input-label">Choose Study Format</label>
      </div>

      <div className="mode-grid">
        <button
          type="button"
          disabled={disabled}
          className={`mode-card ${selectedMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => onSelectMode('flashcards')}
        >
          <div className="mode-icon">
            <Layers size={22} />
          </div>
          <div>
            <div className="mode-title">Interactive Flashcards</div>
            <div className="mode-desc">Flip through front-and-back cards for active recall</div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          className={`mode-card ${selectedMode === 'quiz' ? 'active' : ''}`}
          onClick={() => onSelectMode('quiz')}
        >
          <div className="mode-icon">
            <HelpCircle size={22} />
          </div>
          <div>
            <div className="mode-title">Multiple Choice Quiz</div>
            <div className="mode-desc">Test your knowledge with 4-choice questions and explanations</div>
          </div>
        </button>
      </div>
    </div>
  );
}
