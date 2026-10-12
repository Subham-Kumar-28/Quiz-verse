import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  ArrowUpDown,
  User,
  Zap,
  Target,
  Sparkles,
  ArrowLeft,
  Calendar,
  Globe,
  Database,
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../utils/storage';
import { playClickSound } from '../utils/audio';

interface LeaderboardPageProps {
  currentUsername: string;
  onBack: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  currentUsername,
  onBack,
}) => {
  const [tab, setTab] = useState<'all-time' | 'weekly'>('all-time');
  const [sortBy, setSortBy] = useState<'points' | 'accuracy'>('points');

  const rawEntries = getLeaderboard(tab);

  // Apply sorting
  const entries = [...rawEntries].sort((a, b) => {
    if (sortBy === 'points') {
      return b.totalPoints - a.totalPoints;
    } else {
      return b.accuracy - a.accuracy;
    }
  }).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const currentUserEntry = entries.find(
    (e) => e.username.toLowerCase() === currentUsername.toLowerCase()
  );

  const top3 = entries.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-right">
          <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">Rankings</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Global Leaderboard</h2>
        </div>
      </div>

      {/* Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Weekly vs All-Time Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => {
              playClickSound();
              setTab('all-time');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'all-time'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>All-Time Rankings</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setTab('weekly');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'weekly'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Spotlight</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort By:</span>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('points');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sortBy === 'points'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Total Points
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSortBy('accuracy');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sortBy === 'accuracy'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Accuracy %
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/80 border border-slate-700 shadow-xl text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-300/20 text-slate-200 border border-slate-400/30 flex items-center justify-center text-xl mx-auto mb-3 font-bold">
                  🥈
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rank #2</span>
                <h3 className="text-base font-bold text-white truncate mt-1">
                  {top3[1].username}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-bold text-cyan-400 font-mono">{top3[1].totalPoints}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-bold text-emerald-400 font-mono">{top3[1].accuracy}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="order-1 md:order-2 p-7 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-900 border-2 border-amber-500/60 shadow-2xl text-center transform md:-translate-y-2 glow-card">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-2xl mx-auto mb-3 font-bold shadow-lg shadow-amber-500/20">
                👑
              </div>
              <span className="text-xs uppercase font-black tracking-wider text-amber-400">Champion #1</span>
              <h3 className="text-lg font-black text-white truncate mt-1">
                {top3[0].username}
              </h3>
              <div className="mt-4 pt-4 border-t border-amber-900/40 flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-black text-amber-400 font-mono text-base">{top3[0].totalPoints}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-bold text-emerald-400 font-mono text-base">{top3[0].accuracy}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="order-3 md:order-3 p-6 rounded-3xl bg-slate-900/80 border border-slate-700 shadow-xl text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-400 border border-amber-700/40 flex items-center justify-center text-xl mx-auto mb-3 font-bold">
                  🥉
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rank #3</span>
                <h3 className="text-base font-bold text-white truncate mt-1">
                  {top3[2].username}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-bold text-cyan-400 font-mono">{top3[2].totalPoints}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-bold text-emerald-400 font-mono">{top3[2].accuracy}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CURRENT USER STATUS CALLOUT */}
      {currentUserEntry && (
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/50 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              #{currentUserEntry.rank}
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-300">Your Current Position</div>
              <div className="text-sm font-bold text-white">{currentUserEntry.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 mr-1.5">Score:</span>
              <strong className="text-cyan-400">{currentUserEntry.totalPoints} pts</strong>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5">Accuracy:</span>
              <strong className="text-emerald-400">{currentUserEntry.accuracy}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* FULL LEADERBOARD TABLE */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="py-4 px-6 w-16 text-center">Rank</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6 text-center">Quizzes</th>
                <th className="py-4 px-6 text-center">Accuracy</th>
                <th className="py-4 px-6 text-center">Highest</th>
                <th className="py-4 px-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {entries.map((player) => {
                const isCurrent = player.username.toLowerCase() === currentUsername.toLowerCase();
                return (
                  <tr
                    key={player.id || player.username}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-purple-950/30 text-white font-bold ring-1 ring-inset ring-purple-500/40'
                        : 'hover:bg-slate-850/50 text-slate-300'
                    }`}
                  >
                    <td className="py-4 px-6 text-center font-mono">
                      {player.rank === 1 ? (
                        <span className="text-amber-400 font-bold">🥇 1</span>
                      ) : player.rank === 2 ? (
                        <span className="text-slate-300 font-bold">🥈 2</span>
                      ) : player.rank === 3 ? (
                        <span className="text-amber-600 font-bold">🥉 3</span>
                      ) : (
                        `#${player.rank}`
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {player.avatarSeed || player.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <span className={isCurrent ? 'text-cyan-300 font-bold' : 'text-white'}>
                            {player.username}
                          </span>
                          {isCurrent && (
                            <span className="ml-2 text-[10px] text-purple-400 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                      {player.quizzesCompleted}
                    </td>

                    <td className="py-4 px-6 text-center font-mono text-xs">
                      <span className="text-emerald-400">{player.accuracy}%</span>
                    </td>

                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-300">
                      {player.highestScore}/10
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-cyan-400 font-bold text-base">
                      {player.totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {entries.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No scores recorded yet. Complete a quiz to climb to the top of the leaderboard!
          </div>
        )}
      </div>
    </div>
  );
};
