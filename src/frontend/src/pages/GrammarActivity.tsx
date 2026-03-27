import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

interface GrammarActivityProps {
  onNavigate: (page: string) => void;
}

const GRAMMAR_DATA: Record<
  number,
  {
    sentence: string;
    options: string[];
    correct: number;
    explanation: string;
  }[]
> = {
  1: [
    {
      sentence: "She ___ a dog.",
      options: ["have", "has", "is have", "are has"],
      correct: 1,
      explanation: "'She' is singular, so use 'has'.",
    },
    {
      sentence: "They ___ playing outside.",
      options: ["is", "am", "are", "was"],
      correct: 2,
      explanation: "'They' is plural, so use 'are'.",
    },
    {
      sentence: "I ___ an apple.",
      options: ["eats", "eating", "eat", "eaten"],
      correct: 2,
      explanation: "With 'I', use the base form 'eat'.",
    },
    {
      sentence: "He ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
      explanation: "'He' is third person singular, so use 'goes'.",
    },
    {
      sentence: "___ is a sunny day.",
      options: ["It", "Its", "Their", "They"],
      correct: 0,
      explanation: "Use 'It' for weather.",
    },
    {
      sentence: "The cats ___ on the mat.",
      options: ["sits", "sit", "sitting alone", "sat alone"],
      correct: 1,
      explanation: "'Cats' is plural, so use 'sit'.",
    },
    {
      sentence: "She ___ her homework yesterday.",
      options: ["do", "does", "did", "doing"],
      correct: 2,
      explanation: "'Yesterday' tells us past tense, so use 'did'.",
    },
    {
      sentence: "I can ___ fast.",
      options: ["runs", "ran", "running", "run"],
      correct: 3,
      explanation: "After 'can', use the base form 'run'.",
    },
  ],
  2: [
    {
      sentence: "He ___ the ball into the net.",
      options: ["kick", "kicks", "kicked", "kicking"],
      correct: 2,
      explanation: "Past tense needs 'kicked'.",
    },
    {
      sentence: "We ___ our lunch already.",
      options: ["eat", "eats", "eaten", "have eaten"],
      correct: 3,
      explanation: "'Already' suggests present perfect: 'have eaten'.",
    },
    {
      sentence: "She is ___ than her sister.",
      options: ["tall", "taller", "tallest", "most tall"],
      correct: 1,
      explanation: "Comparing two things uses comparative: 'taller'.",
    },
    {
      sentence: "___ book is on the table.",
      options: ["A", "An", "The", "None"],
      correct: 2,
      explanation: "'The' refers to a specific book.",
    },
    {
      sentence: "They ___ going to the park tomorrow.",
      options: ["is", "am", "are", "was"],
      correct: 2,
      explanation: "'They' uses 'are'.",
    },
    {
      sentence: "I saw ___ elephant at the zoo.",
      options: ["a", "an", "the", "some"],
      correct: 1,
      explanation: "'Elephant' starts with a vowel sound, so use 'an'.",
    },
    {
      sentence: "Neither the boys nor the girl ___ present.",
      options: ["were", "are", "is", "am"],
      correct: 2,
      explanation:
        "With 'neither...nor', the verb agrees with the nearest subject ('girl'): 'is'.",
    },
    {
      sentence: "She ___ to music every evening.",
      options: ["listen", "listens", "listening", "listened"],
      correct: 1,
      explanation: "'She' is singular present: 'listens'.",
    },
  ],
  3: [
    {
      sentence: "The team ___ won the championship.",
      options: ["have", "has", "is", "are"],
      correct: 1,
      explanation: "'Team' is a collective noun — use 'has'.",
    },
    {
      sentence: "By the time we arrived, the show ___.",
      options: ["starts", "started", "had started", "has started"],
      correct: 2,
      explanation:
        "Past perfect 'had started' shows it happened before arrival.",
    },
    {
      sentence: "She speaks English ___ than I do.",
      options: ["good", "well", "better", "best"],
      correct: 2,
      explanation:
        "Comparing: use comparative 'better' (adverb form of 'well').",
    },
    {
      sentence: "___ of the students passed the exam.",
      options: ["Each", "Every", "All", "None"],
      correct: 2,
      explanation: "'All' refers to the group collectively.",
    },
    {
      sentence: "He is one of the students who ___ worked hard.",
      options: ["has", "have", "had", "is"],
      correct: 1,
      explanation:
        "The relative clause refers to 'students' (plural), so 'have'.",
    },
    {
      sentence: "I wish I ___ taller.",
      options: ["am", "were", "was", "be"],
      correct: 1,
      explanation: "Subjunctive mood after 'wish': 'were'.",
    },
    {
      sentence: "Not only she but also her friends ___ invited.",
      options: ["was", "were", "is", "are"],
      correct: 1,
      explanation:
        "'Not only...but also' — verb agrees with nearest subject (friends): 'were'.",
    },
    {
      sentence: "He ___ here since 2020.",
      options: ["lives", "lived", "has lived", "is living"],
      correct: 2,
      explanation: "'Since' indicates present perfect: 'has lived'.",
    },
  ],
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function GrammarActivity({ onNavigate }: GrammarActivityProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const grade = Math.min(Number(user?.grade ?? 1n), 3);
  const questions = GRAMMAR_DATA[grade] ?? GRAMMAR_DATA[1];

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<
    {
      correct: boolean;
      selectedIdx: number;
      correctIdx: number;
      sentence: string;
      explanation: string;
      options: string[];
    }[]
  >([]);
  const [phase, setPhase] = useState<"quiz" | "done">("quiz");

  const current = questions[qIndex];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === current.correct;
    if (correct) setScore((s) => s + 1);
    setResults((prev) => [
      ...prev,
      {
        correct,
        selectedIdx: idx,
        correctIdx: current.correct,
        sentence: current.sentence,
        explanation: current.explanation,
        options: current.options,
      },
    ]);
  };

  const handleNext = () => {
    if (qIndex + 1 >= questions.length) {
      const totalScore = results.filter((r) => r.correct).length;
      localStorage.setItem(
        `classio_grammar_${userId}_${grade}_${getTodayKey()}`,
        JSON.stringify({
          score: totalScore,
          total: questions.length,
          completedAt: new Date().toISOString(),
        }),
      );
      setPhase("done");
    } else {
      setQIndex(qIndex + 1);
      setSelected(null);
    }
  };

  const pct =
    phase === "done" ? Math.round((score / questions.length) * 100) : 0;

  if (phase === "done") {
    const missed = results.filter((r) => !r.correct);
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Grammar Practice" />
        <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("/student")}
              data-ocid="grammar.link"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </div>

          <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <CardContent className="pt-8 pb-6">
              <div className="text-5xl mb-3">
                {pct >= 80 ? "🌟" : pct >= 60 ? "👍" : "📝"}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Activity Complete!
              </h2>
              <p className="text-gray-500 mb-4">
                You scored {score} out of {questions.length}
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-lg"
                style={{
                  background:
                    pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626",
                }}
              >
                {pct}%
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {pct >= 80
                  ? "Excellent grammar skills!"
                  : pct >= 60
                    ? "Good work! Review the explanations below."
                    : "Keep practicing! Grammar takes time to master."}
              </p>
            </CardContent>
          </Card>

          {missed.length > 0 && (
            <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">
                  Questions to Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {missed.map((r, i) => (
                  <div
                    key={`missed-${r.sentence.slice(0, 15)}`}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                    data-ocid={`grammar.item.${i + 1}`}
                  >
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      {r.sentence}
                    </p>
                    <p className="text-xs text-red-600">
                      You chose:{" "}
                      <span className="font-semibold">
                        {r.options[r.selectedIdx]}
                      </span>
                    </p>
                    <p className="text-xs text-green-700">
                      Correct answer:{" "}
                      <span className="font-semibold">
                        {r.options[r.correctIdx]}
                      </span>
                    </p>
                    <p className="text-xs text-indigo-700 mt-1 italic">
                      {r.explanation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
            onClick={() => onNavigate("/student")}
            data-ocid="grammar.primary_button"
          >
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Grammar Practice" />
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="grammar.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <span className="text-sm text-gray-500 ml-auto">
            {qIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <div>
                <CardTitle className="text-base text-gray-900">
                  Grammar Check
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose the grammatically correct option
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-base text-gray-800 font-medium">
                {current.sentence}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {current.options.map((opt, idx) => {
                let cls =
                  "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
                if (selected !== null) {
                  if (idx === current.correct)
                    cls = "border-green-400 bg-green-50";
                  else if (idx === selected && selected !== current.correct)
                    cls = "border-red-400 bg-red-50";
                  else cls = "border-gray-200 bg-gray-50 opacity-60";
                }
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${cls}`}
                    data-ocid="grammar.radio"
                  >
                    <span
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0
                      border-indigo-300 text-indigo-600"
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-gray-800 font-medium">
                      {opt}
                    </span>
                    {selected !== null && idx === current.correct && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                    {selected !== null &&
                      idx === selected &&
                      selected !== current.correct && (
                        <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                      )}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  selected === current.correct
                    ? "bg-green-50 border border-green-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
                data-ocid={
                  selected === current.correct
                    ? "grammar.success_state"
                    : "grammar.error_state"
                }
              >
                <span className="text-lg mt-0.5">
                  {selected === current.correct ? "✅" : "💡"}
                </span>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      selected === current.correct
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {selected === current.correct
                      ? "Correct!"
                      : "Not quite — here's why:"}
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5 italic">
                    {current.explanation}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selected !== null && (
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white"
            onClick={handleNext}
            data-ocid="grammar.primary_button"
          >
            {qIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
          </Button>
        )}
      </main>
    </div>
  );
}
