export function shareScore(score: number, mode: string): void {
  const text = `I scored ${(score / 10).toFixed(2)}/50 on the color memory game! Can you beat me?`;

  if (navigator.share) {
    navigator.share({
      title: "Color Game Score",
      text,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
