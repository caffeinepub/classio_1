import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { getPassageForLevel } from "../data/passages";
import practiceQuestions from "../data/practiceQuestions";

interface PracticeTestProps {
  onNavigate: (page: string) => void;
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function PracticeTest({ onNavigate }: PracticeTestProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const grade = Number(user?.grade ?? 1n);
  const passage = getPassageForLevel(grade, 0);
  const questions = practiceQuestions[grade] ?? practiceQuestions[1];

  const [phase, setPhase] = useState<"read" | "quiz" | "done">("read");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = questions[qIndex].correctIndex === idx;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, correct]);
  };

  const nextQ = () => {
    if (qIndex + 1 >= questions.length) {
      const finalScore =
        score + (selected === questions[qIndex].correctIndex ? 0 : 0);
      localStorage.setItem(
        `classio_practice_${userId}_${getTodayKey()}`,
        JSON.stringify({ score: finalScore, date: getTodayKey() }),
      );
      setPhase("done");
    } else {
      setQIndex(qIndex + 1);
      setSelected(null);
    }
  };

  if (phase === "read") {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Practice Reading Test" />
        <main className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("/student")}
              data-ocid="practice.link"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">
                Reading Passage — Grade {grade}
              </h2>
              {passage && (
                <Badge className="bg-primary/10 text-primary border-0 text-xs ml-auto">
                  {passage.subject}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-base mb-3">
              {passage?.title ?? "Reading Passage"}
            </h3>
            <ScrollArea className="h-64">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {passage?.content ?? "No passage available for your grade."}
              </p>
            </ScrollArea>
          </div>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Read the passage carefully, then answer {questions.length}{" "}
            comprehension questions.
          </p>
          <Button
            size="lg"
            className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
            onClick={() => setPhase("quiz")}
            data-ocid="practice.primary_button"
          >
            Start Comprehension Questions
          </Button>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    const badge =
      pct >= 80
        ? { label: "Excellent!", cls: "bg-green-500/15 text-green-700" }
        : pct >= 60
          ? { label: "Good Job!", cls: "bg-amber-500/15 text-amber-700" }
          : { label: "Needs Practice", cls: "bg-red-500/15 text-red-700" };
    const tips =
      pct >= 80
        ? "Outstanding! You have a strong understanding of the passage."
        : pct >= 60
          ? "Good effort! Review the questions you missed and re-read the passage."
          : "Keep practicing! Try re-reading the passage slowly and look for key ideas.";

    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Practice Test Results" />
        <main
          className="max-w-xl mx-auto px-6 py-12 text-center"
          data-ocid="practice.success_state"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4">
              📝
            </div>
            <h2 className="text-2xl font-bold mb-1">Practice Test Complete!</h2>
            <p className="text-4xl font-bold text-primary mt-2 mb-1">
              {score}/{questions.length}
            </p>
            <p className="text-muted-foreground mb-3">{pct}% correct</p>
            <Badge className={`text-sm px-4 py-1 mb-4 ${badge.cls}`}>
              {badge.label}
            </Badge>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              {tips}
            </p>

            <div className="grid gap-2 mb-6 text-left">
              {questions.map((q, i) => (
                <div
                  key={q.question}
                  className={`rounded-xl border p-3 flex items-start gap-3 ${
                    answers[i]
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                  data-ocid={`practice.item.${i + 1}`}
                >
                  {answers[i] ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">{q.question}</p>
                    {!answers[i] && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => onNavigate("/student")}
              className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
              data-ocid="practice.primary_button"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Quiz phase
  const q = questions[qIndex];
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Practice Test" />
      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="practice.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <Progress
          value={((qIndex + 1) / questions.length) * 100}
          className="mb-6 h-2"
          data-ocid="practice.loading_state"
        />
        <p className="text-xs text-muted-foreground mb-2">
          Question {qIndex + 1} of {questions.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="rounded-2xl border-border shadow-card mb-6">
              <CardContent className="pt-8 pb-6">
                <p className="font-semibold text-base mb-6">{q.question}</p>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    let cls =
                      "border-border bg-card hover:bg-muted/60 text-foreground";
                    if (selected !== null) {
                      if (i === q.correctIndex)
                        cls =
                          "border-green-500 bg-green-500/10 text-green-700 font-semibold";
                      else if (i === selected)
                        cls = "border-red-500 bg-red-500/10 text-red-700";
                    }
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleAnswer(i)}
                        className={`rounded-xl border p-4 text-sm text-left transition-all ${cls}`}
                        data-ocid={`practice.item.${i + 1}`}
                      >
                        {opt}
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
                  className={`rounded-xl border p-4 mb-4 text-sm ${
                    selected === q.correctIndex
                      ? "border-green-500/30 bg-green-500/5 text-green-700"
                      : "border-red-500/30 bg-red-500/5 text-red-700"
                  }`}
                  data-ocid="practice.success_state"
                >
                  <p className="font-semibold mb-1">
                    {selected === q.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  <p className="text-xs">{q.explanation}</p>
                </div>
                <Button
                  className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
                  onClick={nextQ}
                  data-ocid="practice.primary_button"
                >
                  {qIndex + 1 >= questions.length
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
