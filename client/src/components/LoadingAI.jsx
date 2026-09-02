import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, Brain } from 'lucide-react';

const STEPS = [
  'Reading your content and extracting scope',
  'Identifying key concepts and terminology',
  'Creating structured flashcard active-recall deck',
  'Preparing multiple-choice quiz questions & explanations'
];

export function LoadingAI({ mode = 'both' }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-ai-container">
      {/* Centered Glowing AI Neural Orb */}
      <div className="ai-orb-wrapper">
        <div className="ai-orb-outer-ring" />
        <div className="ai-orb-glow" />
        <div className="ai-orb-core">
          <Brain size={32} className="ai-core-icon" />
        </div>
      </div>

      <h2 className="loading-ai-title">StudyAI is thinking...</h2>
      <p className="loading-ai-subtitle">
        Transforming your input into an interactive study session
      </p>

      {/* Step by Step Progress Checklist */}
      <div className="loading-steps-card">
        {STEPS.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`loading-step-item ${isDone ? 'done' : isCurrent ? 'current' : 'pending'}`}
            >
              <div className="step-icon-wrap">
                {isDone ? (
                  <CheckCircle2 size={16} className="step-icon-done" />
                ) : isCurrent ? (
                  <div className="step-spinner-dot" />
                ) : (
                  <Circle size={16} className="step-icon-pending" />
                )}
              </div>
              <span className="step-text">{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
