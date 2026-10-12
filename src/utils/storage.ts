import { Badge, LeaderboardEntry, QuizResult, UserProfile } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first-quiz',
    name: 'First Quiz',
    description: 'Completed your very first computer science quiz!',
    icon: '🎯',
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Scored 10 out of 10 in a quiz round!',
    icon: '🏆',
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Completed 10 or more total quizzes.',
    icon: '👑',
  },
  {
    id: 'python-beginner',
    name: 'Python Pioneer',
    description: 'Tested your knowledge in Python Programming.',
    icon: '🐍',
  },
  {
    id: 'cs-explorer',
    name: 'Computer Science Explorer',
    description: 'Explored and completed quizzes across at least 3 distinct subjects.',
    icon: '🧭',
  },
  {
    id: 'winning-streak',
    name: 'Winning Streak',
    description: 'Answered 5 or more questions correctly in a row.',
    icon: '🔥',
  },
  {
    id: 'multiplayer-champion',
    name: 'Multiplayer Champion',
    description: 'Competed in a real-time multiplayer room battle.',
    icon: '⚔️',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Finished a quiz in under 60 seconds with 8+ correct answers.',
    icon: '⚡',
  },
];

const USERNAME_KEY = 'quizverse_username';
const PROFILE_KEY = 'quizverse_profile';
const LEADERBOARD_ALLTIME_KEY = 'quizverse_leaderboard_alltime';
const LEADERBOARD_WEEKLY_KEY = 'quizverse_leaderboard_weekly';
const THEME_KEY = 'quizverse_theme';

export function getStoredUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function saveStoredUsername(username: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = username.trim();
  localStorage.setItem(USERNAME_KEY, trimmed);

  // Update profile username if exists
  const profile = getUserProfile();
  profile.username = trimmed;
  saveUserProfile(profile);

  // Sync to leaderboards
  updateLeaderboardUsername(trimmed);
}

export function getStoredTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  const val = localStorage.getItem(THEME_KEY);
  return val === 'light' ? 'light' : 'dark';
}

export function saveStoredTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('light-theme');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.remove('light-theme');
    document.body.classList.remove('light-theme');
    document.documentElement.classList.add('dark');
  }
}

export function getUserProfile(): UserProfile {
  const username = getStoredUsername() || 'AnonymousCoder';
  const defaultProfile: UserProfile = {
    username,
    avatarSeed: username.slice(0, 2).toUpperCase(),
    totalQuizzes: 0,
    totalPoints: 0,
    highestScore: 0,
    totalCorrect: 0,
    totalQuestionsAnswered: 0,
    longestStreak: 0,
    level: 1,
    xp: 0,
    badges: [],
    history: [],
    subjectStats: {},
    createdAt: new Date().toISOString(),
  };

  if (typeof window === 'undefined') return defaultProfile;

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile,
      ...parsed,
      username: getStoredUsername() || parsed.username || defaultProfile.username,
    };
  } catch {
    return defaultProfile;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateUserProfileAfterQuiz(result: QuizResult): {
  profile: UserProfile;
  newBadges: Badge[];
} {
  const profile = getUserProfile();

  profile.totalQuizzes += 1;
  profile.totalPoints += result.pointsEarned;
  profile.totalCorrect += result.correctCount;
  profile.totalQuestionsAnswered += 10;
  if (result.score > profile.highestScore) {
    profile.highestScore = result.score;
  }
  if (result.streakHigh > profile.longestStreak) {
    profile.longestStreak = result.streakHigh;
  }

  // Update subject stats
  const subjName = result.subjectName;
  if (!profile.subjectStats[subjName]) {
    profile.subjectStats[subjName] = { played: 0, correct: 0, total: 0 };
  }
  profile.subjectStats[subjName].played += 1;
  profile.subjectStats[subjName].correct += result.correctCount;
  profile.subjectStats[subjName].total += 10;

  // Add to history
  profile.history.unshift({
    id: result.quizId,
    subjectName: result.subjectName,
    standard: result.standard,
    mode: result.mode,
    score: result.score,
    total: 10,
    pointsEarned: result.pointsEarned,
    date: new Date().toLocaleDateString(),
    timeTakenSeconds: result.timeTakenSeconds,
  });
  if (profile.history.length > 20) {
    profile.history = profile.history.slice(0, 20);
  }

  // Add XP (each correct answer gives 15 XP, completing gives 20 XP bonus)
  const xpGained = result.correctCount * 15 + 20;
  profile.xp += xpGained;
  // Level threshold: Level = Math.floor(XP / 100) + 1
  profile.level = Math.floor(profile.xp / 100) + 1;

  // Check achievements / badges
  const earnedBadgeIds = new Set(profile.badges);
  const newlyAwarded: Badge[] = [];

  const checkBadge = (id: string, condition: boolean) => {
    if (condition && !earnedBadgeIds.has(id)) {
      earnedBadgeIds.add(id);
      const badgeObj = BADGES.find((b) => b.id === id);
      if (badgeObj) newlyAwarded.push(badgeObj);
    }
  };

  checkBadge('first-quiz', profile.totalQuizzes >= 1);
  checkBadge('perfect-score', result.score === 10);
  checkBadge('quiz-master', profile.totalQuizzes >= 10);
  checkBadge(
    'python-beginner',
    result.subjectName.toLowerCase().includes('python') ||
      Boolean(profile.subjectStats['Python Programming']?.played)
  );
  checkBadge('cs-explorer', Object.keys(profile.subjectStats).length >= 3);
  checkBadge('winning-streak', result.streakHigh >= 5 || profile.longestStreak >= 5);
  checkBadge('multiplayer-champion', result.mode === 'multiplayer');
  checkBadge(
    'speed-demon',
    result.timeTakenSeconds > 0 &&
      result.timeTakenSeconds <= 60 &&
      result.correctCount >= 8
  );

  profile.badges = Array.from(earnedBadgeIds);
  saveUserProfile(profile);

  // Sync to local leaderboards
  syncUserToLeaderboard(profile);

  return { profile, newBadges: newlyAwarded };
}

// -----------------------------------------------------------
// Leaderboards: All-Time and Weekly
// -----------------------------------------------------------

function getInitialLeaderboard(): LeaderboardEntry[] {
  // Realistic seed benchmarks for a lively competitive leaderboard
  return [
    {
      id: 'seed-1',
      username: 'CodeNinja_99',
      totalPoints: 1240,
      quizzesCompleted: 14,
      accuracy: 94,
      highestScore: 10,
      avatarSeed: 'CN',
      lastActive: 'Today',
    },
    {
      id: 'seed-2',
      username: 'CyberHex',
      totalPoints: 980,
      quizzesCompleted: 11,
      accuracy: 89,
      highestScore: 10,
      avatarSeed: 'CH',
      lastActive: 'Yesterday',
    },
    {
      id: 'seed-3',
      username: 'AlgoMaster',
      totalPoints: 850,
      quizzesCompleted: 9,
      accuracy: 91,
      highestScore: 10,
      avatarSeed: 'AM',
      lastActive: '2 days ago',
    },
    {
      id: 'seed-4',
      username: 'BinarySorcerer',
      totalPoints: 670,
      quizzesCompleted: 8,
      accuracy: 84,
      highestScore: 9,
      avatarSeed: 'BS',
      lastActive: '3 days ago',
    },
    {
      id: 'seed-5',
      username: 'KernelPanicker',
      totalPoints: 520,
      quizzesCompleted: 6,
      accuracy: 82,
      highestScore: 9,
      avatarSeed: 'KP',
      lastActive: '4 days ago',
    },
  ];
}

export function getLeaderboard(type: 'all-time' | 'weekly'): LeaderboardEntry[] {
  if (typeof window === 'undefined') return getInitialLeaderboard();
  const key = type === 'all-time' ? LEADERBOARD_ALLTIME_KEY : LEADERBOARD_WEEKLY_KEY;
  const raw = localStorage.getItem(key);

  let list: LeaderboardEntry[];
  if (!raw) {
    list = getInitialLeaderboard();
    localStorage.setItem(key, JSON.stringify(list));
  } else {
    try {
      list = JSON.parse(raw);
    } catch {
      list = getInitialLeaderboard();
    }
  }

  // Ensure current user is present if they have played
  const profile = getUserProfile();
  const currentUsername = profile.username;
  const userAccuracy =
    profile.totalQuestionsAnswered > 0
      ? Math.round((profile.totalCorrect / profile.totalQuestionsAnswered) * 100)
      : 0;

  const existingIndex = list.findIndex(
    (e) => e.username.toLowerCase() === currentUsername.toLowerCase()
  );

  if (profile.totalQuizzes > 0) {
    const userEntry: LeaderboardEntry = {
      id: 'current-user',
      username: currentUsername,
      totalPoints: profile.totalPoints,
      quizzesCompleted: profile.totalQuizzes,
      accuracy: userAccuracy,
      highestScore: profile.highestScore,
      isCurrentUser: true,
      avatarSeed: currentUsername.slice(0, 2).toUpperCase(),
      lastActive: 'Just now',
    };

    if (existingIndex >= 0) {
      list[existingIndex] = userEntry;
    } else {
      list.push(userEntry);
    }
  }

  // Sort by points descending by default
  list.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  return list.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isCurrentUser:
      entry.username.toLowerCase() === currentUsername.toLowerCase(),
  }));
}

function syncUserToLeaderboard(profile: UserProfile) {
  const currentUsername = profile.username;
  const userAccuracy =
    profile.totalQuestionsAnswered > 0
      ? Math.round((profile.totalCorrect / profile.totalQuestionsAnswered) * 100)
      : 0;

  ['all-time', 'weekly'].forEach((type) => {
    const key = type === 'all-time' ? LEADERBOARD_ALLTIME_KEY : LEADERBOARD_WEEKLY_KEY;
    const raw = localStorage.getItem(key);
    let list: LeaderboardEntry[] = raw ? JSON.parse(raw) : getInitialLeaderboard();

    const existingIndex = list.findIndex(
      (e) => e.username.toLowerCase() === currentUsername.toLowerCase()
    );
    const userEntry: LeaderboardEntry = {
      id: 'current-user',
      username: currentUsername,
      totalPoints: profile.totalPoints,
      quizzesCompleted: profile.totalQuizzes,
      accuracy: userAccuracy,
      highestScore: profile.highestScore,
      isCurrentUser: true,
      avatarSeed: currentUsername.slice(0, 2).toUpperCase(),
      lastActive: 'Just now',
    };

    if (existingIndex >= 0) {
      list[existingIndex] = userEntry;
    } else {
      list.push(userEntry);
    }

    list.sort((a, b) => b.totalPoints - a.totalPoints);
    localStorage.setItem(key, JSON.stringify(list));
  });
}

function updateLeaderboardUsername(newUsername: string) {
  ['all-time', 'weekly'].forEach((type) => {
    const key = type === 'all-time' ? LEADERBOARD_ALLTIME_KEY : LEADERBOARD_WEEKLY_KEY;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const list: LeaderboardEntry[] = JSON.parse(raw);
      const userItem = list.find((e) => e.id === 'current-user' || e.isCurrentUser);
      if (userItem) {
        userItem.username = newUsername;
        userItem.avatarSeed = newUsername.slice(0, 2).toUpperCase();
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  });
}
