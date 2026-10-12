import React, { useState, useEffect } from 'react';
import { Flame, Heart, ArrowRight, ArrowLeft, Trophy, RotateCcw, Home } from 'lucide-react';
import { Question, QuizResult } from '../types';
import { ALL_QUESTIONS, shuffleQuestionOptions } from '../data/questions';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playFanfareSound,
} from '../utils/audio';

interface StreakGameRunnerProps {
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export const StreakGameRunner: React.FC<StreakGameRunnerProps> = ({
  onComplete,
  onExit,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Pick 15 random questions with randomized options (A, B, C, D) for streak endurance
    const shuffled = [...ALL_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15)
      .map((q) => shuffleQuestionOptions(q));
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[currentIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelect = (optIndex: number) => {
    if (showFeedback || !currentQ) return;
    playClickSound();
    setSelectedOpt(optIndex);
    setShowFeedback(true);

    setUserAnswers((prev) => ({ ...prev, [currentIdx]: optIndex }));

    const isCorrect = optIndex === currentQ.correctIndex;

    if (isCorrect) {
      playCorrectSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      // Multiplier bonus based on streak
      const multiplier = Math.min(4, 1 + Math.floor(newStreak / 2));
      setScore((prev) => prev + 10 * multiplier);
    } else {
      playWrongSound();
      setStreak(0);
      const remainingLives = lives - 1;
      setLives(remainingLives);
      if (remainingLives <= 0) {
        setTimeout(() => {
          setGameOver(true);
        }, 1200);
        return;
      }
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length && lives > (isCorrect ? 0 : 1)) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOpt(null);
        setShowFeedback(false);
      } else {
        setGameOver(true);
      }
    }, 1400);
  };

  const handleFinish = () => {
    playFanfareSound();
    const timeTaken = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const finalQuestions = questions.slice(0, Math.max(10, currentIdx + 1)).slice(0, 10);

    let correctCount = 0;
    finalQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correctIndex) correctCount++;
    });

    const result: QuizResult = {
      quizId: 'streak_' + Math.random().toString(36).substring(2, 9),
      subjectName: 'Streak Challenge Arena',
      standard: 'Intermediate',
      mode: 'streak',
      questions: finalQuestions,
      userAnswers,
      score: correctCount,
      percentage: Math.round((correctCount / finalQuestions.length) * 100),
      correctCount,
      incorrectCount: finalQuestions.length - correctCount,
      unansweredCount: 0,
      timeTakenSeconds: timeTaken,
      pointsEarned: score,
      streakHigh: maxStreak,
      completedAt: new Date().toISOString(),
    };

    onComplete(result);
  };

  if (!currentQ) {
    return <div className="text-center py-20 text-slate-400">Loading Streak Arena...</div>;
  }

  if (gameOver) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center animate-in fade-in">
        <div className="p-8 rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl relative overflow-hidden glow-card">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-500/30">
            <Flame className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-white font-display mb-1">
            Challenge Completed!
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            You pushed your limits in the Streak Survival arena.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Longest Streak</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                🔥 {maxStreak}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Points Earned</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                ⚡ +{score}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Save Score &amp; Review
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Return to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header: Lives, Streak, Quit */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            playClickSound();
            onExit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Streak</span>
        </button>

        {/* Streak Flame Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 text-sm font-bold font-mono shadow-sm">
          <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
          <span>STREAK: {streak}</span>
          {streak >= 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
              {Math.min(4, 1 + Math.floor(streak / 2))}X
            </span>
          )}
        </div>

        {/* Shields / Hearts */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((heartIndex) => (
            <Heart
              key={heartIndex}
              className={`w-5 h-5 transition-all ${
                heartIndex <= lives
                  ? 'fill-rose-500 text-rose-500 scale-105'
                  : 'text-slate-700 opacity-40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl relative overflow-hidden mb-6 glow-card">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Streak Round {currentIdx + 1}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Current Score: {score} pts
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug font-display">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedOpt === oIdx;
            const isCorrect = oIdx === currentQ.correctIndex;

            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';
            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              }
            }

            return (
              <button
                key={oIdx}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelect(oIdx)}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {optionLetters[oIdx]}
                  </span>
                  <span className="text-sm sm:text-base font-medium">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
