import { motion } from "motion/react";

interface SkillBar {
  name: string;
  icon: string;
  pct: number;
  fromLevel: number;
  toLevel: number;
  colorClass: string;
  gradientFrom: string;
  gradientTo: string;
}

interface Props {
  scores: {
    pronunciation: number;
    rhythm: number;
    intonation: number;
    fluency: number;
  };
}

function levelFromPct(pct: number): number {
  return Math.floor(pct / 20) + 1;
}

export function SkillProgressBars({ scores }: Props) {
  const bars: SkillBar[] = [
    {
      name: "Pronunciation",
      icon: "🗣️",
      pct: Math.min(100, scores.pronunciation),
      fromLevel: levelFromPct(scores.pronunciation),
      toLevel: Math.min(6, levelFromPct(scores.pronunciation) + 1),
      colorClass: "text-purple-400",
      gradientFrom: "from-purple-600",
      gradientTo: "to-violet-400",
    },
    {
      name: "Rhythm",
      icon: "🎵",
      pct: Math.min(100, scores.rhythm),
      fromLevel: levelFromPct(scores.rhythm),
      toLevel: Math.min(6, levelFromPct(scores.rhythm) + 1),
      colorClass: "text-cyan-400",
      gradientFrom: "from-cyan-600",
      gradientTo: "to-sky-400",
    },
    {
      name: "Intonation",
      icon: "🎶",
      pct: Math.min(100, scores.intonation),
      fromLevel: levelFromPct(scores.intonation),
      toLevel: Math.min(6, levelFromPct(scores.intonation) + 1),
      colorClass: "text-indigo-400",
      gradientFrom: "from-indigo-600",
      gradientTo: "to-blue-400",
    },
    {
      name: "Fluency",
      icon: "⚡",
      pct: Math.min(100, scores.fluency),
      fromLevel: levelFromPct(scores.fluency),
      toLevel: Math.min(6, levelFromPct(scores.fluency) + 1),
      colorClass: "text-emerald-400",
      gradientFrom: "from-emerald-600",
      gradientTo: "to-teal-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <span>📊</span> Skill Progress
      </h3>
      {bars.map((bar) => (
        <div key={bar.name} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
              <span>{bar.icon}</span> {bar.name}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${bar.colorClass}`}>
                Level {bar.fromLevel} → Level {bar.toLevel}
              </span>
              <span className={`text-xs font-bold ${bar.colorClass}`}>
                {bar.pct.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${bar.gradientFrom} ${bar.gradientTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
