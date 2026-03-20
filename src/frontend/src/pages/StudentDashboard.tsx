import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  Bell,
  BookOpen,
  CheckCircle,
  Loader2,
  Lock,
  PlayCircle,
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
    cls: "bg-teal-100 text-teal-700 border border-teal-200",
  },
  {
    min: 3.0,
    label: "📈 Developing",
    cls: "bg-emerald-100 text-emerald-700 border border-emerald-200",
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

const LETTER_TILES = [
  { letter: "H", bg: "bg-teal-200", text: "text-teal-700" },
  { letter: "O", bg: "bg-emerald-200", text: "text-emerald-700" },
  { letter: "N", bg: "bg-cyan-200", text: "text-cyan-700" },
  { letter: "E", bg: "bg-teal-300", text: "text-teal-800" },
  { letter: "D", bg: "bg-emerald-300", text: "text-emerald-800" },
  { letter: "Z", bg: "bg-cyan-300", text: "text-cyan-800" },
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

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  courses: <BookOpen className="w-4 h-4" />,
  reports: <BarChart2 className="w-4 h-4" />,
  achievements: <Trophy className="w-4 h-4" />,
};

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
    : 40;

  const badgeInfo =
    avg !== null
      ? (LEVEL_BADGES.find((b) => avg >= b.min) ??
        LEVEL_BADGES[LEVEL_BADGES.length - 1])
      : null;

  const startedDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

  // Week 1 lesson plan
  const lessonPlan = [
    {
      day: 1,
      type: "vocab",
      title: "Vocabulary Lesson 1",
      subtitle: "6 core words — meanings & spelling",
      icon: "📖",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 2,
      type: "vocab",
      title: "Vocabulary Lesson 2",
      subtitle: "6 new words — synonyms & usage",
      icon: "✏️",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 3,
      type: "vocab",
      title: "Vocabulary Lesson 3",
      subtitle: "6 words + review of lessons 1–2",
      icon: "🔁",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 4,
      type: "vocab",
      title: "Vocabulary Lesson 4",
      subtitle: "Pronunciation focus — say each word aloud",
      icon: "🎙️",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 5,
      type: "vocab",
      title: "Vocabulary Lesson 5",
      subtitle: "Words in context — sentence building",
      icon: "💬",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 6,
      type: "quiz",
      title: "Vocab Quiz",
      subtitle: "Test all 30 words — score 80% to unlock reading",
      icon: "🧠",
      route: "/student/vocab",
      done: vocabDone,
    },
    {
      day: 7,
      type: "practice",
      title: "Practice Reading Test",
      subtitle: "Read & Record — grade-appropriate passage",
      icon: "🎧",
      route: "/student/practice",
      done: practiceDone,
    },
    {
      day: 8,
      type: "weekly",
      title: "Weekly Assessment",
      subtitle: "Final test for Week 1 — unlock Week 2",
      icon: "🏁",
      route: "/student/weekly-test",
      done: weeklyDone,
    },
  ];

  // Determine which lesson is active (first not done)
  const firstActiveLessonDay = lessonPlan.find((l) => !l.done)?.day ?? 9;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Student Dashboard" />

      {/* Tab Navigation Bar — pill style */}
      <div className="bg-teal-50 border-b border-teal-100 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Pill tabs */}
            <div className="bg-white/80 rounded-full p-1 flex gap-1">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`student.${tab.id}.tab`}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-teal-700 hover:bg-teal-50"
                  }`}
                >
                  {TAB_ICONS[tab.id]}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side: badge + bell + avatar */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 border border-teal-200">
                Student
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                data-ocid="student.bell.button"
              >
                <Bell className="w-4 h-4 text-gray-500" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
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
              {/* Course Overview heading */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Course Overview
              </h2>

              {/* ── Proficiency Learning Path card (teal) ── */}
              <div className="relative bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 flex items-center justify-between mb-4 overflow-hidden min-h-[110px]">
                {/* Left text */}
                <div className="z-10">
                  <p className="text-xs font-semibold text-teal-400 mb-0.5 tracking-wider">
                    -
                  </p>
                  <p className="text-base font-bold text-teal-800">
                    Proficiency Learning Path
                  </p>
                  {badgeInfo ? (
                    <span
                      className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold ${badgeInfo.cls}`}
                    >
                      {badgeInfo.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-600 border border-teal-200">
                      🔰 Proficiency Learner
                    </span>
                  )}
                </div>

                {/* Right: floating letter tiles */}
                <div className="relative flex flex-wrap gap-1.5 max-w-[140px] justify-end z-10">
                  {LETTER_TILES.map((tile, idx) => (
                    <motion.span
                      key={tile.letter}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.3 }}
                      className={`w-8 h-8 rounded-lg ${tile.bg} ${tile.text} flex items-center justify-center text-sm font-extrabold shadow-sm select-none`}
                    >
                      {tile.letter}
                    </motion.span>
                  ))}
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-teal-100 opacity-50" />
              </div>

              {/* ── Reading Course Card (always visible) ── */}
              <Card className="rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden mb-4">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left illustration column */}
                    <div className="sm:w-[38%] bg-gradient-to-br from-teal-400 to-emerald-600 flex flex-col items-center justify-center p-6 min-h-[200px] relative">
                      {/* Book illustration */}
                      <div className="relative flex items-center justify-center">
                        <span className="text-6xl drop-shadow-lg">📚</span>
                        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-teal-600 text-sm font-bold shadow">
                          ✓
                        </span>
                      </div>

                      {/* Reading label */}
                      <div className="mt-5 text-left w-full">
                        <p className="text-2xl font-extrabold text-white leading-tight">
                          Reading
                        </p>
                        <p className="text-xs text-teal-100 flex items-center gap-1 mt-1">
                          <PlayCircle className="w-3 h-3 text-teal-200" />
                          Started - {startedDateStr}
                        </p>
                      </div>
                    </div>

                    {/* Right content column */}
                    <div className="flex-1 flex flex-col divide-y divide-gray-100">
                      {/* Row 1: Vocabulary */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="bg-teal-100 rounded-xl p-2 shrink-0 border border-teal-200">
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
                            className="shrink-0 bg-transparent border-teal-300 text-teal-600 hover:bg-teal-50 rounded-full text-xs px-3"
                            onClick={() => onNavigate("/student/vocab")}
                            data-ocid="student.vocab.button"
                          >
                            View Details
                          </Button>
                        </div>
                        {/* Vocab progress bar */}
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${vocabPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Row 2: RCA */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="bg-green-100 rounded-xl p-2 shrink-0 border border-green-200">
                            <span className="text-xl">📋</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">
                              Go to RCA
                            </p>
                            <p className="text-xs text-teal-500 flex items-center gap-1 mt-0.5 font-semibold">
                              <span className="text-teal-500">●</span>
                              {practiceDone ? 2 : 2} / 5
                            </p>
                          </div>

                          {/* Proficiency Test pill button */}
                          {proficiencyLevelFound ? (
                            <span
                              data-ocid="student.journey.button"
                              className="inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs px-4 py-1.5 font-semibold shrink-0"
                            >
                              ✓ Proficiency Complete
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0 bg-transparent border-teal-400 text-teal-600 hover:bg-teal-50 rounded-full text-xs px-4 h-8 font-semibold"
                              onClick={() => onNavigate("/student/test")}
                              data-ocid="proficiency.primary_button"
                            >
                              Take Proficiency Test
                            </Button>
                          )}
                        </div>

                        {/* RCA progress bar (orange) */}
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${rcaPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── Week 1 Learning Plan ── */}
              <div className="mb-4">
                {/* Section header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    📅 Week 1 Learning Plan
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Reading Comprehension Journey
                  </span>
                </div>

                <div className="rounded-2xl border border-teal-100 bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                  {lessonPlan.map((lesson, idx) => {
                    const isActive = lesson.day === firstActiveLessonDay;
                    const isDone = lesson.done;
                    const isLocked =
                      !isDone && lesson.day > firstActiveLessonDay;

                    return (
                      <motion.div
                        key={lesson.day}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`flex items-center gap-4 px-4 py-3.5 ${
                          isLocked ? "opacity-50" : ""
                        }`}
                        data-ocid={`courses.item.${lesson.day}`}
                      >
                        {/* Day badge */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? "bg-emerald-500 text-white"
                              : isActive
                                ? "bg-teal-600 text-white"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : isLocked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            lesson.day
                          )}
                        </div>

                        {/* Icon + text */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xl shrink-0">
                            {lesson.icon}
                          </span>
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isDone
                                  ? "text-gray-400 line-through"
                                  : isLocked
                                    ? "text-gray-400"
                                    : "text-gray-900"
                              }`}
                            >
                              Day {lesson.day} — {lesson.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {lesson.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="shrink-0">
                          {isDone ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-3 h-7 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
                              onClick={() => onNavigate(lesson.route)}
                              data-ocid={`courses.edit_button.${lesson.day}`}
                            >
                              Review
                            </Button>
                          ) : isActive ? (
                            <Button
                              size="sm"
                              className="text-xs px-4 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                              onClick={() => onNavigate(lesson.route)}
                              data-ocid={`courses.primary_button.${lesson.day}`}
                            >
                              Start
                            </Button>
                          ) : (
                            <span className="text-gray-300">
                              <Lock className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

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
                  className="mt-4 flex items-start gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 p-4"
                  data-ocid="student.success_state"
                >
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-teal-700">
                      Week {currentWeekNumber} complete! 🎉
                    </p>
                    <p className="text-xs text-teal-500 mt-0.5">
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
                    <Trophy className="w-4 h-4 text-teal-500" />
                    Proficiency Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div
                      className="flex justify-center py-8"
                      data-ocid="student.loading_state"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
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
                                  ? "bg-teal-100 text-teal-700 border border-teal-200"
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
                      <div className="grid grid-cols-3 gap-3">
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
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-semibold text-teal-600">
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
                    cardCls +=
                      " bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-300 shadow-sm";
                    coinEl = <span className="text-2xl">🥇</span>;
                    coinLabel = "Gold Coin";
                  } else if (isSilver) {
                    cardCls +=
                      " bg-gradient-to-br from-gray-50 to-slate-100 border-slate-300 shadow-sm";
                    coinEl = <span className="text-2xl">🥈</span>;
                    coinLabel = "Silver Coin";
                  } else if (isBronze) {
                    cardCls +=
                      " bg-gradient-to-br from-orange-50 to-amber-50 border-amber-200 shadow-sm";
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
                          <span className="text-xs font-semibold text-teal-600">
                            {coinLabel}
                          </span>
                          {ach.score !== null && (
                            <span className="text-xs text-gray-400">
                              {ach.score.toFixed(1)}/5
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
