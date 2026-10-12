import React from 'react';
import {
  User,
  Edit2,
  Trophy,
  Award,
  Zap,
  Target,
  Clock,
  ArrowLeft,
  Flame,
  CheckCircle,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { UserProfile } from '../types';
import { BADGES } from '../utils/storage';
import { playClickSound } from '../utils/audio';

interface ProfilePageProps {
  profile: UserProfile;
  onChangeUsername: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onChangeUsername,
  onBack,
}) => {
  const accuracy =
    profile.totalQuestionsAnswered > 0
      ? Math.round((profile.totalCorrect / profile.totalQuestionsAnswered) * 100)
      : 0;

  // XP Progress in current level (100 XP per level)
  const currentLevelBaseXP = (profile.level - 1) * 100;
  const xpInCurrentLevel = profile.xp - currentLevelBaseXP;
  const progressPercent = Math.min(100, Math.max(0, xpInCurrentLevel));

  const earnedBadgeSet = new Set(profile.badges);

  // Subject favorites sorted by count
  const sortedSubjects = Object.entries(profile.subjectStats)
    .sort((a, b) => b[1].played - a[1].played)
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Back */}
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
          <span className="text-xs uppercase font-semibold tracking-wider text-purple-400">Player Card</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">User Profile &amp; Stats</h2>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-8 rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl relative overflow-hidden mb-8 glow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-cyan-500/20 font-display">
              {profile.avatarSeed}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h3 className="text-2xl font-black text-white font-display">
                  {profile.username}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onChangeUsername();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  title="Change Username"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                  Level {profile.level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {profile.totalPoints} Total Points
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="w-full sm:w-64 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Level {profile.level}</span>
              <span className="text-purple-400 font-mono">
                {xpInCurrentLevel} / 100 XP
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-right mt-1.5">
              {100 - xpInCurrentLevel} XP to Level {profile.level + 1}
            </span>
          </div>
        </div>

        {/* 5 Core Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-8 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Quizzes Played</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{profile.totalQuizzes}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Total Points</div>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-1">{profile.totalPoints}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Accuracy</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{accuracy}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Highest Score</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">{profile.highestScore}/10</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400 font-medium">Longest Streak</div>
            <div className="text-xl font-bold text-rose-400 font-mono mt-1">🔥 {profile.longestStreak}</div>
          </div>
        </div>
      </div>

      {/* Badges and Achievements (8 real badges) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Earned Badges &amp; Achievements</h3>
            <p className="text-xs text-slate-400">Unlock awards through real quiz mastery and activity</p>
          </div>
          <span className="text-xs font-bold font-mono text-purple-400">
            {profile.badges.length} / {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {BADGES.map((b) => {
            const isUnlocked = earnedBadgeSet.has(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-purple-950/30 border-purple-500/50 text-white shadow-md shadow-purple-950/30 ring-1 ring-purple-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <h4 className="text-sm font-bold truncate">{b.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {b.description}
                </p>
                <div className="mt-3 text-[10px] font-semibold">
                  {isUnlocked ? (
                    <span className="text-emerald-400">✓ Unlocked</span>
                  ) : (
                    <span className="text-slate-600">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Row: Favorite Subjects & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Subjects */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <h4 className="text-base font-bold text-white mb-4 font-display flex items-center justify-between">
            <span>Subject Performance</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </h4>

          {sortedSubjects.length > 0 ? (
            <div className="space-y-3.5">
              {sortedSubjects.map(([subj, stats]) => {
                const subAcc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={subj} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-white">{subj}</span>
                      <span className="text-cyan-400 font-mono">{subAcc}% Accuracy</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                        style={{ width: `${subAcc}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{stats.played} Quizzes played</span>
                      <span>{stats.correct} / {stats.total} Correct</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">
              Complete subject quizzes to see your proficiency breakdown here.
            </p>
          )}
        </div>

        {/* Recent Quiz History */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <h4 className="text-base font-bold text-white mb-4 font-display flex items-center justify-between">
            <span>Recent Quiz Activity</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </h4>

          {profile.history.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {profile.history.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block truncate max-w-[180px]">
                      {item.subjectName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.date} · {item.standard}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-400 block">
                      {item.score} / {item.total}
                    </span>
                    <span className="text-[10px] text-purple-400">
                      +{item.pointsEarned} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">
              No recent quiz sessions yet. Jump into Quiz Questions or Quiz Game!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
