/**
 * Question tracker that tracks recently served question IDs
 * to guarantee users get fresh, different questions every time.
 */

const SEEN_QUESTIONS_KEY_PREFIX = 'quizverse_seen_questions_';

export function getRecentlySeenQuestionIds(subjectId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(`${SEEN_QUESTIONS_KEY_PREFIX}${subjectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordSeenQuestionIds(subjectId: string, questionIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentlySeenQuestionIds(subjectId);
    // Keep up to 50 recent IDs in memory
    const updated = Array.from(new Set([...existing, ...questionIds])).slice(-50);
    sessionStorage.setItem(`${SEEN_QUESTIONS_KEY_PREFIX}${subjectId}`, JSON.stringify(updated));
  } catch {
    // sessionStorage full or disabled
  }
}

export function clearSeenQuestions(subjectId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (subjectId) {
      sessionStorage.removeItem(`${SEEN_QUESTIONS_KEY_PREFIX}${subjectId}`);
    } else {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(SEEN_QUESTIONS_KEY_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch {
    // ignore
  }
}
