import React, { useState } from "react";

const SIGNAL_CONFIG = {
  buying_interest: {
    label: "Buying Interest",
    borderColor: "#10b981",
    bgColor: "rgba(6, 78, 59, 0.15)",
    badgeColor: "#10b981",
    badgeBg: "rgba(6, 78, 59, 0.3)",
    icon: "🟢",
  },
  objection: {
    label: "Objection",
    borderColor: "#ef4444",
    bgColor: "rgba(127, 29, 29, 0.15)",
    badgeColor: "#f87171",
    badgeBg: "rgba(127, 29, 29, 0.3)",
    icon: "🔴",
  },
  confusion: {
    label: "Confusion",
    borderColor: "#f59e0b",
    bgColor: "rgba(120, 53, 15, 0.15)",
    badgeColor: "#fbbf24",
    badgeBg: "rgba(120, 53, 15, 0.3)",
    icon: "🟡",
  },
  stalling: {
    label: "Stalling",
    borderColor: "#3b82f6",
    bgColor: "rgba(30, 58, 138, 0.15)",
    badgeColor: "#60a5fa",
    badgeBg: "rgba(30, 58, 138, 0.3)",
    icon: "🔵",
  },
  positive_engagement: {
    label: "Positive Engagement",
    borderColor: "#14b8a6",
    bgColor: "rgba(19, 78, 74, 0.15)",
    badgeColor: "#2dd4bf",
    badgeBg: "rgba(19, 78, 74, 0.3)",
    icon: "✅",
  },
};

const TEST_TRANSCRIPT = `Rep: Pricing is $499/seat/month.
Prospect: That seems steep. We pay under $200 currently.
Rep: If your team closes one extra deal per quarter, it pays for itself 10x.
Prospect: Send me a pricing deck and I'll get back to you.`;

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysed, setAnalysed] = useState(false);

  const analyse = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setSignals([]);
    setAnalysed(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSignals(data.signals || []);
      setAnalysed(true);
    } catch (e) {
      setError(e.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const loadTest = () => setTranscript(TEST_TRANSCRIPT);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-[#e8e4dc]">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <header className="mb-12">
          <span className="inline-block text-[11px] font-medium tracking-widest uppercase text-emerald-500 border border-emerald-600 px-3 py-1 rounded-full mb-5">
            AI Sales Coach
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#f0ece4] mb-4">
            Read every<br />
            <span className="text-emerald-500">signal.</span>
          </h1>
          <p className="text-[#7a8a9a] text-base font-light leading-relaxed">
            Paste a sales call transcript. Get AI-detected buying signals,
            objections, and one-line coaching tips — instantly.
          </p>
        </header>

        {/* Input card */}
        <div className="bg-[#13192b] border border-[#1e2a3a] rounded-2xl p-7 mb-4">
          <label className="block text-[11px] font-medium tracking-widest uppercase text-[#4a6080] mb-3">
            Transcript
          </label>
          <textarea
            className="w-full min-h-[200px] bg-[#0b0f1a] border border-[#1e2a3a] rounded-xl text-[#e8e4dc] text-sm leading-relaxed p-4 resize-y"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={"Rep: Hello, thanks for joining today…\nProspect: Sure, I've been looking at a few options…"}
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-3 mt-4 items-center">
            <button
              onClick={analyse}
              disabled={loading || !transcript.trim()}
              className="flex-1 min-w-[160px] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors duration-200"
            >
              {loading ? "Analysing…" : "Analyse Transcript →"}
            </button>
            <button
              onClick={loadTest}
              className="text-[#4a6080] hover:text-[#c8d4e0] border border-[#1e2a3a] hover:border-[#4a6080] text-sm px-5 py-3 rounded-xl transition-all duration-200 bg-transparent"
            >
              Load test transcript
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-5 py-4 text-red-400 text-sm mb-4">
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-[#4a6080]">
            <div className="flex justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-300" />
            </div>
            <p className="text-sm mt-4">Reading the room…</p>
          </div>
        )}

        {/* Results */}
        {analysed && signals.length > 0 && (
          <>
            <hr className="border-[#1e2a3a] my-8" />
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4a6080] mb-5">
              {signals.length} signal{signals.length !== 1 ? "s" : ""} detected
            </p>

            <div className="flex flex-col gap-3">
              {signals.map((s, i) => {
                const cfg = SIGNAL_CONFIG[s.type] || SIGNAL_CONFIG["buying_interest"];
                return (
                  <div
                    key={i}
                    style={{
                      borderLeft: `4px solid ${cfg.borderColor}`,
                      backgroundColor: cfg.bgColor,
                      border: `1px solid ${cfg.borderColor}40`,
                      borderLeftWidth: "4px",
                      borderLeftColor: cfg.borderColor,
                    }}
                    className="rounded-xl px-5 py-5"
                  >
                    {/* Badge */}
                    <div className="mb-3">
                      <span
                        style={{
                          color: cfg.badgeColor,
                          backgroundColor: cfg.badgeBg,
                          border: `1px solid ${cfg.borderColor}60`,
                        }}
                        className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-[#c8d4e0] text-sm italic leading-relaxed mb-3">
                      "{s.quote}"
                    </p>

                    {/* Tip */}
                    <p className="text-[#7a8a9a] text-xs leading-relaxed flex gap-2 items-start">
                      <span className="mt-0.5 shrink-0">💡</span>
                      {s.tip}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {analysed && signals.length === 0 && (
          <>
            <hr className="border-[#1e2a3a] my-8" />
            <p className="text-[#4a6080] text-center text-sm">
              No strong signals detected. Try a longer transcript.
            </p>
          </>
        )}
      </div>
    </div>
  );
}