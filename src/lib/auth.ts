export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  mode: string;
  difficulty: string;
  date: string;
}

const USERS_KEY = "dialed-users";
const CURRENT_USER_KEY = "dialed-current-user";
const LEADERBOARD_KEY = "dialed-leaderboard";

export function registerUser(name: string, email: string, password: string): User | null {
  const users = getUsers();
  if (users.find((u) => u.email === email.toLowerCase())) {
    return null;
  }

  const user: User = {
    id: Math.random().toString(36).substring(2, 10),
    email: email.toLowerCase(),
    name,
    createdAt: new Date().toISOString(),
  };

  const passwords = getPasswords();
  passwords[user.id] = password;
  localStorage.setItem("dialed-passwords", JSON.stringify(passwords));

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  setCurrentUser(user);
  return user;
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers();
  const passwords = getPasswords();
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user || passwords[user.id] !== password) {
    return null;
  }

  setCurrentUser(user);
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getPasswords(): Record<string, string> {
  try {
    const data = localStorage.getItem("dialed-passwords");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  const entries = getLeaderboard();
  entries.push(entry);
  entries.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 100)));
}

export function getLeaderboard(filter?: { mode?: string; difficulty?: string }): LeaderboardEntry[] {
  let entries = getLeaderboardRaw();

  if (filter?.mode) {
    entries = entries.filter((e) => e.mode === filter.mode);
  }
  if (filter?.difficulty) {
    entries = entries.filter((e) => e.difficulty === filter.difficulty);
  }

  return entries;
}

function getLeaderboardRaw(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getUserBestScore(userId: string, mode?: string): number {
  const entries = getLeaderboardRaw();
  const filtered = entries.filter((e) => e.userId === userId && (!mode || e.mode === mode));
  return filtered.length > 0 ? filtered[0].score : 0;
}
