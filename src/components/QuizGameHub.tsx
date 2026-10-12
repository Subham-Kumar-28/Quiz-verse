import React from 'react';
import {
  ArrowLeft,
  Zap,
  Timer,
  Flame,
  Users,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface QuizGameHubProps {
  onBack: () => void;
  onSelectGameMode: (mode: 'quick' | 'timed' | 'streak' | 'multiplayer') => void;
  userStats: {
    longestStreak: number;
    highestScore: number;
    totalPoints: number;
  };
}

export const QuizGameHub: React.FC<QuizGameHubProps> = ({
  onBack,
  onSelectGameMode,
  userStats,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header and Back button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-right">
          <span className="text-xs uppercase font-semibold tracking-wider text-cyan-400">Arena Hub</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Quiz Game Modes</h2>
        </div>
      </div>

      {/* Hero Bar with quick player stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 mb-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-cyan-400 tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Competitive Arena
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display">
            Push Your Limits &amp; Top The Leaderboard
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Choose a game mode to earn extra XP, unlock rare achievements, or battle friends in real-time rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-center">
            <div className="text-xs text-slate-400 font-medium">Best Streak</div>
            <div className="text-lg font-bold text-purple-400 font-mono">
              🔥 {userStats.longestStreak} in a row
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <div className="text-xs text-slate-400 font-medium">Total Points</div>
            <div className="text-lg font-bold text-cyan-400 font-mono">
              ⚡ {userStats.totalPoints} pts
            </div>
          </div>
        </div>
      </div>

      {/* 4 Working Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* A. Quick Play */}
        <div
          onClick={() => {
            playClickSound();
            onSelectGameMode('quick');
          }}
          className="group relative p-7 rounded-3xl bg-[#0f172a] border border-cyan-500/30 hover:border-cyan-400 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden glow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
                Instant
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-display mb-2">
              Quick Play
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Dive straight into a 10-question randomized computer science quiz across all topics with zero wait time.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">10 Questions · Random Subjects</span>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 group-hover:bg-cyan-400 transition-colors"
            >
              <span>Play Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. Timed Challenge */}
        <div
          onClick={() => {
            playClickSound();
            onSelectGameMode('timed');
          }}
          className="group relative p-7 rounded-3xl bg-[#0f172a] border border-amber-500/30 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden glow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Timer className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800">
                Speed Bonus
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors font-display mb-2">
              Timed Challenge
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Answer 10 questions under a strict 15-second countdown timer. Earn bonus speed multipliers for lightning-fast correct answers!
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">15s / Question · Speed Multiplier</span>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 group-hover:bg-amber-400 transition-colors"
            >
              <span>Race Clock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* C. Streak Challenge */}
        <div
          onClick={() => {
            playClickSound();
            onSelectGameMode('streak');
          }}
          className="group relative p-7 rounded-3xl bg-[#0f172a] border border-rose-500/30 hover:border-rose-400 shadow-xl hover:shadow-2xl hover:shadow-rose-900/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden glow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800">
                Survival
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors font-display mb-2">
              Streak Challenge
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Answer consecutive questions correctly to build an exponential score multiplier. You have 3 lives—how long can you survive?
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">3 Shields · Exponential Multiplier</span>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold flex items-center gap-1.5 group-hover:bg-rose-400 transition-colors"
            >
              <span>Build Streak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* D. Play with Friends (Multiplayer) */}
        <div
          onClick={() => {
            playClickSound();
            onSelectGameMode('multiplayer');
          }}
          className="group relative p-7 rounded-3xl bg-[#0f172a] border border-purple-500/40 hover:border-purple-400 shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden glow-card"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
                Multiplayer 2–6 Players
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors font-display mb-2">
              Play with Friends
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Create a private room, share your 6-digit code with friends, and compete in a synchronized head-to-head quiz showdown with live rankings!
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Private Rooms · Synchronized Timers</span>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center gap-1.5 group-hover:from-purple-500 group-hover:to-indigo-500 transition-colors shadow-md shadow-purple-600/30"
            >
              <span>Enter Room Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
