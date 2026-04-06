export interface HSB {
  h: number;
  s: number;
  b: number;
}

export interface ColorResult {
  original: HSB;
  guess: HSB;
  score: number;
  baseScore: number;
  hueRecovery: number;
  huePenalty: number;
  deltaE: number;
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

// ─── Color Space Conversions ───────────────────────────────────────

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

export function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  rr *= 100;
  gg *= 100;
  bb *= 100;

  const x = rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375;
  const y = rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750;
  const z = rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041;

  return [x, y, z];
}

export function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  let xx = x / xn;
  let yy = y / yn;
  let zz = z / zn;

  const epsilon = 0.008856;
  const kappa = 903.3;

  xx = xx > epsilon ? Math.cbrt(xx) : (kappa * xx + 16) / 116;
  yy = yy > epsilon ? Math.cbrt(yy) : (kappa * yy + 16) / 116;
  zz = zz > epsilon ? Math.cbrt(zz) : (kappa * zz + 16) / 116;

  const L = 116 * yy - 16;
  const a = 500 * (xx - yy);
  const b = 200 * (yy - zz);

  return [L, a, b];
}

export function hsbToLab(hsb: HSB): [number, number, number] {
  const [r, g, b] = hsbToRgb(hsb);
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

// ─── CIEDE2000 Delta E ────────────────────────────────────────────

export function ciede2000(lab1: [number, number, number], lab2: [number, number, number]): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  let h1p = Math.atan2(b1, a1p) * (180 / Math.PI);
  if (h1p < 0) h1p += 360;
  let h2p = Math.atan2(b2, a2p) * (180 / Math.PI);
  if (h2p < 0) h2p += 360;

  const avgLp2 = (L1 + L2) / 2;
  const avgCp = (C1p + C2p) / 2;

  let avghp: number;
  if (Math.abs(h1p - h2p) <= 180) {
    avghp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    avghp = (h1p + h2p + 360) / 2;
  } else {
    avghp = (h1p + h2p - 360) / 2;
  }

  const T = 1
    - 0.17 * Math.cos((avghp - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * avghp) * Math.PI / 180)
    + 0.32 * Math.cos((3 * avghp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * avghp - 63) * Math.PI / 180);

  let dhp = h2p - h1p;
  if (Math.abs(dhp) > 180) {
    if (h2p <= h1p) dhp += 360;
    else dhp -= 360;
  }

  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * Math.PI / 180);

  const SL = 1 + (0.015 * Math.pow(avgLp2 - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp2 - 50, 2));
  const SC = 1 + 0.045 * avgCp;
  const SH = 1 + 0.015 * avgCp * T;

  const dTheta = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const RT = -Math.sin((2 * dTheta) * Math.PI / 180) * RC;

  const dE = Math.sqrt(
    Math.pow(dLp / SL, 2) +
    Math.pow(dCp / SC, 2) +
    Math.pow(dHp / SH, 2) +
    RT * (dCp / SC) * (dHp / SH)
  );

  return dE;
}

// ─── Scoring Pipeline ─────────────────────────────────────────────

export function calculateScore(original: HSB, guess: HSB): {
  score: number;
  base: number;
  hueRecovery: number;
  huePenalty: number;
  deltaE: number;
} {
  const lab1 = hsbToLab(original);
  const lab2 = hsbToLab(guess);

  const deltaE = ciede2000(lab1, lab2);

  // S-curve: base score
  const base = 10 / (1 + Math.pow(deltaE / 25.25, 1.55));

  // Hue difference (circular)
  const hueDiff = Math.min(Math.abs(original.h - guess.h), 360 - Math.abs(original.h - guess.h));

  // Hue recovery
  const hueAccuracy = Math.max(0, 1 - Math.pow(hueDiff / 25, 1.5));
  const avgSat = (original.s + guess.s) / 2;
  const satWeightRecovery = Math.min(1, avgSat / 30);
  const hueRecovery = (10 - base) * hueAccuracy * satWeightRecovery * 0.25;

  // Hue penalty
  const huePenFactor = Math.max(0, (hueDiff - 30) / 150);
  const satWeightPenalty = Math.min(1, avgSat / 40);
  const huePenalty = base * huePenFactor * satWeightPenalty * 0.15;

  // Final score clamped 0-10
  const score = Math.max(0, Math.min(10, base + hueRecovery - huePenalty));

  return {
    score: Math.round(score * 100) / 100,
    base: Math.round(base * 100) / 100,
    hueRecovery: Math.round(hueRecovery * 100) / 100,
    huePenalty: Math.round(huePenalty * 100) / 100,
    deltaE: Math.round(deltaE * 10) / 10,
  };
}

// ─── Utilities ─────────────────────────────────────────────────────

export function hsbToHex(hsb: HSB): string {
  const [r, g, b] = hsbToRgb(hsb);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function hsbToString(hsb: HSB): string {
  return `H${Math.round(hsb.h)} S${Math.round(hsb.s)} B${Math.round(hsb.b)}`;
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
