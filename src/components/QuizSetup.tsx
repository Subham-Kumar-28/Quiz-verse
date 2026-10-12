import React, { useState } from 'react';
import { ArrowLeft, Play, Timer, Sparkles, Check, HelpCircle, AlertCircle } from 'lucide-react';
import { SUBJECTS } from '../data/questions';
import { SubjectId, StandardDifficulty, TimerOption, QuizConfig } from '../types';
import { playClickSound } from '../utils/audio';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  onBack: () => void;
}

const STANDARDS: StandardDifficulty[] = [
  'Class 6–8',
  'Class 9–10',
  'Class 11–12',
  'Beginner',
  'Intermediate',
  'Advanced',
  'College / B.Sc. Computer Science',
];

const TIMER_OPTIONS: { id: TimerOption; label: string; description: string }[] = [
  { id: 'none', label: 'No Timer', description: 'Take all the time you need to learn' },
  { id: '30s-per-q', label: '30s / Question', description: 'Fast pace for quick recall' },
  { id: '60s-per-q', label: '60s / Question', description: 'Balanced timing for problem-solving' },
  { id: '5m-total', label: '5 Min Total', description: 'Classic 10-question practice test' },
];

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<StandardDifficulty | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>('none');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [validationError, setValidationError] = useState<string | null>(null);

  const categories = ['all', 'Foundations', 'Languages', 'Core CS', 'Systems', 'Networking', 'Web Tech', 'Security'];

  const filteredSubjects = categoryFilter === 'all'
    ? SUBJECTS
    : SUBJECTS.filter((s) => s.category.toLowerCase() === categoryFilter.toLowerCase());

  const handleStart = () => {
    if (!selectedSubject) {
      setValidationError('Please select a Computer Science subject to continue.');
      return;
    }
    if (!selectedStandard) {
      setValidationError('Please select a grade standard or difficulty level.');
      return;
    }

    setValidationError(null);
    playClickSound();
    onStartQuiz({
      subject: selectedSubject,
      standard: selectedStandard,
      questionCount: 10, // exactly 10
      timer: selectedTimer,
      mode: 'standard',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button and page title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-right">
          <span className="text-xs uppercase font-semibold tracking-wider text-purple-400">Quiz Configuration</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Subject Practice Setup</h2>
        </div>
      </div>

      <div className="space-y-10">
        {/* Step 1: Select Subject */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-lg font-bold text-white font-display">Select Subject</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Choose from 14 computer science disciplines</p>
            </div>

            {/* Category Filter segmented tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playClickSound();
                    setCategoryFilter(cat);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                    categoryFilter === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSubjects.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedSubject(sub.id);
                    if (validationError) setValidationError(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/20 ring-1 ring-purple-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="text-2xl p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform shrink-0">
                      {sub.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {sub.name}
                        </h4>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Standard or Difficulty */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-lg font-bold text-white font-display">Select Standard / Difficulty</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Adapt question depth to your academic level</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {STANDARDS.map((std) => {
              const isSelected = selectedStandard === std;
              return (
                <button
                  key={std}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedStandard(std);
                    if (validationError) setValidationError(null);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold truncate">{std}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Quiz Settings (Timer, Question Count) */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-lg font-bold text-white font-display">Quiz Settings</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Configure countdown timer and review format</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIMER_OPTIONS.map((opt) => {
              const isSelected = selectedTimer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedTimer(opt.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-400 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <Timer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400">{opt.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="font-medium">Number of Questions:</span>
            <span className="font-bold text-cyan-400">Exactly 10 Questions</span>
          </div>
        </div>

        {/* Error notification if missing selection */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Summary & Start Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            {selectedSubject && selectedStandard ? (
              <span>
                Ready to test <strong className="text-white">{SUBJECTS.find((s) => s.id === selectedSubject)?.name}</strong> for <strong className="text-white">{selectedStandard}</strong>.
              </span>
            ) : (
              <span>Please select both a subject and difficulty to unlock the quiz.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={!selectedSubject || !selectedStandard}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              selectedSubject && selectedStandard
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white cursor-pointer shadow-purple-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Start Quiz</span>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
