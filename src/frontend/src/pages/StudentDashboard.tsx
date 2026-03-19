import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  BookOpen,
  CheckCircle,
  Loader2,
  Trophy,
  UserCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { MonthlyProgressReport } from "../components/MonthlyProgressReport";
import {
  ComprehensionAccuracyTrend,
  ReadingGrowthTimeline,
  WPMTracker,
} from "../components/ReadingGrowthCharts";
import {
  ReportingIndicatorsPanel,
  ScoreOverviewPanel,
  SkillCard,
  StarRating,
} from "../components/ReportCardLayout";
import { SkillProgressBars } from "../components/SkillProgressBars";
import { VocabMasteryMap } from "../components/VocabMasteryMap";
import { useAuth } from "../context/AuthContext";
import {
  useMyResults,
  useScoreHistory,
  useVocabMastery,
} from "../hooks/useQueries";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

const LEVEL_BADGES = [
  {
    min: 4.5,
    label: "⭐ Master Reader",
    cls: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  {
    min: 4.0,
    label: "🏆 Advanced",
    cls: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  {
    min: 3.0,
    label: "📈 Developing",
    cls: "bg-teal-100 text-teal-700 border border-teal-200",
  },
  {
    min: 2.0,
    label: "🌱 Growing",
    cls: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  {
    min: 0,
    label: "🔰 Beginner",
    cls: "bg-red-100 text-red-700 border border-red-200",
  },
];

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7;
  const nextMon = new Date(now);
  nextMon.setDate(now.getDate() + daysUntilMonday);
  return nextMon.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7,
  );
}

type Tab = "courses" | "reports" | "achievements";

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const { data: results, isLoading } = useMyResults(userId);
  const { data: scoreHistory = [] } = useScoreHistory(userId);
  const { data: vocabWords = [] } = useVocabMastery(userId);
  const [activeTab, setActiveTab] = useState<Tab>("courses");

  const avg =
    results && results.length > 0
      ? Math.round(
          (results.reduce((s, r) => s + Number(r.score), 0) / results.length) *
            10,
        ) / 10
      : null;

  const profSearchRaw = localStorage.getItem(
    `classio_proficiency_search_${userId}`,
  );
  const profSearchData = profSearchRaw ? JSON.parse(profSearchRaw) : null;
  const proficiencyLevelFound: boolean = profSearchData?.levelFound ?? false;

  const grade = Number(user?.grade ?? 1n);
  const todayKey = new Date().toISOString().split("T")[0];
  const currentWeekNumber = getWeekNumber();

  const vocabDone = !!localStorage.getItem(
    `classio_vocab_${userId}_${grade}_${todayKey}`,
  );
  const practiceDone = !!localStorage.getItem(
    `classio_practice_${userId}_${todayKey}`,
  );
  const weeklyDone = !!localStorage.getItem(
    `classio_weekly_${userId}_${currentWeekNumber}`,
  );

  const practiceRaw = localStorage.getItem(
    `classio_practice_${userId}_${todayKey}`,
  );
  const practiceData = practiceRaw ? JSON.parse(practiceRaw) : null;
  const practiceScore: number | null = practiceData?.score ?? null;

  const weeklyRaw = localStorage.getItem(
    `classio_weekly_${userId}_${currentWeekNumber}`,
  );
  const weeklyData = weeklyRaw ? JSON.parse(weeklyRaw) : null;

  const vocabRaw = localStorage.getItem(
    `classio_vocab_${userId}_${grade}_${todayKey}`,
  );
  const vocabData = vocabRaw ? JSON.parse(vocabRaw) : null;

  const vocabPercent = vocabDone ? 21.6 : 0;
  const rcaPercent = practiceDone
    ? Math.round(((practiceScore ?? 0) / 5) * 100)
    : 0;

  const badgeInfo =
    avg !== null
      ? (LEVEL_BADGES.find((b) => avg >= b.min) ??
        LEVEL_BADGES[LEVEL_BADGES.length - 1])
      : null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "courses", label: "My Courses" },
    { id: "reports", label: "My Reports" },
    { id: "achievements", label: "Achievements" },
  ];

  // Achievement definitions
  const achievementDefs = [
    {
      id: "proficiency",
      title: "Proficiency Test",
      desc: "Complete your proficiency assessment",
      icon: "🎯",
      done: proficiencyLevelFound,
      score: avg,
    },
    {
      id: "vocab",
      title: "Vocab Builder",
      desc: "Complete daily vocabulary activity",
      icon: "📚",
      done: vocabDone,
      score: vocabData?.score ?? null,
    },
    {
      id: "practice",
      title: "Practice Test",
      desc: "Complete a practice reading test",
      icon: "📖",
      done: practiceDone,
      score: practiceScore,
    },
    {
      id: "weekly",
      title: "Weekly Assessment",
      desc: "Complete weekly combined test",
      icon: "🏆",
      done: weeklyDone,
      score: weeklyData?.total != null ? (weeklyData.total / 10) * 5 : null,
    },
    {
      id: "report",
      title: "Weekly Report",
      desc: "View your weekly progress report",
      icon: "📊",
      done: weeklyDone,
      score: weeklyData?.total != null ? (weeklyData.total / 10) * 5 : null,
    },
  ];

  const goldCount = achievementDefs.filter(
    (a) => a.done && a.score !== null && a.score >= 4,
  ).length;
  const silverCount = achievementDefs.filter(
    (a) => a.done && a.score !== null && a.score >= 3 && a.score < 4,
  ).length;
  const completedCount = achievementDefs.filter((a) => a.done).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Student Dashboard" />

      {/* Tab Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`student.${tab.id}.tab`}
                  className={`px-5 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side: badge + bell + avatar */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                Student
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                data-ocid="student.bell.button"
              >
                <Bell className="w-4 h-4 text-gray-500" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <UserCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ─── Tab 1: My Courses ─────────────────────────────────────── */}
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Course Overview
              </h2>

              {/* A. Proficiency Path Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 flex items-center justify-between mb-4">
                <div>
                  {badgeInfo ? (
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${badgeInfo.cls} mb-1`}
                    >
                      {badgeInfo.label}
                    </span>
                  ) : (
                    <p className="text-lg font-bold text-indigo-100">
                      Proficiency Learner
                    </p>
                  )}
                  <p className="text-sm text-indigo-200 mt-1">
                    Proficiency Learning Path
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-indigo-700 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-indigo-500/20">
                  🐺
                </div>
              </div>

              {/* Proficiency Test CTA (shown when level not yet found) */}
              {!proficiencyLevelFound ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border border-indigo-200 bg-white p-8 mb-4 flex flex-col items-center text-center shadow-md"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl mb-5 shadow-lg shadow-indigo-500/40">
                      🎯
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Start Your Proficiency Test
                    </h3>
                    <p className="text-gray-600 max-w-md mb-7 leading-relaxed">
                      Before beginning your courses, take a short proficiency
                      test so we can find your current reading level and build
                      the right learning path for you.
                    </p>
                    <button
                      type="button"
                      data-ocid="proficiency.primary_button"
                      onClick={() => onNavigate("/student/test")}
                      className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all duration-200 text-lg"
                    >
                      Take Proficiency Test →
                    </button>
                  </div>
                </motion.div>
              ) : null}
              {proficiencyLevelFound && (
                <>
                  {/* B. Large Course Card */}
                  <Card className="rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Left illustration column */}
                        <div className="sm:w-[35%] bg-gradient-to-br from-indigo-600 to-blue-700 border-r border-indigo-500 flex flex-col items-center justify-center p-6 min-h-[200px] relative">
                          <span className="text-6xl">📚</span>
                          <span className="absolute top-4 right-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">
                            ✓
                          </span>
                          <div className="flex gap-1 mt-3">
                            {["S", "E", "A", "D"].map((l) => (
                              <span
                                key={l}
                                className="w-6 h-6 rounded bg-indigo-500/30 flex items-center justify-center text-indigo-200 text-xs font-bold border border-indigo-500/40"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                          {/* Reading label below */}
                          <div className="mt-4 text-left w-full">
                            <p className="text-2xl font-bold text-white">
                              Reading
                            </p>
                            <p className="text-xs text-indigo-300 flex items-center gap-1 mt-1">
                              <span className="text-cyan-400">▶</span> Started —{" "}
                              {new Date().toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Right content column */}
                        <div className="flex-1 divide-y divide-gray-100">
                          {/* Row 1: Vocabulary */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="bg-violet-100 rounded-xl p-2 shrink-0 border border-violet-200">
                                <span className="text-xl">📖</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm">
                                  Go to Vocabulary
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <span className="text-orange-400">●</span>
                                  {vocabDone ? 1 : 0} / 6 lessons completed
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 bg-transparent border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-full text-xs px-3"
                                onClick={() => onNavigate("/student/vocab")}
                                data-ocid="student.vocab.button"
                              >
                                View Details
                              </Button>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                  style={{ width: `${vocabPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-12 text-right">
                                {vocabPercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>

                          {/* Row 2: RCA */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="bg-emerald-100 rounded-xl p-2 shrink-0 border border-emerald-200">
                                <span className="text-xl">📋</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm">
                                  Go to RCA
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <span className="text-cyan-400">●</span>
                                  {practiceDone ? 1 : 0} / 12 lessons completed
                                </p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs px-3 h-7 border-0"
                                    onClick={() => onNavigate("/student/test")}
                                    data-ocid="student.journey.button"
                                  >
                                    My Journey
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent border-cyan-500 text-cyan-700 hover:bg-cyan-50 rounded-full text-xs px-3 h-7"
                                    onClick={() =>
                                      onNavigate("/student/practice")
                                    }
                                    data-ocid="student.practice.button"
                                  >
                                    Take Practice Test
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                  style={{ width: `${rcaPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-12 text-right">
                                {rcaPercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Feature 7: Skill-Specific Progress Bars */}
              <div className="mt-4">
                <SkillProgressBars
                  scores={{
                    pronunciation:
                      scoreHistory.length > 0
                        ? Math.min(
                            100,
                            Number(
                              scoreHistory[scoreHistory.length - 1]
                                .pronunciationScore,
                            ),
                          )
                        : avg !== null
                          ? Math.round(avg * 20)
                          : 45,
                    rhythm:
                      scoreHistory.length > 0
                        ? Math.min(
                            100,
                            Number(
                              scoreHistory[scoreHistory.length - 1].rhythmScore,
                            ),
                          )
                        : avg !== null
                          ? Math.round(avg * 18)
                          : 38,
                    intonation:
                      scoreHistory.length > 0
                        ? Math.min(
                            100,
                            Number(
                              scoreHistory[scoreHistory.length - 1]
                                .fluencyScore,
                            ),
                          )
                        : avg !== null
                          ? Math.round(avg * 19)
                          : 52,
                    fluency:
                      scoreHistory.length > 0
                        ? Math.min(
                            100,
                            Number(scoreHistory[scoreHistory.length - 1].wpm) /
                              2,
                          )
                        : avg !== null
                          ? Math.round(avg * 17)
                          : 60,
                  }}
                />
              </div>

              {/* Weekly complete banner */}
              {weeklyDone && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                  data-ocid="student.success_state"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-600">
                      Week {currentWeekNumber} complete! 🎉
                    </p>
                    <p className="text-xs text-emerald-400 mt-0.5">
                      Next week&apos;s tasks unlock on{" "}
                      <span className="font-medium">{getNextMonday()}</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── Tab 2: My Reports ─────────────────────────────────────── */}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900">My Reports</h2>

              {/* Proficiency Test Results */}
              <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-200">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                    <Trophy className="w-4 h-4 text-violet-400" />
                    Proficiency Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div
                      className="flex justify-center py-8"
                      data-ocid="student.loading_state"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    </div>
                  ) : results && results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {results.map((r, i) => (
                        <div
                          key={r.id.toString()}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                          data-ocid={`student.item.${i + 1}`}
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Test #{i + 1}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                Number(r.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={
                              Number(r.score) >= 4
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : Number(r.score) >= 2
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                            }
                          >
                            {r.score.toString()}/5
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="text-center py-10 text-gray-400"
                      data-ocid="student.empty_state"
                    >
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No proficiency tests taken yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Practice Report */}
              <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-200">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                    <span className="text-base">📖</span> Practice Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {practiceData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ScoreOverviewPanel
                        readingCurrent={practiceScore}
                        readingPrevious={null}
                        compCurrent={practiceScore}
                        compPrevious={null}
                        max={5}
                      />
                      <ReportingIndicatorsPanel
                        indicators={[
                          { label: "Overall", score: practiceScore, max: 5 },
                          { label: "Reading", score: practiceScore, max: 5 },
                          {
                            label: "Comprehension",
                            score:
                              practiceScore !== null
                                ? practiceScore * 0.9
                                : null,
                            max: 5,
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <div
                      className="text-center py-8 text-gray-400"
                      data-ocid="report.practice.empty_state"
                    >
                      <p className="text-sm">
                        Complete a practice test to see your report.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Report */}
              <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-200">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                    <span className="text-base">📊</span> Weekly Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ScoreOverviewPanel
                          readingCurrent={
                            weeklyData.total != null
                              ? (weeklyData.total / 10) * 5
                              : null
                          }
                          readingPrevious={null}
                          compCurrent={
                            weeklyData.total != null
                              ? (weeklyData.total / 10) * 4.5
                              : null
                          }
                          compPrevious={null}
                          max={5}
                        />
                        <ReportingIndicatorsPanel
                          indicators={[
                            {
                              label: "Overall",
                              score:
                                weeklyData.total != null
                                  ? (weeklyData.total / 10) * 5
                                  : null,
                              max: 5,
                            },
                            {
                              label: "Reading",
                              score:
                                weeklyData.total != null
                                  ? (weeklyData.total / 10) * 5
                                  : null,
                              max: 5,
                            },
                            {
                              label: "Comprehension",
                              score:
                                weeklyData.total != null
                                  ? (weeklyData.total / 10) * 4.5
                                  : null,
                              max: 5,
                            },
                          ]}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <SkillCard
                          color="emerald"
                          title="Pronunciation"
                          icon="🗣️"
                        >
                          <div className="space-y-1 text-xs text-emerald-400">
                            <div className="flex justify-between">
                              <span>Correct</span>
                              <span className="font-semibold">
                                {weeklyData.pronunciation?.correct ?? "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mispronounced</span>
                              <span className="font-semibold">
                                {weeklyData.pronunciation?.mispronounced ?? "—"}
                              </span>
                            </div>
                          </div>
                        </SkillCard>
                        <SkillCard
                          color="rose"
                          title="Rhythm & Intonation"
                          icon="🎵"
                        >
                          <StarRating
                            value={
                              weeklyData.total != null
                                ? (weeklyData.total / 10) * 5
                                : null
                            }
                          />
                        </SkillCard>
                        <SkillCard color="sky" title="Fluency" icon="⚡">
                          <div className="text-xs text-sky-400">
                            <span className="font-semibold">
                              {weeklyData.fluency?.wpm ?? "—"}
                            </span>{" "}
                            words/min
                          </div>
                        </SkillCard>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-center py-8 text-gray-400"
                      data-ocid="report.weekly.empty_state"
                    >
                      <p className="text-sm">
                        Complete a weekly test to see your report.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Feature 1: Reading Growth Timeline */}
              <ReadingGrowthTimeline records={scoreHistory} />

              {/* Feature 2: WPM Tracker */}
              <WPMTracker records={scoreHistory} />

              {/* Feature 5: Comprehension Accuracy Trend */}
              <ComprehensionAccuracyTrend records={scoreHistory} />

              {/* Feature 3: Vocabulary Mastery Map */}
              <VocabMasteryMap words={vocabWords} grade={grade} />

              {/* Feature 6: Monthly Progress Report */}
              <MonthlyProgressReport
                startScore={
                  results && results.length > 0
                    ? Math.round((Number(results[0].score) / 5) * 100)
                    : null
                }
                currentScore={avg !== null ? Math.round((avg / 5) * 100) : null}
                grade={grade}
                username={user?.username ?? ""}
              />
            </motion.div>
          )}

          {/* ─── Tab 3: Achievements ───────────────────────────────────── */}
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Achievements
              </h2>

              {/* Summary row */}
              <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥇</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {goldCount} Gold Coin{goldCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥈</span>
                  <span className="text-sm font-semibold text-gray-600">
                    {silverCount} Silver Coin{silverCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-600">
                    {completedCount} Activit{completedCount !== 1 ? "ies" : "y"}{" "}
                    Completed
                  </span>
                </div>
              </div>

              {/* Achievement grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementDefs.map((ach, i) => {
                  const isGold =
                    ach.done && ach.score !== null && ach.score >= 4;
                  const isSilver =
                    ach.done &&
                    ach.score !== null &&
                    ach.score >= 3 &&
                    ach.score < 4;
                  const isBronze =
                    ach.done && (ach.score === null || ach.score < 3);

                  let cardCls =
                    "rounded-xl border p-4 flex flex-col gap-2 transition-all";
                  let coinEl: React.ReactNode = null;
                  let coinLabel = "";

                  if (!ach.done) {
                    cardCls += " border-gray-200 bg-gray-50 opacity-60";
                    coinEl = <span className="text-2xl">🔒</span>;
                    coinLabel = "Locked";
                  } else if (isGold) {
                    cardCls += " border-yellow-300 bg-yellow-50 shadow-sm";
                    coinEl = <span className="text-2xl">🥇</span>;
                    coinLabel = "Gold Coin";
                  } else if (isSilver) {
                    cardCls += " border-gray-300 bg-gray-50 shadow-sm";
                    coinEl = <span className="text-2xl">🥈</span>;
                    coinLabel = "Silver Coin";
                  } else if (isBronze) {
                    cardCls += " border-amber-300 bg-amber-50 shadow-sm";
                    coinEl = <span className="text-2xl">🎖️</span>;
                    coinLabel = "Completed";
                  }

                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cardCls}
                      data-ocid={`achievements.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{ach.icon}</span>
                        {coinEl}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            ach.done ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {ach.title}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            ach.done ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {ach.desc}
                        </p>
                      </div>
                      {ach.done && (
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs font-semibold ${
                              isGold
                                ? "text-yellow-400"
                                : isSilver
                                  ? "text-gray-300"
                                  : "text-amber-400"
                            }`}
                          >
                            {coinLabel}
                          </span>
                          {ach.score !== null && (
                            <span className="text-xs text-gray-400">
                              Score: {ach.score.toFixed(1)}/5
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
