import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import type { WeeklyReportEntry } from "./WeeklyTest";

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

type Tab = "courses" | "reports" | "achievements";

function StarRow({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: star rating index is stable
          key={i}
          className={i < score ? "text-amber-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const [activeTab, setActiveTab] = useState<Tab>("courses");

  const grade = Number(user?.grade ?? 1n);
  const todayKey = new Date().toISOString().split("T")[0];

  // Proficiency state
  const profSearchRaw = localStorage.getItem(
    `classio_proficiency_search_${userId}`,
  );
  const profSearchData = profSearchRaw ? JSON.parse(profSearchRaw) : null;
  const proficiencyLevelFound: boolean = profSearchData?.levelFound ?? false;

  // Skills badge from proficiency
  const skillsRaw = localStorage.getItem(`classio_skills_${userId}`);
  const skills = skillsRaw ? JSON.parse(skillsRaw) : null;
  const avgSkill = skills
    ? (skills.rhythm +
        skills.intonation +
        skills.chunking +
        skills.pronunciation) /
      4
    : null;
  const badgeInfo =
    avgSkill !== null
      ? (LEVEL_BADGES.find((b) => avgSkill >= b.min) ??
        LEVEL_BADGES[LEVEL_BADGES.length - 1])
      : null;

  // Activity completion flags
  const vocabDone = !!localStorage.getItem(
    `classio_vocab_${userId}_${grade}_${todayKey}`,
  );
  const practiceDone = !!localStorage.getItem(
    `classio_practice_${userId}_${todayKey}`,
  );
  const weekNum = Math.ceil(
    ((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
      86400000 +
      new Date(new Date().getFullYear(), 0, 1).getDay() +
      1) /
      7,
  );
  const weeklyDone = !!localStorage.getItem(
    `classio_weekly_${userId}_${weekNum}`,
  );
  const spellingDone = !!localStorage.getItem(
    `classio_spelling_${userId}_${grade}_${todayKey}`,
  );
  const grammarDone = !!localStorage.getItem(
    `classio_grammar_${userId}_${grade}_${todayKey}`,
  );

  // Weekly reports list
  const reportsRaw = localStorage.getItem(`classio_reports_${userId}`);
  const weeklyReports: WeeklyReportEntry[] = reportsRaw
    ? JSON.parse(reportsRaw)
    : [];

  // Journey steps
  const journeySteps = [
    {
      label: "Proficiency Test",
      icon: "🎯",
      done: proficiencyLevelFound,
      route: "/student/test",
    },
    {
      label: "Vocabulary Building",
      icon: "📚",
      done: vocabDone,
      route: "/student/vocab",
    },
    {
      label: "Practice Tests",
      icon: "📖",
      done: practiceDone,
      route: "/student/practice",
    },
    {
      label: "Spelling Practice",
      icon: "✍️",
      done: spellingDone,
      route: "/student/spelling",
    },
    {
      label: "Grammar Practice",
      icon: "📝",
      done: grammarDone,
      route: "/student/grammar",
    },
    {
      label: "Weekly Assessment",
      icon: "🏆",
      done: weeklyDone,
      route: "/student/weekly-test",
    },
  ];

  // Achievements
  const practiceRaw = localStorage.getItem(
    `classio_practice_${userId}_${todayKey}`,
  );
  const practiceData = practiceRaw ? JSON.parse(practiceRaw) : null;
  const practiceScore: number | null = practiceData?.score ?? null;

  const vocabRaw = localStorage.getItem(
    `classio_vocab_${userId}_${grade}_${todayKey}`,
  );
  const vocabActivityData = vocabRaw ? JSON.parse(vocabRaw) : null;

  const achievementDefs = [
    {
      id: "proficiency",
      title: "Proficiency Test",
      desc: "Complete proficiency assessment",
      icon: "🎯",
      done: proficiencyLevelFound,
      score: avgSkill,
    },
    {
      id: "vocab",
      title: "Vocab Builder",
      desc: "Complete daily vocabulary activity",
      icon: "📚",
      done: vocabDone,
      score: vocabActivityData?.score ?? null,
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
      score: weeklyReports[0]
        ? Math.round((weeklyReports[0].total / weeklyReports[0].totalQ) * 5)
        : null,
    },
    {
      id: "spelling",
      title: "Spelling Activity",
      desc: "Complete daily spelling practice",
      icon: "✍️",
      done: spellingDone,
      score: (() => {
        const r = localStorage.getItem(
          `classio_spelling_${userId}_${grade}_${todayKey}`,
        );
        if (!r) return null;
        const d = JSON.parse(r);
        return d.total ? Math.round((d.score / d.total) * 5) : null;
      })(),
    },
    {
      id: "grammar",
      title: "Grammar Activity",
      desc: "Complete daily grammar practice",
      icon: "📝",
      done: grammarDone,
      score: (() => {
        const r = localStorage.getItem(
          `classio_grammar_${userId}_${grade}_${todayKey}`,
        );
        if (!r) return null;
        const d = JSON.parse(r);
        return d.total ? Math.round((d.score / d.total) * 5) : null;
      })(),
    },
  ];

  const goldCount = achievementDefs.filter(
    (a) => a.done && a.score !== null && a.score >= 4,
  ).length;
  const silverCount = achievementDefs.filter(
    (a) => a.done && a.score !== null && a.score >= 3 && a.score < 4,
  ).length;
  const completedCount = achievementDefs.filter((a) => a.done).length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "courses",
      label: "My Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: "My Reports",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Trophy className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader title="Student Dashboard" />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`student.${tab.id}.tab`}
                className={`flex items-center gap-1.5 px-5 py-4 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ── My Courses ── */}
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome back, {user?.username ?? "Student"}!
                </h2>
              </div>

              {/* Proficiency badge card */}
              <Card
                className={`rounded-2xl border-2 shadow-md ${
                  proficiencyLevelFound
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-indigo-200 bg-white"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Proficiency Badge
                      </p>
                      {badgeInfo ? (
                        <span
                          className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${badgeInfo.cls}`}
                        >
                          {badgeInfo.label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          🔰 Not Yet Assessed
                        </span>
                      )}
                      {proficiencyLevelFound && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-600 font-semibold">
                            Proficiency level found
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-3xl">
                      {proficiencyLevelFound ? "✅" : "🎯"}
                    </div>
                  </div>
                  {!proficiencyLevelFound && (
                    <Button
                      className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                      onClick={() => onNavigate("/student/test")}
                      data-ocid="proficiency.primary_button"
                    >
                      Take Proficiency Test
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Journey steps */}
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-indigo-500" />
                    Learning Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {journeySteps.map((step, idx) => {
                    const isLocked =
                      !step.done && idx > 0 && !journeySteps[idx - 1].done;
                    return (
                      <div
                        key={step.label}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          step.done
                            ? "bg-emerald-50 border-emerald-200"
                            : isLocked
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-indigo-50 border-indigo-200"
                        }`}
                        data-ocid={`courses.item.${idx + 1}`}
                      >
                        <span className="text-xl">{step.icon}</span>
                        <span className="flex-1 text-sm font-semibold text-gray-800">
                          {step.label}
                        </span>
                        {step.done ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                            onClick={() => onNavigate(step.route)}
                            data-ocid={`courses.item.${idx + 1}.button`}
                          >
                            Start
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── My Reports ── */}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
                <span className="text-sm text-gray-400">
                  {weeklyReports.length} report
                  {weeklyReports.length !== 1 ? "s" : ""}
                </span>
              </div>

              {weeklyReports.length === 0 ? (
                <Card
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                  data-ocid="reports.empty_state"
                >
                  <CardContent className="py-16 text-center">
                    <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">
                      No reports yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">
                      Reports are generated after you complete a weekly
                      assessment.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-indigo-600 border-indigo-300"
                      onClick={() => setActiveTab("courses")}
                    >
                      Go to My Courses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-5">
                  {weeklyReports.map((report, idx) => {
                    const pct = Math.round(
                      (report.total / report.totalQ) * 100,
                    );
                    const vocabPct = Math.round(
                      (report.vocabScore / report.vocabTotal) * 100,
                    );
                    const compPct = Math.round(
                      (report.compScore / report.compTotal) * 100,
                    );
                    const overallSkillAvg = report.skills
                      ? (report.skills.rhythm +
                          report.skills.intonation +
                          report.skills.chunking +
                          report.skills.pronunciation) /
                        4
                      : null;
                    const reportBadge =
                      overallSkillAvg !== null
                        ? (LEVEL_BADGES.find((b) => overallSkillAvg >= b.min) ??
                          LEVEL_BADGES[LEVEL_BADGES.length - 1])
                        : null;
                    const reportDate = new Date(report.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    );

                    return (
                      <Card
                        key={report.id}
                        className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden"
                        data-ocid={`reports.item.${idx + 1}`}
                      >
                        {/* Header */}
                        <CardHeader className="border-b border-gray-100 pb-3 bg-gradient-to-r from-indigo-50 to-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base text-indigo-700">
                                Week {report.weekNumber} Report
                              </CardTitle>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {reportDate} · Grade {report.grade}
                              </p>
                            </div>
                            {reportBadge && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${reportBadge.cls}`}
                              >
                                {reportBadge.label}
                              </span>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="p-5 space-y-5">
                          {/* Overall score */}
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-indigo-400 flex flex-col items-center justify-center bg-indigo-50">
                              <span className="text-xl font-extrabold text-indigo-700">
                                {pct}%
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                Overall Score
                              </p>
                              <p className="text-sm text-gray-500">
                                {report.total} out of {report.totalQ} correct
                              </p>
                              <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section breakdown */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                              <p className="text-xs font-semibold text-indigo-600 mb-1">
                                📚 Vocabulary
                              </p>
                              <p className="text-2xl font-bold text-indigo-700">
                                {vocabPct}%
                              </p>
                              <p className="text-xs text-gray-500">
                                {report.vocabScore}/{report.vocabTotal} correct
                              </p>
                            </div>
                            <div className="rounded-xl border border-violet-100 bg-violet-50 p-3">
                              <p className="text-xs font-semibold text-violet-600 mb-1">
                                📖 Comprehension
                              </p>
                              <p className="text-2xl font-bold text-violet-700">
                                {compPct}%
                              </p>
                              <p className="text-xs text-gray-500">
                                {report.compScore}/{report.compTotal} correct
                              </p>
                            </div>
                          </div>

                          {/* Reading skills */}
                          {report.skills && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Reading Skills
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  {
                                    key: "rhythm" as const,
                                    label: "Rhythm",
                                    emoji: "🎵",
                                  },
                                  {
                                    key: "intonation" as const,
                                    label: "Intonation",
                                    emoji: "🎶",
                                  },
                                  {
                                    key: "chunking" as const,
                                    label: "Chunking",
                                    emoji: "📋",
                                  },
                                  {
                                    key: "pronunciation" as const,
                                    label: "Pronunciation",
                                    emoji: "🗣️",
                                  },
                                ].map((s) => (
                                  <div
                                    key={s.key}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                                  >
                                    <span className="text-xs text-gray-600">
                                      {s.emoji} {s.label}
                                    </span>
                                    <StarRow score={report.skills[s.key]} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Additional activities */}
                          {(report.spellingScore !== null ||
                            report.grammarScore !== null ||
                            report.practiceScore !== null) && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Additional Activities
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {report.practiceScore !== null && (
                                  <div className="rounded-xl border border-teal-100 bg-teal-50 p-3 text-center">
                                    <p className="text-xs text-teal-600 font-semibold mb-1">
                                      📖 Practice
                                    </p>
                                    <p className="text-lg font-bold text-teal-700">
                                      {report.practiceScore}/5
                                    </p>
                                  </div>
                                )}
                                {report.spellingScore !== null && (
                                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                                    <p className="text-xs text-amber-600 font-semibold mb-1">
                                      ✍️ Spelling
                                    </p>
                                    <p className="text-lg font-bold text-amber-700">
                                      {report.spellingScore}/5
                                    </p>
                                  </div>
                                )}
                                {report.grammarScore !== null && (
                                  <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center">
                                    <p className="text-xs text-rose-600 font-semibold mb-1">
                                      📝 Grammar
                                    </p>
                                    <p className="text-lg font-bold text-rose-700">
                                      {report.grammarScore}/5
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* View full report link */}
                          <Button
                            variant="outline"
                            className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            onClick={() => onNavigate("/student/weekly-report")}
                          >
                            View Full Report
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Achievements ── */}
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    count: goldCount,
                    label: "Gold 🥇",
                    cls: "bg-amber-50 border-amber-200",
                  },
                  {
                    count: silverCount,
                    label: "Silver 🥈",
                    cls: "bg-gray-50 border-gray-200",
                  },
                  {
                    count: completedCount,
                    label: "Completed ✅",
                    cls: "bg-indigo-50 border-indigo-200",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-4 text-center ${item.cls}`}
                  >
                    <p className="text-2xl font-extrabold text-gray-900">
                      {item.count}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Achievement cards */}
              <div className="space-y-3">
                {achievementDefs.map((ach, idx) => {
                  let coinEmoji = "";
                  let coinLabel = "";
                  let cardCls = "bg-white border-gray-200";

                  if (ach.done) {
                    const s = ach.score ?? 0;
                    if (s >= 4) {
                      coinEmoji = "🥇";
                      coinLabel = "Gold";
                      cardCls = "bg-amber-50 border-amber-200";
                    } else if (s >= 3) {
                      coinEmoji = "🥈";
                      coinLabel = "Silver";
                      cardCls = "bg-gray-50 border-gray-200";
                    } else {
                      coinEmoji = "🥉";
                      coinLabel = "Bronze";
                      cardCls = "bg-orange-50 border-orange-200";
                    }
                  }

                  return (
                    <div
                      key={ach.id}
                      className={`rounded-xl border p-4 flex items-center gap-4 ${cardCls}`}
                      data-ocid={`achievements.item.${idx + 1}`}
                    >
                      <span className="text-2xl">
                        {ach.done ? coinEmoji : "🔒"}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {ach.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {ach.desc}
                        </p>
                      </div>
                      {ach.done ? (
                        <Badge
                          className={`text-xs font-bold ${
                            coinLabel === "Gold"
                              ? "bg-amber-100 text-amber-700 border-amber-300"
                              : coinLabel === "Silver"
                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                : "bg-orange-100 text-orange-700 border-orange-300"
                          }`}
                        >
                          {coinLabel} {coinEmoji}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-400 border-gray-200 text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-200 mt-8">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
