import React from 'react';
import { Zap, ShieldCheck, Flame, Gauge } from 'lucide-react';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    desc: 'Basic concepts, definitions & terminology',
    icon: ShieldCheck,
    color: 'var(--success)',
    bgLight: 'var(--success-light)'
  },
  {
    id: 'medium',
    label: 'Medium',
    desc: 'Conceptual & application-based questions',
    icon: Zap,
    color: 'var(--primary)',
    bgLight: 'var(--primary-light)'
  },
  {
    id: 'hard',
    label: 'Hard',
    desc: 'Challenging scenarios & deep problem solving',
    icon: Flame,
    color: 'var(--danger)',
    bgLight: 'var(--danger-light)'
  }
];

export function DifficultySelector({ selectedDifficulty, onSelectDifficulty, disabled = false }) {
  return (
    <div className="difficulty-section">
      <div className="input-label-row">
        <label className="input-label">
          <Gauge size={17} color="var(--primary)" />
          Target Difficulty Level
        </label>
      </div>

      <div className="difficulty-grid">
        {DIFFICULTIES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedDifficulty === item.id;

          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              className={`difficulty-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectDifficulty(item.id)}
            >
              <div
                className="difficulty-icon-box"
                style={{
                  color: isSelected ? 'white' : item.color,
                  backgroundColor: isSelected ? item.color : item.bgLight
                }}
              >
                <Icon size={18} />
              </div>
              <div className="difficulty-content">
                <div className="difficulty-title">{item.label}</div>
                <div className="difficulty-desc">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
