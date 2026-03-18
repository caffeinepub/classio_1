import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Printer } from "lucide-react";
import { motion } from "motion/react";
import { AppHeader } from "../components/AppHeader";
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

function StarBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <Progress value={pct} className="flex-1 h-2" />
      <span className="text-xs text-muted-foreground w-10 text-right">
        {value}/{max}
      </span>
    </div>
  );
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

  // Pull stored data
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

  // Skill scores saved to localStorage after each proficiency test
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

  const earnedBadges = ACHIEVEMENTS.filter((a) => a.check(report));

  const overallScore = [
    report.vocabScore,
    report.practiceScore,
    report.weeklyTotal != null ? Math.round(report.weeklyTotal / 2) : null,
  ].filter((x) => x !== null) as number[];
  const overallAvg =
    overallScore.length > 0
      ? Math.round(
          (overallScore.reduce((a, b) => a + b, 0) / overallScore.length) * 10,
        ) / 10
      : null;

  const recommendation =
    overallAvg === null
      ? "Complete this week's activities to see your personalized recommendation."
      : overallAvg >= 4.5
        ? "Excellent work this week! Challenge yourself with more advanced passages."
        : overallAvg >= 3.5
          ? "Great progress! Focus on vocabulary review and daily reading practice."
          : overallAvg >= 2.5
            ? "Good effort! Try re-reading passages aloud and practicing pronunciation daily."
            : "Keep going! Short daily practice sessions will build your reading skills quickly.";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Weekly Report" />
      <main className="max-w-2xl mx-auto px-6 py-8">
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
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">
              Week of {getWeekStart()}
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {user?.username ?? "Student"}'s Weekly Report
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Grade {grade} · Reading Comprehension Progress
            </p>
            {overallAvg !== null && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {overallAvg}/5
                </span>
                <span className="text-sm text-muted-foreground">
                  Overall Average
                </span>
              </div>
            )}
          </div>

          {/* Vocab Section */}
          <Card className="rounded-2xl border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>📚</span> Vocabulary Mastery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.vocabScore !== null ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span>Today's Quiz Score</span>
                    <Badge className="bg-primary/10 text-primary border-0">
                      {report.vocabScore}/6
                    </Badge>
                  </div>
                  <StarBar value={report.vocabScore} max={6} />
                </>
              ) : (
                <p
                  className="text-sm text-muted-foreground"
                  data-ocid="report.empty_state"
                >
                  No vocab activity completed today.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Practice Reading Section */}
          <Card className="rounded-2xl border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>📖</span> Reading Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.practiceScore !== null ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span>Practice Test Score</span>
                    <Badge className="bg-primary/10 text-primary border-0">
                      {report.practiceScore}/5
                    </Badge>
                  </div>
                  <StarBar value={report.practiceScore} max={5} />
                </>
              ) : (
                <p
                  className="text-sm text-muted-foreground"
                  data-ocid="report.empty_state"
                >
                  No practice test taken today.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Proficiency Skills */}
          {results && results.length > 0 && (
            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>🎙️</span> Proficiency Skills (All-Time Average)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "🎵 Rhythm", val: report.avgRhythm },
                  { label: "🎶 Intonation", val: report.avgIntonation },
                  { label: "⏸️ Chunking", val: report.avgChunking },
                  { label: "🗣️ Pronunciation", val: report.avgPronunciation },
                ].map((skill) => (
                  <div key={skill.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{skill.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.val ?? "—"}/5
                      </span>
                    </div>
                    {skill.val !== null && <StarBar value={skill.val} />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Weekly Assessment */}
          {weeklyData && (
            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>🏆</span> Weekly Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {weeklyData.vocabScore}/5
                    </p>
                    <p className="text-xs text-muted-foreground">Vocabulary</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {weeklyData.comprehensionScore}/5
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Comprehension
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {weeklyData.total}/10
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <StarBar value={weeklyData.total} max={10} />
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {earnedBadges.length > 0 && (
            <Card className="rounded-2xl border-border shadow-card">
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
                      className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2"
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

          {/* Recommendation */}
          <div className="bg-muted/40 rounded-2xl p-5">
            <p className="text-sm font-semibold mb-1">📋 Teacher's Note</p>
            <p className="text-sm text-muted-foreground">{recommendation}</p>
          </div>

          <Button
            className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
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
