export type SubjectId =
  | 'computer-fundamentals'
  | 'digital-electronics'
  | 'c-programming'
  | 'cpp'
  | 'python'
  | 'java'
  | 'dsa'
  | 'dbms'
  | 'operating-systems'
  | 'computer-networks'
  | 'ai-ml'
  | 'web-dev'
  | 'cybersecurity'
  | 'general-cs';

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  description: string;
  category: string;
}

export type StandardDifficulty =
  | 'Class 6–8'
  | 'Class 9–10'
  | 'Class 11–12'
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'College / B.Sc. Computer Science';

export interface Question {
  id: string;
  subject: SubjectId;
  standard: StandardDifficulty;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0=A, 1=B, 2=C, 3=D
  explanation: string;
  wrongExplanations?: Record<number, string>;
}

export type TimerOption = 'none' | '30s-per-q' | '60s-per-q' | '5m-total' | '10m-total';

export interface QuizConfig {
  subject: SubjectId | 'all';
  standard: StandardDifficulty;
  questionCount: number; // exactly 10
  timer: TimerOption;
  mode: GameMode;
}

export type GameMode = 'standard' | 'quick' | 'timed' | 'streak' | 'multiplayer';

export interface QuizResult {
  quizId: string;
  subjectName: string;
  standard: StandardDifficulty;
  mode: GameMode;
  questions: Question[];
  userAnswers: Record<number, number>; // questionIndex -> selectedOptionIndex (0-3) or -1 for unanswered
  score: number; // 0 to 10
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeTakenSeconds: number;
  pointsEarned: number;
  streakHigh: number;
  completedAt: string;
}

export interface QuizHistoryItem {
  id: string;
  subjectName: string;
  standard: StandardDifficulty;
  mode: GameMode;
  score: number;
  total: number;
  pointsEarned: number;
  date: string;
  timeTakenSeconds: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  username: string;
  avatarSeed: string;
  totalQuizzes: number;
  totalPoints: number;
  highestScore: number;
  totalCorrect: number;
  totalQuestionsAnswered: number;
  longestStreak: number;
  level: number;
  xp: number;
  badges: string[]; // badge IDs
  history: QuizHistoryItem[];
  subjectStats: Record<string, { played: number; correct: number; total: number }>;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalPoints: number;
  quizzesCompleted: number;
  accuracy: number;
  highestScore: number;
  rank?: number;
  isCurrentUser?: boolean;
  avatarSeed?: string;
  lastActive: string;
}

export interface MultiplayerPlayer {
  id: string;
  username: string;
  avatarSeed: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  currentAnswer?: number;
  answerTime?: number;
}

export interface MultiplayerRoom {
  code: string;
  hostId: string;
  hostUsername: string;
  subject: SubjectId | 'all';
  standard: StandardDifficulty;
  maxPlayers: number;
  status: 'lobby' | 'playing' | 'round_result' | 'finished';
  currentQuestionIndex: number;
  questions: Question[];
  players: MultiplayerPlayer[];
  timePerQuestion: number; // seconds
  createdAt: number;
}
