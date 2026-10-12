import React from 'react';
import { ArrowRight, BookOpen, Gamepad2, Sparkles, ChevronRight, Trophy, Zap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HomePageProps {
  username: string;
  onSelectOption: (option: 'quiz-questions' | 'quiz-game') => void;
  onOpenLeaderboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  username,
  onSelectOption,
  onOpenLeaderboard,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Header & Welcome Message */}
        <div className="text-center mb-10 md:mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Master Computer Science & Compete</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display mb-3 text-balance">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400">QuizVerse</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Welcome, <span className="text-cyan-300 font-semibold">{username}</span>! Test your skills across 14 subjects or challenge players in competitive battles.
          </p>
        </div>

        {/* 
          EXACTLY TWO LARGE MAIN OPTION CARDS CENTERED HORIZONTALLY
          Displayed side by side on desktop and stacked vertically on mobile.
          Left Card: Quiz Questions (📝) -> Start Quiz
          Right Card: Quiz Game (🎮) -> Play Game
        */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl">
          {/* Left Card — Quiz Questions */}
          <div
            onClick={() => {
              playClickSound();
              onSelectOption('quiz-questions');
            }}
            className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#0f172a]/95 border-2 border-purple-500/30 hover:border-purple-400 shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-800/30 border border-purple-500/40 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 group-hover:border-purple-400 transition-all">
                📝
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight font-display group-hover:text-purple-300 transition-colors">
                Quiz Questions
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Learn computer science through subject-wise questions, explanations, and practice tests.
              </p>
            </div>

            {/* Main Button: Start Quiz */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onSelectOption('quiz-questions');
                }}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Start Quiz</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                <span>14 Subjects available</span>
                <span>Class 6 to College level</span>
              </div>
            </div>
          </div>

          {/* Right Card — Quiz Game */}
          <div
            onClick={() => {
              playClickSound();
              onSelectOption('quiz-game');
            }}
            className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#0f172a]/95 border-2 border-cyan-500/30 hover:border-cyan-400 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-800/30 border border-cyan-500/40 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                🎮
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight font-display group-hover:text-cyan-300 transition-colors">
                Quiz Game
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Challenge yourself, earn points, beat the leaderboard, and compete with friends.
              </p>
            </div>

            {/* Main Button: Play Game */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onSelectOption('quiz-game');
                }}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-cyan-500 via-teal-600 to-cyan-600 hover:from-cyan-400 hover:to-teal-500 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Play Game</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Multiplayer & Speed Modes</span>
                <span>Live Leaderboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick access footer bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:text-cyan-300 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>View Global Rankings</span>
          </button>
          <div className="hidden sm:inline text-slate-600">·</div>
          <span>100% Free · No Registration Required</span>
        </div>
      </div>
    </div>
  );
};
