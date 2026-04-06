"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { HSB, hsbToHex, hsbToString } from "@/lib/game";

interface ColorPickerProps {
  onSubmit: (guess: HSB) => void;
  index: number;
  timeLeft: number;
}

export function ColorPicker({ onSubmit, index, timeLeft }: ColorPickerProps) {
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(80);
  const [brightness, setBrightness] = useState(90);
  const prevTimeLeft = useRef(timeLeft);

  const currentColor: HSB = { h: hue, s: saturation, b: brightness };

  const handleSubmit = useCallback(() => {
    onSubmit({ h: hue, s: saturation, b: brightness });
  }, [hue, saturation, brightness, onSubmit]);

  useEffect(() => {
    if (prevTimeLeft.current === 1 && timeLeft === 0) {
      onSubmit({ h: hue, s: saturation, b: brightness });
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, hue, saturation, brightness, onSubmit]);

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center fade-in">
      {/* Timer & Round Info */}
      <div className="md:col-span-12 flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase tracking-widest font-medium text-on-surface-variant">
          Round {index + 1} of 5
        </span>
        <span
          className={`text-2xl font-black tabular-nums transition-colors duration-300 ${
            timeLeft <= 5
              ? "text-red-500 animate-pulse"
              : "text-on-surface"
          }`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Swatch Display */}
      <div className="md:col-span-7 flex flex-col items-center md:items-start space-y-6">
        <div className="relative group">
          <div
            className="w-64 h-64 md:w-96 md:h-96 rounded-xl transition-all duration-75"
            style={{
              backgroundColor: hsbToHex(currentColor),
              boxShadow: `0 0 60px -15px ${hsbToHex(currentColor)}80`,
            }}
          />
          {/* Label Overlay */}
          <div className="absolute -bottom-4 -right-4 bg-surface-container-highest px-4 py-2 rounded-lg backdrop-blur-xl border border-outline-variant/10 shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
              Your Match
            </span>
          </div>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none mb-2 uppercase">
            Color {index + 1}
          </h1>
          <p className="text-on-surface-variant text-sm tracking-wide opacity-60 font-mono mt-2">
            H: {Math.round(hue)}° &nbsp; S: {Math.round(saturation)}% &nbsp; B:{" "}
            {Math.round(brightness)}%
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="md:col-span-5 flex flex-col space-y-12 bg-surface-container-low p-8 rounded-xl relative shadow-2xl">
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-primary/5"></div>

        <div className="space-y-10">
          <Slider label="Hue" value={hue} min={0} max={360} onChange={setHue} />
          <Slider
            label="Saturation"
            value={saturation}
            min={0}
            max={100}
            onChange={setSaturation}
          />
          <Slider
            label="Brightness"
            value={brightness}
            min={0}
            max={100}
            onChange={setBrightness}
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="relative group w-full py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.3em] overflow-hidden bg-surface-container-highest border border-outline-variant/30 hover:border-primary transition-colors"
          >
            <div className="absolute inset-0 bg-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative text-on-surface group-hover:text-on-primary-container z-10 transition-colors">
              Submit Match
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, onChange }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
          {label}
        </label>
        <span className="text-[10px] font-mono text-on-surface-variant opacity-40">
          {Math.round(value)}
        </span>
      </div>
      <div className="relative">
        <div className="h-[2px] bg-surface-high rounded-full w-full"></div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -translate-y-[7px]"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#e2e2e2] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
