export default function ScoringPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-2xl">
        <a href="/" className="text-neutral-400 hover:text-white text-sm mb-8 inline-block">
          ← Coloured
        </a>

        <h1 className="text-3xl font-bold mb-2">How Scoring Works</h1>
        <p className="text-neutral-500 text-sm mb-8">Updated Apr 2026</p>

        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed">
          <p className="text-neutral-400">It&apos;s more complicated than you might think.</p>

          <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-base">The short version</h2>
            <p>
              We don&apos;t just compare slider values. Both colors are converted into a color space designed to match human vision, then the distance between them is measured using <span className="text-white font-medium">CIEDE2000</span> — a formula from color science that quantifies how different two colors look, not how far apart their numbers are.
            </p>
            <p>
              Five rounds, 0–10 per round, max 50.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base">Why not just compare the slider values?</h2>
            <p>
              The game picker uses three sliders: Hue, Saturation, and Brightness (HSB). A scoring system based on raw slider math would reward and punish the wrong things because human eyes don&apos;t see color the way numbers work. The same numerical difference on a slider can look dramatic or invisible depending on context. So we use color science instead.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base">The Scoring Pipeline</h2>
            <p>Four stages: convert to a perceptual color space, measure distance, shape it into a score, then adjust for hue accuracy.</p>

            <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">1. Color Space Conversion</h3>
              <p>Both colors are converted from HSB to <span className="text-white">CIELAB</span> — a color model specifically designed so that equal distances correspond to equal perceived differences.</p>
              <ul className="space-y-2 text-neutral-400">
                <li><span className="text-white font-medium">L*</span> — Lightness (0 is black, 100 is white)</li>
                <li><span className="text-white font-medium">a*</span> — Green-Red axis</li>
                <li><span className="text-white font-medium">b*</span> — Blue-Yellow axis</li>
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">2. Measuring the Difference</h3>
              <p>With both colors in CIELAB, we measure the perceptual distance using <span className="text-white">CIEDE2000</span> — the most accurate Delta E formula in color science.</p>
              <ul className="space-y-2 text-neutral-400">
                <li><span className="text-white">&lt;1</span> — Imperceptible to most people</li>
                <li><span className="text-white">1–5</span> — Slight difference, noticeable if you look closely</li>
                <li><span className="text-white">5–15</span> — Clearly not the same color</li>
                <li><span className="text-white">15–50</span> — Wrong color family entirely</li>
                <li><span className="text-white">50+</span> — Unrelated colors</li>
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">3. Turning Distance into a Score</h3>
              <p>An S-shaped curve that&apos;s generous for close matches, punishing for misses, and steepest in the middle:</p>
              <code className="block bg-neutral-950 px-4 py-3 rounded-lg text-neutral-400 text-xs">
                base = 10 / (1 + (dE / 25.25)^1.55)
              </code>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">4. Rewarding Color Memory</h3>
              <p>If you got the hue right (within ~25°), you earn back some points lost from saturation or brightness errors. If your hue is off by more than 30°, you take a light penalty — but only on vivid colors where that difference is visible.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base">What Changed (Apr 2026)</h2>
            <p>
              The game originally used <span className="text-white">CIE76</span> (from 1976), the simplest Delta E formula. It worked, but it didn&apos;t treat all colors equally. A 20° hue shift on green produced a CIE76 distance 3× larger than the same shift on blue. Greens, purples, and cyans were scored unfairly harshly.
            </p>
            <p>
              We switched to <span className="text-white">CIEDE2000</span>, which corrects for this. The S-curve midpoint moved from 38 (CIE76 scale) to 25.25 (CIEDE2000 scale), and hue adjustments were reduced because CIEDE2000 already handles cross-region fairness.
            </p>
          </div>
        </div>

        <a
          href="/"
          className="mt-10 inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Back to Game
        </a>
      </div>
    </div>
  );
}
