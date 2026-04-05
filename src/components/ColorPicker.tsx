"use client";

import { useState, useCallback } from "react";
import { HSB, hsbToHex, hsbToString } from "@/lib/game";

interface ColorPickerProps {
  onSubmit: (guess: HSB) => void;
  index: number;
}

export function ColorPicker({ onSubmit, index }: ColorPickerProps) {
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(80);
  const [brightness, setBrightness] = useState(90);

  const currentColor: HSB = { h: hue, s: saturation, b: brightness };

  const handleSubmit = useCallback(() => {
    onSubmit({ h: hue, s: saturation, b: brightness });
  }, [hue, saturation, brightness, onSubmit]);

  return (
    <div className="space-y-8">
      <div
        className="w-full h-48 rounded-xl shadow-lg mx-auto"
        style={{ backgroundColor: hsbToHex(currentColor) }}
      />

      <div className="text-center text-sm text-neutral-400 font-mono">
        {hsbToString(currentColor)}
      </div>

      <div className="space-y-6">
        <Slider
          label="Hue"
          value={hue}
          min={0}
          max={360}
          onChange={setHue}
          gradient="linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))"
        />
        <Slider
          label="Saturation"
          value={saturation}
          min={0}
          max={100}
          onChange={setSaturation}
          gradient="linear-gradient(to right, hsl(0,0%,50%), hsl(0,100%,50%))"
        />
        <Slider
          label="Brightness"
          value={brightness}
          min={0}
          max={100}
          onChange={setBrightness}
          gradient="linear-gradient(to right, #000, #fff)"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-lg"
      >
        Submit
      </button>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  gradient: string;
}

function Slider({ label, value, min, max, onChange, gradient }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-500 font-mono">{Math.round(value)}</span>
      </div>
      <div className="relative">
        <div
          className="h-8 rounded-lg w-full"
          style={{ background: gradient }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
