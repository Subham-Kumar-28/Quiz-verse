import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UsernameModal } from './components/UsernameModal';
import { HomePage } from './components/HomePage';
import { QuizSetup } from './components/QuizSetup';
import { QuizScreen } from './components/QuizScreen';
import { QuizResultView } from './components/QuizResult';
import { QuizGameHub } from './components/QuizGameHub';
import { StreakGameRunner } from './components/StreakGameRunner';
import { MultiplayerArena } from './components/MultiplayerArena';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { BackgroundAnimation } from './components/BackgroundAnimation';

import {
  Question,
  QuizConfig,
  QuizResult,
  UserProfile,
} from './types';
import { getQuizQuestions, ALL_QUESTIONS } from './data/questions';
import {
  getStoredUsername,
  saveStoredUsername,
  getUserProfile,
  updateUserProfileAfterQuiz,
  getStoredTheme,
  saveStoredTheme,
} from './utils/storage';
import { initAudio, playClickSound } from './utils/audio';

type ActiveView =
  | 'home'
  | 'quiz-setup'
  | 'quiz-active'
  | 'quiz-result'
  | 'game-hub'
  | 'streak-game'
  | 'multiplayer'
  | 'leaderboard'
  | 'profile';

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme);

  // Active quiz session states
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  // Initialize username & audio on mount
  useEffect(() => {
    initAudio();
    saveStoredTheme(theme);
    const existing = getStoredUsername();
    if (!existing) {
      setIsFirstTimeUser(true);
      setShowUsernameModal(true);
    } else {
      setUsername(existing);
    }
    setProfile(getUserProfile());
  }, []);

  const handleSaveUsername = (newUsername: string) => {
    saveStoredUsername(newUsername);
    setUsername(newUsername);
    setProfile(getUserProfile());
    setShowUsernameModal(false);
    setIsFirstTimeUser(false);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  // Launch standard quiz
  const handleStartStandardQuiz = (config: QuizConfig) => {
    const questions = getQuizQuestions(config.subject, config.standard, true);
    setActiveConfig(config);
    setActiveQuestions(questions);
    setCurrentView('quiz-active');
  };

  // Launch quick play quiz
  const handleStartQuickPlay = () => {
    const config: QuizConfig = {
      subject: 'all',
      standard: 'Intermediate',
      questionCount: 10,
      timer: 'none',
      mode: 'quick',
    };
    const questions = getQuizQuestions('all', undefined, true);
    setActiveConfig(config);
    setActiveQuestions(questions);
    setCurrentView('quiz-active');
  };

  // Launch timed challenge quiz
  const handleStartTimedChallenge = () => {
    const config: QuizConfig = {
      subject: 'all',
      standard: 'Intermediate',
      questionCount: 10,
      timer: '30s-per-q',
      mode: 'timed',
    };
    const questions = getQuizQuestions('all', undefined, true);
    setActiveConfig(config);
    setActiveQuestions(questions);
    setCurrentView('quiz-active');
  };

  // Complete a quiz
  const handleQuizComplete = (result: QuizResult) => {
    setLastResult(result);
    const { profile: updatedProfile } = updateUserProfileAfterQuiz(result);
    setProfile(updatedProfile);
    setCurrentView('quiz-result');
  };

  // Multiplayer match finished
  const handleMultiplayerFinish = (score: number, won: boolean) => {
    const fakeResult: QuizResult = {
      quizId: 'mp_' + Math.random().toString(36).substring(2, 9),
      subjectName: 'Multiplayer Battle',
      standard: 'Intermediate',
      mode: 'multiplayer',
      questions: ALL_QUESTIONS.slice(0, 10),
      userAnswers: {},
      score: Math.min(10, Math.floor(score / 10)),
      percentage: Math.min(100, score),
      correctCount: Math.min(10, Math.floor(score / 10)),
      incorrectCount: Math.max(0, 10 - Math.floor(score / 10)),
      unansweredCount: 0,
      timeTakenSeconds: 90,
      pointsEarned: score,
      streakHigh: 3,
      completedAt: new Date().toISOString(),
    };
    const { profile: updatedProfile } = updateUserProfileAfterQuiz(fakeResult);
    setProfile(updatedProfile);
    setCurrentView('game-hub');
  };

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-300 ${theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100'}`}>
      {/* Dynamic Animated Canvas & Ambient Glow Background */}
      <BackgroundAnimation theme={theme} />

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'quiz-setup') {
            setCurrentView('quiz-setup');
          } else if (view === 'game-hub') {
            setCurrentView('game-hub');
          } else if (view === 'leaderboard') {
            setCurrentView('leaderboard');
          } else {
            setCurrentView('home');
          }
        }}
        profile={profile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setCurrentView('profile')}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* VIEW 1: HOME PAGE (The two main options centerpiece) */}
        {currentView === 'home' && (
          <HomePage
            username={username || 'Coder'}
            onSelectOption={(option) => {
              if (option === 'quiz-questions') {
                setCurrentView('quiz-setup');
              } else {
                setCurrentView('game-hub');
              }
            }}
            onOpenLeaderboard={() => setCurrentView('leaderboard')}
          />
        )}

        {/* VIEW 2: QUIZ SETUP (Subject & Standard selector) */}
        {currentView === 'quiz-setup' && (
          <QuizSetup
            onStartQuiz={handleStartStandardQuiz}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 3: ACTIVE 10-QUESTION QUIZ SCREEN */}
        {currentView === 'quiz-active' && activeConfig && (
          <QuizScreen
            config={activeConfig}
            questions={activeQuestions}
            onComplete={handleQuizComplete}
            onExit={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 4: QUIZ RESULTS & DETAILED REVIEW */}
        {currentView === 'quiz-result' && lastResult && (
          <QuizResultView
            result={lastResult}
            onPlayAgain={() => {
              if (activeConfig) {
                handleStartStandardQuiz(activeConfig);
              } else {
                setCurrentView('quiz-setup');
              }
            }}
            onChooseAnother={() => setCurrentView('quiz-setup')}
            onReturnHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 5: QUIZ GAME HUB (4 Game Modes) */}
        {currentView === 'game-hub' && (
          <QuizGameHub
            onBack={() => setCurrentView('home')}
            onSelectGameMode={(mode) => {
              if (mode === 'quick') {
                handleStartQuickPlay();
              } else if (mode === 'timed') {
                handleStartTimedChallenge();
              } else if (mode === 'streak') {
                setCurrentView('streak-game');
              } else if (mode === 'multiplayer') {
                setCurrentView('multiplayer');
              }
            }}
            userStats={{
              longestStreak: profile.longestStreak,
              highestScore: profile.highestScore,
              totalPoints: profile.totalPoints,
            }}
          />
        )}

        {/* VIEW 6: STREAK CHALLENGE GAME RUNNER */}
        {currentView === 'streak-game' && (
          <StreakGameRunner
            onComplete={handleQuizComplete}
            onExit={() => setCurrentView('game-hub')}
          />
        )}

        {/* VIEW 7: PLAY WITH FRIENDS (MULTIPLAYER ARENA) */}
        {currentView === 'multiplayer' && (
          <MultiplayerArena
            username={username || 'Coder'}
            onExit={() => setCurrentView('game-hub')}
            onFinishMatch={handleMultiplayerFinish}
          />
        )}

        {/* VIEW 8: LEADERBOARD PAGE */}
        {currentView === 'leaderboard' && (
          <LeaderboardPage
            currentUsername={username || 'Coder'}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 9: USER PROFILE & ACHIEVEMENTS */}
        {currentView === 'profile' && (
          <ProfilePage
            profile={profile}
            onChangeUsername={() => {
              setIsFirstTimeUser(false);
              setShowUsernameModal(true);
            }}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* First-Time or Edit Username Modal */}
      <UsernameModal
        isOpen={showUsernameModal}
        isFirstTime={isFirstTimeUser}
        currentUsername={username}
        onSave={handleSaveUsername}
        onClose={() => {
          if (!isFirstTimeUser) setShowUsernameModal(false);
        }}
      />
    </div>
  );
}
