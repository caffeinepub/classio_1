import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const LEVEL_BADGES = [
  { min: 80, label: "⭐ Master Reader", cls: "text-violet-300" },
  { min: 65, label: "🏆 Advanced", cls: "text-blue-300" },
  { min: 50, label: "📈 Developing", cls: "text-teal-300" },
  { min: 35, label: "🌱 Growing", cls: "text-amber-300" },
  { min: 0, label: "🔰 Beginner", cls: "text-red-300" },
];

function getBadge(score: number | null) {
  if (score === null) return LEVEL_BADGES[LEVEL_BADGES.length - 1];
  return (
    LEVEL_BADGES.find((b) => score >= b.min) ??
    LEVEL_BADGES[LEVEL_BADGES.length - 1]
  );
}

interface Props {
  startScore: number | null;
  currentScore: number | null;
  grade: number;
  username: string;
}

export function MonthlyProgressReport({
  startScore,
  currentScore,
  grade,
  username,
}: Props) {
  const startBadge = getBadge(startScore);
  const currentBadge = getBadge(currentScore);

  const skillsMastered = [
    currentScore !== null && currentScore >= 60
      ? "Reading Comprehension"
      : null,
    currentScore !== null && currentScore >= 55
      ? "Vocabulary Recognition"
      : null,
    currentScore !== null && currentScore >= 65
      ? "Pronunciation Clarity"
      : null,
  ].filter(Boolean) as string[];

  const areasToImprove = [
    currentScore === null || currentScore < 70 ? "Reading Fluency" : null,
    currentScore === null || currentScore < 65 ? "Comprehension Depth" : null,
    currentScore === null || currentScore < 75 ? "Intonation & Rhythm" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>📋</span> Monthly Progress Report
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 text-xs h-7"
          onClick={() => window.print()}
          data-ocid="report.print_button"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Report
        </Button>
      </div>

      <div
        id="monthly-report-printable"
        className="print:fixed print:inset-0 print:z-50 print:bg-white print:p-8"
      >
        <div className="mb-3 pb-3 border-b border-slate-700/50 print:border-gray-200">
          <p className="text-xs text-slate-400 print:text-gray-600">
            Student:{" "}
            <span className="font-semibold text-white print:text-black">
              {username}
            </span>
            {" · "}
            Grade {grade} ·{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/50 p-4 print:border-gray-200 print:bg-gray-50">
            <p className="text-xs text-slate-500 mb-1 print:text-gray-500">
              Starting Level
            </p>
            <p
              className={`text-base font-bold ${startBadge.cls} print:text-gray-900`}
            >
              {startBadge.label}
            </p>
            <p className="text-xs text-slate-500 mt-1 print:text-gray-500">
              Score: {startScore !== null ? `${startScore}%` : "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 print:border-indigo-200 print:bg-indigo-50">
            <p className="text-xs text-slate-500 mb-1 print:text-gray-500">
              Current Level
            </p>
            <p
              className={`text-base font-bold ${currentBadge.cls} print:text-gray-900`}
            >
              {currentBadge.label}
            </p>
            <p className="text-xs text-slate-500 mt-1 print:text-gray-500">
              Score: {currentScore !== null ? `${currentScore}%` : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-400 print:text-emerald-700">
              ✅ Skills Mastered
            </p>
            {skillsMastered.length > 0 ? (
              skillsMastered.map((s) => (
                <p
                  key={s}
                  className="text-xs text-slate-300 flex items-center gap-1.5 print:text-gray-700"
                >
                  <span className="text-emerald-400">✓</span> {s}
                </p>
              ))
            ) : (
              <p className="text-xs text-slate-500 print:text-gray-400">
                Keep practicing to unlock mastered skills
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-400 print:text-amber-700">
              🎯 Areas to Improve
            </p>
            {areasToImprove.map((s) => (
              <p
                key={s}
                className="text-xs text-slate-300 flex items-center gap-1.5 print:text-gray-700"
              >
                <span className="text-amber-400">→</span> {s}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
