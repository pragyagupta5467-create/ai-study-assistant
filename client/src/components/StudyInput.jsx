import React from 'react';
import { ModeSelector } from './ModeSelector';
import { DifficultySelector } from './DifficultySelector';
import { SampleTopics } from './SampleTopics';
import { Sparkles, FileText, Trash2 } from 'lucide-react';

export function StudyInput({
  inputContent,
  setInputContent,
  selectedMode,
  setSelectedMode,
  selectedDifficulty,
  setSelectedDifficulty,
  onGenerate,
  isLoading
}) {
  const isInputEmpty = !inputContent || inputContent.trim().length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isInputEmpty && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className="panel-card">
      <form onSubmit={handleSubmit}>
        <div className="input-label-row">
          <label htmlFor="study-notes" className="input-label">
            <FileText size={18} color="var(--primary)" />
            Study Notes or Topic Input
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {inputContent.length > 0 && (
              <button
                type="button"
                onClick={() => setInputContent('')}
                className="preset-chip"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Clear input"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
            <span className="char-counter">
              {inputContent.length} characters
            </span>
          </div>
        </div>

        <textarea
          id="study-notes"
          className="study-textarea"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Paste your notes here or enter a topic you want to study (e.g. React Hooks lifecycle, Binary Search Trees, World War II timeline)..."
          rows={7}
          disabled={isLoading}
        />

        <SampleTopics
          onSelectSample={(sampleText) => setInputContent(sampleText)}
          disabled={isLoading}
        />

        <DifficultySelector
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          disabled={isLoading}
        />

        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={isInputEmpty || isLoading}
        >
          <Sparkles size={20} />
          <span>Generate Study Material</span>
        </button>
      </form>
    </div>
  );
}
