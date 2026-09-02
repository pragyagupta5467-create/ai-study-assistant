import React from 'react';
import { Sparkles } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    label: 'React Hooks & State',
    text: 'React Hooks like useState, useEffect, useRef, and useMemo. Key principles include keeping components pure, understanding the dependency array in useEffect to avoid infinite loops, managing immutable state updates, and knowing when to use custom hooks.'
  },
  {
    label: 'HTTP Status Codes',
    text: 'Core HTTP Response Status Codes: 200 OK (successful GET), 201 Created (successful POST), 400 Bad Request (malformed client syntax), 401 Unauthorized (unauthenticated), 403 Forbidden (authenticated but lacks permissions), 404 Not Found, 500 Internal Server Error, and 502 Bad Gateway.'
  },
  {
    label: 'JavaScript Async / Event Loop',
    text: 'JavaScript Event Loop, Call Stack, Task Queue (Macrotasks like setTimeout), and Microtask Queue (Promises, queueMicrotask). Microtasks have higher priority and run immediately after the current execution context before macrotasks.'
  },
  {
    label: 'Big-O & Data Structures',
    text: 'Time and space complexity of fundamental data structures: Hash Maps (O(1) average lookup and insertion), Binary Search Trees (O(log n) balanced), Arrays (O(1) access, O(n) insert/delete at front), and Stacks/Queues (LIFO vs FIFO).'
  }
];

export function SampleTopics({ onSelectSample, disabled = false }) {
  return (
    <div className="preset-topics">
      <div className="preset-title">
        <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
        Or Try Quick Sample Topics:
      </div>
      <div className="preset-chips">
        {SAMPLE_PRESETS.map((preset, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            className="preset-chip"
            onClick={() => onSelectSample(preset.text)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
