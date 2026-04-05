export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Privacy</h1>

        <div className="space-y-4 text-neutral-300 text-sm">
          <p>
            We collect minimal data to run the game and display leaderboards.
          </p>

          <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">What we store</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Your display name (only if you enter it)</li>
              <li>Game scores for leaderboard display</li>
              <li>Local storage for your high scores</li>
            </ul>
          </div>

          <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">What we don&apos;t store</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Personal identifiers</li>
              <li>Tracking cookies</li>
              <li>Analytics data</li>
            </ul>
          </div>

          <p className="text-neutral-500">
            All game logic runs client-side. No data is sent to servers except when you explicitly submit a score.
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
