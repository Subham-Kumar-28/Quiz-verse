import React, { useState } from 'react';
import { Sparkles, User, AlertCircle, Check } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../utils/audio';

interface UsernameModalProps {
  isOpen: boolean;
  isFirstTime: boolean;
  currentUsername: string;
  onSave: (username: string) => void;
  onClose?: () => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({
  isOpen,
  isFirstTime,
  currentUsername,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentUsername || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a username to continue.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username cannot exceed 20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_ -]+$/.test(trimmed)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores.');
      return;
    }

    playCorrectSound();
    onSave(trimmed);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-purple-950/40 p-6 sm:p-8 text-center relative overflow-hidden glow-card">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Website Logo */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-5">
          <span className="text-3xl font-black text-white font-display">Q</span>
        </div>

        {/* Heading & Text */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2 font-display">
          Welcome to <span className="text-cyan-400">QuizVerse</span>!
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {isFirstTime
            ? 'Enter your username to start your quiz journey.'
            : 'Update your display username for quizzes and the leaderboard.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="username-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Player Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. CodeMaster99"
                autoFocus
                maxLength={20}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm font-medium"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            {!isFirstTime && onClose && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              onClick={() => playClickSound()}
              className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isFirstTime ? 'Continue' : 'Save Changes'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="mt-5 text-[11px] text-slate-500">
          No registration or personal password required. Your progress is saved in your browser.
        </p>
      </div>
    </div>
  );
};
