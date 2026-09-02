import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Target,
  BookOpen
} from 'lucide-react';

export function QuizResults({
  questions,
  userAnswers,
  onReviewWrongAnswers,
  onRetestWrongAnswers,
  onPracticeWeakTopics,
  onRestartFullQuiz,
  onNewSession,
  isRetestMode = false
}) {
  const total = questions.length;
  let correctCount = 0;
  const wrongQuestions = [];
  const topicStats = {};

  questions.forEach((q, idx) => {
    const userAnswerIdx = userAnswers[idx];
    const topic = q.topic || 'General Concepts';

    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0 };
    }
    topicStats[topic].total += 1;

    if (userAnswerIdx === q.correctAnswer) {
      correctCount++;
      topicStats[topic].correct += 1;
    } else {
      wrongQuestions.push({
        id: `mistake_${Date.now()}_${idx}`,
        question: q.question,
        topicName: topic,
        yourAnswer: userAnswerIdx !== undefined ? q.options[userAnswerIdx] : 'No answer selected',
        correctAnswer: q.options[q.correctAnswer],
        explanation: q.explanation,
        options: q.options,
        correctAnswerIndex: q.correctAnswer
      });
    }
  });

  const wrongCount = total - correctCount;
  const accuracy = Math.round((correctCount / total) * 100);

  // Group topics into Strong vs Weak
  const topicList = Object.entries(topicStats).map(([topic, stats]) => {
    const topicAcc = Math.round((stats.correct / stats.total) * 100);
    return {
      topic,
      accuracy: topicAcc,
      status: topicAcc >= 60 ? 'strong' : 'weak'
    };
  });

  const strongTopics = topicList.filter((t) => t.status === 'strong');
  const weakTopics = topicList.filter((t) => t.status === 'weak');

  let feedback = {
    title: "Great work! You're getting stronger.",
    sub: 'You demonstrated solid conceptual understanding across core topics.'
  };

  if (accuracy === 100) {
    feedback = {
      title: 'Flawless Victory! 🌟',
      sub: 'You scored 100% and completely mastered this assessment set.'
    };
  } else if (accuracy < 60) {
    feedback = {
      title: 'Keep practicing! Knowledge builds with revision.',
      sub: 'Review the missed concepts below and retry your mistakes to reinforce memory.'
    };
  }

  return (
    <div className="quiz-results-root">
      <div className="results-hero-card">
        {isRetestMode && (
          <div className="retest-pill">
            <RotateCcw size={13} />
            <span>Retest Completed</span>
          </div>
        )}

        {/* Circular Animated Score Ring */}
        <div className="score-meter-wrap">
          <svg className="score-svg" viewBox="0 0 120 120">
            <circle className="score-svg-bg" cx="60" cy="60" r="50" />
            <circle
              className="score-svg-fill"
              cx="60"
              cy="60"
              r="50"
              style={{
                strokeDashoffset: 314 - (314 * accuracy) / 100
              }}
            />
          </svg>
          <div className="score-meter-text">
            <span className="score-meter-pct">{accuracy}%</span>
            <span className="score-meter-ratio">{correctCount}/{total} Correct</span>
          </div>
        </div>

        <h1 className="results-hero-title">{feedback.title}</h1>
        <p className="results-hero-sub">{feedback.sub}</p>

        {/* 3 Metric Stat Boxes */}
        <div className="results-metrics-grid">
          <div className="metric-box correct">
            <div className="metric-val">{correctCount}</div>
            <div className="metric-lbl">Correct Answers</div>
          </div>
          <div className="metric-box incorrect">
            <div className="metric-val">{wrongCount}</div>
            <div className="metric-lbl">Incorrect Answers</div>
          </div>
          <div className="metric-box accuracy">
            <div className="metric-val">{accuracy}%</div>
            <div className="metric-lbl">Overall Accuracy</div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="results-cta-buttons">
          {wrongCount > 0 && onReviewWrongAnswers && (
            <button
              className="btn-results-primary"
              onClick={() => onReviewWrongAnswers(wrongQuestions)}
            >
              <AlertTriangle size={17} />
              <span>Review Wrong Answers ({wrongCount})</span>
            </button>
          )}

          <button className="btn-results-secondary" onClick={onRestartFullQuiz}>
            <RotateCcw size={16} />
            <span>Retake Quiz</span>
          </button>

          <button className="btn-results-ghost" onClick={onNewSession}>
            <PlusCircle size={16} />
            <span>New Study Topic</span>
          </button>
        </div>
      </div>

      {/* Performance Breakdown: Strong Areas vs Weak Areas */}
      <div className="breakdown-grid">
        {/* Strong Areas */}
        <div className="breakdown-card strong">
          <div className="breakdown-header">
            <CheckCircle2 size={18} color="var(--success)" />
            <h3>Strong Areas</h3>
          </div>
          {strongTopics.length > 0 ? (
            <div className="breakdown-topics-list">
              {strongTopics.map((item, idx) => (
                <div key={idx} className="breakdown-topic-row">
                  <div className="breakdown-topic-name">
                    <span className="dot-green">✓</span>
                    <span>{item.topic}</span>
                  </div>
                  <span className="breakdown-topic-pct strong">{item.accuracy}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="breakdown-empty">Complete more practice to establish strong areas.</p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="breakdown-card weak">
          <div className="breakdown-header">
            <AlertTriangle size={18} color="var(--danger)" />
            <h3>Weak Areas</h3>
          </div>
          {weakTopics.length > 0 ? (
            <>
              <div className="breakdown-topics-list">
                {weakTopics.map((item, idx) => (
                  <div key={idx} className="breakdown-topic-row">
                    <div className="breakdown-topic-name">
                      <span className="dot-amber">⚠</span>
                      <span>{item.topic}</span>
                    </div>
                    <span className="breakdown-topic-pct weak">{item.accuracy}%</span>
                  </div>
                ))}
              </div>

              {onPracticeWeakTopics && (
                <button
                  className="btn-practice-weak"
                  onClick={() => onPracticeWeakTopics(weakTopics.map((w) => w.topic))}
                >
                  <Target size={15} />
                  <span>Practice Weak Topics ({weakTopics.length})</span>
                </button>
              )}
            </>
          ) : (
            <div className="breakdown-empty-success">
              <CheckCircle2 size={24} color="var(--success)" />
              <span>No weak areas detected! Excellent mastery across all topics.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
