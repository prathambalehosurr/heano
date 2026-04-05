export interface HighScore {
  name: string;
  score: number;
  mode: string;
  date: string;
}

const STORAGE_KEY = "color-game-scores";

export function saveScore(score: HighScore): void {
  const scores = getScores();
  scores.push(score);
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 50)));
}

export function getScores(): HighScore[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getHighScore(): number {
  const scores = getScores();
  return scores.length > 0 ? scores[0].score : 0;
}
