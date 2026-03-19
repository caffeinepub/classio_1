import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Music, Printer, Volume2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { AppHeader } from "../components/AppHeader";
import {
  DonutChart,
  ReportingIndicatorsPanel,
  ScoreOverviewPanel,
  SkillCard,
  StarRating,
} from "../components/ReportCardLayout";
import { useAuth } from "../context/AuthContext";
import { useMyResults } from "../hooks/useQueries";

interface WeeklyReportProps {
  onNavigate: (page: string) => void;
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7,
  );
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const ACHIEVEMENTS = [
  {
    id: "vocab_champion",
    label: "Vocab Champion",
    emoji: "📚",
    check: (d: ReportData) => (d.vocabScore ?? 0) >= 4,
  },
  {
    id: "reading_star",
    label: "Reading Star",
    emoji: "⭐",
    check: (d: ReportData) => (d.practiceScore ?? 0) >= 4,
  },
  {
    id: "consistent_learner",
    label: "Consistent Learner",
    emoji: "🎯",
    check: (d: ReportData) => (d.weeklyTotal ?? 0) >= 7,
  },
  {
    id: "perfect_week",
    label: "Perfect Week",
    emoji: "🏆",
    check: (d: ReportData) => (d.weeklyTotal ?? 0) >= 9,
  },
];

const FLUENCY_RANGES: Record<number, string> = {
  1: "60–80 wpm",
  2: "70–100 wpm",
  3: "80–110 wpm",
  4: "90–120 wpm",
  5: "100–130 wpm",
  6: "110–140 wpm",
  7: "115–145 wpm",
  8: "120–150 wpm",
  9: "125–155 wpm",
  10: "130–160 wpm",
};

interface ReportData {
  vocabScore: number | null;
  practiceScore: number | null;
  weeklyVocab: number | null;
  weeklyComp: number | null;
  weeklyTotal: number | null;
  avgRhythm: number | null;
  avgIntonation: number | null;
  avgChunking: number | null;
  avgPronunciation: number | null;
}

export function WeeklyReport({ onNavigate }: WeeklyReportProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const { data: results } = useMyResults(userId);

  const todayKey = new Date().toISOString().split("T")[0];
  const practiceRaw = localStorage.getItem(
    `classio_practice_${userId}_${todayKey}`,
  );
  const weeklyRaw = localStorage.getItem(
    `classio_weekly_${userId}_${getWeekNumber()}`,
  );
  const grade = Number(user?.grade ?? 1n);
  const vocabRaw = localStorage.getItem(
    `classio_vocab_${userId}_${grade}_${todayKey}`,
  );

  const practiceData = practiceRaw ? JSON.parse(practiceRaw) : null;
  const weeklyData = weeklyRaw ? JSON.parse(weeklyRaw) : null;
  const vocabData = vocabRaw ? JSON.parse(vocabRaw) : null;

  let avgRhythm: number | null = null;
  let avgIntonation: number | null = null;
  let avgChunking: number | null = null;
  let avgPronunciation: number | null = null;
  const skillDataRaw = localStorage.getItem(`classio_skills_${userId}`);
  if (skillDataRaw) {
    const skillData = JSON.parse(skillDataRaw) as Record<string, number>;
    avgRhythm = skillData.rhythm ?? null;
    avgIntonation = skillData.intonation ?? null;
    avgChunking = skillData.chunking ?? null;
    avgPronunciation = skillData.pronunciation ?? null;
  } else if (results && results.length > 0) {
    const n = results.length;
    const avgScore =
      Math.round((results.reduce((s, r) => s + Number(r.score), 0) / n) * 10) /
      10;
    avgRhythm = avgScore;
    avgIntonation = avgScore;
    avgChunking = avgScore;
    avgPronunciation = avgScore;
  }

  const report: ReportData = {
    vocabScore: vocabData?.score ?? null,
    practiceScore: practiceData?.score ?? null,
    weeklyVocab: weeklyData?.vocabScore ?? null,
    weeklyComp: weeklyData?.comprehensionScore ?? null,
    weeklyTotal: weeklyData?.total ?? null,
    avgRhythm,
    avgIntonation,
    avgChunking,
    avgPronunciation,
  };

  // Derive reading & comprehension scores for display
  const readingScore = report.practiceScore ?? report.weeklyVocab;
  const comprehensionScore = report.weeklyComp;

  // Previous scores (simulate from results history if available)
  const prevReadingScore =
    results && results.length > 1
      ? Math.round(Number(results[results.length - 2]?.score ?? 0))
      : null;
  const prevCompScore = results && results.length > 1 ? prevReadingScore : null;

  // Overall for recommendation
  const overallScores = [
    report.vocabScore,
    report.practiceScore,
    report.weeklyTotal != null ? Math.round(report.weeklyTotal / 2) : null,
  ].filter((x) => x !== null) as number[];
  const overallAvg =
    overallScores.length > 0
      ? Math.round(
          (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) *
            10,
        ) / 10
      : null;

  const overallScore = overallAvg;

  const earnedBadges = ACHIEVEMENTS.filter((a) => a.check(report));

  const recommendation =
    overallScore === null
      ? "Complete this week's activities to see your personalized recommendation."
      : overallScore >= 4.5
        ? "Excellent work this week! Challenge yourself with more advanced passages."
        : overallScore >= 3.5
          ? "Great progress! Focus on vocabulary review and daily reading practice."
          : overallScore >= 2.5
            ? "Good effort! Try re-reading passages aloud and practicing pronunciation daily."
            : "Keep going! Short daily practice sessions will build your reading skills quickly.";

  // Pronunciation word counts (simulated from score)
  const pronScore = report.avgPronunciation ?? 0;
  const totalWords = 80;
  const correctWords = Math.round((pronScore / 5) * totalWords);
  const mispronounced = Math.round(((5 - pronScore) / 5) * totalWords * 0.6);
  const missed = totalWords - correctWords - mispronounced;

  // Fluency WPM estimate
  const fluencyRange =
    FLUENCY_RANGES[Math.min(Math.max(grade, 1), 10)] ?? "110–150 wpm";
  const wpmEstimate = Math.round(65 + (pronScore / 5) * 60 + grade * 5);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-0 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <AppHeader title="Weekly Report" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="report.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2"
            data-ocid="report.button"
          >
            <Printer className="w-4 h-4" /> Print Report
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6">
            <p className="text-sm text-gray-400">Week of {getWeekStart()}</p>
            <h2 className="text-2xl font-bold mt-1">
              {user?.username ?? "Student"}'s Weekly Report Card
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Grade {grade} · Reading Comprehension Progress
            </p>
          </div>

          {/* ───── 3-Column Layout ───── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ── Left: Score Overview ── */}
            <ScoreOverviewPanel
              readingCurrent={readingScore}
              readingPrevious={prevReadingScore}
              compCurrent={comprehensionScore}
              compPrevious={prevCompScore}
              max={5}
              emptyMessage="Complete weekly activities to see score charts."
            />

            {/* ── Middle: Reporting Indicators ── */}
            <ReportingIndicatorsPanel
              indicators={[
                { label: "Overall", score: overallScore, max: 5 },
                { label: "Reading", score: readingScore, max: 5 },
                { label: "Comprehension", score: comprehensionScore, max: 5 },
              ]}
            />

            {/* ── Right: Skill Detail Cards ── */}
            <div className="flex flex-col gap-3">
              <SkillCard
                color="emerald"
                title="Pronunciation"
                icon={<Volume2 className="w-4 h-4 text-emerald-700" />}
              >
                {report.avgPronunciation !== null ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-emerald-600">
                        {correctWords}
                      </p>
                      <p className="text-xs text-emerald-400/70">Correct</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-500">
                        {mispronounced}
                      </p>
                      <p className="text-xs text-emerald-400/70">Mispron.</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-500">{missed}</p>
                      <p className="text-xs text-emerald-400/70">Missed</p>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-xs text-emerald-400/70"
                    data-ocid="report.empty_state"
                  >
                    No data yet
                  </p>
                )}
              </SkillCard>
              <SkillCard
                color="rose"
                title="Rhythm & Intonation"
                icon={<Music className="w-4 h-4 text-rose-700" />}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-rose-400/70">Rhythm</span>
                    <StarRating value={report.avgRhythm} max={5} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-rose-400/70">Intonation</span>
                    <StarRating value={report.avgIntonation} max={5} />
                  </div>
                </div>
              </SkillCard>
              <SkillCard
                color="sky"
                title="Fluency"
                icon={<Zap className="w-4 h-4 text-sky-700" />}
              >
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold text-sky-800">
                    {report.avgPronunciation !== null ? `${wpmEstimate}` : "—"}
                  </p>
                  <p className="text-xs text-sky-400/70">words/min</p>
                  <Badge className="mt-2 bg-sky-500/20 text-sky-300 border-0 text-xs">
                    Grade {grade}: {fluencyRange}
                  </Badge>
                </div>
              </SkillCard>
            </div>
          </div>

          {/* Achievements */}
          {earnedBadges.length > 0 && (
            <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>🎖️</span> This Week's Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {earnedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="flex items-center gap-2 bg-indigo-500/20 rounded-full px-4 py-2"
                    >
                      <span className="text-lg">{badge.emoji}</span>
                      <span className="text-sm font-semibold text-primary">
                        {badge.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Teacher's Note */}
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-sm font-semibold mb-1">📋 Teacher's Note</p>
            <p className="text-sm text-gray-400">{recommendation}</p>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white"
            onClick={() => onNavigate("/student")}
            data-ocid="report.primary_button"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
