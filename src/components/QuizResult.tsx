import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Home,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Info,
} from 'lucide-react';
import { QuizResult } from '../types';
import { playClickSound } from '../utils/audio';

interface QuizResultProps {
  result: QuizResult;
  onPlayAgain: () => void;
  onChooseAnother: () => void;
  onReturnHome: () => void;
}

export const QuizResultView: React.FC<QuizResultProps> = ({
  result,
  onPlayAgain,
  onChooseAnother,
  onReturnHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  const optionLetters = ['A', 'B', 'C', 'D'];

  const getPerformanceMessage = (score: number) => {
    if (score === 10) return { title: 'Legendary Performance! 🌟', sub: 'Flawless victory! You answered every question with master-level precision.' };
    if (score >= 8) return { title: 'Outstanding Knowledge! 🏆', sub: 'Impressive command of computer science principles and technical details.' };
    if (score >= 6) return { title: 'Great Job! 🚀', sub: 'Solid foundation! A quick review of explanations will push you to perfection.' };
    if (score >= 4) return { title: 'Good Effort! 💡', sub: 'You are building your skills. Review the detailed explanations below to master these concepts.' };
    return { title: 'Keep Practicing! 🌱', sub: 'Every attempt is a step forward. Check each question explanation to level up!' };
  };

  const performance = getPerformanceMessage(result.score);

  const filteredQuestions = result.questions.map((q, idx) => ({ q, idx })).filter(({ q, idx }) => {
    const userSelected = result.userAnswers[idx];
    const isCorrect = userSelected === q.correctIndex;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Score Overview Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl text-center relative overflow-hidden mb-8 glow-card">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Badge Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 mb-6">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
          {performance.title}
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-8">
          {performance.sub}
        </p>

        {/* Big Score Display */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="px-6 py-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-display">
              {result.score} <span className="text-2xl sm:text-3xl text-slate-500 font-normal">/ 10</span>
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
              Final Score ({result.percentage}%)
            </div>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-purple-400 font-display">
              +{result.pointsEarned}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
              Points Earned
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Metrics (4 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 text-emerald-400">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <div className="text-xl font-bold font-mono">{result.correctCount}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-rose-500/30 text-rose-400">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-1">
              <XCircle className="w-4 h-4" />
              <span>Incorrect</span>
            </div>
            <div className="text-xl font-bold font-mono">{result.incorrectCount}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/30 text-amber-400">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Unanswered</span>
            </div>
            <div className="text-xl font-bold font-mono">{result.unansweredCount}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-cyan-400">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4" />
              <span>Time Taken</span>
            </div>
            <div className="text-xl font-bold font-mono">{result.timeTakenSeconds}s</div>
          </div>
        </div>

        {/* 4 Action Buttons Required by Brief */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowReview((prev) => !prev);
            }}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              showReview
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <span>{showReview ? 'Hide Explanations' : 'Review Answers'}</span>
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onPlayAgain();
            }}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChooseAnother();
            }}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Choose Another Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onReturnHome();
            }}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </div>

      {/* Review Answers Detailed Section */}
      {showReview && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Detailed Answer Review</h3>
              <p className="text-xs text-slate-400">
                Explore complete rationales and explanations for every question to solidify your computer science knowledge.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setFilterMode('incorrect')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'incorrect'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Incorrect ({result.incorrectCount + result.unansweredCount})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Correct ({result.correctCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map(({ q, idx }) => {
              const userSelected = result.userAnswers[idx];
              const isCorrect = userSelected === q.correctIndex;
              const isUnanswered = userSelected === undefined || userSelected === -1;

              return (
                <div
                  key={q.id || idx}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-slate-900/90 border-emerald-900/60'
                      : isUnanswered
                      ? 'bg-slate-900/90 border-amber-900/60'
                      : 'bg-slate-900/90 border-rose-900/60'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Question {idx + 1} of 10
                    </span>
                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Correct (+10 pts)
                        </span>
                      ) : isUnanswered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 border border-amber-700/60 text-amber-300">
                          <HelpCircle className="w-3.5 h-3.5" />
                          Unanswered (0 pts)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 border border-rose-700/60 text-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect (0 pts)
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-4 leading-snug">
                    {q.question}
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((optText, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isOptionUserChoice = userSelected === oIdx;

                      let styleClasses = 'bg-slate-950/60 border-slate-800 text-slate-300';
                      if (isOptionCorrect) {
                        styleClasses = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500/50';
                      } else if (isOptionUserChoice && !isCorrect) {
                        styleClasses = 'bg-rose-950/60 border-rose-500 text-rose-200 font-medium ring-1 ring-rose-500/50';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border text-sm flex items-center justify-between ${styleClasses}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isOptionCorrect
                                  ? 'bg-emerald-500 text-slate-950'
                                  : isOptionUserChoice
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {optionLetters[oIdx]}
                            </span>
                            <span>{optText}</span>
                          </div>

                          <div className="text-xs shrink-0 font-semibold ml-2">
                            {isOptionCorrect && (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Correct Answer
                              </span>
                            )}
                            {isOptionUserChoice && !isCorrect && (
                              <span className="text-rose-400 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" />
                                Your Choice
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanations Box */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed space-y-2">
                    <div className="flex items-start gap-2 text-cyan-300">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                      <div>
                        <strong className="text-cyan-400 block mb-0.5">Why the correct answer is right:</strong>
                        <span className="text-slate-300">{q.explanation}</span>
                      </div>
                    </div>

                    {!isCorrect && !isUnanswered && q.wrongExplanations && userSelected !== undefined && q.wrongExplanations[userSelected] && (
                      <div className="pt-2 border-t border-slate-800/80 text-rose-300/90 pl-6">
                        <strong className="text-rose-400 block mb-0.5">Why your selected answer was incorrect:</strong>
                        <span className="text-slate-400">{q.wrongExplanations[userSelected]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
