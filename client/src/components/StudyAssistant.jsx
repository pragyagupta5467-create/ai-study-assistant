import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Trash2,
  Zap,
  ShieldCheck,
  Flame,
  Layers,
  HelpCircle,
  BookOpen,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

const PRESET_TOPICS = [
  { label: 'Operating Systems (Deadlock & Scheduling)', text: 'Operating Systems concepts: CPU scheduling algorithms (Round Robin, FCFS, Priority), process vs thread differences, synchronization primitives (semaphores, mutexes), and the 4 Coffman conditions for deadlock.' },
  { label: 'Java Collections Framework', text: 'Java Collections Framework hierarchy: ArrayList vs LinkedList tradeoffs, HashMap hashing & collision resolution (treeification in Java 8), ConcurrentHashMap, and fail-fast vs fail-safe iterators.' },
  { label: 'Database Normalization & ACID', text: 'Database Management Systems: ACID transaction properties, SQL isolation levels (Dirty read, Non-repeatable read, Phantom read), B+ Tree indexing, and 1NF to BCNF normalization.' },
  { label: 'Computer Networks (OSI & TCP/IP)', text: 'Computer Networks: 7-layer OSI model, 4-layer TCP/IP model, TCP 3-way handshake, flow control, sliding window protocol, UDP vs TCP differences, and DNS resolution hierarchy.' }
];

export function StudyAssistant({
  inputContent,
  setInputContent,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedFormat,
  setSelectedFormat,
  questionCount,
  setQuestionCount,
  onGenerate,
  isLoading
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'topic'
  const [topicInput, setTopicInput] = useState('');

  const currentContent = activeTab === 'notes' ? inputContent : topicInput;
  const isInputEmpty = !currentContent || currentContent.trim().length === 0;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isInputEmpty && !isLoading) {
      if (activeTab === 'topic') {
        setInputContent(topicInput);
      }
      onGenerate(activeTab === 'topic' ? topicInput : inputContent);
    }
  };

  const handleSelectPreset = (preset) => {
    if (activeTab === 'notes') {
      setInputContent(preset.text);
    } else {
      setTopicInput(preset.label);
    }
  };

  return (
    <div className="assistant-view-root">
      {/* Hero Heading */}
      <div className="assistant-hero">
        <div className="assistant-hero-badge">
          <Sparkles size={14} />
          <span>Intelligent Study Generator</span>
        </div>
        <h1 className="assistant-hero-title">
          What do you want to learn today?
        </h1>
        <p className="assistant-hero-sub">
          Give StudyAI your notes or a topic. We'll turn them into an interactive study session with flashcards, quizzes, and learning analytics.
        </p>
      </div>

      {/* Main Input Generator Card */}
      <div className="generator-card">
        {/* Input Mode Tabs: Notes vs Topic */}
        <div className="generator-tabs">
          <button
            type="button"
            className={`gen-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={16} />
            <span>📝 Notes</span>
          </button>

          <button
            type="button"
            className={`gen-tab ${activeTab === 'topic' ? 'active' : ''}`}
            onClick={() => setActiveTab('topic')}
          >
            <Target size={16} />
            <span>🎯 Topic</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Notes Mode Textarea */}
          {activeTab === 'notes' ? (
            <div className="input-field-wrap">
              <div className="textarea-top-bar">
                <span className="textarea-hint">
                  Paste your lecture notes, textbook content, or class material below:
                </span>
                {inputContent.length > 0 && (
                  <button
                    type="button"
                    className="clear-input-btn"
                    onClick={() => setInputContent('')}
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                )}
              </div>

              <textarea
                className="generator-textarea"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Paste your lecture notes, textbook content, or class material here..."
                rows={8}
                disabled={isLoading}
              />

              <div className="textarea-char-footer">
                <span>Supports plain text, markdown, or unstructured summaries</span>
                <span className="char-count">{inputContent.length} characters</span>
              </div>
            </div>
          ) : (
            /* Topic Mode Input */
            <div className="input-field-wrap">
              <div className="textarea-top-bar">
                <span className="textarea-hint">
                  Enter any subject or concept you want to study:
                </span>
                {topicInput.length > 0 && (
                  <button
                    type="button"
                    className="clear-input-btn"
                    onClick={() => setTopicInput('')}
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                )}
              </div>

              <input
                type="text"
                className="generator-topic-input"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter a topic, e.g. Operating Systems Process Synchronization"
                disabled={isLoading}
              />

              <div className="textarea-char-footer">
                <span>StudyAI will extract core concepts and generate questions</span>
                <span className="char-count">{topicInput.length} characters</span>
              </div>
            </div>
          )}

          {/* Quick Preset Topics */}
          <div className="presets-row">
            <span className="presets-label">Popular Topics:</span>
            <div className="preset-pills">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-line" />

          {/* Generation Controls Section */}
          <div className="controls-grid">
            {/* 1. Difficulty Selector */}
            <div className="control-column">
              <label className="control-label">
                <SlidersHorizontal size={15} />
                <span>Difficulty Level</span>
              </label>
              <div className="control-pills-row">
                {[
                  { id: 'easy', label: 'Easy', icon: ShieldCheck, desc: 'Basic concepts' },
                  { id: 'medium', label: 'Medium', icon: Zap, desc: 'Application' },
                  { id: 'hard', label: 'Hard', icon: Flame, desc: 'Problem solving' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`control-pill ${selectedDifficulty === d.id ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(d.id)}
                  >
                    <d.icon size={14} />
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Material Format Selector */}
            <div className="control-column">
              <label className="control-label">
                <BookOpen size={15} />
                <span>Material Format</span>
              </label>
              <div className="control-pills-row">
                {[
                  { id: 'both', label: 'Both', icon: Sparkles },
                  { id: 'flashcards', label: 'Flashcards', icon: Layers },
                  { id: 'quiz', label: 'Quiz', icon: HelpCircle }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`control-pill ${selectedFormat === m.id ? 'active' : ''}`}
                    onClick={() => setSelectedFormat(m.id)}
                  >
                    <m.icon size={14} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Question / Card Count */}
            <div className="control-column">
              <label className="control-label">
                <span>Items Count</span>
              </label>
              <div className="control-pills-row count-pills">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    className={`control-pill count ${questionCount === cnt ? 'active' : ''}`}
                    onClick={() => setQuestionCount(cnt)}
                  >
                    <span>{cnt} Items</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Submit Button */}
          <div className="generator-submit-row">
            <button
              type="submit"
              className="btn-generate-primary"
              disabled={isInputEmpty || isLoading}
            >
              <Sparkles size={19} className="sparkle-anim" />
              <span>✨ Generate Study Material</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
