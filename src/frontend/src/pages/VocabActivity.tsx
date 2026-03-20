import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Mic,
  Play,
  Square,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import vocabData from "../data/vocabData";

interface VocabActivityProps {
  onNavigate: (page: string) => void;
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

const WORD_EMOJIS = [
  "💡",
  "🌟",
  "📚",
  "🎯",
  "🔑",
  "✨",
  "🌿",
  "🎨",
  "🏆",
  "🌊",
];

export function VocabActivity({ onNavigate }: VocabActivityProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const grade = Number(user?.grade ?? 1n);
  const words = vocabData[grade] ?? vocabData[1];
  const storageKey = `classio_vocab_${userId}_${grade}_${getTodayKey()}`;

  const [phase, setPhase] = useState<"learn" | "quiz" | "done">(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? "done" : "learn";
  });
  const [currentWord, setCurrentWord] = useState(0);
  const [practicedWords, setPracticedWords] = useState<Set<number>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<
    { definition: string; choices: string[]; correctIndex: number }[]
  >([]);

  // Build quiz questions when entering quiz phase
  useEffect(() => {
    if (phase === "quiz") {
      const qs = words.map((w, i) => {
        const wrongChoices = words
          .filter((_, j) => j !== i)
          .map((x) => x.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const choices = [...wrongChoices, w.word].sort(
          () => Math.random() - 0.5,
        );
        return {
          definition: w.definition,
          choices,
          correctIndex: choices.indexOf(w.word),
        };
      });
      setQuizQuestions(qs);
      setQuizIndex(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setQuizDone(false);
    }
  }, [phase, words]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        for (const t of stream.getTracks()) {
          t.stop();
        }
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (_) {
      // mic not available
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const markPracticed = () => {
    const next = new Set(practicedWords);
    next.add(currentWord);
    setPracticedWords(next);
    setAudioURL(null);
    if (currentWord < words.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = quizQuestions[quizIndex]?.correctIndex === idx;
    if (correct) setQuizScore((s) => s + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizDone(true);
      const finalScore =
        quizScore +
        (selectedAnswer === quizQuestions[quizIndex]?.correctIndex ? 1 : 0);
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          score: finalScore,
          date: getTodayKey(),
        }),
      );
      // Save per-day vocab completion key
      const existingDays = [1, 2, 3, 4, 5].filter((d) =>
        localStorage.getItem(`classio_vocab_day_${userId}_${grade}_${d}`),
      ).length;
      if (existingDays < 5) {
        localStorage.setItem(
          `classio_vocab_day_${userId}_${grade}_${existingDays + 1}`,
          JSON.stringify({ completedAt: Date.now() }),
        );
      }
      // Save quiz completion key
      localStorage.setItem(
        `classio_vocab_quiz_${userId}_${grade}`,
        JSON.stringify({ score: finalScore, completedAt: Date.now() }),
      );
    } else {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const word = words[currentWord];
  const wordEmoji = word.emoji || WORD_EMOJIS[currentWord % WORD_EMOJIS.length];

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Vocab Builder" />
        <main className="max-w-xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-4xl mx-auto mb-4">
              ✅
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Today&apos;s Vocab Done!
            </h2>
            <p className="text-gray-500 mb-6">
              You&apos;ve already completed today&apos;s vocabulary activity.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {words.map((w) => (
                <div
                  key={w.word}
                  className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-left"
                >
                  <div className="text-xl mb-1">{w.emoji}</div>
                  <p className="font-semibold text-sm text-gray-800">
                    {w.word}
                  </p>
                  <p className="text-xs text-gray-500">{w.syllables}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => onNavigate("/student/practice")}
              className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white w-full"
              data-ocid="vocab.primary_button"
            >
              Go to Practice Reading Test →
            </Button>
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => onNavigate("/student")}
              data-ocid="vocab.secondary_button"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (phase === "quiz") {
    if (quizDone) {
      const pct = Math.round((quizScore / words.length) * 100);
      return (
        <div className="min-h-screen bg-gray-50">
          <AppHeader title="Vocab Quiz Results" />
          <main className="max-w-xl mx-auto px-6 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-4xl mx-auto mb-4">
                🏆
              </div>
              <h2 className="text-2xl font-bold mb-1 text-gray-900">
                Quiz Complete!
              </h2>
              <p className="text-4xl font-bold text-teal-600 mb-1">
                {quizScore}/{words.length}
              </p>
              <p className="text-gray-500 mb-2">{pct}% correct</p>
              <Badge
                className={`mb-8 text-sm px-4 py-1 ${
                  pct >= 80
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : pct >= 50
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {pct >= 80
                  ? "Excellent!"
                  : pct >= 50
                    ? "Good Job!"
                    : "Keep Practicing!"}
              </Badge>
              <Button
                onClick={() => onNavigate("/student/practice")}
                className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white w-full mb-2"
                data-ocid="vocab.primary_button"
              >
                Go to Practice Reading Test →
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => onNavigate("/student")}
                data-ocid="vocab.secondary_button"
              >
                Back to Dashboard
              </Button>
            </motion.div>
          </main>
        </div>
      );
    }

    const q = quizQuestions[quizIndex];
    if (!q) return null;
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Vocab Quiz" />
        <main className="max-w-xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("/student")}
              data-ocid="vocab.link"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          </div>
          <Progress
            value={((quizIndex + 1) / words.length) * 100}
            className="mb-2 h-2 [&>div]:bg-teal-500"
            data-ocid="vocab.loading_state"
          />
          <p className="text-xs text-gray-500 mb-6">
            Question {quizIndex + 1} of {words.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={quizIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-2xl bg-white border border-teal-100 shadow-sm mb-6">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-sm text-gray-500 mb-2">Definition:</p>
                  <p className="text-lg font-semibold text-gray-900">
                    &ldquo;{q.definition}&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Which word matches this definition?
                  </p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice, i) => {
                  let cls =
                    "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                  if (selectedAnswer !== null) {
                    if (i === q.correctIndex)
                      cls = "border-teal-500 bg-teal-50 text-teal-800";
                    else if (i === selectedAnswer && i !== q.correctIndex)
                      cls = "border-red-400 bg-red-50 text-red-700";
                  }
                  return (
                    <button
                      type="button"
                      key={choice}
                      onClick={() => handleQuizAnswer(i)}
                      className={`rounded-xl border p-4 text-sm font-semibold transition-all text-left ${cls}`}
                      data-ocid={`vocab.item.${i + 1}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white"
                    onClick={nextQuizQuestion}
                    data-ocid="vocab.primary_button"
                  >
                    {quizIndex + 1 >= quizQuestions.length
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

  // ── Learn phase ──────────────────────────────────────────────────────
  const practiced = practicedWords.size;
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Daily Vocab Builder" />
      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Back + progress header */}
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="vocab.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              Grade {grade} — Word {practiced + 1} of {words.length}
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-600">
            {Math.round((practiced / words.length) * 100)}% done
          </span>
        </div>

        {/* Teal progress bar */}
        <Progress
          value={(practiced / words.length) * 100}
          className="mb-6 h-2 [&>div]:bg-teal-500"
          data-ocid="vocab.loading_state"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl bg-white border border-teal-100 shadow-sm overflow-hidden mb-4">
              {/* Header: emoji + word + phonetic */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 text-center relative">
                {/* Word number pill */}
                <span className="absolute top-3 right-3 text-xs font-bold bg-teal-100 text-teal-600 px-2.5 py-1 rounded-full">
                  {currentWord + 1} / {words.length}
                </span>

                <div className="text-7xl mb-4">{wordEmoji}</div>

                <h2 className="text-4xl font-bold mb-1 tracking-tight text-teal-700">
                  {word.word}
                </h2>
                <p className="text-teal-500 text-sm tracking-widest font-mono">
                  {word.syllables}
                </p>
              </div>

              <CardContent className="pt-5 pb-6 space-y-4">
                {/* Definition */}
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                  <Badge className="bg-teal-100 text-teal-700 border-0 mb-2 text-xs">
                    Definition
                  </Badge>
                  <p className="text-sm font-medium text-gray-800">
                    {word.definition}
                  </p>
                </div>

                {/* Example sentence */}
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-2 text-xs">
                    Example Sentence
                  </Badge>
                  <p className="text-sm italic text-gray-600">
                    &ldquo;
                    {word.example
                      ? word.example
                      : `The word "${word.word}" helps us describe the world around us.`}
                    &rdquo;
                  </p>
                </div>

                {/* Pronunciation tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-lg shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-bold text-amber-700 mb-0.5">
                      Pronunciation Tip
                    </p>
                    <p className="text-xs text-amber-600">
                      Break it into syllables — say each part slowly:{" "}
                      <strong>{word.syllables}</strong>
                    </p>
                  </div>
                </div>

                {/* Pronunciation Practice */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-teal-500" />
                    <p className="text-sm font-semibold text-gray-800">
                      Pronunciation Practice
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Record yourself saying:{" "}
                    <strong>&ldquo;{word.syllables}&rdquo;</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={startRecording}
                        className="gap-2 border-teal-300 text-teal-600 hover:bg-teal-50"
                        data-ocid="vocab.upload_button"
                      >
                        <Mic className="w-4 h-4" /> Record
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={stopRecording}
                        className="gap-2"
                        data-ocid="vocab.upload_button"
                      >
                        <Square className="w-4 h-4" /> Stop
                      </Button>
                    )}
                    {audioURL && (
                      <audio src={audioURL} controls className="h-8 flex-1">
                        <track kind="captions" />
                      </audio>
                    )}
                    {isRecording && (
                      <span className="flex items-center gap-1.5 text-xs text-red-500">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Recording...
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white gap-2"
              onClick={markPracticed}
              data-ocid="vocab.primary_button"
            >
              {practiced < words.length - 1 ? (
                <>
                  <CheckCircle className="w-5 h-5" /> Mark as Practiced — Next
                  Word
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Complete &amp; Start Quiz
                </>
              )}
            </Button>

            {/* Word dots */}
            <div className="flex justify-center gap-2 mt-4">
              {words.map((w, i) => (
                <button
                  type="button"
                  key={w.word}
                  onClick={() => setCurrentWord(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    practicedWords.has(i)
                      ? "bg-teal-500 w-2.5"
                      : i === currentWord
                        ? "bg-teal-600 w-5"
                        : "bg-gray-300 w-2.5"
                  }`}
                  data-ocid={`vocab.item.${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
