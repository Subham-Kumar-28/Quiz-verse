import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, HelpCircle, AlertTriangle, X } from 'lucide-react';
import { Question, QuizConfig, QuizResult } from '../types';
import { playClickSound, playTickSound, playFanfareSound } from '../utils/audio';

interface QuizScreenProps {
  config: QuizConfig;
  questions: Question[];
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  config,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(Date.now());

  // Timer state
  const hasTimer = config.timer !== 'none';
  const getInitialSeconds = () => {
    switch (config.timer) {
      case '30s-per-q':
        return 30 * questions.length; // 300s
      case '60s-per-q':
        return 60 * questions.length; // 600s
      case '5m-total':
        return 300;
      case '10m-total':
        return 600;
      default:
        return 0;
    }
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(getInitialSeconds);

  // Timer ticker
  useEffect(() => {
    if (!hasTimer) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(true); // Auto-submit when time expires
          return 0;
        }
        if (prev <= 10) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimer]);

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (optIndex: number) => {
    playClickSound();
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = (forced: boolean = false) => {
    setShowConfirmModal(false);
    playFanfareSound();

    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === undefined || selected === -1) {
        unansweredCount++;
        currentStreak = 0;
      } else if (selected === q.correctIndex) {
        correctCount++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        incorrectCount++;
        currentStreak = 0;
      }
    });

    // Scoring system: 10 points per correct answer + streak bonus
    const pointsEarned = correctCount * 10 + (maxStreak >= 3 ? maxStreak * 2 : 0);
    const percentage = Math.round((correctCount / questions.length) * 100);

    const result: QuizResult = {
      quizId: 'q_' + Math.random().toString(36).substring(2, 9),
      subjectName: currentQ ? currentQ.subject : 'Computer Science',
      standard: config.standard,
      mode: config.mode,
      questions,
      userAnswers,
      score: correctCount,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeTakenSeconds,
      pointsEarned,
      streakHigh: maxStreak,
      completedAt: new Date().toISOString(),
    };

    onComplete(result);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[Number(k)] !== undefined && userAnswers[Number(k)] !== -1
  ).length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header: Progress, Exit, Timer */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            playClickSound();
            if (window.confirm('Are you sure you want to exit? Your progress in this quiz will be lost.')) {
              onExit();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quit Quiz</span>
        </button>

        {hasTimer && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
              timeRemaining <= 30
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-900/80 border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>
        )}

        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono">
            Answered {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Indicator Navigator (1..10) */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-2">
        {questions.map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== -1;
          return (
            <button
              key={idx}
              onClick={() => {
                playClickSound();
                setCurrentIndex(idx);
              }}
              className={`flex-1 min-w-[32px] sm:min-w-[40px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300 scale-105'
                  : isAnswered
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-600/50 hover:bg-purple-800/70'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl relative overflow-hidden mb-6 glow-card">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 capitalize">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-8 leading-snug font-display">
          {currentQ.question}
        </h3>

        {/* Four Selectable Options */}
        <div className="space-y-3.5">
          {currentQ.options.map((optionText, optIdx) => {
            const isSelected = userAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {optionText}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Buttons: Previous, Next, Submit */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900'
              : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3">
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Submit Quiz Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowConfirmModal(true);
            }}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Quiz</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal before final submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">Ready to submit?</h3>
            <p className="text-sm text-slate-300 mb-4">
              You have answered <strong className="text-cyan-400">{answeredCount}</strong> of <strong className="text-white">{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span className="block mt-1 text-xs text-amber-400">
                  You still have {questions.length - answeredCount} unanswered question(s). Unanswered questions score 0 points.
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Review More
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
