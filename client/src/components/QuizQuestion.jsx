import React, { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  Tag,
  BookOpen
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onNextQuestion,
  isLastQuestion
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isSelected = selectedAnswer !== null && selectedAnswer !== undefined;
  const isCorrect = isSelected && selectedAnswer === question.correctAnswer;

  const handleOptionClick = (idx) => {
    if (hasSubmitted) return; // Prevent changing after revealing
    onSelectOption(idx);
    setHasSubmitted(true);
  };

  const handleAdvance = () => {
    setHasSubmitted(false);
    onNextQuestion();
  };

  return (
    <div className="quiz-view-root">
      {/* Quiz Progress Top Bar */}
      <ProgressBar
        current={questionIndex + 1}
        total={totalQuestions}
        label={`Question ${questionIndex + 1} of ${totalQuestions}`}
      />

      {/* Main Question Card */}
      <div className="quiz-main-card">
        {/* Topic Tag */}
        {question.topic && (
          <div className="quiz-topic-pill">
            <Tag size={12} />
            <span>{question.topic}</span>
          </div>
        )}

        <h2 className="quiz-question-heading">{question.question}</h2>

        {/* Interactive Option Cards */}
        <div className="quiz-options-list">
          {question.options.map((optionText, idx) => {
            const isThisSelected = selectedAnswer === idx;
            const isThisCorrectOption = idx === question.correctAnswer;

            let optionStatusClass = '';
            if (hasSubmitted) {
              if (isThisCorrectOption) {
                optionStatusClass = 'correct-answer';
              } else if (isThisSelected && !isCorrect) {
                optionStatusClass = 'wrong-answer';
              }
            } else if (isThisSelected) {
              optionStatusClass = 'selected-preview';
            }

            return (
              <button
                key={idx}
                type="button"
                className={`quiz-option-card ${optionStatusClass}`}
                onClick={() => handleOptionClick(idx)}
                disabled={hasSubmitted}
              >
                <div className="option-badge-letter">
                  {OPTION_LABELS[idx] || idx + 1}
                </div>

                <div className="option-text-wrap">
                  <span>{optionText}</span>
                </div>

                {hasSubmitted && isThisCorrectOption && (
                  <CheckCircle2 size={20} className="option-feedback-icon correct" />
                )}

                {hasSubmitted && isThisSelected && !isCorrect && (
                  <XCircle size={20} className="option-feedback-icon wrong" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Box on Answer */}
        {hasSubmitted && (
          <div className={`quiz-explanation-box ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
            <div className="explanation-header">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <strong style={{ color: 'var(--success)' }}>Correct!</strong>
                </>
              ) : (
                <>
                  <XCircle size={18} color="var(--danger)" />
                  <strong style={{ color: 'var(--danger)' }}>Incorrect</strong>
                </>
              )}
            </div>
            <p className="explanation-body">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Next Action */}
      <div className="quiz-footer-actions">
        {hasSubmitted ? (
          <button
            type="button"
            onClick={handleAdvance}
            className="btn-next-question"
          >
            <span>{isLastQuestion ? 'Submit & View Results' : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <span className="quiz-hint-text">
            Select an answer choice above to reveal the explanation.
          </span>
        )}
      </div>
    </div>
  );
}
