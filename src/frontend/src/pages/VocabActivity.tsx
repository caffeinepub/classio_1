import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Mic,
  MicOff,
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
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          score:
            quizScore +
            (selectedAnswer === quizQuestions[quizIndex]?.correctIndex ? 1 : 0),
          date: getTodayKey(),
        }),
      );
    } else {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const word = words[currentWord];

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Vocab Builder" />
        <main className="max-w-xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center text-4xl mx-auto mb-4">
              ✅
            </div>
            <h2 className="text-2xl font-bold mb-2">Today's Vocab Done!</h2>
            <p className="text-muted-foreground mb-6">
              You've already completed today's vocabulary activity.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {words.map((w) => (
                <div
                  key={w.word}
                  className="bg-card border border-border rounded-xl p-3 text-left"
                >
                  <div className="text-xl mb-1">{w.emoji}</div>
                  <p className="font-semibold text-sm">{w.word}</p>
                  <p className="text-xs text-muted-foreground">{w.syllables}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => onNavigate("/student/practice")}
              className="bg-classio-blue hover:bg-classio-blue/90 text-white w-full"
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
        <div className="min-h-screen bg-background">
          <AppHeader title="Vocab Quiz Results" />
          <main className="max-w-xl mx-auto px-6 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4">
                🏆
              </div>
              <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
              <p className="text-4xl font-bold text-primary mb-1">
                {quizScore}/{words.length}
              </p>
              <p className="text-muted-foreground mb-2">{pct}% correct</p>
              <Badge
                className={`mb-8 text-sm px-4 py-1 ${
                  pct >= 80
                    ? "bg-green-500/15 text-green-700"
                    : pct >= 50
                      ? "bg-amber-500/15 text-amber-700"
                      : "bg-red-500/15 text-red-700"
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
                className="bg-classio-blue hover:bg-classio-blue/90 text-white w-full mb-2"
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
      <div className="min-h-screen bg-background">
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
            className="mb-6 h-2"
            data-ocid="vocab.loading_state"
          />
          <p className="text-xs text-muted-foreground mb-2">
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
              <Card className="rounded-2xl border-border shadow-card mb-6">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Definition:
                  </p>
                  <p className="text-lg font-semibold">
                    &ldquo;{q.definition}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Which word matches this definition?
                  </p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice, i) => {
                  let cls = "border-border bg-card hover:bg-muted/60";
                  if (selectedAnswer !== null) {
                    if (i === q.correctIndex)
                      cls = "border-green-500 bg-green-500/10 text-green-700";
                    else if (i === selectedAnswer && i !== q.correctIndex)
                      cls = "border-red-500 bg-red-500/10 text-red-700";
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
                    className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
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

  // Learn phase
  const practiced = practicedWords.size;
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Daily Vocab Builder" />
      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            data-ocid="vocab.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              Grade {grade} · {practiced}/{words.length} words practiced
            </p>
          </div>
        </div>

        <Progress
          value={(practiced / words.length) * 100}
          className="mb-6 h-2"
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
            <Card className="rounded-2xl border-border shadow-card overflow-hidden mb-4">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
                <div className="text-7xl mb-4">{word.emoji}</div>
                <h2 className="text-4xl font-bold mb-1 tracking-tight">
                  {word.word}
                </h2>
                <p className="text-muted-foreground text-sm tracking-widest font-mono">
                  {word.syllables}
                </p>
              </div>
              <CardContent className="pt-6 pb-6">
                <div className="mb-4">
                  <Badge className="bg-primary/10 text-primary border-0 mb-2 text-xs">
                    Definition
                  </Badge>
                  <p className="text-sm font-medium">{word.definition}</p>
                </div>
                <div className="mb-6">
                  <Badge className="bg-accent/10 text-accent border-0 mb-2 text-xs">
                    Example
                  </Badge>
                  <p className="text-sm italic text-muted-foreground">
                    "{word.example}"
                  </p>
                </div>

                {/* Pronunciation Practice */}
                <div className="border border-border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold">
                      Pronunciation Practice
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Record yourself saying:{" "}
                    <strong>&ldquo;{word.syllables}&rdquo;</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={startRecording}
                        className="gap-2"
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
              className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white gap-2"
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
                  <Play className="w-5 h-5" /> Complete & Start Quiz
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
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    practicedWords.has(i)
                      ? "bg-green-500"
                      : i === currentWord
                        ? "bg-primary w-5"
                        : "bg-muted-foreground/30"
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
