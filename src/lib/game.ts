export interface HSB {
  h: number;
  s: number;
  b: number;
}

export interface ColorResult {
  original: HSB;
  guess: HSB;
  score: number;
}

export type GameMode = "solo" | "multiplayer" | "daily";

export type GamePhase = "menu" | "memorize" | "recreate" | "results";

export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  colors: HSB[];
  results: ColorResult[];
  currentIndex: number;
  playerName: string;
  gameId?: string;
  difficulty: "easy" | "hard";
  timeLimit: number;
}

export function hsbToRgb(hsb: HSB): [number, number, number] {
  const h = hsb.h / 360;
  const s = hsb.s / 100;
  const b = hsb.b / 100;

  let r: number, g: number, bl: number;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = b * (1 - s);
  const q = b * (1 - f * s);
  const t = b * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = b; g = t; bl = p; break;
    case 1: r = q; g = b; bl = p; break;
    case 2: r = p; g = b; bl = t; break;
    case 3: r = p; g = q; bl = b; break;
    case 4: r = t; g = p; bl = b; break;
    case 5: r = b; g = p; bl = q; break;
    default: r = 0; g = 0; bl = 0;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(bl * 255)];
}

export function hsbToHex(hsb: HSB): string {
  const [r, g, b] = hsbToRgb(hsb);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function hsbToString(hsb: HSB): string {
  return `H${Math.round(hsb.h)} S${Math.round(hsb.s)} B${Math.round(hsb.b)}`;
}

export function calculateDistance(a: HSB, b: HSB): number {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180;
  const ds = Math.abs(a.s - b.s) / 100;
  const db = Math.abs(a.b - b.b) / 100;
  return Math.sqrt(dh * dh + ds * ds + db * db) / Math.sqrt(3);
}

export function calculateScore(distance: number): number {
  return Math.max(0, Math.round((1 - distance) * 1000));
}

export function generateRandomColor(hard: boolean): HSB {
  if (hard) {
    return {
      h: Math.random() * 360,
      s: 20 + Math.random() * 80,
      b: 20 + Math.random() * 80,
    };
  }
  return {
    h: Math.random() * 360,
    s: 40 + Math.random() * 60,
    b: 40 + Math.random() * 60,
  };
}

export function generateColors(count: number, hard: boolean): HSB[] {
  return Array.from({ length: count }, () => generateRandomColor(hard));
}

export function generateDailyColors(): HSB[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const rand = (min: number, max: number, offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  return Array.from({ length: 5 }, (_, i) => ({
    h: rand(0, 360, i * 3),
    s: rand(30, 90, i * 3 + 1),
    b: rand(30, 90, i * 3 + 2),
  }));
}

export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatScore(total: number): string {
  return `${(total / 10).toFixed(2)}`;
}
