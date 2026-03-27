import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import practiceQuestions from "../data/practiceQuestions";
import vocabData from "../data/vocabData";

interface WeeklyTestProps {
  onNavigate: (page: string) => void;
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7,
  );
}

export function WeeklyTest({ onNavigate }: WeeklyTestProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const grade = Number(user?.grade ?? 1n);
  const words = vocabData[grade] ?? vocabData[1];
  const questions = (practiceQuestions[grade] ?? practiceQuestions[1]).slice(
    0,
    5,
  );

  const vocabQs = words.slice(0, 5).map((w, i) => {
    const wrong = words
      .filter((_, j) => j !== i)
      .map((x) => x.definition)
      .slice(0, 3);
    const choices = [...wrong, w.definition].sort(() => Math.random() - 0.5);
    return {
      word: w.word,
      choices,
      correctIndex: choices.indexOf(w.definition),
    };
  });

  const [section, setSection] = useState<"vocab" | "comprehension" | "done">(
    "vocab",
  );
  const [vocabIdx, setVocabIdx] = useState(0);
  const [vocabScore, setVocabScore] = useState(0);
  const [compIdx, setCompIdx] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // Track final scores to pass to done screen without state timing issues
  const [finalVocab, setFinalVocab] = useState(0);
  const [finalComp, setFinalComp] = useState(0);

  const totalQ = vocabQs.length + questions.length;
  const answered =
    section === "vocab"
      ? vocabIdx
      : section === "comprehension"
        ? vocabQs.length + compIdx
        : totalQ;

  const handleVocabAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (vocabQs[vocabIdx].correctIndex === idx) setVocabScore((s) => s + 1);
  };

  const nextVocab = () => {
    if (vocabIdx + 1 >= vocabQs.length) {
      setSection("comprehension");
      setSelected(null);
    } else {
      setVocabIdx(vocabIdx + 1);
      setSelected(null);
    }
  };

  const handleCompAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (questions[compIdx].correctIndex === idx) setCompScore((s) => s + 1);
  };

  const nextComp = () => {
    const isLastQuestion = compIdx + 1 >= questions.length;
    const lastAnswerCorrect = selected === questions[compIdx]?.correctIndex;

    if (isLastQuestion) {
      // Correctly account for the last answer
      const finalCompScore = compScore + (lastAnswerCorrect ? 1 : 0);
      const finalVocabScore = vocabScore;
      const total = finalVocabScore + finalCompScore;

      setFinalVocab(finalVocabScore);
      setFinalComp(finalCompScore);

      // Get skill scores from proficiency test
      const skillsRaw = localStorage.getItem(`classio_skills_${userId}`);
      const skills = skillsRaw
        ? JSON.parse(skillsRaw)
        : { rhythm: 2, intonation: 2, chunking: 2, pronunciation: 2 };

      const todayKey = new Date().toISOString().split("T")[0];
      const spellingRaw = localStorage.getItem(
        `classio_spelling_${userId}_${grade}_${todayKey}`,
      );
      const spellingData = spellingRaw ? JSON.parse(spellingRaw) : null;
      const spellingScore = spellingData?.total
        ? Math.round((spellingData.score / spellingData.total) * 5)
        : null;

      const grammarRaw = localStorage.getItem(
        `classio_grammar_${userId}_${grade}_${todayKey}`,
      );
      const grammarData = grammarRaw ? JSON.parse(grammarRaw) : null;
      const grammarScore = grammarData?.total
        ? Math.round((grammarData.score / grammarData.total) * 5)
        : null;

      const practiceRaw = localStorage.getItem(
        `classio_practice_${userId}_${todayKey}`,
      );
      const practiceData = practiceRaw ? JSON.parse(practiceRaw) : null;
      const practiceScore = practiceData?.score ?? null;

      // Save weekly data (for WeeklyReport page compatibility)
      localStorage.setItem(
        `classio_weekly_${userId}_${getWeekNumber()}`,
        JSON.stringify({
          vocabScore: finalVocabScore,
          comprehensionScore: finalCompScore,
          total,
          date: new Date().toISOString(),
        }),
      );

      // Save consolidated report entry to the reports list
      const reportsKey = `classio_reports_${userId}`;
      const existingRaw = localStorage.getItem(reportsKey);
      const existingReports: WeeklyReportEntry[] = existingRaw
        ? JSON.parse(existingRaw)
        : [];

      const newReport: WeeklyReportEntry = {
        id: `week_${getWeekNumber()}_${Date.now()}`,
        weekNumber: getWeekNumber(),
        date: new Date().toISOString(),
        grade,
        vocabScore: finalVocabScore,
        vocabTotal: vocabQs.length,
        compScore: finalCompScore,
        compTotal: questions.length,
        total,
        totalQ,
        skills,
        spellingScore,
        grammarScore,
        practiceScore,
      };

      // Replace any existing report for the same week, or append
      const filtered = existingReports.filter(
        (r) => r.weekNumber !== getWeekNumber(),
      );
      localStorage.setItem(
        reportsKey,
        JSON.stringify([newReport, ...filtered]),
      );

      setSection("done");
    } else {
      setCompIdx(compIdx + 1);
      setSelected(null);
    }
  };

  if (section === "done") {
    const total = finalVocab + finalComp;
    const pct = Math.round((total / totalQ) * 100);
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Weekly Test Results" />
        <main
          className="max-w-xl mx-auto px-6 py-12 text-center"
          data-ocid="weekly.success_state"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-4xl mx-auto mb-4">
              🏆
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Weekly Test Complete!
            </h2>
            <p className="text-4xl font-bold text-indigo-600 mb-1">
              {total}/{totalQ}
            </p>
            <p className="text-gray-500 mb-4">{pct}% overall</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="rounded-xl bg-white border border-gray-200">
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {finalVocab}/{vocabQs.length}
                  </p>
                  <p className="text-xs text-gray-500">Vocabulary</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl bg-white border border-gray-200">
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {finalComp}/{questions.length}
                  </p>
                  <p className="text-xs text-gray-500">Comprehension</p>
                </CardContent>
              </Card>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white mb-2"
              onClick={() => onNavigate("/student/weekly-report")}
              data-ocid="weekly.primary_button"
            >
              See Weekly Report
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onNavigate("/student")}
              data-ocid="weekly.secondary_button"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const isVocabSection = section === "vocab";
  const currentChoices = isVocabSection
    ? vocabQs[vocabIdx].choices
    : questions[compIdx].options;
  const currentCorrect = isVocabSection
    ? vocabQs[vocabIdx].correctIndex
    : questions[compIdx].correctIndex;
  const currentQuestion = isVocabSection
    ? `Which definition matches: "${vocabQs[vocabIdx].word}"?`
    : questions[compIdx].question;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Weekly Assessment" />
      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="weekly.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex gap-2 ml-auto">
            <Badge
              className={
                isVocabSection
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-500"
              }
            >
              Section 1: Vocabulary
            </Badge>
            <Badge
              className={
                !isVocabSection
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-500"
              }
            >
              Section 2: Comprehension
            </Badge>
          </div>
        </div>

        <Progress
          value={(answered / totalQ) * 100}
          className="mb-4 h-2"
          data-ocid="weekly.loading_state"
        />
        <p className="text-xs text-gray-500 mb-4">
          {isVocabSection ? "Vocabulary" : "Comprehension"} — Question{" "}
          {isVocabSection ? vocabIdx + 1 : compIdx + 1} of{" "}
          {isVocabSection ? vocabQs.length : questions.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${section}-${isVocabSection ? vocabIdx : compIdx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm mb-6">
              <CardContent className="pt-8 pb-6">
                <p className="font-semibold text-base mb-6 text-gray-900">
                  {currentQuestion}
                </p>
                <div className="grid gap-3">
                  {currentChoices.map((choice, i) => {
                    let cls =
                      "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                    if (selected !== null) {
                      if (i === currentCorrect)
                        cls =
                          "border-green-500 bg-green-50 text-green-700 font-semibold";
                      else if (i === selected)
                        cls = "border-red-400 bg-red-50 text-red-600";
                    }
                    return (
                      <button
                        type="button"
                        key={choice}
                        onClick={() =>
                          isVocabSection
                            ? handleVocabAnswer(i)
                            : handleCompAnswer(i)
                        }
                        className={`rounded-xl border p-4 text-sm text-left transition-all ${cls}`}
                        data-ocid={`weekly.item.${i + 1}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`rounded-xl border p-3 mb-4 text-sm ${
                    selected === currentCorrect
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-red-400 bg-red-50 text-red-700"
                  }`}
                  data-ocid="weekly.success_state"
                >
                  {selected === currentCorrect ? "✓ Correct!" : "✗ Incorrect"}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white"
                  onClick={isVocabSection ? nextVocab : nextComp}
                  data-ocid="weekly.primary_button"
                >
                  {isVocabSection && vocabIdx + 1 >= vocabQs.length
                    ? "Start Comprehension Section →"
                    : !isVocabSection && compIdx + 1 >= questions.length
                      ? "See Results"
                      : "Next Question"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Exported type for use in dashboard
export interface WeeklyReportEntry {
  id: string;
  weekNumber: number;
  date: string;
  grade: number;
  vocabScore: number;
  vocabTotal: number;
  compScore: number;
  compTotal: number;
  total: number;
  totalQ: number;
  skills: {
    rhythm: number;
    intonation: number;
    chunking: number;
    pronunciation: number;
  };
  spellingScore: number | null;
  grammarScore: number | null;
  practiceScore: number | null;
}
