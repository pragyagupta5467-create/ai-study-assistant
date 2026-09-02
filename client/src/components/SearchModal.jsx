import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Layers, HelpCircle, X, ArrowRight } from 'lucide-react';

export function SearchModal({
  isOpen,
  onClose,
  topics = [],
  onSelectTopic,
  onNewSession
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      t.concepts?.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input-row">
          <Search size={18} className="search-modal-icon" />
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search topics, concepts, or flashcards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="search-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="search-modal-results">
          {filtered.length > 0 ? (
            filtered.map((topic) => (
              <div
                key={topic.id}
                className="search-result-item"
                onClick={() => {
                  onSelectTopic(topic);
                  onClose();
                }}
              >
                <div className="search-result-icon">
                  <BookOpen size={16} />
                </div>
                <div className="search-result-info">
                  <div className="search-result-title">{topic.title}</div>
                  <div className="search-result-sub">{topic.subtitle}</div>
                </div>
                <span className="search-result-action">
                  Study <ArrowRight size={12} />
                </span>
              </div>
            ))
          ) : (
            <div className="search-no-results">
              <p>No study sets found matching "{query}".</p>
              <button
                className="btn-create-from-search"
                onClick={() => {
                  onNewSession();
                  onClose();
                }}
              >
                <Sparkles size={14} />
                <span>Create study set for "{query}"</span>
              </button>
            </div>
          )}
        </div>

        <div className="search-modal-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd> &bull; Select with <kbd>Enter</kbd> &bull; Close with <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
