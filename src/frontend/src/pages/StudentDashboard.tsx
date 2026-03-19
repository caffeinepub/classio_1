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
import {
  ReportingIndicatorsPanel,
  ScoreOverviewPanel,
  SkillCard,
  StarRating,
} from "../components/ReportCardLayout";
import { useAuth } from "../context/AuthContext";
import { useMyResults } from "../hooks/useQueries";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

const LEVEL_BADGES = [
  {
    min: 4.5,
    label: "⭐ Master Reader",
    cls: "bg-violet-100 text-violet-800 border border-violet-200",
  },
  {
    min: 4.0,
    label: "🏆 Advanced",
    cls: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  {
    min: 3.0,
    label: "📈 Developing",
    cls: "bg-teal-100 text-teal-800 border border-teal-200",
  },
  {
    min: 2.0,
    label: "🌱 Growing",
    cls: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  {
    min: 0,
    label: "🔰 Beginner",
    cls: "bg-red-100 text-red-800 border border-red-200",
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side: badge + bell + avatar */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                Student
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                data-ocid="student.bell.button"
              >
                <Bell className="w-4 h-4 text-gray-500" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <UserCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
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
              <div className="bg-violet-100 rounded-2xl p-4 flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-violet-900">
                    {badgeInfo?.label ?? "Proficiency Learner"}
                  </p>
                  <p className="text-sm text-violet-600 mt-0.5">
                    Proficiency Learning Path
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-blue-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  🐺
                </div>
              </div>

              {/* B. Large Course Card */}
              <Card className="rounded-2xl shadow-md border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left illustration column */}
                    <div className="sm:w-[35%] bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center p-6 min-h-[200px] relative">
                      <span className="text-6xl">📚</span>
                      <span className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                        ✓
                      </span>
                      <div className="flex gap-1 mt-3">
                        {["S", "E", "A", "D"].map((l) => (
                          <span
                            key={l}
                            className="w-6 h-6 rounded bg-white/70 flex items-center justify-center text-blue-800 text-xs font-bold"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                      {/* Reading label below */}
                      <div className="mt-4 text-left w-full">
                        <p className="text-2xl font-bold text-blue-900">
                          Reading
                        </p>
                        <p className="text-xs text-blue-700 flex items-center gap-1 mt-1">
                          <span className="text-blue-500">▶</span> Started —{" "}
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
                          <div className="bg-violet-100 rounded-xl p-2 shrink-0">
                            <span className="text-xl">📖</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">
                              Go to Vocabulary
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <span className="text-orange-500">●</span>
                              {vocabDone ? 1 : 0} / 6 lessons completed
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 text-blue-600 border-blue-300 rounded-full text-xs px-3"
                            onClick={() => onNavigate("/student/vocab")}
                            data-ocid="student.vocab.button"
                          >
                            View Details
                          </Button>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-400 rounded-full transition-all duration-500"
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
                          <div className="bg-green-50 rounded-xl p-2 shrink-0">
                            <span className="text-xl">📋</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">
                              Go to RCA
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <span className="text-blue-500">●</span>
                              {practiceDone ? 1 : 0} / 12 lessons completed
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white rounded-full text-xs px-3 h-7"
                                onClick={() => onNavigate("/student/test")}
                                data-ocid="student.journey.button"
                              >
                                My Journey
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-300 rounded-full text-xs px-3 h-7"
                                onClick={() => onNavigate("/student/practice")}
                                data-ocid="student.practice.button"
                              >
                                Take Practice Test
                              </Button>
                            </div>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 rounded-full transition-all duration-500"
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

              {/* Weekly complete banner */}
              {weeklyDone && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                  data-ocid="student.success_state"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Week {currentWeekNumber} complete! 🎉
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Next week's tasks unlock on{" "}
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
              <Card className="rounded-xl border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-violet-500" />
                    Proficiency Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div
                      className="flex justify-center py-8"
                      data-ocid="student.loading_state"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : results && results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {results.map((r, i) => (
                        <div
                          key={r.id.toString()}
                          className="flex items-center justify-between px-5 py-3"
                          data-ocid={`student.item.${i + 1}`}
                        >
                          <div>
                            <p className="text-sm font-medium">Test #{i + 1}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                Number(r.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={
                              Number(r.score) >= 4
                                ? "bg-emerald-100 text-emerald-700 border-0"
                                : Number(r.score) >= 2
                                  ? "bg-blue-100 text-blue-700 border-0"
                                  : "bg-red-100 text-red-700 border-0"
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
              <Card className="rounded-xl border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
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
              <Card className="rounded-xl border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
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
                          <div className="space-y-1 text-xs text-emerald-700">
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
                          <div className="text-xs text-sky-700">
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
              <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-3 mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥇</span>
                  <span className="text-sm font-semibold text-yellow-700">
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
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">
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
                    cardCls += " border-yellow-400 bg-yellow-50 shadow-sm";
                    coinEl = <span className="text-2xl">🥇</span>;
                    coinLabel = "Gold Coin";
                  } else if (isSilver) {
                    cardCls += " border-gray-300 bg-gray-50 shadow-sm";
                    coinEl = <span className="text-2xl">🥈</span>;
                    coinLabel = "Silver Coin";
                  } else if (isBronze) {
                    cardCls += " border-amber-200 bg-amber-50 shadow-sm";
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
                                ? "text-yellow-600"
                                : isSilver
                                  ? "text-gray-500"
                                  : "text-amber-600"
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
