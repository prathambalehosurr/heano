export default function ScoringPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-md">
        <a href="/" className="text-neutral-400 hover:text-white text-sm mb-8 inline-block">
          ← Dialed
        </a>

        <h1 className="text-3xl font-bold mb-2">Scoring</h1>
        <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
          How your color recall is measured.
        </p>

        <div className="space-y-6 text-neutral-300 text-sm">
          <p>
            Each color is scored on a scale of 0 to 1000 based on how close your guess is to the original.
          </p>

          <p>
            The score is calculated using the distance in HSB (Hue, Saturation, Brightness) color space between the original color and your guess.
          </p>

          <div className="bg-neutral-900 rounded-xl p-5 space-y-3">
            <h2 className="text-white font-semibold">Score Breakdown</h2>
            <ul className="space-y-2">
              <li><span className="text-white font-medium">500–1000:</span> Excellent recall</li>
              <li><span className="text-white font-medium">250–500:</span> Good approximation</li>
              <li><span className="text-white font-medium">100–250:</span> Somewhat close</li>
              <li><span className="text-white font-medium">0–100:</span> Way off</li>
            </ul>
          </div>

          <p>
            Your total score is the sum of all 5 color scores, displayed as <span className="text-white font-mono">X.XX/50</span> (total divided by 10).
          </p>

          <p className="text-neutral-500">
            Hard mode generates colors with a wider range of saturation and brightness, making them harder to recall.
          </p>
        </div>

        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Back to Game
        </a>
      </div>
    </div>
  );
}
