"use client";

import { use } from "react";
import { Game } from "@/components/Game";

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <Game gameId={id} />;
}
