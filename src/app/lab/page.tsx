export default function LabPage() {
  const studies = [
    {
      category: "Scoring & Color",
      items: [
        { tag: "Scoring", title: "Scoring & Color Range Study", desc: "Interactive tool for exploring the scoring curve, Delta E calculations, and color generation range." },
        { tag: "Scoring", title: "Current System vs CIEDE2000", desc: "Side-by-side comparison of the CIE76 sigmoid scoring vs CIEDE2000 perceptual distance." },
      ],
    },
    {
      category: "Sound",
      items: [
        { tag: "Design", title: "Sound — Results Screen", desc: "Layout options for solo and multiplayer results. Names, scores, round breakdowns." },
        { tag: "Audit", title: "Sharing Comparison", desc: "Side-by-side audit of OG images, share text, and daily share." },
        { tag: "Design", title: "Audio Gate Study", desc: "12 approaches to the \"turn your sound on\" overlay." },
      ],
    },
    {
      category: "Game Design",
      items: [
        { tag: "Design", title: "Challenge Intro", desc: "A/B variants for the multiplayer challenge intro screen." },
        { tag: "Design", title: "Share Challenge Flow", desc: "Share link generation, copy UX, and the viral challenge loop design." },
        { tag: "Design", title: "Daily Mode — Results, Share, Leaderboard", desc: "Screen designs for daily challenge results and daily leaderboard." },
        { tag: "Growth", title: "OG Copy & Personalization", desc: "Provocative vs competitive vs neutral copy for social sharing previews." },
        { tag: "Growth", title: "Dynamic OG Image Options", desc: "Variations of the auto-generated social preview image." },
        { tag: "Growth", title: "Retention Study", desc: "Analysis of return rate, session depth, and what drives players to come back." },
      ],
    },
    {
      category: "UI Components",
      items: [
        { tag: "Component", title: "Button Study", desc: "Primary and secondary button styles, hover states, and size variants." },
        { tag: "Component", title: "Loader Study", desc: "Loading spinner options for leaderboard fetches and async states." },
        { tag: "Component", title: "Toast Study", desc: "Notification toast designs — success, error, info, and rainbow variants." },
      ],
    },
    {
      category: "Monetization",
      items: [
        { tag: "Monetization", title: "Ad Formats — Color", desc: "IAB ad size exploration for Ezoic." },
        { tag: "Monetization", title: "Consent Banner", desc: "7 consent banner options for Ezoic CMP." },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-2xl">
        <a href="/" className="text-neutral-400 hover:text-white text-sm mb-8 inline-block">
          ← DIALED
        </a>

        <h1 className="text-3xl font-bold mb-2">Lab Studies</h1>
        <p className="text-neutral-400 mb-10 text-sm leading-relaxed">
          Design explorations, prototypes, and component studies from the making of DIALED. Everything here started as a question.
        </p>

        {studies.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              {section.category}
            </h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href="#"
                  className="flex items-start gap-4 p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors group"
                >
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-800 px-2 py-1 rounded mt-0.5 shrink-0">
                    {item.tag}
                  </span>
                  <div className="min-w-0">
                    <div className="text-white font-medium group-hover:text-neutral-200">
                      {item.title}
                    </div>
                    <div className="text-neutral-500 text-sm mt-1">
                      {item.desc}
                    </div>
                  </div>
                  <span className="text-neutral-600 ml-auto shrink-0 text-lg">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <a href="/" className="text-neutral-400 hover:text-white text-sm mt-8 inline-block">
          ← DIALED
        </a>
      </div>
    </div>
  );
}
