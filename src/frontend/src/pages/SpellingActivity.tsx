import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

interface SpellingActivityProps {
  onNavigate: (page: string) => void;
}

const SPELLING_DATA: Record<
  number,
  { sentence: string; blank: string; misspelled: string; correct: string }[]
> = {
  1: [
    {
      sentence: "The ___ is shining brightly.",
      blank: "sun",
      misspelled: "sunn",
      correct: "sun",
    },
    {
      sentence: "She has a red ___.",
      blank: "ball",
      misspelled: "bal",
      correct: "ball",
    },
    {
      sentence: "The ___ is big and fluffy.",
      blank: "cloud",
      misspelled: "cloudd",
      correct: "cloud",
    },
    {
      sentence: "I like to eat an ___ every day.",
      blank: "apple",
      misspelled: "aple",
      correct: "apple",
    },
    {
      sentence: "The ___ jumped over the fence.",
      blank: "frog",
      misspelled: "frogg",
      correct: "frog",
    },
    {
      sentence: "We went to the ___ yesterday.",
      blank: "park",
      misspelled: "parc",
      correct: "park",
    },
    {
      sentence: "She wore a blue ___.",
      blank: "dress",
      misspelled: "dres",
      correct: "dress",
    },
    {
      sentence: "The ___ flew south for winter.",
      blank: "bird",
      misspelled: "brid",
      correct: "bird",
    },
  ],
  2: [
    {
      sentence: "He found a ___ on the road.",
      blank: "stone",
      misspelled: "ston",
      correct: "stone",
    },
    {
      sentence: "The ___ was full of fish.",
      blank: "river",
      misspelled: "rivver",
      correct: "river",
    },
    {
      sentence: "She wrote a ___ to her friend.",
      blank: "letter",
      misspelled: "leter",
      correct: "letter",
    },
    {
      sentence: "The ___ started on Monday.",
      blank: "school",
      misspelled: "skool",
      correct: "school",
    },
    {
      sentence: "He put the book on the ___.",
      blank: "shelf",
      misspelled: "shalf",
      correct: "shelf",
    },
    {
      sentence: "They played in the ___ after lunch.",
      blank: "garden",
      misspelled: "gardin",
      correct: "garden",
    },
    {
      sentence: "The ___ tasted sweet.",
      blank: "honey",
      misspelled: "hony",
      correct: "honey",
    },
    {
      sentence: "She wore ___ shoes.",
      blank: "pretty",
      misspelled: "pritty",
      correct: "pretty",
    },
  ],
  3: [
    {
      sentence: "The ___ of the mountains was stunning.",
      blank: "beauty",
      misspelled: "beuty",
      correct: "beauty",
    },
    {
      sentence: "He showed great ___ in the race.",
      blank: "courage",
      misspelled: "curage",
      correct: "courage",
    },
    {
      sentence: "She read the ___ carefully.",
      blank: "message",
      misspelled: "messige",
      correct: "message",
    },
    {
      sentence: "The ___ was full of colorful flowers.",
      blank: "meadow",
      misspelled: "medow",
      correct: "meadow",
    },
    {
      sentence: "He gave a ___ to the audience.",
      blank: "speech",
      misspelled: "speach",
      correct: "speech",
    },
    {
      sentence: "The ___ explained the rules.",
      blank: "teacher",
      misspelled: "techer",
      correct: "teacher",
    },
    {
      sentence: "She felt a sense of ___.",
      blank: "wonder",
      misspelled: "wunder",
      correct: "wonder",
    },
    {
      sentence: "The child was full of ___.",
      blank: "energy",
      misspelled: "enerji",
      correct: "energy",
    },
  ],
  4: [
    {
      sentence: "The scientist made an important ___.",
      blank: "discovery",
      misspelled: "discovrey",
      correct: "discovery",
    },
    {
      sentence: "She showed excellent ___ in art.",
      blank: "technique",
      misspelled: "tecnique",
      correct: "technique",
    },
    {
      sentence: "The ___ was held in the town square.",
      blank: "ceremony",
      misspelled: "ceremoney",
      correct: "ceremony",
    },
    {
      sentence: "He had a strong ___ to succeed.",
      blank: "ambition",
      misspelled: "ambision",
      correct: "ambition",
    },
    {
      sentence: "The ___ was very complicated.",
      blank: "problem",
      misspelled: "problim",
      correct: "problem",
    },
    {
      sentence: "She received a ___ for her work.",
      blank: "certificate",
      misspelled: "certifecate",
      correct: "certificate",
    },
    {
      sentence: "The ___ of the city was impressive.",
      blank: "architecture",
      misspelled: "archetecture",
      correct: "architecture",
    },
    {
      sentence: "He gave a ___ explanation.",
      blank: "thorough",
      misspelled: "thuro",
      correct: "thorough",
    },
  ],
  5: [
    {
      sentence: "The ___ between the two countries was peaceful.",
      blank: "relationship",
      misspelled: "relashionship",
      correct: "relationship",
    },
    {
      sentence: "She had great ___ for the subject.",
      blank: "enthusiasm",
      misspelled: "enthusism",
      correct: "enthusiasm",
    },
    {
      sentence: "The ___ required careful planning.",
      blank: "expedition",
      misspelled: "expidition",
      correct: "expedition",
    },
    {
      sentence: "He showed remarkable ___ in crisis.",
      blank: "composure",
      misspelled: "composure",
      correct: "composure",
    },
    {
      sentence: "The book had a fascinating ___.",
      blank: "narrative",
      misspelled: "narative",
      correct: "narrative",
    },
    {
      sentence: "She worked with great ___.",
      blank: "determination",
      misspelled: "determineation",
      correct: "determination",
    },
    {
      sentence: "The ___ was clearly explained.",
      blank: "phenomenon",
      misspelled: "phenominon",
      correct: "phenomenon",
    },
    {
      sentence: "He showed ___ in his decisions.",
      blank: "consistency",
      misspelled: "consistancy",
      correct: "consistency",
    },
  ],
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function SpellingActivity({ onNavigate }: SpellingActivityProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const grade = Math.min(Number(user?.grade ?? 1n), 5);
  const questions = SPELLING_DATA[grade] ?? SPELLING_DATA[1];

  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<
    {
      correct: boolean;
      userAnswer: string;
      correctWord: string;
      sentence: string;
    }[]
  >([]);
  const [phase, setPhase] = useState<"quiz" | "done">("quiz");

  const current = questions[qIndex];
  const isCorrect =
    answer.trim().toLowerCase() === current.correct.toLowerCase();

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    const correct =
      answer.trim().toLowerCase() === current.correct.toLowerCase();
    if (correct) setScore((s) => s + 1);
    setResults((prev) => [
      ...prev,
      {
        correct,
        userAnswer: answer.trim(),
        correctWord: current.correct,
        sentence: current.sentence,
      },
    ]);
  };

  const handleNext = () => {
    if (qIndex + 1 >= questions.length) {
      const totalScore =
        results.filter((r) => r.correct).length +
        (submitted && isCorrect ? 1 : 0);
      localStorage.setItem(
        `classio_spelling_${userId}_${grade}_${getTodayKey()}`,
        JSON.stringify({
          score: totalScore,
          total: questions.length,
          completedAt: new Date().toISOString(),
        }),
      );
      setPhase("done");
    } else {
      setQIndex(qIndex + 1);
      setAnswer("");
      setSubmitted(false);
    }
  };

  const pct =
    phase === "done" ? Math.round((score / questions.length) * 100) : 0;

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Spelling Practice" />
        <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("/student")}
              data-ocid="spelling.link"
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
                  ? "Excellent spelling! Keep it up!"
                  : pct >= 60
                    ? "Good effort! Review the words you missed."
                    : "Keep practicing! Try reading each word aloud."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">
                Word Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((r, i) => (
                <div
                  key={`result-${r.correctWord}`}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    r.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                  data-ocid={`spelling.item.${i + 1}`}
                >
                  {r.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {r.sentence.replace("___", `[${r.correctWord}]`)}
                    </p>
                    {!r.correct && (
                      <p className="text-xs mt-1">
                        <span className="text-red-600">You wrote: </span>
                        <span className="font-medium text-red-700">
                          {r.userAnswer}
                        </span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-green-700 font-semibold">
                          Correct: {r.correctWord}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
            onClick={() => onNavigate("/student")}
            data-ocid="spelling.primary_button"
          >
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Spelling Practice" />
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="spelling.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <span className="text-sm text-gray-500 ml-auto">
            {qIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <div>
                <CardTitle className="text-base text-gray-900">
                  Fill in the Blank
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  The highlighted word is misspelled — type the correct spelling
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-relaxed">
                {current.sentence.split("___").map((part, i, arr) => (
                  <span key={`sp-${part.slice(0, 5)}-${i}`}>
                    {part}
                    {i < arr.length - 1 && (
                      <Badge className="mx-1 bg-amber-100 text-amber-800 border border-amber-300 text-sm font-mono px-2">
                        {current.misspelled}
                      </Badge>
                    )}
                  </span>
                ))}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="spelling-answer"
                className="text-sm font-medium text-gray-700"
              >
                Type the correct spelling:
              </label>
              <Input
                id="spelling-answer"
                value={answer}
                onChange={(e) => !submitted && setAnswer(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !submitted && handleSubmit()
                }
                placeholder="Enter correct spelling..."
                className={`h-11 rounded-xl text-base font-medium ${
                  submitted
                    ? isCorrect
                      ? "bg-green-50 border-green-400 text-green-800"
                      : "bg-red-50 border-red-400 text-red-800"
                    : "bg-gray-50 border-gray-200 focus:border-indigo-400"
                }`}
                disabled={submitted}
                data-ocid="spelling.input"
              />
            </div>

            {submitted && (
              <div
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
                data-ocid={
                  isCorrect ? "spelling.success_state" : "spelling.error_state"
                }
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div>
                  {isCorrect ? (
                    <p className="text-green-800 font-semibold">
                      Correct! Great spelling!
                    </p>
                  ) : (
                    <>
                      <p className="text-red-800 font-semibold">
                        Not quite right
                      </p>
                      <p className="text-sm text-red-700 mt-0.5">
                        Correct spelling:{" "}
                        <span className="font-bold text-indigo-700">
                          {current.correct}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Say the word aloud letter by letter to remember it.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!submitted ? (
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
            disabled={!answer.trim()}
            data-ocid="spelling.submit_button"
          >
            Check Spelling
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
            onClick={handleNext}
            data-ocid="spelling.primary_button"
          >
            {qIndex + 1 >= questions.length ? "See Results" : "Next Word →"}
          </Button>
        )}
      </main>
    </div>
  );
}
