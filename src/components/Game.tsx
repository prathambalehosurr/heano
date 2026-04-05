"use client";

import { useState, useCallback, useEffect } from "react";
import {
  HSB,
  GameMode,
  GamePhase,
  ColorResult,
  hsbToHex,
  hsbToString,
  calculateDistance,
  calculateScore,
  generateColors,
  generateDailyColors,
  generateGameId,
  formatScore,
} from "@/lib/game";
import { ColorPicker } from "./ColorPicker";
import { MenuScreen } from "./MenuScreen";
import { MemorizeScreen } from "./MemorizeScreen";
import { ResultsScreen } from "./ResultsScreen";
import { saveScore, getHighScore } from "@/lib/scores";

export function Game() {
  const [mode, setMode] = useState<GameMode>("solo");
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [colors, setColors] = useState<HSB[]>([]);
  const [results, setResults] = useState<ColorResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("hard");
  const [timeLeft, setTimeLeft] = useState(0);

  const startGame = useCallback((gameMode: GameMode, name?: string, id?: string) => {
    let gameColors: HSB[];

    if (gameMode === "daily") {
      gameColors = generateDailyColors();
    } else {
      gameColors = generateColors(5, difficulty === "hard");
    }

    setMode(gameMode);
    setColors(gameColors);
    setResults([]);
    setCurrentIndex(0);
    setPlayerName(name || "");
    setGameId(id);
    setPhase("memorize");

    if (gameMode === "multiplayer") {
      setTimeLeft(300);
    } else {
      setTimeLeft(15);
    }
  }, [difficulty]);

  useEffect(() => {
    if (phase !== "memorize") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase("recreate");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const submitGuess = useCallback((guess: HSB) => {
    const original = colors[currentIndex];
    const distance = calculateDistance(original, guess);
    const score = calculateScore(distance);

    const result: ColorResult = { original, guess, score };
    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex + 1 < colors.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase("results");
    }
  }, [colors, currentIndex, results]);

  const resetGame = useCallback(() => {
    setPhase("menu");
    setColors([]);
    setResults([]);
    setCurrentIndex(0);
    setPlayerName("");
    setGameId(undefined);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalScore = results.reduce((sum: number, r: ColorResult) => sum + r.score, 0);
  const highScore = getHighScore();

  if (phase === "menu") {
    return (
      <MenuScreen
        onStart={startGame}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />
    );
  }

  if (phase === "memorize") {
    return (
      <MemorizeScreen
        colors={colors}
        timeLeft={timeLeft}
        formatTime={formatTime}
        mode={mode}
      />
    );
  }

  if (phase === "recreate") {
    return (
      <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">color</h2>
            <p className="text-neutral-500 text-sm">
              {currentIndex + 1} of {colors.length}
            </p>
          </div>

          <ColorPicker
            onSubmit={submitGuess}
            index={currentIndex}
          />
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        results={results}
        totalScore={totalScore}
        formattedScore={formatScore(totalScore)}
        mode={mode}
        playerName={playerName}
        gameId={gameId}
        onPlayAgain={resetGame}
        onStartNew={() => startGame(mode, playerName, gameId)}
      />
    );
  }

  return null;
}
