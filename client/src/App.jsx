import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { StudyAssistant } from './components/StudyAssistant';
import { LoadingAI } from './components/LoadingAI';
import { SessionOverview } from './components/SessionOverview';
import { FlashcardViewer } from './components/FlashcardViewer';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { WrongAnswersView } from './components/WrongAnswersView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { SearchModal } from './components/SearchModal';
import { ErrorState } from './components/ErrorState';
import { generateStudyMaterial, cancelActiveGeneration } from './services/api';
import {
  INITIAL_STATS,
  INITIAL_TOPICS,
  INITIAL_MISTAKES
} from './data/mockData';

export function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('study_ai_theme') || 'light';
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('study_ai_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Pragya',
          email: 'pragya@studyai.edu',
          role: 'Student',
          avatar: 'PG'
        };
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Active Main View: 'dashboard' | 'assistant' | 'session-overview' | 'flashcards' | 'quiz' | 'quiz-results' | 'wrong-answers' | 'progress' | 'settings' | 'loading' | 'error'
  const [activeView, setActiveView] = useState('dashboard');

  // Persistent App State
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('study_ai_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('study_ai_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('study_ai_mistakes');
    return saved ? JSON.parse(saved) : INITIAL_MISTAKES;
  });

  // Active Study Session Data
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [activeStudyData, setActiveStudyData] = useState(topics[0]);

  // Assistant Generator Form States
  const [inputContent, setInputContent] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedFormat, setSelectedFormat] = useState('both'); // 'both' | 'flashcards' | 'quiz'
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizUserAnswers, setQuizUserAnswers] = useState({});
  const [isRetestMode, setIsRetestMode] = useState(false);

  // Global Toasts Queue
  const [toasts, setToasts] = useState([]);

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('study_ai_theme', theme);
  }, [theme]);

  // Sync User Auth
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('study_ai_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('study_ai_user');
    }
  }, [currentUser]);

  // Sync Data
  useEffect(() => {
    localStorage.setItem('study_ai_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('study_ai_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('study_ai_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast Dispatcher
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! 👋`, 'success');
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Account created! Welcome to StudyAI, ${user.name}! 🚀`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  };

  // Select a Topic to study from list or sidebar
  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    setActiveStudyData(topic);
    setActiveView('session-overview');
  };

  // AI Material Generation Handler
  const handleGenerateStudySet = async (overrideContent = null) => {
    const contentToUse = overrideContent || inputContent;
    if (!contentToUse.trim()) return;

    setIsGenerating(true);
    setActiveView('loading');
    setGenError(null);

    const targetMode = selectedFormat === 'both' ? 'flashcards' : selectedFormat;

    try {
      const result = await generateStudyMaterial(contentToUse, targetMode, selectedDifficulty);

      if (selectedFormat === 'both' && (!result.questions || result.questions.length === 0)) {
        const quizResult = await generateStudyMaterial(contentToUse, 'quiz', selectedDifficulty);
        result.questions = quizResult.questions || [];
      }

      const newTopic = {
        id: `topic_${Date.now()}`,
        title: result.title || 'Custom AI Study Set',
        subtitle: `${result.cards?.length || 0} Flashcards & ${result.questions?.length || 0} Questions`,
        icon: 'BookOpen',
        category: 'Custom Topic',
        progress: 0,
        lastStudied: 'Just now',
        cardsCount: result.cards?.length || 0,
        quizScore: 0,
        difficulty: selectedDifficulty,
        summary: `AI generated study material covering key principles, flashcard active-recall items, and test questions for ${result.title}.`,
        concepts: result.questions?.map((q) => q.topic).filter(Boolean).slice(0, 6) || ['Core Fundamentals', 'Key Concepts', 'Application'],
        cards: result.cards || [],
        questions: result.questions || []
      };

      setTopics((prev) => [newTopic, ...prev]);
      setActiveTopic(newTopic);
      setActiveStudyData(newTopic);
      setStats((prev) => ({ ...prev, topicsStudied: prev.topicsStudied + 1 }));

      showToast('Study material generated successfully!', 'success');
      setActiveView('session-overview');
    } catch (err) {
      if (err.code === 'ABORTED') return;
      console.error('[Generation Error]', err);
      setGenError({
        message: err.message || 'Failed to generate study material.',
        code: err.code || 'GENERATION_FAILED',
        details: err.details || null
      });
      setActiveView('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Start Flashcards Viewer
  const handleStartFlashcards = () => {
    setActiveView('flashcards');
  };

  // Start Quiz Viewer
  const handleStartQuiz = (customQuestions = null, isRetest = false) => {
    const questionsToUse = customQuestions || activeStudyData?.questions || activeTopic?.questions || [];
    if (questionsToUse.length === 0) {
      showToast('No quiz questions available for this topic.', 'warning');
      return;
    }
    setActiveQuizQuestions(questionsToUse);
    setCurrentQuizIndex(0);
    setQuizUserAnswers({});
    setIsRetestMode(isRetest);
    setActiveView('quiz');
  };

  // Quiz Option Click
  const handleSelectQuizOption = (optionIndex) => {
    setQuizUserAnswers((prev) => ({
      ...prev,
      [currentQuizIndex]: optionIndex
    }));
  };

  // Advance Quiz Question
  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < activeQuizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      const total = activeQuizQuestions.length;
      let correct = 0;
      const newMistakes = [];

      activeQuizQuestions.forEach((q, idx) => {
        const userAns = quizUserAnswers[idx];
        if (userAns === q.correctAnswer) {
          correct++;
        } else {
          newMistakes.push({
            id: `m_${Date.now()}_${idx}`,
            topicId: activeTopic?.id || 'custom',
            topicName: activeTopic?.title || 'Custom Topic',
            subtopic: q.topic || 'General Concepts',
            difficulty: activeStudyData?.difficulty || 'medium',
            question: q.question,
            yourAnswer: userAns !== undefined ? q.options[userAns] : 'No answer',
            correctAnswer: q.options[q.correctAnswer],
            explanation: q.explanation,
            options: q.options,
            correctAnswerIndex: q.correctAnswer
          });
        }
      });

      const accuracy = Math.round((correct / total) * 100);

      if (newMistakes.length > 0 && !isRetestMode) {
        setMistakes((prev) => [...newMistakes, ...prev]);
        showToast(`${newMistakes.length} mistakes saved to your Mistakes Hub`, 'info');
      } else if (isRetestMode) {
        showToast('Re-test completed! Mastery updated 🎉', 'success');
      }

      setStats((prev) => ({
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        averageScore: Math.round((prev.averageScore + accuracy) / 2)
      }));

      if (activeTopic) {
        setTopics((prev) =>
          prev.map((t) => (t.id === activeTopic.id ? { ...t, progress: Math.min(100, t.progress + 15), quizScore: accuracy } : t))
        );
      }

      setActiveView('quiz-results');
    }
  };

  // Review Wrong Answers from Quiz Results
  const handleReviewWrongAnswers = () => {
    setActiveView('wrong-answers');
  };

  // Retest Specific Missed Questions
  const handleStartRetest = (mistakeList) => {
    const formattedQuestions = mistakeList.map((m, idx) => ({
      id: idx + 1,
      question: m.question,
      topic: m.topicName || m.subtopic || 'Mistake Review',
      options: m.options,
      correctAnswer: m.correctAnswerIndex !== undefined ? m.correctAnswerIndex : 0,
      explanation: m.explanation
    }));

    handleStartQuiz(formattedQuestions, true);
  };

  // Practice Weak Topics
  const handlePracticeWeakTopics = async (weakTopics) => {
    setIsGenerating(true);
    setActiveView('loading');
    try {
      const prompt = `Targeted practice quiz focusing on: ${weakTopics.join(', ')}`;
      const result = await generateStudyMaterial(prompt, 'quiz', selectedDifficulty, weakTopics);
      handleStartQuiz(result.questions || [], true);
      showToast(`Generated targeted quiz for: ${weakTopics.join(', ')}`, 'success');
    } catch (err) {
      showToast('Could not generate practice questions for weak topics.', 'error');
      setActiveView('quiz-results');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset Sample Data
  const handleResetSampleData = () => {
    setStats(INITIAL_STATS);
    setTopics(INITIAL_TOPICS);
    setMistakes(INITIAL_MISTAKES);
    setActiveTopic(INITIAL_TOPICS[0]);
    setActiveStudyData(INITIAL_TOPICS[0]);
  };

  // Breadcrumb Title Helper
  const getActiveViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'assistant': return 'Study Assistant';
      case 'session-overview': return 'Study Session';
      case 'flashcards': return 'Flashcards';
      case 'quiz': return 'Quiz';
      case 'quiz-results': return 'Quiz Results';
      case 'wrong-answers': return 'Wrong Answers';
      case 'progress': return 'Progress';
      case 'settings': return 'Settings';
      default: return 'StudyAI';
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Queue */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* User Login & Account Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Command Palette Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        topics={topics}
        onSelectTopic={handleSelectTopic}
        onNewSession={() => setActiveView('assistant')}
      />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={(viewId) => {
          if (viewId === 'flashcards') {
            handleStartFlashcards();
          } else if (viewId === 'quiz') {
            handleStartQuiz();
          } else {
            setActiveView(viewId);
          }
        }}
        recentTopics={topics}
        onSelectTopic={handleSelectTopic}
        mistakesCount={mistakes.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <div className="main-viewport">
        {/* Top Navbar */}
        <Navbar
          activeViewTitle={getActiveViewTitle()}
          activeTopicTitle={activeView === 'session-overview' || activeView === 'flashcards' || activeView === 'quiz' ? activeTopic?.title : null}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={setActiveView}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Content Views */}
        <main className="content-scroll-container">
          {/* 1. Dashboard View */}
          {activeView === 'dashboard' && (
            <Dashboard
              stats={stats}
              topics={topics}
              onNewSession={() => setActiveView('assistant')}
              onSelectTopic={handleSelectTopic}
              onContinueLearning={() => handleSelectTopic(topics[0] || activeTopic)}
            />
          )}

          {/* 2. Study Assistant Input Generator */}
          {activeView === 'assistant' && (
            <StudyAssistant
              inputContent={inputContent}
              setInputContent={setInputContent}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              onGenerate={handleGenerateStudySet}
              isLoading={isGenerating}
            />
          )}

          {/* 3. AI Generation Loading Animation */}
          {activeView === 'loading' && (
            <LoadingAI mode={selectedFormat} />
          )}

          {/* 4. Generated Study Session Overview */}
          {activeView === 'session-overview' && activeStudyData && (
            <SessionOverview
              studyData={activeStudyData}
              onStartFlashcards={handleStartFlashcards}
              onStartQuiz={() => handleStartQuiz(activeStudyData?.questions)}
              onRegenerate={() => handleGenerateStudySet()}
              onCopySummary={() => showToast('Summary copied to clipboard', 'success')}
            />
          )}

          {/* 5. 3D Flashcards Experience */}
          {activeView === 'flashcards' && activeStudyData && (
            <FlashcardViewer
              studyData={activeStudyData}
              onTakeQuiz={() => handleStartQuiz(activeStudyData?.questions)}
              onRestartDeck={() => showToast('Flashcard deck restarted', 'info')}
              onBackToOverview={() => setActiveView('session-overview')}
            />
          )}

          {/* 6. Multiple Choice Quiz Assessment */}
          {activeView === 'quiz' && activeQuizQuestions.length > 0 && (
            <QuizQuestion
              question={activeQuizQuestions[currentQuizIndex]}
              questionIndex={currentQuizIndex}
              totalQuestions={activeQuizQuestions.length}
              selectedAnswer={quizUserAnswers[currentQuizIndex]}
              onSelectOption={handleSelectQuizOption}
              onNextQuestion={handleNextQuizQuestion}
              isLastQuestion={currentQuizIndex === activeQuizQuestions.length - 1}
            />
          )}

          {/* 7. Quiz Results Screen */}
          {activeView === 'quiz-results' && activeQuizQuestions.length > 0 && (
            <QuizResults
              questions={activeQuizQuestions}
              userAnswers={quizUserAnswers}
              onReviewWrongAnswers={handleReviewWrongAnswers}
              onRetestWrongAnswers={(wrongQuestions) => handleStartRetest(wrongQuestions)}
              onPracticeWeakTopics={handlePracticeWeakTopics}
              onRestartFullQuiz={() => handleStartQuiz(activeStudyData?.questions)}
              onNewSession={() => setActiveView('assistant')}
              isRetestMode={isRetestMode}
            />
          )}

          {/* 8. Wrong Answers Mistakes Hub */}
          {activeView === 'wrong-answers' && (
            <WrongAnswersView
              mistakes={mistakes}
              onStartRetest={handleStartRetest}
              onClearMistakes={() => setMistakes([])}
              onStartNewQuiz={() => handleStartQuiz()}
            />
          )}

          {/* 9. Progress & Analytics View */}
          {activeView === 'progress' && (
            <ProgressView
              stats={stats}
              topics={topics}
            />
          )}

          {/* 10. Settings View */}
          {activeView === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={toggleTheme}
              onResetSampleData={handleResetSampleData}
              onShowToast={showToast}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
            />
          )}

          {/* 11. Error State View */}
          {activeView === 'error' && (
            <ErrorState
              error={genError}
              onRetry={() => handleGenerateStudySet()}
              onEditInput={() => setActiveView('assistant')}
              onGenerateAgain={() => {
                setInputContent('');
                setActiveView('assistant');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
