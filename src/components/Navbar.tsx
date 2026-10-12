import React from 'react';
import { Volume2, VolumeX, Sun, Moon, User, Trophy, BookOpen, Gamepad2 } from 'lucide-react';
import { UserProfile } from '../types';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  profile: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  profile,
  theme,
  onToggleTheme,
  onOpenProfile,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const navItemClass = (view: string) =>
    `px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg ${
      currentView === view
        ? theme === 'light'
          ? 'text-cyan-700 bg-cyan-100/80 border border-cyan-300 shadow-sm'
          : 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/60'
        : theme === 'light'
        ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
      theme === 'light'
        ? 'border-slate-200 bg-white/90 backdrop-blur-md shadow-xs'
        : 'border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <span className="text-white font-black text-lg">Q</span>
          </div>
          <div>
            <span className={`text-xl font-black tracking-tight font-display transition-colors ${
              theme === 'light' ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-300'
            }`}>
              Quiz<span className={theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}>Verse</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              onNavigate('home');
            }}
            className={navItemClass('home')}
          >
            Home
          </button>
          <button
            onClick={() => {
              playClickSound();
              onNavigate('quiz-setup');
            }}
            className={`flex items-center gap-1.5 ${navItemClass('quiz-setup')}`}
          >
            <BookOpen className="w-4 h-4" />
            Quiz Questions
          </button>
          <button
            onClick={() => {
              playClickSound();
              onNavigate('game-hub');
            }}
            className={`flex items-center gap-1.5 ${navItemClass('game-hub')}`}
          >
            <Gamepad2 className="w-4 h-4" />
            Quiz Game
          </button>
          <button
            onClick={() => {
              playClickSound();
              onNavigate('leaderboard');
            }}
            className={`flex items-center gap-1.5 ${navItemClass('leaderboard')}`}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
        </nav>

        {/* Zone 3: Actions (Sound, Theme, User Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'light'
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Toggle sound"
          >
            {soundOn ? (
              <Volume2 className={`w-4 h-4 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onToggleTheme();
            }}
            title={theme === 'dark' ? 'Switch to day mode' : 'Switch to dark mode'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'light'
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Profile Badge Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenProfile();
            }}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer group shadow-xs ${
              theme === 'light'
                ? 'bg-white border-slate-200 hover:border-purple-400'
                : 'bg-slate-900 border-slate-700/80 hover:border-purple-500/60'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {profile.avatarSeed || profile.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className={`text-xs font-semibold transition-colors truncate max-w-[110px] ${
                theme === 'light' ? 'text-slate-800 group-hover:text-cyan-700' : 'text-slate-200 group-hover:text-cyan-300'
              }`}>
                {profile.username}
              </div>
              <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                Lvl {profile.level} · {profile.totalPoints} pts
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
